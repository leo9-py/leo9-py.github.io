export const resumeData = {
  name: 'Leo Dan Peña',
  title: 'Senior Software Engineer',
  contact: {
    email: 'leo9.py@gmail.com',
    phone: '(956) 353-3828',
    github: 'github.com/leo9-py',
    githubUrl: 'https://github.com/leo9-py',
    linkedin: 'linkedin.com/in/leo-dan-pena',
    linkedinUrl: 'https://linkedin.com/in/leo-dan-pena',
    location: 'Texas, USA',
  },
  summary:
    'Senior Software Engineer with experience building and maintaining production payroll and data integration systems at Paycom. Specialized in PHP-based backend development, legacy system modernization and end-to-end delivery of custom client solutions from requirements through deployment. Experienced in leveraging AI-assisted development tools to improve code quality, testing coverage, and delivery speed while maintaining strict correctness and compliance requirements.',
  experience: [
    {
      company: 'Paycom Software, Inc.',
      role: 'Senior Software Engineer',
      location: 'Grapevine, TX',
      start: 'July 2022',
      end: 'Present',
      bullets: [
        'Leveraged AI-assisted development tools to accelerate legacy code refactoring, test case generation, and complex debugging, while applying rigorous review and validation to maintain correctness and compliance in payroll and HR systems.',
        'Designed and delivered custom backend solutions, filling product gaps for enterprise clients, supporting sales and retention efforts.',
        'Developed and optimized payroll, employee data import and export systems, improving automation for client operations teams.',
        'Led modernization efforts, refactoring legacy code to improve performance, readability, and long-term maintainability.',
        'Architected reusable PHP modules and internal frameworks used across multiple client implementations, reducing development time.',
        'Championed unit testing practices across projects, increasing coverage and contributing to a measurable reduction in production defects.',
        'Mentored junior devs via design discussions and pair-debugging sessions, improving code quality and accelerating onboarding.',
        'Supported production issues and edge-case failures in high-impact systems, applying root-cause analysis to prevent recurrence.',
        'Conducted User Acceptance Testing with business stakeholders to ensure solutions met both technical and regulatory requirements.',
      ],
    },
    {
      company: 'The University of Texas Rio Grande Valley',
      role: 'System Analyst Support Engineer',
      location: 'Edinburg, TX',
      start: 'June 2021',
      end: 'December 2021',
      bullets: [
        'Supported campus-wide systems and software continuity in collaboration with departmental stakeholders.',
        'Automated account provisioning and storage management using shell scripts, reducing per-user disk usage and manual setup effort.',
        'Managed Microsoft Active Directory user access and system imaging to support standardized deployments across university systems.',
      ],
    },
  ],
  openSource: [
    {
      name: 'Fully local AI-powered desktop companion app',
      date: 'March 2026',
      stack: 'Ollama, Electron, React and TypeScript',
      githubUrl: 'https://github.com/leo9-py/desktop-pet',
      bullets: [
        'Built a privacy-first local AI desktop companion using Electron, React 18, and TypeScript with a fully local LLM via Ollama.',
        'Implemented active window tracking via PowerShell/Win32 API and idle detection using Electron\'s power monitor to drive context-aware, trigger-based AI responses with cooldown and error backoff logic.',
        'Architected a modular main-process structure across multiple focused TypeScript modules (window tracking, commentary engine, tray management, settings persistence) following clean separation of concerns.',
      ],
    },
  ],
  skills: {
    'Languages & Frameworks': ['PHP', 'Python', 'Oracle MySQL', 'Laminas', 'MVC Frameworks', 'Electron', 'React'],
    'Tools & Platforms': ['Ollama', 'Git', 'Splunk', 'GitLab Runners', 'GitLab Pipeline', 'Beyond Compare', 'JetBrains IntelliJ', 'Apple Xcode'],
    'Practices': ['Unit Testing', "Robert C. Martin's Clean Code", 'Legacy Modernization', 'Scrum', 'Agile', 'User Acceptance Testing'],
  },
  education: [
    {
      school: 'The University of Texas Rio Grande Valley',
      degree: 'Bachelor of Science, Computer Science',
      gpa: '3.50/4.0',
      date: 'June 2022',
      location: 'Edinburg, TX',
    },
    {
      school: 'South Texas College',
      degree: 'Associate of Science, Computer Science',
      gpa: '3.70/4.0',
      date: 'May 2020',
      location: 'McAllen, TX',
    },
  ],
}
