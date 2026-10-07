// Placeholder résumé content — edit freely. Rendered by components/ResumeDocument
// (shown in the Preview app and at the /resume route, which is printed to PDF).

export interface ResumeJob {
  role: string;
  company: string;
  period: string;
  points: string[];
}

export interface ResumeEdu {
  school: string;
  detail: string;
  period: string;
}

export interface Resume {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  summary: string;
  experience: ResumeJob[];
  education: ResumeEdu[];
  skills: string[];
}

export const RESUME: Resume = {
  name: "Christopher Angoe",
  title: "Software Engineer",
  location: "Accra, Ghana",
  email: "christopher.angoe@amalitech.com",
  website: "your-portfolio.vercel.app",
  summary:
    "Software engineer focused on the front end and product. I turn fuzzy ideas into interfaces people enjoy using, and I care about the details that make software feel good.",
  experience: [
    {
      role: "Software Engineer",
      company: "AmaliTech",
      period: "2023 — Present",
      points: [
        "Build and maintain web applications with React, Next.js, and TypeScript.",
        "Collaborate across design and product to ship user-facing features end to end.",
        "Focus on accessibility, performance, and clean, maintainable code.",
      ],
    },
    {
      role: "Frontend Developer (placeholder)",
      company: "Previous Company",
      period: "2021 — 2023",
      points: [
        "Replace with a real role — describe the impact, not just the tasks.",
        "A metric or outcome reads better than a feature list.",
      ],
    },
  ],
  education: [
    {
      school: "Your University",
      detail: "BSc, Computer Science (placeholder)",
      period: "2017 — 2021",
    },
  ],
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "Accessibility",
    "UI/UX",
    "Git",
  ],
};
