// Add/remove a category in certificateCategories, then its array in certificatesData.
export const certificateCategories = {
  professional: 'Professional',
  nonProfessional: 'Non-Professional',
  honors: 'Honors',
  courses: 'Courses'
};

export const certificatesData = {
  professional: [
    {
      title: "Foundational C# with Microsoft",
      issuer: "Microsoft, freeCodeCamp",
      date: "May 1, 2026",
      link: "https://www.freecodecamp.org/certification/quang_m_nguyen/foundational-c-sharp-with-microsoft"
    },
    
  ],
  nonProfessional: [
    {
      title: "UX Design Foundations",
      issuer: "uxcel",
      date: "Sep 13, 2026",
      link: "https://app.uxcel.com/certificates/E91RYO68W4V1?utm_source=share-certificate",
    },
    {
      title: "Hacker Holidays Completion Certificate",
      issuer: "TryHackMe",
      date: "Aug 12, 2026",
      link: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-VR7UQJRHKN.pdf"
    },
    {
      title: "AI Security",
      issuer: "TryHackMe",
      date: "Aug 1, 2026",
      link: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-DKY2QCHNPR.pdf",
    },
    {
      title: "Learning Docker",
      issuer: "LinkedIn Learning",
      date: "June 18, 2026",
      link: "https://www.linkedin.com/learning/certificates/6a38781388b7dbec70e063efe5c3d1aa59b12150af339bff708cd1e9da6160b8?trk=share_certificate"
    },
    {
      title: "IT Security Foundations: Network Security",
      issuer: "NASBA, LinkedIn Learning",
      date: "Apr 9, 2026",
      link: "https://www.linkedin.com/learning/certificates/1eb6a17bed666fffc16b4fa913271d42d186094d0925bbbd294cb341d03edb7c?trk=share_certificate"
    },
    {
      title: "IT Security Foundations: Network Security",
      issuer: "LinkedIn Learning",
      date: "Apr 9, 2026",
      link: "https://www.linkedin.com/learning/certificates/e03c7685a26aa6cb7453d5810e0e69efca707b09b0d5dded835f4290c2740ab0?trk=share_certificate"
    },
    {
      title: "Jr Penetration Tester",
      issuer: "TryHackMe",
      date: "Mar 16, 2026",
      link: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-SGYE4BVITL.pdf"
    },
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
  ],
  honors: [
    {
      title: "Faculty Honors",
      issuer: "Georgia Tech",
      date: "Spring 2026"
    },
    {
      title: "Dean's List",
      issuer: "Georgia Tech",
      date: "Spring 2026"
    },
    {
      title: "Dean's List",
      issuer: "Georgia Tech",
      date: "Fall 2025"
    },
    {
      title: "President's List",
      issuer: "Georgia State University",
      date: "Spring 2023"
    },
    {
      title: "President's List",
      issuer: "Georgia State University",
      date: "Fall 2022"
    },
  ],
  courses: [],
};

export const issuerIcons = {
  "Google": "https://developers.google.com/static/site-assets/logo-google.svg",
  "Microsoft": "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b",
  "Amazon": "https://a0.awsstatic.com/libra-css/images/logos/aws_smile-header-desktop-en-white_59x35.png",
  "Meta": "https://about.meta.com/brand/resources/meta/company-brand/",
  "freeCodeCamp": "icons/freeCodeCamp.svg",
  "LinkedIn Learning": "icons/LinkedIn.svg",
  "TryHackMe": "icons/tryhackme.svg",
  "Georgia State University": "/icons/GSU_seal.png",
  "Georgia Tech": "/icons/GT_seal.png",
  "NASBA": "/icons/NASBA.png",
  "uxcel": "/icons/uxcel_icon.png",
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
