// Certificate data - Add your certificates here
const certificatesData = [
  {
    title: "Legacy JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    date: "July 21, 2023",
    description: "JavaScript Algorithms and Data Structures Certification",
    link: "https://www.freecodecamp.org/certification/quang_m_nguyen/javascript-algorithms-and-data-structures"
  },
  {
    title: "Figma Essential Training: The Basics",
    issuer: "LinkedIn Learning", 
    date: "Sep 04, 2025",
    description: "Basic Figma training course",
    link: "https://www.linkedin.com/learning/certificates/834631ec81942e46498fe9aa0a760113b95a3d5da73c21d71ef592541a4ea6bf?u=2163426"
  },
  // Add more certificates here by copying the structure above
];

// Issuer icon mappings - maps issuer names to icon file paths or SVG icons
const issuerIcons = {
  // Technology Companies
  "Google": "https://developers.google.com/static/site-assets/logo-google.svg",
  "Microsoft": "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b",
  "Amazon": "https://a0.awsstatic.com/libra-css/images/logos/aws_smile-header-desktop-en-white_59x35.png",
  "Meta": "https://about.meta.com/brand/resources/meta/company-brand/",
  
  // Educational Platforms
  "freeCodeCamp": "icons/freeCodeCamp.svg",
  "LinkedIn Learning": "icons/LinkedIn.svg",
  "Coursera": {
    type: "svg", 
    content: `<circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6"/>
              <path d="M12 17v6"/>
              <path d="M4.22 4.22l4.24 4.24"/>
              <path d="15.54 15.54l4.24 4.24"/>
              <path d="M1 12h6"/>
              <path d="M17 12h6"/>
              <path d="M4.22 19.78l4.24-4.24"/>
              <path d="M15.54 8.46l4.24-4.24"/>`
  },
  "edX": {
    type: "svg",
    content: `<path d="M2 3h6l4 6-4 6H2l4-6-4-6z"/>
              <path d="M22 3h-6l-4 6 4 6h6l-4-6 4-6z"/>`
  },
  "Udemy": {
    type: "svg",
    content: `<circle cx="12" cy="12" r="10"/>
              <polygon points="10,8 16,12 10,16"/>`
  },
  
  // Certification Bodies
  "CompTIA": {
    type: "svg",
    content: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`
  },
  "Cisco": {
    type: "svg",
    content: `<rect x="2" y="6" width="20" height="8" rx="1"/>
              <circle cx="7" cy="10" r="1"/>
              <circle cx="12" cy="10" r="1"/>
              <circle cx="17" cy="10" r="1"/>`
  },
  
  // Default fallback
  "default": {
    type: "svg",
    content: `<circle cx="12" cy="6" r="3" />
              <path d="M12 3v6" />
              <path d="M21 11l-8 -2l-2 -1l-8 2v4.5a3.5 3.5 0 0 0 3.5 3.5h9a3.5 3.5 0 0 0 3.5 -3.5v-4.5z" />
              <path d="M7 15v-2a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v2" />`
  }
};

// Function to get the appropriate icon for an issuer
function getIssuerIcon(issuer) {
  const icon = issuerIcons[issuer] || issuerIcons["default"];
  
  if (typeof icon === "string") {
    // External image URL
    return `<img src="${icon}" alt="${issuer} logo" style="width: 48px; height: 48px; object-fit: contain;" />`;
  } else if (icon.type === "svg") {
    // SVG content
    return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              ${icon.content}
            </svg>`;
  }
  
  // Fallback to default
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
      <p class="certificate-description">
        ${cert.description}
      </p>
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

  // Generate certificates HTML from data
  const certificatesHTML = certificatesData.map(cert => generateCertificateHTML(cert)).join('');

  certificatesSection.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">Certificates & Achievements</h2>
      <div class="certificates-grid reveal">
        ${certificatesHTML}
      </div>
    </div>

    <style>
      #certificates {
        background-color: var(--color-bg);
        padding: var(--space-6) 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .certificates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--space-4);
        margin-top: var(--space-4);
      }

      .certificate-card {
        background: var(--color-card-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        display: block;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
      }

      .certificate-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        border-color: var(--color-primary);
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
      }

      .certificate-card:hover .certificate-cta {
        opacity: 1;
        transform: translateX(4px);
      }

      .view-certificate {
        transition: all 0.3s ease;
      }

      @media (max-width: 768px) {
        .certificates-grid {
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }

        .certificate-card {
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
      }
    </style>
  `;
}
