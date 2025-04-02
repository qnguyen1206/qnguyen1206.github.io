import { LucideIcon } from 'lucide-react';
import type { Project } from '../types/game';

export interface SkillCategory {
  iconName: string;
  iconColor: string;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced';
  }>;
}

export const skillCategories: Record<string, SkillCategory> = {
  'Programming': {
    iconName: 'Sword',
    iconColor: 'text-blue-400',
    skills: [
      { name: 'C#', level: 'advanced' },
      { name: 'GDscript', level: 'advanced' },
      { name: 'HTML', level: 'intermediate' },
      { name: 'CSS', level: 'intermediate' },
      { name: 'PHP', level: 'intermediate' },
      { name: 'Python', level: 'intermediate' },
      { name: 'C', level: 'intermediate' },
      { name: 'Assembly', level: 'intermediate' },
      { name: 'Java', level: 'intermediate' },
      { name: 'JavaScript', level: 'intermediate' },
      { name: 'TypeScript', level: 'beginner' }
    ]
  },
  'Languages': {
    iconName: 'Globe',
    iconColor: 'text-green-400',
    skills: [
      { name: 'English', level: 'advanced' },
      { name: 'Vietnamese', level: 'advanced' },
      { name: 'Spanish', level: 'beginner' },
      { name: 'Japanese', level: 'beginner' }
    ]
  },
  'Tools': {
    iconName: 'Wrench',
    iconColor: 'text-purple-400',
    skills: [
      { name: 'Git', level: 'advanced' },
      { name: 'GitHub', level: 'advanced' },
      { name: 'GitLab', level: 'advanced' },
      { name: 'Visual Studio Code', level: 'advanced' },
      { name: 'Unity Game Engine', level: 'advanced' },
      { name: 'Godot & GodotSteam', level: 'advanced' },
      { name: 'Android Studio', level: 'intermediate' },
      { name: 'IntelliJ IDEA', level: 'intermediate' },
      { name: 'Jupiter Notebook', level: 'intermediate' },
    ]
  },
  'Concepts': {
    iconName: 'Brain',
    iconColor: 'text-yellow-400',
    skills: [
      { name: 'Game Design', level: 'advanced' },
      { name: 'Object-Oriented Programming', level: 'intermediate' },
      { name: 'Data Structures & Algorithms', level: 'intermediate' },
      { name: 'Computer Organization', level: 'intermediate' },
      { name: 'Agile Development', level: 'intermediate' },
      { name: 'Cryptography', level: 'intermediate' },
      { name: 'Network Security', level: 'beginner' },
      { name: 'Security Analysis', level: 'beginner' }
    ]
  },
  'Soft Skills': {
    iconName: 'Users',
    iconColor: 'text-red-400',
    skills: [
      { name: 'Team Leadership', level: 'advanced' },
      { name: 'Project Management', level: 'intermediate' },
      { name: 'Problem Solving', level: 'advanced' },
      { name: 'Communication', level: 'advanced' },
      { name: 'Time Management', level: 'intermediate' }
    ]
  },
  'Frontend Frameworks & Libraries': {
    iconName: 'Layout',
    iconColor: 'text-pink-400',
    skills: [
      { name: 'React.js', level: 'intermediate' },
      { name: 'Tailwind CSS', level: 'intermediate' },
      { name: 'Next.js', level: 'beginner' },
    ]
  },
  'Backend Frameworks & Libraries': {
    iconName: 'Server',
    iconColor: 'text-orange-400',
    skills: [
      { name: 'Node.js', level: 'intermediate' },
      { name: 'MySQL', level: 'intermediate' },
      { name: 'Firebase', level: 'intermediate' },
      { name: 'NumPy', level: 'intermediate' },
      { name: 'Pandas', level: 'intermediate' },
      { name: 'Conda', level: 'beginner' },
      { name: 'Docker', level: 'beginner' },
      { name: 'Prometheus', level: 'beginner' },
      { name: 'Grafana', level: 'beginner' }
    ]
  },
  'AI & Machine Learning': {
    iconName: 'Bot',
    iconColor: 'text-indigo-400',
    skills: [
      { name: 'Cursor AI', level: 'advanced' },
      { name: 'ChatGPT', level: 'advanced' },
      { name: 'V0 by Vercel', level: 'intermediate' },
      { name: 'Bolt AI', level: 'intermediate' },
      { name: 'Claude', level: 'intermediate' },
      { name: 'DeepSeek R1', level: 'intermediate' },
      { name: 'MeshyAI', level: 'beginner' },
    ]
  }
} as const;

export const TOTAL_SKILLS = Object.keys(skillCategories).length;

export type ProjectStatus = 'In Development' | 'On Hold' | 'Finished' | 'Private' | 'Under NDA' | 'API Deprecated';
export type ProjectStatuses = ProjectStatus[];

export const getStatusColor = (status: ProjectStatus | ProjectStatuses): string => {
  if (Array.isArray(status)) {
    return getStatusColor(status[0]);
  }
  switch (status) {
    case 'In Development':
      return 'text-yellow-500';
    case 'On Hold':
      return 'text-red-500';
    case 'Finished':
      return 'text-green-500';
    case 'Private':
      return 'text-gray-500';
    case 'Under NDA':
      return 'text-purple-500';
    case 'API Deprecated':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

export const projects: Project[] = [
  {
    title: 'Kart: A Tech Filled Racing Game',
    description: 'A multiplayer racing game where cars and technology meet, designed using Godot and Steamworks.',
    image: 'images/KartIcon.png',
    tech: 'GDscript, GodotSteam, GitLab, Steamworks',
    status: ['In Development', 'Private'],
    types: ['Game Development']
  },
  {
    title: 'Infinity: Mythical Hunt',
    description: 'A co-op game where players immerse in the world of mythical creatures with real-world folklores and fantasies.',
    image: 'images/InQnityIcon.png',
    tech: 'GDscript, GodotSteam, GitLab, Steamworks',
    status: ['On Hold', 'Private'],
    types: ['Game Development', 'Personal Projects']
  },
  {
    title: 'TO DO app',
    description: 'A simple gamify to do list app with DeepSeek-R1 14B param local AI integrated for personal use.',
    image: 'images/clipboard.png',
    tech: 'Python, Tkinter, PrettyTable, PyInstaller',
    github: 'https://github.com/Kairu1206/todoapp',
    status: ['Finished'],
    types: ['App Development', 'Personal Projects']
  },
  {
    title: 'Gamify Saving App',
    description: 'A gamify saving app to make saving easier and more fun.',
    image: 'images/inqnity_banking_image.png',
    tech: 'HTML, CSS, JavaScript, React, NodeJS, Firebase, REST API',
    status: ['On Hold', 'Private'],
    live: 'https://inqnity-61729.web.app',
    types: ['App Development', 'Personal Projects']
  },
  {
    title: 'Rock Open Game',
    description: 'A personal project to bring a high school project to web game.',
    image: 'images/webrockgameicon.png',
    tech: 'HTML, CSS, JavaScript, React, NodeJS, Firebase, GitHub CI/CD',
    github: 'https://github.com/Kairu1206/RockOpenGameWeb',
    status: ['Finished'],
    live: 'https://rockopengameweb.web.app/',
    types: ['Game Development', 'Course Work']
  },
  {
    title: 'WanderSync App',
    description: 'A course project using Java and Firebase to learn about Agile and Sprint methodology.',
    image: 'images/AndroidStudioIcon.png',
    tech: 'Java, Firebase, Android Studio, GitHub',
    github: 'https://github.com/Kairu1206/CS2340D_Team26',
    status: ['Finished'],
    types: ['App Development', 'Course Work']
  },
  {
    title: 'Tower Offense Game',
    description: 'A course project using Unity and C# to create a 2D tower offense game.',
    image: 'images/Castle.png',
    tech: 'Unity, C#, GitHub',
    github: 'https://github.com/Kairu1206/LMC_2410',
    live: 'https://kairu1206.itch.io/tower-offense-game',
    status: ['Finished'],
    types: ['Game Development', 'Course Work']
  },
  {
    title: 'Stella In Space',
    description: 'A course project using Unity and C# to create a 2D platformer game.',
    image: 'images/stellaInSpaceIcon.png',
    tech: 'Unity, C#, GitHub',
    github: 'https://github.com/Kairu1206/StellaInSpace',
    live: 'https://kairu1206.itch.io/stella-in-space',
    status: ['Finished'],
    types: ['Game Development', 'Course Work']
  },
  {
    title: 'What Yours is Mime',
    description: 'A 2.5D bullet-hell game where players battle through a kingdom\'s dungeon as a jester.',
    image: 'images/WYiMIcon.png',
    tech: 'Unity, C#, GitHub',
    status: ['Finished'],
    github: 'https://github.com/Kairu1206/WYiM',
    live: 'https://jhaboon.itch.io/wyim',
    types: ['Game Development', 'Club Projects']
  },
  {
    title: 'Gastropoda',
    description: 'A 2D platformer game where players escape from a mutant snail that broke out from the lab.',
    image: 'images/GastropodaIcon.png',
    tech: 'Unity, C#, GitHub',
    status: ['Finished'],
    github: 'https://github.com/Kairu1206/gastropoda',
    live: 'https://jhaboon.itch.io/gastropoda-v115',
    types: ['Game Development', 'Club Projects']
  },
  {
    title: 'Customer Service App',
    description: 'A customer service app providing connection between customers, employees and company services.',
    image: 'images/ndaAppIcon.png',
    tech: 'C#, PHP, MySQL, PHPMyAdmin',
    status: ['Under NDA', 'Private'],
    types: ['App Development']
  },
  {
    title: 'ChatBot Project',
    description: 'A course project using ChatGPT APIs to create a chatbot with personality.',
    image: 'images/ChatGPTIcon.png',
    tech: 'HTML, CSS, JavaScript, ChatGPT API',
    github: 'https://github.com/Kairu1206/chatbot',
    status: ['API Deprecated', 'Finished'],
    types: ['Web Development', 'Course Work']
  },
  {
    title: 'Aframe Project',
    description: 'A course project using Aframe to display 3D objects on a website.',
    image: 'images/AframeIcon.png',
    tech: 'HTML, CSS, Aframe',
    github: 'https://github.com/Kairu1206/aframe-remix',
    status: ['Finished'],
    types: ['Web Development', 'Course Work']
  },
  {
    title: 'GBA Game Project',
    description: 'A course project creating a simple game for GameBoy Advance. Try it out below!',
    image: 'images/GameBoyIcon.png',
    tech: 'C, GBA SDK',
    github: 'https://github.com/Kairu1206/CS2110',
    status: ['Finished'],
    types: ['Game Development', 'Course Work']
  },
  {
    title: 'Pwnagotchi Implementation',
    description: 'A custom implementation of Pwnagotchi for WiFi security research and analysis.',
    image: 'images/pwnagotchiIcon.png',
    tech: 'Python, Raspberry Pi',
    status: ['Private', 'On Hold'],
    types: ['Cybersecurity Research', 'Personal Projects']
  },
  {
    title: 'RF Security Analysis Tool',
    description: 'A research project exploring radio frequency security using Flipper Zero, focusing on automotive systems.',
    image: 'images/flipperzeroIcon.png',
    tech: 'C, Flipper Zero, RF Analysis',
    status: ['Private', 'On Hold'],
    types: ['Cybersecurity Research', 'Personal Projects']
  },
  {
    title: 'Common Web Security Vulnerabilities and Prevention',
    description: 'A study of common web security vulnerabilities and prevention techniques.',
    image: 'images/webIcon.png',
    tech: 'HTML, CSS, JavaScript, PHP, MySQL',
    status: ['Private', 'Finished'],
    types: ['Cybersecurity Research', 'Personal Projects']
  },
];

export const TOTAL_PROJECTS = projects.length;

export const experiences = [
  {
    title: 'Project Lead & Game Development Programmer',
    company: 'Game Development Projects',
    period: 'June 2022 - Present',
    type: 'Club and Group Work',
    description: 'Leading game development projects and programming implementation.'
  },
  {
    title: 'App Developer and Designer Intern',
    company: 'NDA Customer Service',
    period: 'June 2023 - Aug 2023',
    type: 'Internship',
    description: 'Leading mobile app development and design.'
  },
  {
    title: 'Customer Service',
    company: 'Pho Nam ATL',
    period: 'June 2023 - Present',
    type: 'Part-time Job'
  },
  {
    title: 'Summer Camp Counselor',
    company: 'Lake Wenatchee YMCA',
    period: 'June 2024 - August 2024',
    type: 'Part-time Job'
  },
  {
    title: 'Lifeguard',
    company: 'United Pools',
    period: 'June 2022 - July 2022',
    type: 'Part-time Job'
  },
];

export const TOTAL_EXPERIENCES = experiences.length;

export const education = [
  {
    school: 'Georgia Institute of Technology',
    degree: 'Bachelor of Science in Computational Media',
    period: '2023 - Present',
    gpa: 'TBD',
    description: 'Specializing in Game Design and Intelligence',
    scholarships_and_awards: ['Zell Miller Scholarship Recipient'],
  },
  {
    school: 'Georgia State University',
    degree: 'Bachelor of Science in Computer Science',
    period: '2022 - 2023',
    gpa: '4.0/4.0',
    description: 'Completed core Computer Science curriculums before transferring to Georgia Tech',
    scholarships_and_awards: ['Zell Miller Scholarship Recipient', 'GSU President List Fall 2022 Recipient', 'GSU Dean List Spring 2023 Recipient'],
  }
]; 

export const TOTAL_EDUCATION = education.length;

export interface GalleryItem {
  image: string;
  title: string;
  description: string;
  categories: Array<'digital' | 'traditional' | 'design' | 'photography'>;
}

export const galleryItems: GalleryItem[] = [
  {
    image: "/images/gallery/digital_0.png",
    title: "Cloudscape",
    description: "Cloudscape drawing",
    categories: ["digital"]
  },
  {
    image: "/images/gallery/photo_0.png",
    title: "Photo 0",
    description: "Photo 0",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/digital_1.png",
    title: "Cat",
    description: "Cat drawing",
    categories: ["digital", "design"]
  },
  {
    image: "/images/gallery/draw_1.png",
    title: "Mountain Cliff",
    description: "Mountain Cliff with Sakura Tree drawing",
    categories: ["traditional"]
  },
  {
    image: "/images/gallery/photo_1.png",
    title: "Photo 1",
    description: "Photo 1",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/InQnityIcon.png",
    title: "InQnity: Mythical Hunt",
    description: "Game icon design",
    categories: ["digital", "design"]
  },
  {
    image: "/images/gallery/digital_2.png",
    title: "Cat 2",
    description: "Cat drawing",
    categories: ["digital", "design"]
  },
  {
    image: "/images/gallery/draw_2.png",
    title: "Mountain Sunset",
    description: "Sunset on a mountain drawing",
    categories: ["traditional"]
  },
  {
    image: "/images/gallery/photo_2.png",
    title: "Photo 2",
    description: "Photo 2",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/draw_4.png",
    title: "Lake Sunset",
    description: "Sunset on a lake drawing",
    categories: ["traditional"]
  },
  {
    image: "/images/gallery/photo_3.png",
    title: "Photo 3",
    description: "Photo 3",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/draw_5.png",
    title: "Lake and Mountains",
    description: "Lake and mountains drawing",
    categories: ["traditional"]
  },
  {
    image: "/images/gallery/photo_4.png",
    title: "Photo 4",
    description: "Photo 4",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/draw_6.png",
    title: "Sunset Beach",
    description: "Sunset on a beach drawing",
    categories: ["traditional"]
  },
  {
    image: "/images/gallery/photo_6.png",
    title: "Photo 6",
    description: "Photo 6",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/draw_7.png",
    title: "Mountain Village",
    description: "Mountain village landscape drawing",
    categories: ["traditional"]
  },
  {
    image: "/images/gallery/photo_7.png",
    title: "Photo 7",
    description: "Photo 7",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/draw_8.png",
    title: "Wolf",
    description: "Wolf drawing",
    categories: ["traditional"]
  },
  {
    image: "/images/gallery/photo_8.png",
    title: "Photo 8",
    description: "Photo 8",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/draw_9.png",
    title: "Dragon",
    description: "Dragon drawing",
    categories: ["traditional"]
  },
  {
    image: "/images/gallery/photo_9.png",
    title: "Photo 9",
    description: "Photo 9",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_10.png",
    title: "Photo 10",
    description: "Photo 10",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_11.png",
    title: "Photo 11",
    description: "Photo 11", 
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_12.png",
    title: "Photo 12",
    description: "Photo 12",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_13.png",
    title: "Photo 13",
    description: "Photo 13",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_14.png",
    title: "Photo 14",
    description: "Photo 14",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_15.png",
    title: "Photo 15",
    description: "Photo 15",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_16.png",
    title: "Photo 16",
    description: "Photo 16",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_17.png",
    title: "Photo 17",
    description: "Photo 17",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_18.png",
    title: "Photo 18",
    description: "Photo 18",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_19.png",
    title: "Photo 19",
    description: "Photo 19",
    categories: ["photography"]
  },
  {
    image: "/images/gallery/photo_20.png",
    title: "Photo 20",
    description: "Photo 20",
    categories: ["photography"]
  }
];

export const TOTAL_GALLERY = galleryItems.length;

export interface SkillNode {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  icon?: string;
  color: string;
  x: number;
  y: number;
  dependencies: string[];
  description?: string;
}

// Move this function to the top, before skillTreeData
const getCirclePosition = (centerX: number, centerY: number, radius: number, index: number, total: number) => {
  const angle = (index * (2 * Math.PI) / total) - Math.PI/2; // Start from top
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  };
};

// Then your skillTreeData and other code...
export const skillTreeData: SkillNode[] = [
  // Core node at center
  {
    id: 'core',
    name: 'Core Skills',
    icon: 'CircleDot',
    level: 'advanced',
    color: '#3b82f6',
    x: 50,
    y: 50,
    dependencies: [],
    description: 'Core skills and fundamentals'
  },

  // Programming Category & Skills
  {
    id: 'programming',
    name: 'Programming',
    icon: 'Code',
    level: 'advanced',
    color: '#3b82f6',
    x: 25,
    y: 30,
    dependencies: ['core']
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: 'Code',
    level: 'advanced',
    color: '#3b82f6',
    x: 20,
    y: 25,
    dependencies: ['programming']
  },
  {
    id: 'gdscript',
    name: 'GDScript',
    icon: 'Code',
    level: 'advanced',
    color: '#3b82f6',
    x: 15,
    y: 28,
    dependencies: ['programming']
  },
  {
    id: 'html_css',
    name: 'HTML & CSS',
    icon: 'Code',
    level: 'intermediate',
    color: '#3b82f6',
    x: 35,
    y: 20,
    dependencies: ['programming']
  },
  {
    id: 'php',
    name: 'PHP',
    icon: 'Code',
    level: 'intermediate',
    color: '#3b82f6',
    x: 45,
    y: 25,
    dependencies: ['programming']
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'Code',
    level: 'intermediate',
    color: '#3b82f6',
    x: 15,
    y: 25,
    dependencies: ['programming']
  },
  {
    id: 'c',
    name: 'C',
    icon: 'Code',
    level: 'intermediate',
    color: '#3b82f6',
    x: 20,
    y: 30,
    dependencies: ['programming']
  },
  {
    id: 'assembly',
    name: 'Assembly',
    icon: 'Code',
    level: 'intermediate',
    color: '#3b82f6',
    x: 30,
    y: 35,
    dependencies: ['programming']
  },
  {
    id: 'java',
    name: 'Java',
    icon: 'Code',
    level: 'intermediate',
    color: '#3b82f6',
    x: 40,
    y: 30,
    dependencies: ['programming']
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'Code',
    level: 'intermediate',
    color: '#3b82f6',
    x: 45,
    y: 20,
    dependencies: ['programming']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'Code',
    level: 'beginner',
    color: '#3b82f6',
    x: 50,
    y: 25,
    dependencies: ['programming']
  },

  // Languages Category & Skills
  {
    id: 'languages',
    name: 'Languages',
    icon: 'Globe',
    level: 'advanced',
    color: '#22c55e',
    x: 75,
    y: 30,
    dependencies: ['core']
  },
  {
    id: 'english',
    name: 'English',
    icon: 'Globe',
    level: 'advanced',
    color: '#22c55e',
    x: 65,
    y: 20,
    dependencies: ['languages']
  },
  {
    id: 'vietnamese',
    name: 'Vietnamese',
    icon: 'Globe',
    level: 'advanced',
    color: '#22c55e',
    x: 75,
    y: 15,
    dependencies: ['languages']
  },
  {
    id: 'spanish',
    name: 'Spanish',
    icon: 'Globe',
    level: 'beginner',
    color: '#22c55e',
    x: 85,
    y: 20,
    dependencies: ['languages']
  },
  {
    id: 'japanese',
    name: 'Japanese',
    icon: 'Globe',
    level: 'beginner',
    color: '#22c55e',
    x: 80,
    y: 25,
    dependencies: ['languages']
  },

  // Tools Category & Skills
  {
    id: 'tools',
    name: 'Development Tools',
    icon: 'Wrench',
    level: 'advanced',
    color: '#a855f7',
    x: 75,
    y: 70,
    dependencies: ['core']
  },
  {
    id: 'git',
    name: 'Git & GitHub & GitLab',
    icon: 'Wrench',
    level: 'advanced',
    color: '#a855f7',
    x: 65,
    y: 80,
    dependencies: ['tools']
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    icon: 'Wrench',
    level: 'advanced',
    color: '#a855f7',
    x: 70,
    y: 85,
    dependencies: ['tools']
  },
  {
    id: 'unity',
    name: 'Unity Game Engine',
    icon: 'Wrench',
    level: 'advanced',
    color: '#a855f7',
    x: 75,
    y: 80,
    dependencies: ['tools']
  },
  {
    id: 'godot',
    name: 'Godot & GodotSteam',
    icon: 'Wrench',
    level: 'advanced',
    color: '#a855f7',
    x: 80,
    y: 85,
    dependencies: ['tools']
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: 'Wrench',
    level: 'intermediate',
    color: '#a855f7',
    x: 85,
    y: 80,
    dependencies: ['tools']
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: 'Wrench',
    level: 'intermediate',
    color: '#a855f7',
    x: 90,
    y: 75,
    dependencies: ['tools']
  },
  {
    id: 'android_studio',
    name: 'Android Studio',
    icon: 'Wrench',
    level: 'intermediate',
    color: '#a855f7',
    x: 85,
    y: 70,
    dependencies: ['tools']
  },
  {
    id: 'intellij',
    name: 'IntelliJ IDEA',
    icon: 'Wrench',
    level: 'intermediate',
    color: '#a855f7',
    x: 80,
    y: 65,
    dependencies: ['tools']
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: 'Wrench',
    level: 'beginner',
    color: '#a855f7',
    x: 75,
    y: 60,
    dependencies: ['tools']
  },

  // Concepts Category & Skills
  {
    id: 'concepts',
    name: 'Core Concepts',
    icon: 'Brain',
    level: 'advanced',
    color: '#eab308',
    x: 25,
    y: 70,
    dependencies: ['core']
  },
  {
    id: 'game_design',
    name: 'Game Design',
    icon: 'Brain',
    level: 'advanced',
    color: '#eab308',
    x: 15,
    y: 80,
    dependencies: ['concepts']
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    icon: 'Brain',
    level: 'intermediate',
    color: '#eab308',
    x: 20,
    y: 85,
    dependencies: ['concepts']
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: 'Brain',
    level: 'intermediate',
    color: '#eab308',
    x: 25,
    y: 80,
    dependencies: ['concepts']
  },
  {
    id: 'computer_org',
    name: 'Computer Organization',
    icon: 'Brain',
    level: 'intermediate',
    color: '#eab308',
    x: 30,
    y: 85,
    dependencies: ['concepts']
  },
  {
    id: 'agile',
    name: 'Agile Development',
    icon: 'Brain',
    level: 'intermediate',
    color: '#eab308',
    x: 35,
    y: 80,
    dependencies: ['concepts']
  },
  {
    id: 'cryptography',
    name: 'Cryptography',
    icon: 'Brain',
    level: 'intermediate',
    color: '#eab308',
    x: 40,
    y: 75,
    dependencies: ['concepts']
  },
  {
    id: 'network_security',
    name: 'Network Security',
    icon: 'Brain',
    level: 'beginner',
    color: '#eab308',
    x: 35,
    y: 70,
    dependencies: ['concepts']
  },
  {
    id: 'security_analysis',
    name: 'Security Analysis',
    icon: 'Brain',
    level: 'beginner',
    color: '#eab308',
    x: 30,
    y: 65,
    dependencies: ['concepts']
  },

  // Soft Skills Category & Skills
  {
    id: 'soft_skills',
    name: 'Soft Skills',
    icon: 'Users',
    level: 'advanced',
    color: '#ef4444',
    x: 50,
    y: 85,
    dependencies: ['core']
  },
  {
    id: 'leadership',
    name: 'Team Leadership',
    icon: 'Users',
    level: 'advanced',
    color: '#ef4444',
    x: 40,
    y: 90,
    dependencies: ['soft_skills']
  },
  {
    id: 'project_management',
    name: 'Project Management',
    icon: 'Users',
    level: 'intermediate',
    color: '#ef4444',
    x: 45,
    y: 95,
    dependencies: ['soft_skills']
  },
  {
    id: 'problem_solving',
    name: 'Problem Solving',
    icon: 'Users',
    level: 'advanced',
    color: '#ef4444',
    x: 50,
    y: 90,
    dependencies: ['soft_skills']
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: 'Users',
    level: 'advanced',
    color: '#ef4444',
    x: 55,
    y: 95,
    dependencies: ['soft_skills']
  },
  {
    id: 'time_management',
    name: 'Time Management',
    icon: 'Users',
    level: 'intermediate',
    color: '#ef4444',
    x: 60,
    y: 90,
    dependencies: ['soft_skills']
  },

  // Frontend Frameworks Category & Skills
  {
    id: 'frontend',
    name: 'Frontend Frameworks',
    icon: 'Code',
    level: 'intermediate',
    color: '#ec4899',
    x: 15,
    y: 50,
    dependencies: ['core']
  },
  {
    id: 'react',
    name: 'React.js',
    icon: 'Code',
    level: 'intermediate',
    color: '#ec4899',
    x: 10,
    y: 45,
    dependencies: ['frontend']
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    icon: 'Code',
    level: 'intermediate',
    color: '#ec4899',
    x: 20,
    y: 45,
    dependencies: ['frontend']
  },

  // Runtime & Server Category & Skills
  {
    id: 'runtime',
    name: 'Runtime & Server',
    icon: 'Code',
    level: 'intermediate',
    color: '#f97316',
    x: 85,
    y: 50,
    dependencies: ['core']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: 'Code',
    level: 'intermediate',
    color: '#f97316',
    x: 90,
    y: 45,
    dependencies: ['runtime']
  },

  // AI & ML Category & Skills
  {
    id: 'ai_ml',
    name: 'AI & Machine Learning',
    icon: 'Bot',
    level: 'advanced',
    color: '#818cf8',
    x: 50,
    y: 15,
    dependencies: ['core']
  },
  {
    id: 'cursor_ai',
    name: 'Cursor AI',
    icon: 'Bot',
    level: 'advanced',
    color: '#818cf8',
    x: 40,
    y: 10,
    dependencies: ['ai_ml']
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: 'Bot',
    level: 'advanced',
    color: '#818cf8',
    x: 45,
    y: 5,
    dependencies: ['ai_ml']
  },
  {
    id: 'v0',
    name: 'V0 by Vercel',
    icon: 'Bot',
    level: 'intermediate',
    color: '#818cf8',
    x: 50,
    y: 10,
    dependencies: ['ai_ml']
  },
  {
    id: 'bolt',
    name: 'Bolt AI',
    icon: 'Bot',
    level: 'intermediate',
    color: '#818cf8',
    x: 55,
    y: 5,
    dependencies: ['ai_ml']
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: 'Bot',
    level: 'intermediate',
    color: '#818cf8',
    x: 60,
    y: 10,
    dependencies: ['ai_ml']
  }
];

// Calculate and update positions for all nodes
function updateSkillTreePositions() {
  const CORE_X = 50;
  const CORE_Y = 50;
  const MAIN_RADIUS = 25;
  const CHILD_RADIUS = 12;

  // Position main category nodes around core in a more balanced way
  const mainCategories = [
    { id: 'programming', angle: -Math.PI/4 },     // top-left
    { id: 'languages', angle: Math.PI/4 },        // top-right
    { id: 'tools', angle: 3*Math.PI/4 },          // bottom-right
    { id: 'concepts', angle: -3*Math.PI/4 },      // bottom-left
    { id: 'soft_skills', angle: Math.PI },        // bottom
    { id: 'frontend', angle: -Math.PI*0.75 },     // left-top
    { id: 'runtime', angle: Math.PI*0.75 },       // right-bottom
    { id: 'ai_ml', angle: 0 }                     // top
  ];

  // Update main category positions
  mainCategories.forEach(cat => {
    const node = skillTreeData.find(n => n.id === cat.id);
    if (node) {
      node.x = CORE_X + MAIN_RADIUS * Math.cos(cat.angle);
      node.y = CORE_Y + MAIN_RADIUS * Math.sin(cat.angle);
    }
  });

  // Update child node positions with dynamic radius based on number of siblings
  skillTreeData.forEach(node => {
    if (node.dependencies[0] !== 'core' && node.dependencies[0] !== '') {
      const parent = skillTreeData.find(n => n.id === node.dependencies[0]);
      if (parent) {
        const siblings = skillTreeData.filter(n => n.dependencies[0] === node.dependencies[0]);
        const index = siblings.indexOf(node);
        const dynamicRadius = CHILD_RADIUS * (1 + siblings.length / 10); // Larger radius for more siblings
        const pos = getCirclePosition(parent.x, parent.y, dynamicRadius, index, siblings.length);
        node.x = pos.x;
        node.y = pos.y;
      }
    }
  });
}

// Apply the positions
updateSkillTreePositions();

// Convert the existing skill categories to skill tree nodes
export const generateSkillTreeFromCategories = () => {
  const nodes: SkillNode[] = [];
  let yOffset = 20;

  Object.entries(skillCategories).forEach(([category, data], categoryIndex) => {
    // Add category node
    const categoryNode: SkillNode = {
      id: category.toLowerCase(),
      name: category,
      level: 'advanced',
      color: getColorForCategory(categoryIndex),
      x: 30 + (categoryIndex * 20) % 60, // Distribute horizontally
      y: yOffset,
      dependencies: ['programming_core'],
      description: `${category} skills and expertise`
    };
    nodes.push(categoryNode);

    // Add skill nodes for each skill in category
    data.skills.forEach((skill, skillIndex) => {
      const skillNode: SkillNode = {
        id: `${category.toLowerCase()}_${skill.name.toLowerCase().replace(/\s+/g, '_')}`,
        name: skill.name,
        level: skill.level,
        color: categoryNode.color,
        x: categoryNode.x + (skillIndex * 15 - 15),
        y: yOffset + 15,
        dependencies: [categoryNode.id]
      };
      nodes.push(skillNode);
    });

    yOffset += 30; // Move to next row for next category
  });

  return nodes;
};

const getColorForCategory = (index: number): string => {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#22c55e', // green
    '#a855f7', // purple
    '#eab308', // yellow
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];
  return colors[index % colors.length];
};
