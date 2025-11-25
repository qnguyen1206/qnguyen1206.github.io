export function initSkills() {
  const skills = document.getElementById('skills');

  const skillNodes = [
    {
      name: 'JavaScript',
      icon: 'icons/javascript_icon.png',
      level: 80,
      x: 15,
      y: 25,
      depth: 0.3,
      category: 'Languages',
      dialogue: {
        experience: "1 year",
        highlights: [
          "Built interactive portfolio websites with vanilla JS",
        ]
      }
    },
    {
      name: 'Python',
      icon: 'icons/python_icon.png',
      level: 85,
      x: 25,
      y: 45,
      depth: 0.5,
      category: 'Languages',
      dialogue: {
        experience: "3 years",
        highlights: [
          "Build a to-do list app with Python",
          "Game development with Python"
        ]
      }
    },
    {
      name: 'C#',
      icon: 'icons/csharp_icon.png',
      level: 75,
      x: 12,
      y: 65,
      depth: 0.4,
      category: 'Languages',
      dialogue: {
        experience: "3 years",
        highlights: [

        ]
      }
    },
    {
      name: 'Java',
      icon: 'icons/java_icon.png',
      level: 80,
      x: 20,
      y: 80,
      depth: 0.6,
      category: 'Languages',
      dialogue: {
        experience: "3 years",
        highlights: [

        ]
      }
    },
    {
      name: 'HTML',
      icon: 'icons/html_icon.png',
      level: 80,
      x: 35,
      y: 20,
      depth: 0.2,
      category: 'Web',
      dialogue: {
        experience: "3 years",
        highlights: [

        ]
      }
    },
    {
      name: 'CSS',
      icon: 'icons/css_icon.png',
      level: 75,
      x: 42,
      y: 35,
      depth: 0.4,
      category: 'Web',
      dialogue: {
        experience: "3 years",
        highlights: [

        ]
      }
    },
    {
      name: 'React',
      icon: 'icons/react_icon.png',
      level: 85,
      x: 38,
      y: 55,
      depth: 0.5,
      category: 'Web',
      dialogue: {
        experience: "1 year",
        highlights: [

        ]
      }
    },
    {
      name: 'Node.js',
      icon: 'icons/nodejs_icon.png',
      level: 80,
      x: 45,
      y: 72,
      depth: 0.3,
      category: 'Web',
      dialogue: {
        experience: "1 year",
        highlights: [

        ]
      }
    },
    {
      name: 'Unity',
      icon: 'icons/unity_icon.png',
      level: 85,
      x: 58,
      y: 30,
      depth: 0.6,
      category: 'Game Dev',
      dialogue: {
        experience: "4 years",
        highlights: [

        ]
      }
    },
    {
      name: 'Godot/GDScript',
      icon: 'icons/godot_icon.png',
      level: 75,
      x: 62,
      y: 50,
      depth: 0.4,
      category: 'Game Dev',
      dialogue: {
        experience: "5 years",
        highlights: [

        ]
      }
    },
    {
      name: 'Git/GitHub',
      icon: 'icons/github_icon.png',
      level: 90,
      x: 75,
      y: 25,
      depth: 0.3,
      category: 'Tools',
      dialogue: {
        experience: "4 years",
        highlights: [

        ]
      }
    },
    {
      name: 'Firebase',
      icon: 'icons/firebase_icon.png',
      level: 80,
      x: 78,
      y: 60,
      depth: 0.4,
      category: 'Tools',
      dialogue: {
        experience: "1 year",
        highlights: [

        ]
      }
    },
    {
      name: 'GitLab',
      icon: 'icons/gitlab_icon.png',
      level: 85,
      x: 85,
      y: 78,
      depth: 0.6,
      category: 'Tools',
      dialogue: {
        experience: "3 years",
        highlights: [

        ]
      }
    },
  ];

  const connections = [
    [0, 1], [1, 2], [2, 3],
    [4, 5], [5, 6], [6, 7],
    [8, 9],
    [10, 11], [11, 12],
    [1, 6], [6, 9], [7, 11],
  ];

  skills.innerHTML = `
    <div class="parallax-skills-container">
      <h2 class="section-title">Technical Skills</h2>

      <div class="parallax-scene">
        <div class="category-legend">
          <div class="legend-item">
            <span class="legend-dot" style="background: #21d4ff;"></span>
            <span class="legend-label">Languages</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot" style="background: #8b5cff;"></span>
            <span class="legend-label">Web</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot" style="background: #ff6b35;"></span>
            <span class="legend-label">Game Dev</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot" style="background: #4ade80;"></span>
            <span class="legend-label">Tools</span>
          </div>
        </div>

        <div class="parallax-layer grid-layer" data-depth="0.1">
          <div class="neon-grid"></div>
        </div>

        <div class="parallax-layer particles-layer" data-depth="0.3">
          ${Array.from({length: 20}, () => `
            <div class="particle" style="
              left: ${Math.random() * 100}%;
              top: ${Math.random() * 100}%;
              animation-delay: ${Math.random() * 3}s;
            "></div>
          `).join('')}
        </div>

        <svg class="connections-svg" data-depth="0.5">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#21d4ff;stop-opacity:0.3" />
              <stop offset="50%" style="stop-color:#8b5cff;stop-opacity:0.6" />
              <stop offset="100%" style="stop-color:#21d4ff;stop-opacity:0.3" />
            </linearGradient>
          </defs>
          ${connections.map(([from, to]) => `
            <line 
              class="skill-connection" 
              data-from="${from}" 
              data-to="${to}"
              stroke="url(#lineGradient)" 
              stroke-width="2"
              opacity="0.4"
            />
          `).join('')}
        </svg>

        <div class="skills-nodes-layer" data-depth="0.8">
          ${skillNodes.map((skill, index) => `
            <div 
              class="skill-node" 
              data-index="${index}"
              data-category="${skill.category}"
              style="left: ${skill.x}%; top: ${skill.y}%;"
              tabindex="0"
              role="button"
              aria-label="${skill.name}"
            >
              <div class="node-glow"></div>
              <div class="node-inner">
                <img src="${skill.icon}" alt="${skill.name}" class="node-icon" loading="lazy">
              </div>
              <div class="node-label">${skill.name}</div>
              <div class="node-ring"></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <style>
      .parallax-skills-container {
        position: relative;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 60px 20px;
        overflow: hidden;
      }
      
      .section-title {
        text-align: center;
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 60px;
        background: linear-gradient(90deg, #21d4ff, #8b5cff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .parallax-scene {
        position: relative;
        width: 100%;
        height: 800px;
        min-height: 800px;
        background: linear-gradient(180deg, rgba(4,33,50,0.4), rgba(0,0,0,0.6));
        border-radius: 20px;
        overflow: visible;
        border: 1px solid rgba(33,212,255,0.2);
        box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
      }

      /* Category Legend */
      .category-legend {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 30px;
        background: rgba(4, 33, 50, 0.8);
        backdrop-filter: blur(10px);
        padding: 12px 24px;
        border-radius: 30px;
        border: 1px solid rgba(33, 212, 255, 0.3);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }

      .legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        box-shadow: 0 0 10px currentColor;
      }

      .legend-label {
        white-space: nowrap;
      }

      .parallax-layer {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: transform 0.1s ease-out;
      }

      .neon-grid {
        width: 100%;
        height: 100%;
        background-image:
          linear-gradient(rgba(33,212,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(33,212,255,0.05) 1px, transparent 1px);
        background-size: 50px 50px;
        animation: gridPulse 4s ease-in-out infinite;
      }

      @keyframes gridPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }

      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #21d4ff;
        border-radius: 50%;
        box-shadow: 0 0 10px #21d4ff;
        animation: float 6s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); opacity: 0.3; }
        50% { transform: translateY(-30px); opacity: 0.8; }
      }

      .connections-svg {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }

      .skill-connection {
        stroke-dasharray: 5, 5;
        animation: dashFlow 2s linear infinite;
        transition: opacity 0.3s, stroke-width 0.3s;
      }

      @keyframes dashFlow {
        to { stroke-dashoffset: -10; }
      }

      /* Skill nodes */
      .skills-nodes-layer {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
      }

      .skill-node {
        position: absolute;
        width: 80px;
        height: 80px;
        transform: translate(-50%, -50%);
        cursor: pointer;
        transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.2, 1);
      }

      .skill-node:hover,
      .skill-node:focus {
        transform: translate(-50%, -50%) scale(1.2);
        z-index: 10;
      }

      .node-glow {
        position: absolute;
        inset: -10px;
        background: radial-gradient(circle, rgba(33,212,255,0.4), transparent 70%);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s;
        animation: pulse 2s ease-in-out infinite;
      }

      .skill-node:hover .node-glow,
      .skill-node:focus .node-glow {
        opacity: 1;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50% { transform: scale(1.2); opacity: 0.6; }
      }

      .node-inner {
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(4,33,50,0.9), rgba(0,0,0,0.9));
        border-radius: 50%;
        border: 2px solid rgba(33,212,255,0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        transition: border-color 0.3s, box-shadow 0.3s;
      }

      .skill-node:hover .node-inner,
      .skill-node:focus .node-inner {
        border-color: rgba(33,212,255,0.8);
        box-shadow: 0 0 30px rgba(33,212,255,0.5), 0 8px 32px rgba(0,0,0,0.5);
      }

      .node-icon {
        width: 40px;
        height: 40px;
        object-fit: contain;
        filter: drop-shadow(0 0 5px rgba(33,212,255,0.5));
      }

      .node-label {
        font-size: 10px;
        font-weight: 600;
        color: #fff;
        text-align: center;
        line-height: 1.2;
        opacity: 0;
        transition: opacity 0.3s;
        position: absolute;
        bottom: -25px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
      }

      .skill-node:hover .node-label,
      .skill-node:focus .node-label {
        opacity: 1;
      }

      .node-level {
        display: none;
      }

      .node-ring {
        position: absolute;
        inset: -5px;
        border: 2px solid transparent;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
      }

      .skill-node:hover .node-ring,
      .skill-node:focus .node-ring {
        opacity: 1;
        border-color: rgba(139,92,255,0.5);
        animation: ringRotate 3s linear infinite;
      }

      @keyframes ringRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Category colors */
      .skill-node[data-category="Languages"] .node-inner { border-color: rgba(33,212,255,0.5); }
      .skill-node[data-category="Web"] .node-inner { border-color: rgba(139,92,255,0.5); }
      .skill-node[data-category="Game Dev"] .node-inner { border-color: rgba(255,111,0,0.5); }
      .skill-node[data-category="Tools"] .node-inner { border-color: rgba(67,160,71,0.5); }

      .skill-node[data-category="Languages"]:hover .node-inner { box-shadow: 0 0 30px rgba(33,212,255,0.6); }
      .skill-node[data-category="Web"]:hover .node-inner { box-shadow: 0 0 30px rgba(139,92,255,0.6); }
      .skill-node[data-category="Game Dev"]:hover .node-inner { box-shadow: 0 0 30px rgba(255,111,0,0.6); }
      .skill-node[data-category="Tools"]:hover .node-inner { box-shadow: 0 0 30px rgba(67,160,71,0.6); }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .category-legend {
          gap: 15px;
          padding: 10px 16px;
          top: 10px;
        }

        .legend-item {
          font-size: 12px;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
        }

        .parallax-scene {
          height: 700px;
          min-height: 700px;
        }

        .skill-node {
          width: 60px;
          height: 60px;
        }

        .node-icon {
          width: 32px;
          height: 32px;
        }

        .node-label {
          font-size: 9px;
          bottom: -22px;
        }

        .section-title {
          font-size: 2rem;
        }
      }

      @media (max-width: 480px) {
        .parallax-scene {
          height: 600px;
          min-height: 600px;
        }

        .skill-node {
          width: 50px;
          height: 50px;
        }

        .node-icon {
          width: 28px;
          height: 28px;
        }

        .node-label {
          font-size: 8px;
          bottom: -20px;
        }
      }

      /* Speech Bubble Styles */
      .skill-speech-bubble {
        position: absolute;
        width: 280px;
        max-height: 400px;
        background: linear-gradient(135deg, rgba(15,27,42,0.98), rgba(11,22,32,0.98));
        border: 2px solid rgba(33,212,255,0.4);
        border-radius: 16px;
        padding: 18px;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: scale(0.9);
        transition: all 0.3s cubic-bezier(0.2, 0.9, 0.2, 1);
        box-shadow:
          0 20px 60px rgba(0,0,0,0.8),
          0 0 40px rgba(33,212,255,0.2),
          inset 0 1px 0 rgba(255,255,255,0.1);
        overflow-y: auto;
        pointer-events: none;
      }

      .skill-speech-bubble.active {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
        pointer-events: auto;
      }

      .speech-bubble-close {
        position: absolute;
        top: 14px;
        right: 14px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: all 0.2s;
        color: #93a3b6;
        font-size: 20px;
        line-height: 0;
        padding: 0;
      }

      .speech-bubble-close:hover {
        background: rgba(255,255,255,0.1);
        color: #21d4ff;
        transform: rotate(90deg);
      }

      .speech-bubble-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .bubble-header {
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(33,212,255,0.2);
        margin-bottom: 10px;
      }

      .bubble-title {
        font-size: 18px;
        font-weight: 700;
        color: #21d4ff;
        text-shadow: 0 0 10px rgba(33,212,255,0.3);
      }

      .bubble-experience {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 14px;
        background: linear-gradient(135deg, rgba(139,92,255,0.2), rgba(33,212,255,0.2));
        border: 1.5px solid rgba(139,92,255,0.4);
        border-radius: 16px;
        font-size: 13px;
        font-weight: 600;
        color: #eaf3ff;
        box-shadow: 0 2px 10px rgba(139,92,255,0.2);
        margin-bottom: 10px;
      }

      .exp-icon {
        font-size: 16px;
      }

      .bubble-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .bubble-highlight {
        font-size: 12px;
        line-height: 1.4;
        color: #c5d5e8;
        padding: 6px 10px;
        background: rgba(33,212,255,0.05);
        border-left: 2px solid rgba(33,212,255,0.4);
        border-radius: 4px;
      }

      .skill-speech-bubble::-webkit-scrollbar {
        width: 6px;
      }

      .skill-speech-bubble::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.2);
        border-radius: 10px;
      }

      .skill-speech-bubble::-webkit-scrollbar-thumb {
        background: rgba(33,212,255,0.3);
        border-radius: 10px;
      }

      .skill-speech-bubble::-webkit-scrollbar-thumb:hover {
        background: rgba(33,212,255,0.5);
      }

      @media (max-width: 768px) {
        .skill-speech-bubble {
          width: 240px;
          max-height: 350px;
          padding: 14px;
        }

        .bubble-title {
          font-size: 16px;
        }

        .bubble-experience {
          font-size: 12px;
          padding: 6px 12px;
        }

        .bubble-highlight {
          font-size: 11px;
          padding: 5px 8px;
        }
      }
    </style>
  `;

  // Initialize parallax effect
  const scene = skills.querySelector('.parallax-scene');
  const layers = skills.querySelectorAll('.parallax-layer, .connections-svg, .skills-nodes-layer');

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  // Smooth mouse tracking
  scene.addEventListener('mousemove', (e) => {
    const rect = scene.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
  });

  // Animation loop for smooth parallax
  function animate() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth) || 0.5;
      const moveX = currentX * depth * 50;
      const moveY = currentY * depth * 50;
      layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Update connection lines positions
  function updateConnections() {
    const svg = skills.querySelector('.connections-svg');
    const nodes = skills.querySelectorAll('.skill-node');
    const lines = skills.querySelectorAll('.skill-connection');

    lines.forEach(line => {
      const fromIndex = parseInt(line.dataset.from);
      const toIndex = parseInt(line.dataset.to);
      const fromNode = nodes[fromIndex];
      const toNode = nodes[toIndex];

      if (fromNode && toNode) {
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        const x1 = fromRect.left + fromRect.width / 2 - svgRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - svgRect.top;
        const x2 = toRect.left + toRect.width / 2 - svgRect.left;
        const y2 = toRect.top + toRect.height / 2 - svgRect.top;

        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
      }
    });
  }

  // Update connections on load and resize
  setTimeout(updateConnections, 100);
  window.addEventListener('resize', updateConnections);

  // Highlight connections on node hover
  const nodes = skills.querySelectorAll('.skill-node');
  nodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      const lines = skills.querySelectorAll('.skill-connection');
      lines.forEach(line => {
        const from = parseInt(line.dataset.from);
        const to = parseInt(line.dataset.to);
        if (from === index || to === index) {
          line.style.opacity = '1';
          line.style.strokeWidth = '3';
        } else {
          line.style.opacity = '0.2';
        }
      });
    });

    node.addEventListener('mouseleave', () => {
      const lines = skills.querySelectorAll('.skill-connection');
      lines.forEach(line => {
        line.style.opacity = '0.4';
        line.style.strokeWidth = '2';
      });
    });
  });

  // Create speech bubble container
  const speechBubbleHTML = `
    <div class="skill-speech-bubble" id="skillSpeechBubble">
      <button class="speech-bubble-close" id="closeSpeechBubble">×</button>
      <div class="speech-bubble-content" id="speechBubbleContent"></div>
    </div>
  `;

  // Append speech bubble to the parallax scene
  scene.insertAdjacentHTML('beforeend', speechBubbleHTML);

  const speechBubble = document.getElementById('skillSpeechBubble');
  const speechBubbleContent = document.getElementById('speechBubbleContent');
  const closeSpeechBtn = document.getElementById('closeSpeechBubble');
  let currentOpenNode = null;

  function openSpeechBubble(skillIndex, nodeElement) {
    const skill = skillNodes[skillIndex];
    if (!skill || !skill.dialogue) return;

    // Close if clicking the same node
    if (currentOpenNode === nodeElement) {
      closeSpeechBubble();
      return;
    }

    currentOpenNode = nodeElement;
    const dialogue = skill.dialogue;

    // Generate highlights HTML
    const highlightsHTML = dialogue.highlights.map(highlight =>
      `<div class="bubble-highlight">✨ ${highlight}</div>`
    ).join('');

    speechBubbleContent.innerHTML = `
      <div class="bubble-header">
        <div class="bubble-title">${skill.name}</div>
      </div>

      <div class="bubble-experience">
        <span class="exp-icon">⏱️</span> ${dialogue.experience}
      </div>

      <div class="bubble-section">
        ${highlightsHTML}
      </div>
    `;

    // Position the speech bubble next to the node
    const nodeRect = nodeElement.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();

    // Calculate position relative to scene
    const nodeX = nodeRect.left - sceneRect.left + nodeRect.width / 2;
    const nodeY = nodeRect.top - sceneRect.top + nodeRect.height / 2;

    // Position bubble to the right of the node
    // If node is on right side, position bubble to the left
    const isRightSide = nodeX > sceneRect.width / 2;

    speechBubble.style.left = isRightSide ? 'auto' : `${nodeX + 60}px`;
    speechBubble.style.right = isRightSide ? `${sceneRect.width - nodeX + 60}px` : 'auto';
    speechBubble.style.top = `${Math.max(20, nodeY - 150)}px`;

    speechBubble.classList.add('active');
  }

  function closeSpeechBubble() {
    speechBubble.classList.remove('active');
    currentOpenNode = null;
  }

  // Close speech bubble handlers
  closeSpeechBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSpeechBubble();
  });

  document.addEventListener('click', (e) => {
    if (!speechBubble.contains(e.target) && !e.target.closest('.skill-node')) {
      closeSpeechBubble();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && speechBubble.classList.contains('active')) {
      closeSpeechBubble();
    }
  });

  // Add click handlers to skill nodes
  nodes.forEach((node, index) => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      openSpeechBubble(index, node);
    });

    // Keyboard accessibility
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSpeechBubble(index, node);
      }
    });
  });
}

