import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
  sarafa_achievement,
  saintpeters_achievement,
  aitr_achievement,
  iitm_achievement,
  sih_achievement,
  nvidia_achievement,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Data Scientist",
    icon: web,
  },
  {
    title: "ML Developer",
    icon: mobile,
  },
  {
    title: "LLM Development",
    icon: backend,
  },
  {
    title: "Web Developer and Database",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "High School Certificate (10th)",
    company_name: "Sarafa Vidya Niketan School, Indore, M.P.",
    icon: sarafa_achievement,
    iconBg: "#383E56",
    date: "2018 (CBSE)",
    points: [
      "Secured 84.6% in 10th grade."
    ],
  },
  {
    title: "Senior School Certificate (10+2)",
    company_name: "The Saint Peter's Higher Secondary School, Indore, M.P.",
    icon: saintpeters_achievement,
    iconBg: "#E6DEDD",
    date: "2020 (M.P. Board)",
    points: [
      "Secured 91.8% in 12th grade."
    ],
  },
  {
    title: "B.Tech in Computer Science & IT (Pursuing)",
    company_name: "Acropolis Institute of Technology and Research, Indore (RGPV)",
    icon: aitr_achievement,
    iconBg: "#383E56",
    date: "2021-2025",
    points: [
      "Current CGPA: 7.91"
    ],
  },
  {
    title: "B.Sc. in Data Science & Programming (Pursuing)",
    company_name: "Indian Institute of Technology (IIT) Madras (Distance Learning)",
    icon: iitm_achievement,
    iconBg: "#E6DEDD",
    date: "2023-Running",
    points: [
      "Current CGPA: 6.85"
    ],
  },
  {
    title: "Winner - Smart India Hackathon (SIH) 2024",
    company_name: "Grand Finale",
    icon: sih_achievement,
    iconBg: "#383E56",
    date: "2024",
    points: [
      "Winners at Grand Finale of Smart India Hackathon (SIH) 2024."
    ],
  },
  {
    title: "Nvidia Deep Learning Workshop",
    company_name: "Nvidia",
    icon: nvidia_achievement,
    iconBg: "#E6DEDD",
    date: "Completed",
    points: [
      "Completed Nvidia's Deep Learning Workshop, gaining proficiency in advanced AI and Machine Learning techniques."
    ],
  },
];

const projects = [
  {
    name: "MargAI",
    description:
      "An AI driven inclusive assessment tool for skill ecosystem with innovative features like AADHAR OTP based login, UDID-based disability verification, and AI-assisted mental health counselling. 'MargAI' ensures equitable access to holistic support for all learners, including PwD Candidates.",
    organization: "Smart India Hackathon 2024",
    role: "AI Developer",
    duration: "3 months",
    technology: ["Flutter", "ReactJS", "ExpressJS", "Python", "Azure", "Langflow", "FastAPI"],
    tags: [
      { name: "Flutter", color: "blue-text-gradient" },
      { name: "ReactJS", color: "blue-text-gradient" },
      { name: "ExpressJS", color: "green-text-gradient" },
      { name: "Python", color: "pink-text-gradient" },
      { name: "Azure", color: "blue-text-gradient" },
      { name: "Langflow", color: "green-text-gradient" },
      { name: "FastAPI", color: "pink-text-gradient" },
    ],
    image: carrent, // Placeholder, update with relevant image if available
    source_code_link: "https://github.com/samarjeet-singh-kheda/marg-ai-web-client",
  },
  {
    name: "KhetiBuddy",
    description:
      "An AI Driven plant care system, mainly focused on detecting plant disease based on leaf images and providing assistance related to the issue.",
    organization: "Acropolis Institute of Technology and Research, Indore",
    role: "Developer",
    duration: "4 months",
    technology: ["Python", "HuggingFace", "NextJS", "TailwindCSS", "Langflow", "Teachable Machines(Google)"],
    tags: [
      { name: "Python", color: "blue-text-gradient" },
      { name: "HuggingFace", color: "green-text-gradient" },
      { name: "NextJS", color: "blue-text-gradient" },
      { name: "TailwindCSS", color: "pink-text-gradient" },
      { name: "Langflow", color: "green-text-gradient" },
      { name: "Teachable Machines", color: "pink-text-gradient" },
    ],
    image: jobit, // Placeholder, update with relevant image if available
    source_code_link: "https://github.com/himaxx/KhetiBuddy",
  },
  {
    name: "Campus Finder",
    description:
      "A web application to help students and visitors easily locate buildings and facilities on campus using interactive maps and search features.",
    organization: "Acropolis Institute of Technology and Research, Indore",
    role: "Developer",
    duration: "2 months",
    technology: ["ReactJS", "NodeJS", "ExpressJS", "MongoDB"],
    tags: [
      { name: "ReactJS", color: "blue-text-gradient" },
      { name: "NodeJS", color: "green-text-gradient" },
      { name: "ExpressJS", color: "pink-text-gradient" },
      { name: "MongoDB", color: "blue-text-gradient" },
    ],
    image: carrent, // Placeholder, update with relevant image if available
    source_code_link: "https://github.com/himaxx/Campus-Finder?tab=readme-ov-file",
  },
  {
    name: "SpoofBlocker",
    description:
      "Developed an AI-based attendance system that accurately distinguishes between fake and genuine student identities using facial recognition. Captured real-time attendance via camera and stored data in Firebase for streamlined record keeping.",
    organization: "Acropolis Institute of Technology and Research, Indore",
    role: "Developer",
    duration: "1 month",
    technology: ["Streamlit", "Python", "WebRTC", "Firebase"],
    tags: [
      { name: "Streamlit", color: "blue-text-gradient" },
      { name: "Python", color: "green-text-gradient" },
      { name: "WebRTC", color: "pink-text-gradient" },
      { name: "Firebase", color: "blue-text-gradient" },
    ],
    image: tripguide, // Placeholder, update with relevant image if available
    source_code_link: "https://github.com/himaxx/Anti",
  },
];

export { services, technologies, experiences, projects };
