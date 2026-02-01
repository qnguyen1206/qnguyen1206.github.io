import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { blogPosts } from './blog-posts.js';

export function initBlog() {
  const blog = document.getElementById('blog');
  if (!blog) return;
  const categories = ['All', 'LeetCode', 'TryHackMe', 'Tools'];
  const POSTS_PER_PAGE = 9;
  
  // Sort blog posts by date (most recent first)
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Helper to get stars for difficulty (moved up for use in renderBlogCards)
  function getDifficultyStars(difficulty) {
    const diff = difficulty.toLowerCase();
    if (diff === 'easy') return '★';
    if (diff === 'medium') return '★★';
    if (diff === 'hard') return '★★★';
    if (diff === 'challenge') return '★★★★';
    if (diff === 'extreme') return '★★★★★';
    return '';
  }

  // Render blog cards for the current page and filter
  function renderBlogCards(posts, page = 1) {
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    if (paginatedPosts.length === 0) {
      return `
        <div class="blog-empty">
          <p>🚧 No writeups found. Check back later!</p>
        </div>
      `;
    }

    return paginatedPosts.map(post => `
      <article class="blog-card" data-category="${post.category.toLowerCase()}" data-id="${post.id}">
        <div class="blog-card-header">
          <span class="blog-category ${post.category.toLowerCase()}">${post.category}</span>
          <span class="blog-difficulty ${post.difficulty.toLowerCase()}"><span class="difficulty-stars">${getDifficultyStars(post.difficulty)}</span> ${post.difficulty}</span>
        </div>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt}</p>
        <div class="blog-tags">
          ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
        </div>
        <div class="blog-footer">
          <span class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <button class="blog-read-more" data-id="${post.id}">Read More →</button>
        </div>
      </article>
    `).join('');
  }

  // Render pagination controls
  function renderPagination(totalPosts, currentPage = 1) {
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    
    if (totalPages <= 1) return '';

    let paginationHTML = '<div class="blog-pagination">';
    
    // Previous button
    paginationHTML += `<button class="pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>`;
    
    // Page numbers
    paginationHTML += '<div class="pagination-numbers">';
    
    // Logic for showing page numbers with ellipsis
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      paginationHTML += `<button class="pagination-btn pagination-num" data-page="1">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `<button class="pagination-btn pagination-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
      paginationHTML += `<button class="pagination-btn pagination-num" data-page="${totalPages}">${totalPages}</button>`;
    }

    paginationHTML += '</div>';
    
    // Next button
    paginationHTML += `<button class="pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`;
    
    paginationHTML += '</div>';
    
    return paginationHTML;
  }

  blog.innerHTML = `
    <div class="container">
      <h2 class="section-title">Writeups</h2>
      <div class="blog-filters">
        ${categories.map((cat, index) => `
          <button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${cat.toLowerCase()}">${cat}</button>
        `).join('')}
      </div>

      <div class="blog-grid">
        ${renderBlogCards(sortedPosts, 1)}
      </div>

      ${renderPagination(sortedPosts.length, 1)}

      <!-- Modal for full writeup -->
      <div class="blog-modal" id="blog-modal">
        <div class="blog-modal-content">
          <button class="blog-modal-close">&times;</button>
          <div class="blog-modal-header">
            <span class="blog-category" id="modal-category"></span>
            <span class="blog-difficulty" id="modal-difficulty"></span>
          </div>
          <h2 class="blog-modal-title" id="modal-title"></h2>
          <div class="blog-modal-tags" id="modal-tags"></div>
          <div class="blog-modal-body" id="modal-body"></div>
        </div>
      </div>
    </div>

    <style>
      #blog {
        padding: var(--space-16) 0;
      }

      .blog-intro {
        text-align: center;
        max-width: 700px;
        margin: 0 auto var(--space-8);
      }

      .blog-intro p {
        font-size: var(--font-size-lg);
        color: var(--color-gray-300);
      }

      .blog-filters {
        display: flex;
        justify-content: center;
        gap: var(--space-3);
        margin-bottom: var(--space-8);
        flex-wrap: wrap;
      }

      .filter-btn {
        padding: var(--space-2) var(--space-4);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: var(--radius-full);
        background: transparent;
        color: var(--color-gray-300);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: var(--font-size-sm);
      }

      .filter-btn:hover,
      .filter-btn.active {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3));
        border-color: var(--color-primary-500);
        color: var(--color-white);
      }

      .blog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--space-6);
        max-width: 1200px;
        margin: 0 auto;
      }

      .blog-card {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
      }

      .blog-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 40px rgba(139, 92, 246, 0.2);
        border-color: var(--color-primary-500);
      }

      .blog-card.hidden {
        display: none;
      }

      .blog-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-3);
      }

      .blog-category {
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
      }

      .blog-category.leetcode {
        background: rgba(255, 161, 22, 0.2);
        color: #ffa116;
      }

      .blog-category.tryhackme {
        background: rgba(13, 126, 54, 0.2);
        color: #00ff5e;
      }

      .blog-category.tools {
        background: rgba(172, 172, 172, 0.2);
        color: #c6c6c6;
      }

      .blog-difficulty {
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.3em;
      }

      .difficulty-stars {
        color: gold;
        font-size: 1.1em;
        margin-right: 0.2em;
        letter-spacing: 0.05em;
        line-height: 1;
        display: inline-block;
      }

      .blog-difficulty.easy {
        background: rgba(34, 197, 94, 0.2); /* green */
        color: #22c55e;
      }

      .blog-difficulty.medium {
        background: rgba(251, 191, 36, 0.2); /* yellow */
        color: #fbbf24;
      }

      .blog-difficulty.hard {
        background: rgba(251, 146, 60, 0.2); /* orange */
        color: #fb923c;
      }

      .blog-difficulty.challenge {
        background: rgba(239, 68, 68, 0.2); /* red */
        color: #ef4444;
      }

      .blog-difficulty.extreme {
        background: rgba(168, 85, 247, 0.2); /* purple */
        color: #a855f7;
      }

      .blog-title {
        font-family: 'Berkshire Swash', normal;
        font-size: var(--font-size-xl);
        margin-bottom: var(--space-2);
        color: var(--color-white);
      }

      .blog-excerpt {
        color: var(--color-gray-400);
        font-size: var(--font-size-sm);
        margin-bottom: var(--space-4);
        flex-grow: 1;
      }

      .blog-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-4);
      }

      .blog-tag {
        padding: var(--space-1) var(--space-2);
        background: rgba(139, 92, 246, 0.15);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        color: var(--color-primary-300);
      }

      .blog-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--space-3);
        border-top: 1px solid rgba(139, 92, 246, 0.2);
      }

      .blog-date {
        font-size: var(--font-size-xs);
        color: var(--color-gray-500);
      }

      .blog-read-more {
        color: var(--color-primary-400);
        font-size: var(--font-size-sm);
        text-decoration: none;
        transition: color 0.3s ease;
        background: none;
        border: none;
        cursor: pointer;
        font-family: inherit;
      }

      .blog-read-more:hover {
        color: var(--color-primary-300);
      }

      .blog-empty {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-12);
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
        border: 1px dashed rgba(139, 92, 246, 0.3);
        border-radius: var(--radius-lg);
      }

      .blog-empty p {
        font-size: var(--font-size-lg);
        color: var(--color-gray-400);
      }

      /* Modal Styles */
      .blog-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 1000;
        padding: 2rem;
        box-sizing: border-box;
      }

      .blog-modal.active {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .blog-modal-content {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: var(--radius-lg);
        max-width: 800px;
        width: 100%;
        max-height: calc(100vh - 4rem);
        padding: var(--space-8);
        position: relative;
        box-sizing: border-box;
        overflow-y: auto;
        overscroll-behavior: contain;
      }

      .blog-modal-close {
        position: absolute;
        top: var(--space-4);
        right: var(--space-4);
        background: none;
        border: none;
        color: var(--color-gray-400);
        font-size: 2rem;
        cursor: pointer;
        transition: color 0.3s ease;
        line-height: 1;
      }

      .blog-modal-close:hover {
        color: var(--color-white);
      }

      .blog-modal-header {
        display: flex;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
      }

      .blog-modal-title {
        font-family: 'Berkshire Swash', cursive;
        font-size: var(--font-size-3xl);
        color: var(--color-white);
        margin-bottom: var(--space-4);
      }

      .blog-modal-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-6);
        padding-bottom: var(--space-6);
        border-bottom: 1px solid rgba(139, 92, 246, 0.2);
      }

      .blog-modal-body {
        color: var(--color-gray-300);
        line-height: 1.8;
      }

      .blog-modal-body h2 {
        font-family: 'Berkshire Swash', cursive;
        font-size: var(--font-size-xl);
        color: var(--color-white);
        margin-top: var(--space-6);
        margin-bottom: var(--space-3);
      }

      .blog-modal-body h3 {
        font-family: 'Berkshire Swash', cursive;
        font-size: var(--font-size-lg);
        color: var(--color-white);
        margin-top: var(--space-4);
        margin-bottom: var(--space-2);
      }

      .blog-modal-body p {
        margin-bottom: var(--space-4);
      }

      .blog-modal-body ul {
        margin-left: var(--space-6);
        margin-bottom: var(--space-4);
        list-style-type: disc;
        padding-left: var(--space-4);
      }

      .blog-modal-body ol {
        margin-left: var(--space-6);
        margin-bottom: var(--space-4);
        list-style-type: decimal;
        padding-left: var(--space-4);
      }

      .blog-modal-body li {
        margin-bottom: 0;
        display: list-item;
      }

      .blog-modal-body pre {
        background: #282c34;
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        overflow-x: auto;
        margin: var(--space-4) 0;
      }

      .blog-modal-body pre code {
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: var(--font-size-sm);
        background: transparent;
        padding: 0;
      }

      .blog-modal-body code {
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: var(--font-size-sm);
        color: #a591ff;
      }

      .blog-modal-body p code {
        background: rgba(139, 92, 246, 0.15);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
      }

      .blog-modal-body strong {
        color: var(--color-white);
      }

      /* Solution tabs styles */
      .solution-tabs {
        margin: var(--space-4) 0;
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: var(--radius-md);
        overflow: hidden;
      }

      .solution-tabs-header {
        display: flex;
        flex-wrap: wrap;
        background: rgba(139, 92, 246, 0.1);
        border-bottom: 1px solid rgba(139, 92, 246, 0.3);
      }

      .solution-tab-btn {
        padding: var(--space-2) var(--space-4);
        background: transparent;
        border: none;
        color: var(--color-gray-400);
        cursor: pointer;
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: var(--font-size-sm);
        transition: all 0.2s ease;
        border-right: 1px solid rgba(139, 92, 246, 0.2);
      }

      .solution-tab-btn:last-child {
        border-right: none;
      }

      .solution-tab-btn:hover {
        background: rgba(139, 92, 246, 0.15);
        color: var(--color-gray-200);
      }

      .solution-tab-btn.active {
        background: rgba(139, 92, 246, 0.25);
        color: var(--color-white);
      }

      .solution-tab-content {
        display: none;
      }

      .solution-tab-content.active {
        display: block;
      }

      .solution-tab-content pre {
        margin: 0;
        border: none;
        border-radius: 0;
      }

      @media (max-width: 768px) {
        .blog-grid {
          grid-template-columns: 1fr;
        }

        .blog-filters {
          gap: var(--space-2);
        }

        .filter-btn {
          padding: var(--space-2) var(--space-3);
          font-size: var(--font-size-xs);
        }

        .blog-modal-content {
          padding: var(--space-5);
          margin: var(--space-4) 0;
        }

        .blog-modal-title {
          font-size: var(--font-size-2xl);
        }

        .blog-pagination {
          gap: var(--space-2);
        }

        .pagination-btn {
          padding: var(--space-2) var(--space-3);
          font-size: var(--font-size-xs);
        }

        .pagination-prev,
        .pagination-next {
          padding: var(--space-2);
        }
      }

      /* Pagination Styles */
      .blog-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--space-3);
        margin-top: var(--space-8);
        flex-wrap: wrap;
      }

      .pagination-numbers {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .pagination-btn {
        padding: var(--space-2) var(--space-4);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: var(--radius-md);
        background: transparent;
        color: var(--color-gray-300);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: var(--font-size-sm);
        font-family: inherit;
      }

      .pagination-btn:hover:not(.disabled) {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3));
        border-color: var(--color-primary-500);
        color: var(--color-white);
      }

      .pagination-btn.active {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5));
        border-color: var(--color-primary-400);
        color: var(--color-white);
      }

      .pagination-btn.disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .pagination-ellipsis {
        color: var(--color-gray-500);
        padding: 0 var(--space-1);
      }

      .pagination-prev,
      .pagination-next {
        font-weight: 500;
      }
    </style>
  `;

  // Pagination state
  let currentPage = 1;
  let currentFilter = 'all';

  // Get filtered posts based on current filter
  function getFilteredPosts() {
    if (currentFilter === 'all') {
      return sortedPosts;
    }
    return sortedPosts.filter(post => post.category.toLowerCase() === currentFilter);
  }

  // Update the blog grid and pagination
  function updateBlogView() {
    const filteredPosts = getFilteredPosts();
    const blogGrid = blog.querySelector('.blog-grid');
    const paginationContainer = blog.querySelector('.blog-pagination');
    
    // Update blog cards
    blogGrid.innerHTML = renderBlogCards(filteredPosts, currentPage);
    
    // Update pagination
    const newPaginationHTML = renderPagination(filteredPosts.length, currentPage);
    if (paginationContainer) {
      paginationContainer.outerHTML = newPaginationHTML;
    } else if (newPaginationHTML) {
      blogGrid.insertAdjacentHTML('afterend', newPaginationHTML);
    }

    // Re-attach event listeners for read more buttons
    attachReadMoreListeners();
    
    // Re-attach pagination listeners
    attachPaginationListeners();
  }

  // Attach pagination event listeners
  function attachPaginationListeners() {
    const paginationBtns = blog.querySelectorAll('.pagination-btn:not(.disabled)');
    paginationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (page !== currentPage) {
          currentPage = page;
          updateBlogView();
          // Smooth scroll to top of blog section
          blog.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Simple markdown parser for writeups
  let solutionTabCounter = 0;
  
  function parseMarkdown(text) {
    // DEBUG: Check if escaping is enabled
    // console.log('parseMarkdown v2.0 - escaping enabled');
    
    // Placeholder tokens for escaped characters
    const ESCAPED_UNDERSCORE = 'XESCUNDERSCOREX';
    const ESCAPED_CARET = 'XESCCARETX';
    const ESCAPED_BACKSLASH = 'XESCBACKSLASHX';
    const ESCAPED_ASTERISK = 'XESCASTERISKX';
    
    // Store code blocks to protect them from other formatting
    const codeBlockStore = [];
    const inlineCodeStore = [];
    
    // Process solution tabs first (protect their code blocks)
    text = text.replace(/\\\\/g, ESCAPED_BACKSLASH); // Protect escaped backslashes first
    text = text.replace(/\[solutions\]([\s\S]*?)\[\/solutions\]/g, (match, content) => {
      const tabId = `solution-tabs-${solutionTabCounter++}`;
      const codeBlocks = [];
      // Updated regex to capture optional custom label after colon
      const regex = /\`\`\`(\w+)?(?::([^\n]+))?\n([\s\S]*?)\`\`\`/g;
      let blockMatch;
      
      while ((blockMatch = regex.exec(content)) !== null) {
        const lang = blockMatch[1] || 'code';
        const label = blockMatch[2] ? blockMatch[2].trim() : lang;
        // Escape HTML tags in code blocks
        const code = blockMatch[3].replace(/</g, '&lt;').replace(/>/g, '&gt;');
        codeBlocks.push({ lang, label, code });
      }
      
      if (codeBlocks.length === 0) return '';
      
      const tabs = codeBlocks.map((block, i) => 
        `<button class="solution-tab-btn ${i === 0 ? 'active' : ''}" data-tab="${tabId}-${i}">${block.label}</button>`
      ).join('');
      
      const contents = codeBlocks.map((block, i) => 
        `<div class="solution-tab-content ${i === 0 ? 'active' : ''}" data-tab-content="${tabId}-${i}"><pre><code class="language-${block.lang}">${block.code}</code></pre></div>`
      ).join('');
      
      // Store the entire solution tabs block and replace with placeholder
      const placeholder = `~~SOLUTIONTABS${codeBlockStore.length}~~`;
      codeBlockStore.push(`<div class="solution-tabs" data-tabs="${tabId}"><div class="solution-tabs-header">${tabs}</div>${contents}</div>`);
      return placeholder;
    });
    
    // Protect code blocks - store them and replace with placeholders
    text = text.replace(/\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g, (match, lang, code) => {
      const placeholder = `~~CODEBLOCK${codeBlockStore.length}~~`;
      const langClass = lang ? `language-${lang}` : '';
      // Escape HTML tags in code blocks
      const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      codeBlockStore.push(`<pre><code class="${langClass}">${escapedCode}</code></pre>`);
      return placeholder;
    });
    
    // Protect inline code
    text = text.replace(/\`([^\`]+)\`/g, (match, code) => {
      const placeholder = `~~INLINECODE${inlineCodeStore.length}~~`;
      // Escape HTML tags in inline code
      const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      inlineCodeStore.push(`<code>${escapedCode}</code>`);
      return placeholder;
    });
    
    text = text
      // First, protect escaped characters (backslash already handled above)
      .replace(/\\_/g, ESCAPED_UNDERSCORE)
      .replace(/\\\^/g, ESCAPED_CARET)
      .replace(/\\\*/g, ESCAPED_ASTERISK)
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      // Superscript: x^2 or x^{10}
      .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
      .replace(/\^(\w)/g, '<sup>$1</sup>')
      // Subscript: x_1 or x_{10}
      .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
      .replace(/_(\w)/g, '<sub>$1</sub>')
      // Numbered lists (1. 2. 3. etc)
      .replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>')
      // Wrap consecutive oli elements in ol (remove newlines between items)
      .replace(/(<oli>.*<\/oli>\n?)+/g, (match) => '<ol>' + match.replace(/oli>/g, 'li>').replace(/\n/g, '') + '</ol>')
      // Unordered lists (- item)
      .replace(/^- (.+)$/gm, '<uli>$1</uli>')
      // Wrap consecutive uli elements in ul (remove newlines between items)
      .replace(/(<uli>.*<\/uli>\n?)+/g, (match) => '<ul>' + match.replace(/uli>/g, 'li>').replace(/\n/g, '') + '</ul>')
      // Paragraphs (lines that aren't already wrapped)
      // Split on 2+ newlines (with optional whitespace between) for paragraph breaks
      .split(/\n\s*\n/)
      .map(para => {
        para = para.trim();
        if (!para) return '';
        // Skip if it's already an HTML element (but not a placeholder)
        if (para.startsWith('<') && !para.startsWith('~~')) return para;
        // If it's just a code block placeholder on its own line, return as-is
        if (/^~~(CODEBLOCK|SOLUTIONTABS)\d+~~$/.test(para)) return para;
        // Convert single newlines to <br> within paragraphs (including those with inline code)
        let html = para.replace(/\n/g, '<br>');
        return `<p>${html}</p>`;
      })
      .join('')
      // Now apply bold and italic formatting to everything (lists and paragraphs)
      // Bold
      .replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
      // Italics: single asterisks, not inside bold
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Restore escaped characters AFTER all formatting is done
      .replace(/XESCUNDERSCOREX/g, '_')
      .replace(/XESCCARETX/g, '^')
      .replace(/XESCBACKSLASHX/g, '\\')
      .replace(/XESCASTERISKX/g, '*');
    
    // Restore code blocks and inline code
    codeBlockStore.forEach((code, i) => {
      text = text.replace(`~~CODEBLOCK${i}~~`, code);
      text = text.replace(`~~SOLUTIONTABS${i}~~`, code);
    });
    inlineCodeStore.forEach((code, i) => {
      text = text.replace(`~~INLINECODE${i}~~`, code);
    });
    
    return text;
  }

  // Store blog posts data for modal access
  const postsMap = {};
  blogPosts.forEach(post => {
    postsMap[post.id] = post;
  });

  // Modal functionality
  const modal = blog.querySelector('#blog-modal');
  
  // Move modal to body to prevent positioning issues from parent transforms
  document.body.appendChild(modal);
  
  const modalContent = modal.querySelector('.blog-modal-content');
  const modalTitle = modal.querySelector('#modal-title');
  const modalCategory = modal.querySelector('#modal-category');
  const modalDifficulty = modal.querySelector('#modal-difficulty');
  const modalTags = modal.querySelector('#modal-tags');
  const modalBody = modal.querySelector('#modal-body');
  const modalClose = modal.querySelector('.blog-modal-close');

  // Function to attach read more listeners (reusable for pagination updates)
  function attachReadMoreListeners() {
    blog.querySelectorAll('.blog-read-more').forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = btn.dataset.id;
        const post = postsMap[postId];
        
        if (post) {
          modalTitle.textContent = post.title;
          modalCategory.textContent = post.category;
          modalCategory.className = `blog-category ${post.category.toLowerCase()}`;
          modalDifficulty.innerHTML = `<span class="difficulty-stars">${getDifficultyStars(post.difficulty)}</span> ${post.difficulty}`;
          modalDifficulty.className = `blog-difficulty ${post.difficulty.toLowerCase()}`;
          modalTags.innerHTML = post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('');
          modalBody.innerHTML = parseMarkdown(post.content);
          
          // Apply syntax highlighting to all code blocks
          modalBody.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
          });
          
          // Initialize solution tabs click handlers
          modalBody.querySelectorAll('.solution-tab-btn').forEach(tabBtn => {
            tabBtn.addEventListener('click', () => {
              const tabId = tabBtn.dataset.tab;
              const tabsContainer = tabBtn.closest('.solution-tabs');
              
              // Update active button
              tabsContainer.querySelectorAll('.solution-tab-btn').forEach(btn => btn.classList.remove('active'));
              tabBtn.classList.add('active');
              
              // Update active content
              tabsContainer.querySelectorAll('.solution-tab-content').forEach(content => content.classList.remove('active'));
              tabsContainer.querySelector(`[data-tab-content="${tabId}"]`).classList.add('active');
            });
          });
          
          modal.classList.add('active');
          // Reset scroll positions to top
          modal.scrollTop = 0;
          modalContent.scrollTop = 0;
          modalBody.scrollTop = 0;
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // Initial attachment of read more listeners
  attachReadMoreListeners();

  // Initial attachment of pagination listeners
  attachPaginationListeners();

  // Close modal
  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    modal.scrollTop = 0;
    modalContent.scrollTop = 0;
    modalBody.scrollTop = 0;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modal.scrollTop = 0;
      modalContent.scrollTop = 0;
      modalBody.scrollTop = 0;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      modal.scrollTop = 0;
      modalContent.scrollTop = 0;
      modalBody.scrollTop = 0;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  });

  // Filter functionality
  const filterBtns = blog.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update filter and reset to page 1
      currentFilter = filter;
      currentPage = 1;
      updateBlogView();
    });
  });
}