  /*
   * =====================================================
   * PROJECT DATA STRUCTURE
   * =====================================================
   * 
   * REQUIRED FIELDS:
   *   id: 'unique-id'              → Unique identifier (used internally)
   *   title: 'Project Name'        → Display title
   *   category: 'Game Development' → Category label
   *   tags: ['Tag1', 'Tag2']       → Technology/skill tags
   * 
   * OPTIONAL FIELDS:
   *   image: 'images/icon.jpg'     → Card thumbnail image
   *   description: 'Text...'       → Short description (first line shows on card)
   *   status: 'release'            → Project status badge
   *   role: 'Developer'            → Your role in the project
   *   teamSize: '5'                → Number of team members
   *   duration: '2 years'          → Project timeline
   *   githubLink: 'url'            → GitHub repository URL
   *   gitlabLink: 'url'            → GitLab repository URL
   *   externalLink: 'url'          → Live project/demo URL
   *   hidden: true                 → Hide project from display
   *   images: [                    → Gallery images and videos for modal
   *     { src: 'path.png', alt: 'Description', caption: 'Optional caption' },
   *     { type: 'video', src: 'path.mp4', poster: 'preview.jpg', alt: 'Video description', caption: 'Optional caption' }
   *   ]
   *   Videos: use H.264/AAC MP4 for broad browser support. Optional mimeType defaults to video/mp4.
   *   Videos appear full-width above Project Details; images remain in the gallery below.
   *   Media paths are relative to public/. Videos play on demand and pause when the modal closes.
   *   writeup: `...`               → Detailed writeup of what you did
   * 
   * STATUS OPTIONS:
   *   'alpha'          → Red badge
   *   'beta'           → Yellow badge
   *   'mvp'            → Cyan badge
   *   'release'        → Green badge
   *   'in development' → Purple badge
   *   'on hold'        → Orange badge
   *   'complete'       → Blue badge
   * 
   * WRITEUP FORMATTING:
   *   ## Header        → Section header
   *   ### Subheader    → Subsection header
   *   **bold**         → Bold text
   *   *italic*         → Italic text
   *   `code`           → Inline code
   *   - item           → Bullet list
   *   1. item          → Numbered list
   *   (blank line)     → New paragraph
   * 
   * =====================================================
   */

export const projectsData = [
    {
      id: 'biophilia',
      title: 'Biophilia',
      category: 'App Development',
      image: '/images/BiophiliaIcon.png',
      description: 'This project is awarded a Catalyst Grant and is an on going project led by Artist Belinda Person in collaboration with Professor Krystian Ramlogan.',
      tags: ['Unity', 'C#', 'VR', 'ProCreate', 'Design'],
      status: 'complete',
      role: 'VR Environment Concept Artist',
      teamSize: '9',
      duration: '3 months (June 2026 - Aug 2026)',
      githubLink: '',
      gitlabLink: '',
      externalLink: 'https://freyahuijia.github.io/biophilia-web/',
      images: [
        {
          type: 'video',
          src: 'images/biophilia/IMG_2775.mp4',
          poster: 'images/biophilia/IMG_2775-poster.jpg',
          alt: 'Biophilia project video',
          caption: 'Biophilia project video'
        },
        { src: 'images/biophilia/IMG_2767.jpeg', alt: 'biophila img 1' },
        { src: 'images/biophilia/IMG_2768.jpeg', alt: 'biophilia img 2' },
        { src: 'images/biophilia/IMG_2769.jpeg', alt: 'biophilia img 3' },
        { src: 'images/biophilia/IMG_2770.jpeg', alt: 'biophilia img 4' },
        { src: 'images/biophilia/IMG_2771.jpeg', alt: 'biophilia img 5' },
        { src: 'images/biophilia/IMG_2772.jpeg', alt: 'biophilia img 6' },
        { src: 'images/biophilia/IMG_2773.jpeg', alt: 'biophilia img 7' },
        { src: 'images/biophilia/IMG_2774.jpeg', alt: 'biophilia img 8' },
      ],
      writeup: `
## VR Environment Concept Artist
- 🪴 Designed and conceptualized the gallery space in the VR environment.

For more information about the design process, please visit the <a href="javascript:void(0)" onclick="window.openBlogPost('biophilia-design-process')" style="color: var(--primary); text-decoration: underline; cursor: pointer;">design process page</a>.
`,
    },
    {
      id: 'kart-tech-racing',
      title: 'Kart: The Tech Filled Racing Game',
      category: 'Game Development',
      image: 'images/KartIcon.jpg',
      description: 'A multiplayer racing game where cars and technology meet, designed using Godot and Steamworks.',
      tags: ['Godot', 'GDScript', 'Steamworks', 'GitLab', 'Krita', 'Blender', 'MS Paint'],
      status: 'beta',
      role: 'Lead Programmer, Gameplay Designer, UI/UX Designer, Artist, Technical Editor',
      teamSize: '3',
      duration: '5 years (2020 - Present)',
      gitlabLink: '',
      externalLink: 'https://store.steampowered.com/app/2165230/Kart_The_Tech_Filled_Racing_Game/',
      images: [
        { src: 'images/kart-tech-racing/kart_screenshot1.png', alt: 'Kart: The Tech Filled Racing Game Screenshot 1' },
        { src: 'images/kart-tech-racing/kart_screenshot2.png', alt: 'Kart: The Tech Filled Racing Game Screenshot 2' },
        { src: 'images/kart-tech-racing/kart_screenshot3.png', alt: 'Kart: The Tech Filled Racing Game Screenshot 3' },
        { src: 'images/kart-tech-racing/artist_cred.png', alt: 'Artist Credit' },
        { src: 'images/kart-tech-racing/designer_cred.png', alt: 'Designer Credit' },
        { src: 'images/kart-tech-racing/programmer_cred.png', alt: 'Programmer Credit' },
        { src: 'images/kart-tech-racing/quang_cred.png', alt: 'Quang Credit' },
        { src: 'images/kart-tech-racing/technical_editor.png', alt: 'Technical Editor Credit' }
      ],
      writeup: `
## Lead Programmer
- 🛞 Designed and implemented P2P multiplayer system including lobby, in-game chat, and leaderboard using Steamworks' API and GodotSteam built-in functions.
- 🛞 Programmed gameplay logic, karts physics and ability system.
- 🛞 Designed and implemented persistent save system using custom scripts.
- 🛞 Reviewed and solved merge conflicts using GitHub desktop.
- 🛞 Designed and implemented dynamic opponent AIs system using path navigation, finite state machine, and raycasting.

## Gameplay Designer
- 🛞 Designed and balanced abilities for each kart.
- 🛞 Designed map layout and environment.

## UI/UX Designer
- 🛞 Designed and implemented settings menu, pause menu, and in-game UI.
- 🛞 Established UI typography, layout and visual consistency across the game.
- 🛞 Designed and implemented start screen, lobby screen, and end screen UI.
- 🛞 Enhanced user experience by adding particles effects.

## Artist
- 🛞 Created game arts including karts abilities icons, tabs icons and buttons UI.

## Technical Editor
- 🛞 Maintained the game's design documented.

For more information about the design process, please visit the <a href="javascript:void(0)" onclick="window.openBlogPost('kart-the-tech-filled-racing-game')" style="color: var(--primary); text-decoration: underline; cursor: pointer;">design process page</a>.
`,
    },
    {
      id: 'turnover',
      title: 'TurnOver',
      category: 'App Development',
      image: 'images/Turnover-Logo.jpg',
      description: 'A web app that allow the coaches and athletes to track and analyze their performance through video analysis using computer vision.',
      tags: ["HTML", "CSS", "JavaScript", "React", "Vite", "MongoDB", "Express", "Cloudinary", "Python", "Flask", "YOLO", "Figma"],
      status: 'MVP',
      role: 'Co-Founder, Developer, Designer',
      teamSize: '4',
      duration: '6 months (2025 - Present)',
      githubLink: 'https://github.com/qnguyen1206/cs4803',
      externalLink: 'https://cs4803-eight.vercel.app/',
      images: [

      ],
      writeup: `
## Co-Founder
- 🟑 Initiated the project idea
- 🟑 Conducted market research to validate the idea.

## Developer
- 🟑 Implemented user authentication and authorization using JSON Web Tokens (JWT).
- 🟑 Implemented video upload and storage using Cloudinary.
- 🟑 Implemented video analysis using YOLO object detection model.

## Designer
- 🟑 Designed and implemented the app's UI/UX.
- 🟑 Created the app's logo and branding.

For more information about the design process, please visit the <a href="javascript:void(0)" onclick="window.openBlogPost('turnover-design-process')" style="color: var(--primary); text-decoration: underline; cursor: pointer;">design process page</a>.
`
    },
    {
      id: 'window-washing-game',
      title: 'Window Washing Game',
      category: 'Game Development',
      image: 'images/windowWashingIcon.png',
      description: 'A party co-op game where players work together to clean the windows.',
      tags: ['Unity', 'C#', 'GitHub', 'Figma', 'Trello'],
      status: 'complete',
      role: 'Programmer, System Designer, UI/UX Designer',
      teamSize: '6',
      duration: '3 months (2026 - Present)',
      githubLink: '',
      externalLink: '',
      images: [],
      writeup: `
## Programmer
- 🪟 Implemented game's mechanics and logic.
- 🪟 Implemented game's online multiplayer using PurrNet.
- 🪟 Resolving merge conflicts

## System Designer
- 🪟 Designed game's system architecture.
- 🪟 Designed game's data model.

## UI/UX Designer
- 🪟 Designed lobby's UI including players cards.

For MDM, please visit the <a href="javascript:void(0)" onclick="window.openBlogPost('window-washing-game-mdm')" style="color: var(--primary); text-decoration: underline; cursor: pointer;">writeup page</a>.
`
    },
    {
      id: 'escape-from-team-rocket',
      title: 'Escape from Team Rocket',
      category: 'Game Development',
      image: '',
      description: 'An interactive narrative game using remix of Pokemon Games and Unity.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'complete',
      role: 'Designer, Programmer',
      teamSize: '3',
      duration: '5 months (Jan 2026 - May 2026)',
      githubLink: 'https://github.com/qnguyen1206/EscapeFromTeamRocket/tree/main',
      gitlabLink: '',
      externalLink: '',
      images: [],
      writeup: `
## Designer
- 🚀 Designed the game's narrative and branching storylines through collaboration with the team.

## Programmer
- 🚀 Implemented the first scene of the game using Unity and C#.
- 🚀 Fixed bugs and optimized the game's performance.
`,
      hidden: true,
    },
    {
      id: 'todo-app',
      title: 'TO DO App',
      category: 'App Development',
      image: 'images/clipboard.png',
      description: 'A gamified to-do list app with DeepSeek-R1 14B param local AI integrated for personal use.',
      tags: ['Python', 'Tkinter', 'MySQL'],
      status: 'release',
      role: 'Solo Developer',
      duration: '1 year (2025 - Present)',
      githubLink: 'https://github.com/Kairu1206/todoapp',
      externalLink: 'https://github.com/Kairu1206/todoapp',
      images: [
        { src: 'images/todoapp/todo-app-screenshot1.png', alt: 'TO DO App Screenshot 1' },
        { src: 'images/todoapp/todo-app-screenshot2.png', alt: 'TO DO App Screenshot 2' },
        { src: 'images/todoapp/todo-app-screenshot3.png', alt: 'TO DO App Screenshot 3' },
        { src: 'images/todoapp/todo-app-screenshot4.png', alt: 'TO DO App Screenshot 4' },
        { src: 'images/todoapp/todo-app-screenshot5.png', alt: 'TO DO App Screenshot 5' },
      ], 
      writeup: `
For more information, please visit the <a href="javascript:void(0)" onclick="window.openBlogPost('todo-app')" style="color: var(--primary); text-decoration: underline; cursor: pointer;">writeup page</a>.
`
    },
        {
      id: 'redesign-ebay',
      title: 'Redesign Ebay',
      category: 'App Development',
      image: 'images/Redesign-ebay-logo.png',
      description: 'A redesign of Ebay\'s website using Figma and FigJam for design and Google Sheets and Google Docs for project management and documentation.',
      tags: ['Figma', 'FigJam', 'Google Sheets', 'Google Docs'],
      status: 'complete',
      role: 'Designer, Technical Writer',
      teamSize: '4',
      duration: '5 months (Jan 2026 - May 2026)',
      githubLink: '',
      gitlabLink: '',
      externalLink: 'https://www.figma.com/proto/qmfM5SbiJ5lZTYX0hR1pw0/CS3803-High-Fi-Prototype?node-id=2-4&starting-point-node-id=2%3A4&t=982lOIQutyrlaFXV-1',
      images: [
        { src: 'blogs/design-process/redesign-ebay/Bidding-Page.png', alt: 'Redesign Ebay Bidding Page' },
        { src: 'blogs/design-process/redesign-ebay/Home-Page.png', alt: 'Redesign Ebay Home Page' },
        { src: 'blogs/design-process/redesign-ebay/Search-Page.png', alt: 'Redesign Ebay Product Page' },
        { src: 'blogs/design-process/redesign-ebay/Watchlist-Page.png', alt: 'Redesign Ebay Search Page' },
        { src: 'blogs/design-process/redesign-ebay/Item-Listing-Page.png', alt: 'Redesign Ebay Watchlist Page' },
      ],
      writeup: `
## Designer
- 🛍 Redesigned Ebay's website using Figma and FigJam.
- 🛍 Conducted user research and usability testing to inform design decisions and improve user experience.

## Technical Writer
- 🛍 Maintained the design documentation and project management documents using Google Docs, Gooogle Sheets and FigJam.

For more information about the design process, please visit the <a href="javascript:void(0)" onclick="window.openBlogPost('redesign-ebay-design-process')" style="color: var(--primary); text-decoration: underline; cursor: pointer;">design process page</a>.

For tech report, please visit the <a href="https://sites.google.com/view/cs3803techreport/home" style="color: var(--primary); text-decoration: underline; cursor: pointer;">tech report</a>.
`
    },
    {
      id: 'infinity-mythical-hunt',
      title: 'Mythical Hunt',
      category: 'Game Development',
      image: 'images/InQnityIcon.png',
      description: 'A co-op game where players immerse in the world of mythical creatures with real-world folklores and fantasies.',
      tags: ['Godot', 'GDScript', 'Steamworks', 'GitLab'],
      status: 'in development',
      role: 'Sole Developer',
      duration: '5 years (2021 - Present)',
      gitlabLink: 'https://gitlab.com/infinity-mythical-hunt',
      externalLink: './LMC4730/',
      images: [],
      writeup: `
For more information about Game Design Docs (GDD), please visit this <a href="https://docs.google.com/document/d/1UJy3OC_YYUjv-iYgKN2nyl05vAzpec3FY6-ygIBCkA4/edit?usp=sharing" style="color: var(--primary); text-decoration: underline; cursor: pointer;">link</a>.
`,
    },
    {
      id: 'what-yours-is-mime',
      title: 'What Yours is Mime',
      category: 'Game Development',
      image: 'images/WYiMIcon.png',
      description: 'A 2.5D bullet-hell game where players battle through a kingdom\'s dungeon as a jester.\n This is a club project for Georigia State Panther Dev Club where I was tasked to program the game\'s enemy logic and implement the game\'s instruction system. I learned how to use Unity, C#, and Unity Plastic SCM to build and mantain the game.',
      tags: ['Unity', 'C#', 'Unity Plastic SCM', 'GitHub'],
      status: 'release',
      role: 'Programmer',
      teamSize: '16',
      duration: '4 months (Jan 2023 - April 2023)',
      externalLink: 'https://jhaboon.itch.io/wyim',
      images: [
        { src: 'images/wyim/wyim_screenshot1.png', alt: 'What Yours is Mime Screenshot 1' },
        { src: 'images/wyim/wyim_screenshot2.png', alt: 'What Yours is Mime Screenshot 2' },
        { src: 'images/wyim/wyim_screenshot3.png', alt: 'What Yours is Mime Screenshot 3' }
      ],
      writeup: `
## Programmer
- Implemented player movement and attack logic using C#.
- Implemented the game's instruction system using C#.
`
    },
    {
      id: 'gastropoda',
      title: 'Gastropoda',
      category: 'Game Development',
      image: 'images/GastropodaIcon.png',
      description: 'A 2D platformer game where players have to escape from a giant snail.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'release',
      role: 'Programmer',
      teamSize: '18',
      duration: '4 months (Aug 2022 - Dec 2022)',
      githubLink: 'https://github.com/aimbesi1/gastropoda',
      externalLink: 'https://jhaboon.itch.io/gastropoda-v115',
      images: [],
      writeup: `
## Programmer
- Implemented player movement and physical interactions using C#.
- Implemented items interactions using C#.
`
    },
        {
      id: 'rock-open-game',
      title: 'Rock Open Game',
      category: 'Game Development',
      image: 'images/webrockgameicon.png',
      description: 'A browser-based multiplayer game reimagining a high school project with modern web technologies.\n I started this project because I want to learn HTML, CSS, and JavaScript. In addition, I want to learn more about React, NodeJS, and Tailwind CSS. Moreover, I learn how hosting a website on Firebase and learn how to secure it.',
      tags: ['JavaScript', 'React', 'Firebase', 'NodeJS'],
      status: 'release',
      role: 'Solo Developer',
      duration: '9 months (2025)',
      githubLink: 'https://github.com/qnguyen1206/RockOpenGameWeb',
      externalLink: 'https://rockopengameweb.web.app/',
      images: [
        { src: 'images/rock-open-game/rock_open_game_screenshot1.png', alt: 'Rock Open Game Screenshot 1' },
        { src: 'images/rock-open-game/rock_open_game_screenshot2.png', alt: 'Rock Open Game Screenshot 2' },
        { src: 'images/rock-open-game/rock_open_game_screenshot3.png', alt: 'Rock Open Game Screenshot 3' },
        { src: 'images/rock-open-game/rock_open_game_screenshot4.png', alt: 'Rock Open Game Screenshot 4' }
      ]
    },
    {
      id: 'wander-sync-app',
      title: 'WanderSync App',
      category: 'App Development',
      image: 'images/AndroidStudioIcon.png',
      description: 'A collaborative travel planning app built using Agile methodology.\nThis is a course project for CS 2340 at Georgia Tech. We learn how Agile methodology works and how to build an app using Android Studio and Firebase. In addition, we also learn how to use SonarQube to analyze our code quality. We also learn how to create unit tests and how to use JUnit to test our code.',
      tags: ['Java', 'Firebase', 'Android Studio', 'GitHub'],
      status: 'complete',
      role: 'Backend Programmer',
      teamSize: '6',
      duration: '4 months (Aug 2023 - Dec 2023)',
      githubLink: 'https://github.com/Kairu1206/CS2340D_Team26',
      images: [],
      writeup: `
## Backend Programmer
- Implemented user authentication and authorization using Firebase Authentication and Security Rules.
- Implemented user profile management and travel plan creation/editing/deletion using Firebase Realtime Database.
- Implemented unit tests for backend functionality using JUnit.
- Analyzed code quality using SonarQube and fixed reported issues.
`,
    },
    {
      id: 'gallery',
      title: 'Gallery',
      category: '',
      image: 'images/gallery/draw_1.png',
      description: 'A collection of my drawings and photos.',
      tags: [],
      status: '',
      role: '',
      duration: '',
      githubLink: '',
      externalLink: '',
      images: [
        { src: 'images/gallery/draw_1.png', alt: 'Gallery Image 1' },
        { src: 'images/gallery/draw_2.png', alt: 'Gallery Image 2' },
        { src: 'images/gallery/draw_4.png', alt: 'Gallery Image 4' },
        { src: 'images/gallery/draw_5.png', alt: 'Gallery Image 5' },
        { src: 'images/gallery/draw_6.png', alt: 'Gallery Image 6' },
        { src: 'images/gallery/draw_7.png', alt: 'Gallery Image 7' },
        { src: 'images/gallery/draw_8.png', alt: 'Gallery Image 8' },
        { src: 'images/gallery/draw_9.png', alt: 'Gallery Image 9' },
        { src: 'images/gallery/digital_0.png', alt: 'Gallery Image 10' },
        { src: 'images/gallery/digital_1.png', alt: 'Gallery Image 11' },
        { src: 'images/gallery/digital_2.png', alt: 'Gallery Image 12' },
        { src: 'images/gallery/photo_0.png', alt: 'Gallery Image 13' },
        { src: 'images/gallery/photo_1.png', alt: 'Gallery Image 14' },
        { src: 'images/gallery/photo_2.png', alt: 'Gallery Image 15' },
        { src: 'images/gallery/photo_3.png', alt: 'Gallery Image 16' },
        { src: 'images/gallery/photo_4.png', alt: 'Gallery Image 17' },
        { src: 'images/gallery/photo_6.png', alt: 'Gallery Image 19' },
        { src: 'images/gallery/photo_7.png', alt: 'Gallery Image 20' },
        { src: 'images/gallery/photo_8.png', alt: 'Gallery Image 21' },
        { src: 'images/gallery/photo_9.png', alt: 'Gallery Image 22' },
        { src: 'images/gallery/photo_10.png', alt: 'Gallery Image 23' },
        { src: 'images/gallery/photo_11.png', alt: 'Gallery Image 24' },
        { src: 'images/gallery/photo_12.png', alt: 'Gallery Image 25' },
        { src: 'images/gallery/photo_13.png', alt: 'Gallery Image 26' },
        { src: 'images/gallery/photo_14.png', alt: 'Gallery Image 27' },
        { src: 'images/gallery/photo_15.png', alt: 'Gallery Image 28' },
        { src: 'images/gallery/photo_16.png', alt: 'Gallery Image 29' },
        { src: 'images/gallery/photo_17.png', alt: 'Gallery Image 30' },
        { src: 'images/gallery/photo_18.png', alt: 'Gallery Image 31' },
        { src: 'images/gallery/photo_19.png', alt: 'Gallery Image 32' },
        { src: 'images/gallery/photo_20.png', alt: 'Gallery Image 33' },
      ]
    }
  ];
