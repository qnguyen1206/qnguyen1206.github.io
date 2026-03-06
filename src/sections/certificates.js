const certificatesData = {
  professional: [
    
  ],
  nonProfessional: [
    {
      title: "Web Fundamentals",
      issuer: "TryHackMe",
      date: "Mar 5, 2026",
      link: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-WINFHGE86I.pdf"
    },
    {
      title: "Cyber Security 101",
      issuer: "TryHackMe",
      date: "Feb 25, 2026",
      link: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-9JHFBDC10O.pdf"
    },
    {
      title: "Pre Security",
      issuer: "TryHackMe", 
      date: "Jan 19, 2026",
      link: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-OEVIOASGDY.pdf"
    },
    {
      title: "Typography: Hierarchy and Navigation",
      issuer: "LinkedIn Learning", 
      date: "Oct 19, 2025",
      link: "https://www.linkedin.com/learning/certificates/55d7fb36f815d968191f6f722c8ac76b39b79ded8ef2fdeacf5d921c8038307c?trk=share_certificate"
    },
    {
      title: "Graphic Design Foundations: Typography",
      issuer: "LinkedIn Learning", 
      date: "Oct 11, 2025",
      link: "https://www.linkedin.com/learning/certificates/2ec51a540e414a3d402a76776f3d869a0ae7d0e4d8028231bc2f4a099aa43f0c?trk=share_certificate"
    },
    {
      title: "Python for Data visualization",
      issuer: "LinkedIn Learning", 
      date: "Sep 05, 2025",
      link: "https://www.linkedin.com/learning/certificates/4aa4b781930a7849ceea31e326d4665b8ef969e2b43843f44c7a14e380c01952?trk=share_certificate"
    },
    {
      title: "Figma Essential Training: The Basics",
      issuer: "LinkedIn Learning", 
      date: "Sep 04, 2025",
      link: "https://www.linkedin.com/learning/certificates/834631ec81942e46498fe9aa0a760113b95a3d5da73c21d71ef592541a4ea6bf?trk=share_certificate"
    },
    {
      title: "Legacy JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      date: "July 21, 2023",
      link: "https://www.freecodecamp.org/certification/quang_m_nguyen/javascript-algorithms-and-data-structures"
    }
  ]
};

const issuerIcons = {
  "Google": "https://developers.google.com/static/site-assets/logo-google.svg",
  "Microsoft": "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b",
  "Amazon": "https://a0.awsstatic.com/libra-css/images/logos/aws_smile-header-desktop-en-white_59x35.png",
  "Meta": "https://about.meta.com/brand/resources/meta/company-brand/",
  "freeCodeCamp": "icons/freeCodeCamp.svg",
  "LinkedIn Learning": "icons/LinkedIn.svg",
  "TryHackMe": "icons/tryhackme.svg",
  "Coursera": {
    type: "svg",
    content: `<circle cx="12" cy="12" r="3"/><path d="M12 1v6"/><path d="M12 17v6"/><path d="M4.22 4.22l4.24 4.24"/><path d="15.54 15.54l4.24 4.24"/><path d="M1 12h6"/><path d="M17 12h6"/><path d="M4.22 19.78l4.24-4.24"/><path d="M15.54 8.46l4.24-4.24"/>`
  },
  "edX": {
    type: "svg",
    content: `<path d="M2 3h6l4 6-4 6H2l4-6-4-6z"/><path d="M22 3h-6l-4 6 4 6h6l-4-6 4-6z"/>`
  },
  "Udemy": {
    type: "svg",
    content: `<circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/>`
  },
  "CompTIA": {
    type: "svg",
    content: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`
  },
  "Cisco": {
    type: "svg",
    content: `<rect x="2" y="6" width="20" height="8" rx="1"/><circle cx="7" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="17" cy="10" r="1"/>`
  },
  "default": {
    type: "svg",
    content: `<circle cx="12" cy="6" r="3" /><path d="M12 3v6" /><path d="M21 11l-8 -2l-2 -1l-8 2v4.5a3.5 3.5 0 0 0 3.5 3.5h9a3.5 3.5 0 0 0 3.5 -3.5v-4.5z" /><path d="M7 15v-2a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v2" />`
  }
};

function getIssuerIcon(issuer) {
  const icon = issuerIcons[issuer] || issuerIcons["default"];

  if (typeof icon === "string") {
    return `<img src="${icon}" alt="${issuer} logo" style="width: 48px; height: 48px; object-fit: contain;" />`;
  } else if (icon.type === "svg") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>${icon.content}</svg>`;
  }

  return getIssuerIcon("default");
}

function generateCertificateHTML(cert) {
  return `
    <a href="${cert.link}" class="certificate-card" target="_blank" rel="noopener noreferrer">
      <div class="certificate-icon">
        ${getIssuerIcon(cert.issuer)}
      </div>
      <h3>${cert.title}</h3>
      <p class="certificate-issuer">${cert.issuer}</p>
      <p class="certificate-date">${cert.date}</p>
      <div class="certificate-cta">
        <span class="view-certificate">View Certificate</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M7 7h10v10" />
          <path d="M7 17l10 -10" />
        </svg>
      </div>
    </a>
  `;
}

export function initCertificates() {
  const certificatesSection = document.getElementById('certificates');

  // Current active tab state
  let activeTab = 'professional';
  
  function getCurrentCertificates() {
    return certificatesData[activeTab] || [];
  }

  function getCertificatesHTML() {
    const certs = getCurrentCertificates();
    if (certs.length === 0) {
      return `<div class="certificates-empty"><p>No certificates in this category yet.</p></div>`;
    }
    return certs.map(cert => generateCertificateHTML(cert)).join('');
  }

  function getCertificatesPerView() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) return 1;
    if (screenWidth < 768) return 2;
    if (screenWidth < 1024) return 3;
    return 4;
  }

  function getTotalPages() {
    const certificatesPerView = getCertificatesPerView();
    const currentCerts = getCurrentCertificates();
    return Math.max(1, Math.ceil(currentCerts.length / certificatesPerView));
  }

  function createDotsHTML() {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return '';
    return Array.from({length: totalPages}, (_, index) => `
      <button class="cert-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
    `).join('');
  }

  certificatesSection.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">Certificates</h2>
      
      <div class="certificates-tabs">
        <button class="cert-tab-btn active" data-tab="professional">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
            <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
            <path d="M12 12l0 .01" />
            <path d="M3 13a20 20 0 0 0 18 0" />
          </svg>
          Professional
        </button>
        <button class="cert-tab-btn" data-tab="nonProfessional">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
            <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
          </svg>
          Non-Professional
        </button>
      </div>

      <div class="certificates-container reveal">
        <div class="certificates-wrapper" id="certificatesWrapper">
          <div class="certificates-grid" id="certificatesGrid">
            ${getCertificatesHTML()}
          </div>
        </div>
        <div class="certificates-navigation" id="certificatesNavigation">
          <button class="cert-nav-btn prev-btn" id="prevCertBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <div class="certificates-dots" id="certificatesDots">
            ${createDotsHTML()}
          </div>
          <button class="cert-nav-btn next-btn" id="nextCertBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <style>
      #certificates {
        background-color: var(--color-bg);
        padding: var(--space-4) 0 var(--space-6) 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .certificates-tabs {
        display: flex;
        justify-content: center;
        gap: var(--space-3);
        margin-bottom: var(--space-6);
        flex-wrap: wrap;
      }

      .cert-tab-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-5);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: var(--radius-full);
        background: transparent;
        color: var(--color-gray-300);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: var(--font-size-sm);
        font-family: inherit;
        font-weight: 500;
      }

      .cert-tab-btn:hover {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
        border-color: rgba(139, 92, 246, 0.5);
        color: var(--color-white);
      }

      .cert-tab-btn.active {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4));
        border-color: var(--color-primary-500);
        color: var(--color-white);
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
      }

      .cert-tab-btn svg {
        flex-shrink: 0;
      }

      .certificates-empty {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
        width: 100%;
        color: var(--color-gray-400);
        font-size: var(--font-size-lg);
      }

      .certificates-container {
        position: relative;
        margin-top: var(--space-4);
        padding: var(--space-2) 0;
      }

      .certificates-wrapper {
        position: relative;
        border-radius: var(--radius-lg);
        width: 100%;
        padding: var(--space-2) 0;
      }

      .certificates-grid {
        display: flex;
        gap: var(--space-4);
        transition: all 0.5s ease;
        justify-content: center;
        align-items: stretch;
        flex-wrap: nowrap;
        padding: var(--space-2) 0;
      }

      .certificate-card {
        flex: 0 0 280px;
        width: 280px;
        height: 400px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1), 0 4px 16px rgba(59, 130, 246, 0.1);
      }

      .certificates-navigation {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-4);
        margin-top: var(--space-4);
      }

      .cert-nav-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
        border: 1px solid rgba(139, 92, 246, 0.3);
        color: var(--color-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .cert-nav-btn:hover {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
        border-color: rgba(139, 92, 246, 0.4);
        transform: scale(1.1);
      }

      .cert-nav-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .certificates-dots {
        display: flex;
        gap: var(--space-2);
        align-items: center;
      }

      .cert-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(139, 92, 246, 0.3);
        border: 1px solid rgba(139, 92, 246, 0.4);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .cert-dot.active {
        background: var(--color-primary);
        transform: scale(1.3);
        box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
      }

      .cert-dot:hover {
        background: var(--color-primary);
        transform: scale(1.1);
      }

      .certificate-card:hover {
        transform: translateY(-4px);
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15));
        box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2), 0 6px 20px rgba(59, 130, 246, 0.15);
        border-color: rgba(139, 92, 246, 0.3);
        text-decoration: none;
        color: inherit;
      }

      .certificate-card:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      .certificate-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .certificate-card:hover::before {
        opacity: 1;
      }

      .certificate-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        border-radius: 50%;
        margin-bottom: var(--space-3);
        color: white;
        padding: var(--space-2);
      }

      .certificate-icon svg {
        width: 48px;
        height: 48px;
        color: white;
      }

      .certificate-icon img {
        width: 48px;
        height: 48px;
        object-fit: contain;
        border-radius: 4px;
        filter: brightness(0) invert(1);
      }

      .certificate-card h3 {
        color: var(--color-text);
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: var(--space-2);
      }

      .certificate-issuer {
        color: var(--color-primary);
        font-weight: 500;
        font-size: 1rem;
        margin-bottom: var(--space-1);
      }

      .certificate-date {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        margin-bottom: var(--space-3);
      }

      .certificate-description {
        color: var(--color-text-muted);
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: var(--space-3);
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .certificate-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-1);
        color: var(--color-primary);
        font-weight: 500;
        font-size: 0.9rem;
        opacity: 0.8;
        transition: all 0.3s ease;
        margin-top: auto;
      }

      .certificate-card:hover .certificate-cta {
        opacity: 1;
        transform: translateX(4px);
      }

      .view-certificate {
        transition: all 0.3s ease;
      }

      @media (max-width: 1024px) {
        .certificate-card {
          flex: 0 0 260px;
          width: 260px;
          height: 380px;
        }
      }

      @media (max-width: 768px) {
        .certificates-grid {
          gap: var(--space-3);
        }

        .certificate-card {
          flex: 0 0 240px;
          width: 240px;
          height: 360px;
          padding: var(--space-3);
        }

        .certificate-icon {
          width: 60px;
          height: 60px;
        }

        .certificate-icon svg {
          width: 32px;
          height: 32px;
        }

        .cert-nav-btn {
          width: 40px;
          height: 40px;
        }
      }

      @media (max-width: 480px) {
        .certificates-grid {
          gap: var(--space-2);
        }

        .certificate-card {
          flex: 0 0 calc(100vw - 2rem);
          width: calc(100vw - 2rem);
          max-width: 320px;
          height: 380px;
        }

        .certificates-navigation {
          gap: var(--space-2);
        }

        .certificates-tabs {
          gap: var(--space-2);
        }

        .cert-tab-btn {
          padding: var(--space-2) var(--space-3);
          font-size: var(--font-size-xs);
        }

        .cert-tab-btn svg {
          width: 16px;
          height: 16px;
        }
      }
    </style>
  `;

  // JavaScript functionality for carousel
  let currentIndex = 0;
  let autoScroll;

  function updateCarousel() {
    const certificatesPerView = getCertificatesPerView();
    const totalPages = getTotalPages();
    const currentCerts = getCurrentCertificates();

    const certificatesGrid = document.getElementById('certificatesGrid');
    const dots = document.querySelectorAll('.cert-dot');
    const prevBtn = document.getElementById('prevCertBtn');
    const nextBtn = document.getElementById('nextCertBtn');
    const navigation = document.getElementById('certificatesNavigation');

    // Hide navigation if only one page or no certificates
    if (totalPages <= 1 || currentCerts.length === 0) {
      navigation.style.display = 'none';
    } else {
      navigation.style.display = 'flex';
    }

    certificatesGrid.style.transform = 'translateX(0)';
    certificatesGrid.style.justifyContent = 'center';

    const startIndex = currentIndex * certificatesPerView;
    const endIndex = Math.min(startIndex + certificatesPerView, currentCerts.length);

    const allCards = certificatesGrid.querySelectorAll('.certificate-card');
    allCards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= totalPages - 1;
  }

  function updateDotsAndCarousel() {
    const dotsContainer = document.getElementById('certificatesDots');
    dotsContainer.innerHTML = createDotsHTML();

    const totalPages = getTotalPages();
    if (currentIndex >= totalPages) {
      currentIndex = Math.max(0, totalPages - 1);
    }

    const newDots = document.querySelectorAll('.cert-dot');
    newDots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    updateCarousel();
  }

  function refreshCertificatesView() {
    const certificatesGrid = document.getElementById('certificatesGrid');
    certificatesGrid.innerHTML = getCertificatesHTML();
    currentIndex = 0;
    updateDotsAndCarousel();
  }

  function nextSlide() {
    const totalPages = getTotalPages();
    if (currentIndex < totalPages - 1) {
      currentIndex++;
      updateCarousel();
    } else {
      currentIndex = 0;
      updateCarousel();
    }
  }

  function prevSlide() {
    const totalPages = getTotalPages();
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    } else {
      currentIndex = totalPages - 1;
      updateCarousel();
    }
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function startAutoScroll() {
    autoScroll = setInterval(nextSlide, 4000);
  }

  function stopAutoScroll() {
    clearInterval(autoScroll);
  }

  const certificatesGrid = document.getElementById('certificatesGrid');
  const dots = document.querySelectorAll('.cert-dot');
  const prevBtn = document.getElementById('prevCertBtn');
  const nextBtn = document.getElementById('nextCertBtn');

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  startAutoScroll();

  const certificatesContainer = document.querySelector('.certificates-container');
  certificatesContainer.addEventListener('mouseenter', stopAutoScroll);
  certificatesContainer.addEventListener('mouseleave', startAutoScroll);

  // Tab switching functionality
  const tabBtns = document.querySelectorAll('.cert-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab !== activeTab) {
        activeTab = tab;
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Refresh the certificates view
        stopAutoScroll();
        refreshCertificatesView();
        startAutoScroll();
      }
    });
  });

  let startX = 0;
  let endX = 0;

  certificatesGrid.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoScroll();
  });

  certificatesGrid.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    startAutoScroll();
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateDotsAndCarousel();
    }, 250);
  });

  updateCarousel();
}
