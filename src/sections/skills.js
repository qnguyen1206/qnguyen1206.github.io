export function initSkills() {
  const skills = document.getElementById('skills');
  
  // Function to get proficiency name from level
  function getProficiencyName(level) {
    if (level <= 25) return 'Beginner';
    if (level <= 50) return 'Intermediate';
    if (level <= 75) return 'Proficient';
    return 'Advanced';
  }
  
  // Function to calculate skills per panel based on screen size
  function getSkillsPerPanel() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Base calculation on screen size and available panel height
    if (screenWidth < 400) {
      return 3; // Very small screens - fits 3 skills comfortably
    } else if (screenWidth < 480) {
      return 4; // Small mobile devices - fits 4 skills
    } else if (screenWidth < 768) {
      return 4; // Mobile devices - fits 4 skills
    } else {
      return 5; // Tablets, laptops, and larger screens - capped at 5 skills max
    }
  }
  
  // Skills data organized by categories
  const skillsData = {
    'Programming Languages': [
      { name: 'JavaScript', icon: 'icons/javascript_icon.png', level: 90 },
      { name: 'Python', icon: 'icons/python_icon.png', level: 85 },
      { name: 'Java', icon: 'icons/java_icon.png', level: 80 },
      { name: 'C#', icon: 'icons/csharp_icon.png', level: 75 },
      { name: 'C', icon: 'icons/c_icon.png', level: 70 },
      { name: 'PHP', icon: 'icons/php_icon.png', level: 65 }
    ],
    'Web Technologies': [
      { name: 'HTML', icon: 'icons/html_icon.png', level: 95 },
      { name: 'CSS', icon: 'icons/css_icon.png', level: 90 },
      { name: 'React', icon: 'icons/react_icon.png', level: 85 },
      { name: 'Node.js', icon: 'icons/nodejs_icon.png', level: 80 },
      { name: 'Vite', icon: 'icons/vite_icon.png', level: 75 }
    ],
    'Game Development': [
      { name: 'Unity', icon: 'icons/unity_icon.png', level: 85 },
      { name: 'Godot', icon: 'icons/godot_icon.png', level: 70 },
      { name: 'A-Frame', icon: 'icons/aframe_icon.png', level: 65 }
    ],
    'Tools & Platforms': [
      { name: 'GitHub', icon: 'icons/github_icon.png', level: 90 },
      { name: 'GitLab', icon: 'icons/gitlab_icon.png', level: 85 },
      { name: 'Firebase', icon: 'icons/firebase_icon.png', level: 80 },
      { name: 'Android Studio', icon: 'icons/android_studio_icon.png', level: 75 },
      { name: 'MySQL', icon: 'icons/mysql_icon.png', level: 70 },
      { name: 'phpMyAdmin', icon: 'icons/phpmyadmin_icon.png', level: 65 }
    ],
    'Hardware & IoT': [
      { name: 'Raspberry Pi', icon: 'icons/raspberry_pi_icon.png', level: 75 },
      { name: 'Flipper Zero', icon: 'icons/flipper_zero_icon.png', level: 60 }
    ],
    'AI & Development': [
      { name: 'ChatGPT', icon: 'icons/chatgpt_icon.png', level: 85 },
      { name: 'GitHub Copilot', icon: 'icons/copilot_icon.png', level: 80 },
      { name: 'DeepSeek', icon: 'icons/deepseek_icon.png', level: 75 }
    ],
    'UI/UX Design': [
      { name: 'Krita', icon: 'icons/adobe_xd_icon.png', level: 80 },
      { name: 'MS Paint', icon: 'icons/sketch_icon.png', level: 75 },
      { name: 'Figma', icon: 'icons/figma_icon.png', level: 10 },
    ]
  };

  skills.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">Skills & Technologies</h2>
      
      <div class="skills-carousel-container">
        <div class="carousel-3d" id="skillsCarousel">
          ${Object.entries(skillsData).map(([category, skillsList], index) => {
            // Split skills into pages based on screen size
            const skillsPerPanel = getSkillsPerPanel();
            const skillPages = [];
            for (let i = 0; i < skillsList.length; i += skillsPerPanel) {
              skillPages.push(skillsList.slice(i, i + skillsPerPanel));
            }
            
            const hasMultiplePages = skillPages.length > 1;
            
            return `
            <div class="carousel-panel ${hasMultiplePages ? 'has-flip' : ''}" data-index="${index}" data-current-page="0" data-total-pages="${skillPages.length}">
              <div class="skills-category-block">
                <div class="flip-container">
                  ${skillPages.map((pageSkills, pageIndex) => `
                  <div class="skill-page ${pageIndex === 0 ? 'active' : ''}" data-page="${pageIndex}">
                    <div class="category-header">
                      <h3 class="category-title">${category}</h3>
                      ${hasMultiplePages ? `<div class="flip-indicator">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                          <path d="M21 3v5h-5"/>
                          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                          <path d="M3 21v-5h5"/>
                        </svg>
                        ${pageIndex + 1}/${skillPages.length}
                      </div>` : ''}
                    </div>
                    <div class="skills-block">
                      ${pageSkills.map(skill => `
                        <div class="skill-item">
                          <div class="skill-icon">
                            <img src="${skill.icon}" alt="${skill.name}" />
                          </div>
                          <div class="skill-info">
                            <h4 class="skill-name">${skill.name}</h4>
                            <div class="skill-level">
                              <div class="skill-bar">
                                <div class="skill-progress" data-level="${skill.level}"></div>
                              </div>
                              <span class="skill-proficiency">${getProficiencyName(skill.level)}</span>
                            </div>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  `).join('')}
                </div>
              </div>
            </div>
            `;
          }).join('')}
        </div>
        
        <div class="carousel-navigation">
          <button class="carousel-btn prev-btn" id="prevBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <div class="carousel-dots">
            ${Object.keys(skillsData).map((_, index) => `
              <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
            `).join('')}
          </div>
          <button class="carousel-btn next-btn" id="nextBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <style>
      .skills-carousel-container {
        max-width: 800px;
        margin: 60px auto 0 auto;
        position: relative;
        height: 510px;
        perspective: 1200px;
        overflow: visible;
      }
      
      .carousel-3d {
        position: relative;
        width: 100%;
        height: 410px;
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        margin: 0 auto;
      }
      
      .carousel-panel {
        position: absolute;
        width: 260px;
        height: 380px;
        left: 50%;
        top: 50%;
        transform-origin: center center;
        margin-left: -130px;
        margin-top: -190px;
        backface-visibility: hidden;
        transform-style: preserve-3d;
      }
      
      .skills-category-block {
        border-radius: var(--border-radius-xl);
        transition: all var(--transition-normal) var(--easing-out);
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        position: relative;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
      }
      
      /* Flip container and skill pages */
      .flip-container {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.8s ease-in-out;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
      }
      
      .skill-page {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        -webkit-backface-visibility: hidden;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: var(--border-radius-xl);
        padding: var(--space-3);
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1), 0 4px 16px rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.2);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.5s ease-in-out;
      }
      
      .skill-page.active {
        opacity: 1;
        transform: translateX(0);
      }
      
      .flip-indicator {
        font-size: calc(var(--font-size-xs) * 0.9);
        color: rgba(139, 92, 246, 0.8);
        text-align: center;
        margin-top: 4px;
        font-weight: var(--font-weight-medium);
        opacity: 0.7;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
      
      .flip-indicator svg {
        flex-shrink: 0;
      }
      
      .skills-category-block:hover .flip-indicator {
        opacity: 1;
      }
      
      .skills-category-block:hover .skill-page.active {
        box-shadow: 0 12px 40px rgba(139, 92, 246, 0.15), 0 6px 20px rgba(59, 130, 246, 0.15);
        border-color: rgba(139, 92, 246, 0.3);
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15));
      }
      
      .category-header {
        text-align: center;
        margin-bottom: var(--space-2);
        padding-bottom: var(--space-2);
        border-bottom: 2px solid rgba(139, 92, 246, 0.3);
        flex-shrink: 0;
      }
      
      .category-title {
        font-size: var(--font-size-md);
        font-weight: var(--font-weight-bold);
        color: var(--color-primary-600);
        margin: 0;
        text-shadow: 0 2px 4px rgba(139, 92, 246, 0.1);
      }
      
      .skills-block {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        flex: 1;
        overflow: visible;
        padding-bottom: var(--space-2);
      }
      
      .skill-item {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2);
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(75, 85, 99, 0.2));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-radius: var(--border-radius-lg);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(75, 85, 99, 0.1);
        transition: all var(--transition-normal) var(--easing-out);
        border: 1px solid rgba(75, 85, 99, 0.3);
        min-height: 42px;
        flex-shrink: 0;
      }
      
      .skill-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(75, 85, 99, 0.2);
        border-color: rgba(75, 85, 99, 0.4);
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(75, 85, 99, 0.3));
      }
      
      .skill-icon {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(55, 65, 81, 0.3));
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        border-radius: var(--border-radius-md);
        padding: var(--space-1);
        border: 1px solid rgba(55, 65, 81, 0.4);
      }
      
      .skill-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      
      .skill-info {
        flex: 1;
      }
      
      .skill-name {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-semibold);
        color: white;
        margin-bottom: 2px;
      }
      
      .skill-level {
        display: flex;
        align-items: center;
        gap: var(--space-1);
      }
      
      .skill-bar {
        flex: 1;
        height: 4px;
        background: var(--color-neutral-200);
        border-radius: 2px;
        overflow: hidden;
      }
      
      .skill-progress {
        height: 100%;
        border-radius: 2px;
        width: 0%;
        transition: width 1.5s ease-out 0.5s;
      }
      
      /* Skill level color coding */
      .skill-progress[data-level="0"], .skill-progress[data-level="1"], .skill-progress[data-level="2"], .skill-progress[data-level="3"], .skill-progress[data-level="4"], .skill-progress[data-level="5"], .skill-progress[data-level="6"], .skill-progress[data-level="7"], .skill-progress[data-level="8"], .skill-progress[data-level="9"], .skill-progress[data-level="10"], .skill-progress[data-level="11"], .skill-progress[data-level="12"], .skill-progress[data-level="13"], .skill-progress[data-level="14"], .skill-progress[data-level="15"], .skill-progress[data-level="16"], .skill-progress[data-level="17"], .skill-progress[data-level="18"], .skill-progress[data-level="19"], .skill-progress[data-level="20"], .skill-progress[data-level="21"], .skill-progress[data-level="22"], .skill-progress[data-level="23"], .skill-progress[data-level="24"], .skill-progress[data-level="25"] {
        background: linear-gradient(90deg, #ef4444, #dc2626); /* Red - Beginner (0-25%) */
      }
      
      .skill-progress[data-level="26"], .skill-progress[data-level="27"], .skill-progress[data-level="28"], .skill-progress[data-level="29"], .skill-progress[data-level="30"], .skill-progress[data-level="31"], .skill-progress[data-level="32"], .skill-progress[data-level="33"], .skill-progress[data-level="34"], .skill-progress[data-level="35"], .skill-progress[data-level="36"], .skill-progress[data-level="37"], .skill-progress[data-level="38"], .skill-progress[data-level="39"], .skill-progress[data-level="40"], .skill-progress[data-level="41"], .skill-progress[data-level="42"], .skill-progress[data-level="43"], .skill-progress[data-level="44"], .skill-progress[data-level="45"], .skill-progress[data-level="46"], .skill-progress[data-level="47"], .skill-progress[data-level="48"], .skill-progress[data-level="49"], .skill-progress[data-level="50"] {
        background: linear-gradient(90deg, #eab308, #ca8a04); /* Yellow - Intermediate (26-50%) */
      }
      
      .skill-progress[data-level="51"], .skill-progress[data-level="52"], .skill-progress[data-level="53"], .skill-progress[data-level="54"], .skill-progress[data-level="55"], .skill-progress[data-level="56"], .skill-progress[data-level="57"], .skill-progress[data-level="58"], .skill-progress[data-level="59"], .skill-progress[data-level="60"], .skill-progress[data-level="61"], .skill-progress[data-level="62"], .skill-progress[data-level="63"], .skill-progress[data-level="64"], .skill-progress[data-level="65"], .skill-progress[data-level="66"], .skill-progress[data-level="67"], .skill-progress[data-level="68"], .skill-progress[data-level="69"], .skill-progress[data-level="70"], .skill-progress[data-level="71"], .skill-progress[data-level="72"], .skill-progress[data-level="73"], .skill-progress[data-level="74"], .skill-progress[data-level="75"] {
        background: linear-gradient(90deg, #22c55e, #16a34a); /* Green - Proficient (51-75%) */
      }
      
      .skill-progress[data-level="76"], .skill-progress[data-level="77"], .skill-progress[data-level="78"], .skill-progress[data-level="79"], .skill-progress[data-level="80"], .skill-progress[data-level="81"], .skill-progress[data-level="82"], .skill-progress[data-level="83"], .skill-progress[data-level="84"], .skill-progress[data-level="85"], .skill-progress[data-level="86"], .skill-progress[data-level="87"], .skill-progress[data-level="88"], .skill-progress[data-level="89"], .skill-progress[data-level="90"], .skill-progress[data-level="91"], .skill-progress[data-level="92"], .skill-progress[data-level="93"], .skill-progress[data-level="94"], .skill-progress[data-level="95"], .skill-progress[data-level="96"], .skill-progress[data-level="97"], .skill-progress[data-level="98"], .skill-progress[data-level="99"], .skill-progress[data-level="100"] {
        background: linear-gradient(90deg, #8b5cf6, #7c3aed); /* Purple - Advanced (76-100%) */
      }
      
      .skill-proficiency {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: white;
        min-width: 85px;
        text-align: right;
        line-height: 1.4;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      /* Show proficiency text only on active slide */
      .carousel-panel.active .skill-proficiency {
        opacity: 1;
      }
      
      .carousel-navigation {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-6);
        margin-top: calc(var(--space-8) + 20px);
      }
      
      .carousel-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(139, 92, 246, 0.3);
        color: var(--color-primary-600);
        cursor: pointer;
        transition: all var(--transition-normal) var(--easing-out);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .carousel-btn:hover {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3));
        border-color: rgba(139, 92, 246, 0.4);
        transform: scale(1.1);
      }
      
      .carousel-dots {
        display: flex;
        gap: var(--space-3);
      }
      
      .carousel-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(139, 92, 246, 0.3);
        border: 1px solid rgba(139, 92, 246, 0.4);
        cursor: pointer;
        transition: all var(--transition-normal) var(--easing-out);
      }
      
      .carousel-dot.active {
        background: var(--color-primary-500);
        transform: scale(1.2);
      }
      
      .carousel-dot:hover {
        background: var(--color-primary-400);
        transform: scale(1.1);
      }
      
      /* Dark mode styles */
      [data-theme="dark"] .skill-page {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15));
        border-color: rgba(139, 92, 246, 0.3);
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2), 0 4px 16px rgba(59, 130, 246, 0.2);
      }
      
      [data-theme="dark"] .skills-category-block:hover .skill-page.active {
        border-color: rgba(139, 92, 246, 0.4);
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
        box-shadow: 0 12px 40px rgba(139, 92, 246, 0.25), 0 6px 20px rgba(59, 130, 246, 0.25);
      }
      
      [data-theme="dark"] .category-header {
        border-bottom-color: rgba(139, 92, 246, 0.4);
      }
      
      [data-theme="dark"] .category-title {
        color: rgba(139, 92, 246, 0.9);
        text-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
      }
      
      [data-theme="dark"] .skill-item {
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(55, 65, 81, 0.4));
        border-color: rgba(55, 65, 81, 0.5);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(55, 65, 81, 0.2);
      }
      
      [data-theme="dark"] .skill-item:hover {
        border-color: rgba(55, 65, 81, 0.6);
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(55, 65, 81, 0.5));
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(55, 65, 81, 0.3);
      }
      
      [data-theme="dark"] .skill-icon {
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(31, 41, 55, 0.5));
        border-color: rgba(31, 41, 55, 0.6);
      }
      
      [data-theme="dark"] .carousel-btn {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3));
        border-color: rgba(139, 92, 246, 0.4);
        color: rgba(139, 92, 246, 0.9);
      }
      
      [data-theme="dark"] .carousel-btn:hover {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4));
        border-color: rgba(139, 92, 246, 0.5);
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .skills-carousel-container {
          height: 510px;
          margin: 50px auto 0 auto;
        }
        
        .carousel-3d {
          height: 410px;
        }
        
        .carousel-panel {
          width: 240px;
          height: 380px;
          margin-left: -120px;
          margin-top: -190px;
          top: 50%;
        }
        
        .skills-category-block {
          padding: var(--space-3);
        }
        
        .skills-block {
          gap: var(--space-2);
        }
        
        .skill-item {
          padding: var(--space-2);
        }
        
        .skill-icon {
          width: 28px;
          height: 28px;
        }
        
        .category-title {
          font-size: var(--font-size-md);
        }
        
        .carousel-navigation {
          gap: var(--space-4);
        }
        
        .carousel-btn {
          width: 40px;
          height: 40px;
        }
      }
      
      @media (max-width: 480px) {
        .skills-carousel-container {
          height: 520px;
          margin: 40px auto 0 auto;
        }
        
        .carousel-3d {
          height: 420px;
        }
        
        .carousel-panel {
          width: 220px;
          height: 340px;
          margin-left: -110px;
          margin-top: -170px;
          top: 50%;
        }
        
        .skills-category-block {
          padding: var(--space-2);
        }
        
        .skill-level {
          flex-direction: column;
          align-items: stretch;
          gap: var(--space-2);
        }
        
        .skill-proficiency {
          text-align: center;
          min-width: auto;
        }
      }
      
      @media (max-width: 400px) {
        .skills-carousel-container {
          height: 540px;
          margin: 30px auto 0 auto;
        }
        
        .carousel-3d {
          height: 440px;
        }
        
        .carousel-panel {
          width: 200px;
          height: 320px;
          margin-left: -100px;
          margin-top: -160px;
          top: 50%;
        }
        
        .skills-category-block {
          padding: var(--space-2);
        }
        
        .skill-item {
          padding: var(--space-1);
        }
        
        .skill-icon {
          width: 24px;
          height: 24px;
        }
        
        .category-title {
          font-size: var(--font-size-sm);
        }
      }
    </style>
  `;

  // 3D Carousel functionality
  const carousel = document.getElementById('skillsCarousel');
  const panels = document.querySelectorAll('.carousel-panel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = document.querySelectorAll('.carousel-dot');
  
  let currentIndex = 0;
  const totalPanels = panels.length;
  const angleStep = 360 / totalPanels;
  
  // Position panels in 3D space
  function positionPanels() {
    panels.forEach((panel, index) => {
      const angle = index * angleStep;
      panel.style.transform = `rotateY(${angle}deg) translateZ(290px)`;
    });
  }
  
  // Update carousel rotation
  function updateCarousel() {
    const rotation = -currentIndex * angleStep;
    carousel.style.transform = `rotateY(${rotation}deg)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
    
    // Update active panel class
    panels.forEach((panel, index) => {
      panel.classList.toggle('active', index === currentIndex);
    });
    
    // Reset all skill bars and proficiency labels first
    panels.forEach(panel => {
      // Reset all pages
      const allSkillBars = panel.querySelectorAll('.skill-progress');
      const allProficiencyLabels = panel.querySelectorAll('.skill-proficiency');
      
      allSkillBars.forEach(bar => {
        bar.style.width = '0%';
      });
      
      allProficiencyLabels.forEach(label => {
        label.textContent = 'Beginner';
        label.style.color = 'white'; // Reset to default color
      });
      
      // Reset to first page
      panel.setAttribute('data-current-page', '0');
      const skillPages = panel.querySelectorAll('.skill-page');
      skillPages.forEach((page, pageIndex) => {
        page.classList.toggle('active', pageIndex === 0);
      });
    });
    
    // Animate skill bars for the active panel only (first page initially)
    setTimeout(() => {
      const activePanel = panels[currentIndex];
      const activePage = activePanel.querySelector('.skill-page.active');
      if (activePage) {
        const skillBars = activePage.querySelectorAll('.skill-progress');
        const proficiencyLabels = activePage.querySelectorAll('.skill-proficiency');
        
        skillBars.forEach((bar, index) => {
          const level = bar.getAttribute('data-level');
          bar.style.width = level + '%';
          const proficiencyName = getProficiencyName(parseInt(level));
          if (proficiencyLabels[index]) {
            proficiencyLabels[index].textContent = proficiencyName;
            
            // Set proficiency text color based on skill level
            if (level <= 25) {
              proficiencyLabels[index].style.color = '#ef4444'; // Red - Beginner
            } else if (level <= 50) {
              proficiencyLabels[index].style.color = '#eab308'; // Yellow - Intermediate
            } else if (level <= 75) {
              proficiencyLabels[index].style.color = '#22c55e'; // Green - Proficient
            } else {
              proficiencyLabels[index].style.color = '#8b5cf6'; // Purple - Advanced
            }
          }
        });
      }
    }, 400);
  }
  
  // Navigation functions
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalPanels;
    updateCarousel();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalPanels) % totalPanels;
    updateCarousel();
  }
  
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }
  
  // Reset auto-rotation timer
  function resetAutoRotation() {
    clearInterval(autoRotate);
    autoRotate = setInterval(nextSlide, 5000);
  }
  
  // Event listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoRotation();
  });
  
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoRotation();
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoRotation();
    });
  });
  
  // Page flip functionality for skills with multiple pages
  panels.forEach(panel => {
    if (panel.classList.contains('has-flip')) {
      const skillsBlock = panel.querySelector('.skills-category-block');
      skillsBlock.addEventListener('click', (e) => {
        // Prevent flip if clicking on navigation buttons
        if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dot')) {
          return;
        }
        
        const currentPage = parseInt(panel.getAttribute('data-current-page'));
        const totalPages = parseInt(panel.getAttribute('data-total-pages'));
        const nextPage = (currentPage + 1) % totalPages;
        
        // Hide current page
        const currentPageElement = panel.querySelector(`.skill-page[data-page="${currentPage}"]`);
        const nextPageElement = panel.querySelector(`.skill-page[data-page="${nextPage}"]`);
        
        if (currentPageElement && nextPageElement) {
          currentPageElement.classList.remove('active');
          nextPageElement.classList.add('active');
          panel.setAttribute('data-current-page', nextPage);
          
          // Re-animate skill bars after page change
          setTimeout(() => {
            updateSkillBars(panel, nextPage);
          }, 250);
        }
      });
    }
  });
  
  // Helper function to update skill bars for a specific panel and page
  function updateSkillBars(panel, pageIndex = null) {
    if (pageIndex === null) {
      pageIndex = parseInt(panel.getAttribute('data-current-page')) || 0;
    }
    
    const activePage = panel.querySelector(`.skill-page[data-page="${pageIndex}"]`);
    if (!activePage) return;
    
    const skillBars = activePage.querySelectorAll('.skill-progress');
    const proficiencyLabels = activePage.querySelectorAll('.skill-proficiency');
    
    // Reset bars first
    skillBars.forEach(bar => {
      bar.style.width = '0%';
    });
    
    // Animate after short delay
    setTimeout(() => {
      skillBars.forEach((bar, index) => {
        const level = bar.getAttribute('data-level');
        bar.style.width = level + '%';
        const proficiencyName = getProficiencyName(parseInt(level));
        if (proficiencyLabels[index]) {
          proficiencyLabels[index].textContent = proficiencyName;
          
          // Set proficiency text color based on skill level
          if (level <= 25) {
            proficiencyLabels[index].style.color = '#ef4444'; // Red - Beginner
          } else if (level <= 50) {
            proficiencyLabels[index].style.color = '#eab308'; // Yellow - Intermediate
          } else if (level <= 75) {
            proficiencyLabels[index].style.color = '#22c55e'; // Green - Proficient
          } else {
            proficiencyLabels[index].style.color = '#8b5cf6'; // Purple - Advanced
          }
        }
      });
    }, 100);
  }
  
  // Auto-rotation (optional)
  let autoRotate = setInterval(nextSlide, 5000);
  
  // Pause auto-rotation on hover
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoRotate);
  });
  
  carousel.addEventListener('mouseleave', () => {
    autoRotate = setInterval(nextSlide, 5000);
  });
  
  // Touch/swipe support for mobile
  let startX = 0;
  let endX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  carousel.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoRotation(); // Reset timer after swipe
    }
  });
  
  // Initialize
  positionPanels();
  updateCarousel();
  
  // Handle window resize to recalculate skills per panel
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-initialize the skills section with new panel sizes
      initSkills();
    }, 250);
  });

  // Intersection Observer for reveal animations
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reset all skill bars and proficiency labels first
        panels.forEach(panel => {
          const skillBars = panel.querySelectorAll('.skill-progress');
          const proficiencyLabels = panel.querySelectorAll('.skill-proficiency');
          
          skillBars.forEach(bar => {
            bar.style.width = '0%';
          });
          
          proficiencyLabels.forEach(label => {
            label.textContent = 'Beginner';
            label.style.color = 'white'; // Reset to default color
          });
          
          // Reset to first page
          panel.setAttribute('data-current-page', '0');
          const skillPages = panel.querySelectorAll('.skill-page');
          skillPages.forEach((page, pageIndex) => {
            page.classList.toggle('active', pageIndex === 0);
          });
        });
        
        // Trigger initial skill bar animation for the first visible panel only (first page)
        setTimeout(() => {
          const activePanel = panels[currentIndex];
          const activePage = activePanel.querySelector('.skill-page.active');
          if (activePage) {
            const skillBars = activePage.querySelectorAll('.skill-progress');
            const proficiencyLabels = activePage.querySelectorAll('.skill-proficiency');
            
            skillBars.forEach((bar, index) => {
              const level = bar.getAttribute('data-level');
              bar.style.width = level + '%';
              const proficiencyName = getProficiencyName(parseInt(level));
              if (proficiencyLabels[index]) {
                proficiencyLabels[index].textContent = proficiencyName;
                
                // Set proficiency text color based on skill level
                if (level <= 25) {
                  proficiencyLabels[index].style.color = '#ef4444'; // Red - Beginner
                } else if (level <= 50) {
                  proficiencyLabels[index].style.color = '#eab308'; // Yellow - Intermediate
                } else if (level <= 75) {
                  proficiencyLabels[index].style.color = '#22c55e'; // Green - Proficient
                } else {
                  proficiencyLabels[index].style.color = '#8b5cf6'; // Purple - Advanced
                }
              }
            });
          }
        }, 200);
        skillObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe the carousel container
  skillObserver.observe(document.querySelector('.skills-carousel-container'));
}