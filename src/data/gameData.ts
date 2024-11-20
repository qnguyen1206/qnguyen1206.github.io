import { LucideIcon } from 'lucide-react';
import type { Project } from '../types/game';

interface SkillCategory {
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
      { name: 'HTML & CSS', level: 'intermediate' },
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
      { name: 'Git & GitHub & GitLab', level: 'advanced' },
      { name: 'Visual Studio Code', level: 'advanced' },
      { name: 'Unity Game Engine', level: 'advanced' },
      { name: 'Godot & GodotSteam', level: 'advanced' },
      { name: 'MySQL', level: 'intermediate' },
      { name: 'Firebase', level: 'intermediate' },
      { name: 'Android Studio', level: 'intermediate' },
      { name: 'IntelliJ IDEA', level: 'intermediate' },
      { name: 'Docker', level: 'beginner' }
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
      { name: 'Tailwind CSS', level: 'intermediate' }
    ]
  },
  'Runtime & Server Technologies': {
    iconName: 'Server',
    iconColor: 'text-orange-400',
    skills: [
      { name: 'Node.js', level: 'intermediate' }
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
      { name: 'Claude', level: 'intermediate' }
    ]
  }
} as const;

export const TOTAL_SKILLS = Object.keys(skillCategories).length;

export const projects: Project[] = [
  {
    title: 'WanderSync App',
    description: 'A course project using Java and Firebase to learn about Agile and Sprint methodology.',
    image: 'images/AndroidStudioIcon.png',
    tech: 'Java, Firebase, Android Studio, GitHub',
    github: 'https://github.com/Kairu1206/CS2340D_Team26',
    types: ['App Development', 'Course Work']
  },
  {
    title: 'Kart: A Tech Filled Racing Game',
    description: 'A multiplayer racing game where cars and technology meet, designed using Godot and Steamworks.',
    image: 'images/KartIcon.png',
    tech: 'GDscript, GodotSteam, GitLab, Steamworks',
    status: 'In Development',
    types: ['Game Development']
  },
  {
    title: 'InQnity: Mythical Hunt',
    description: 'A co-op game where players immerse in the world of mythical creatures with real-world folklores and fantasies.',
    image: 'images/InQnityIcon.png',
    tech: 'GDscript, GodotSteam, GitLab, Steamworks',
    status: 'In Development',
    types: ['Game Development', 'Personal Projects']
  },
  {
    title: 'What Yours is Mime',
    description: 'A 2.5D bullet-hell game where players battle through a kingdom\'s dungeon as a jester.',
    image: 'images/WYiMIcon.png',
    tech: 'Unity, C#, GitHub',
    github: 'https://github.com/Kairu1206/WYiM',
    live: 'https://jhaboon.itch.io/wyim',
    types: ['Game Development', 'Club Projects']
  },
  {
    title: 'Gastropoda',
    description: 'A 2D platformer game where players escape from a mutant snail that broke out from the lab.',
    image: 'images/GastropodaIcon.png',
    tech: 'Unity, C#, GitHub',
    github: 'https://github.com/Kairu1206/gastropoda',
    live: 'https://jhaboon.itch.io/gastropoda-v115',
    types: ['Game Development', 'Club Projects']
  },
  {
    title: 'Customer Service App',
    description: 'A customer service app providing connection between customers, employees and company services.',
    image: 'images/ndaAppIcon.png',
    tech: 'C#, PHP, MySQL, PHPMyAdmin',
    status: 'Under NDA',
    types: ['App Development']
  },
  {
    title: 'ChatBot Project',
    description: 'A course project using ChatGPT APIs to create a chatbot with personality.',
    image: 'images/ChatGPTIcon.png',
    tech: 'HTML, CSS, JavaScript, ChatGPT API',
    github: 'https://github.com/Kairu1206/chatbot',
    live: '/src/chatbot/index.html',
    status: 'API Deprecated',
    types: ['Web Development', 'Course Work']
  },
  {
    title: 'Aframe Project',
    description: 'A course project using Aframe to display 3D objects on a website.',
    image: 'images/AframeIcon.png',
    tech: 'HTML, CSS, Aframe',
    github: 'https://github.com/Kairu1206/aframe-remix',
    live: '/src/aframe-remix/aframe-index.html',
    types: ['Web Development', 'Course Work']
  },
  {
    title: 'GBA Game Project',
    description: 'A course project creating a simple game for GameBoy Advance. Try it out below!',
    image: 'images/GameBoyIcon.png',
    tech: 'C, GBA SDK',
    github: 'https://github.com/Kairu1206/CS2110',
    live: '/src/emulatorjs_gba/index.html',
    types: ['Game Development', 'Course Work']
  },
  {
    title: 'IP Geolocation Service',
    description: 'A service that provides real-time location data using IP addresses and geolocation APIs, built with security and privacy in mind.',
    image: 'images/ipIcon.png',
    tech: 'HTML, CSS, JavaScript, IP Geolocation API, PHP, MySQL',
    status: 'Private',
    types: ['Security Research', 'Personal Projects']
  },
  {
    title: 'Advanced Keylogger',
    description: 'A security research project demonstrating keylogging vulnerabilities and countermeasures in modern systems.',
    image: 'images/keyloggerIcon.png',
    tech: 'HTML, CSS, JavaScript, PHP, MySQL',
    status: 'Private',
    types: ['Security Research', 'Personal Projects']
  },
  {
    title: 'Pwnagotchi Implementation',
    description: 'A custom implementation of Pwnagotchi for WiFi security research and analysis.',
    image: 'images/pwnagotchiIcon.png',
    tech: 'Python, Raspberry Pi',
    status: 'Private',
    types: ['Security Research', 'Personal Projects']
  },
  {
    title: 'RF Security Analysis Tool',
    description: 'A research project exploring radio frequency security using Flipper Zero, focusing on automotive systems.',
    image: 'images/flipperzeroIcon.png',
    tech: 'C, Flipper Zero, RF Analysis',
    status: 'Private',
    types: ['Security Research', 'Personal Projects']
  }
];

export const TOTAL_PROJECTS = projects.length;

export const experiences = [
  {
    title: 'Customer Service',
    company: 'Pho Nam ATL',
    period: 'June 2023 - Present',
    type: 'Work'
  },
  {
    title: 'Summer Camp Counselor',
    company: 'Lake Wenatchee YMCA',
    period: 'June 2024 - August 2024',
    type: 'Work'
  },
  {
    title: 'Project Lead & Game Development Programmer',
    company: 'Game Development Projects',
    period: 'June 2022 - Present',
    type: 'Other',
    description: 'Leading game development projects and programming implementation.'
  },
  {
    title: 'App Development Lead',
    company: 'Mobile Development Projects',
    period: 'June 2023 - Aug 2023',
    type: 'Other',
    description: 'Leading mobile app development and design.'
  }
];

export const TOTAL_EXPERIENCES = experiences.length;

export const education = [
  {
    school: 'Georgia Institute of Technology',
    degree: 'Bachelor of Science in Computational Media',
    period: '2023 - Present',
    gpa: '2.96/4.0',
    description: 'Specializing in Game Design and Intelligence'
  },
  {
    school: 'Georgia State University',
    degree: 'Bachelor of Science in Computer Science',
    period: '2022 - 2023',
    gpa: '4.0/4.0',
    description: 'Completed core Computer Science curriculum with highest honors before transferring to Georgia Tech'
  }
]; 

export const TOTAL_EDUCATION = education.length;
