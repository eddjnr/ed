export type ProjectCardData = {
  slug: string;
  title: string;
  description: string;
  href: string;
  detail?: string;
  tags?: string;
  year?: string;
};

export type Project = ProjectCardData & { homeDescription?: string };

export const projects: Project[] = [
  {
    slug: "kasho",
    title: "Kasho",
    detail: "Personal finance",
    description: "A local-first personal finance system for understanding and organizing money.",
    homeDescription: "A calmer way to understand and organize your money.",
    href: "https://www.kasho.com.br/",
    tags: "Fullstack · Redis · Postgres",
    year: "2026",
  },
  {
    slug: "aeronotch",
    title: "Aeronotch",
    detail: "Windows utility",
    description: "A compact screen-top utility for a cleaner Windows desktop.",
    homeDescription: "A compact companion for a cleaner Windows desktop.",
    href: "https://aeronotch.vercel.app/",
    tags: "Tauri · Rust · React",
    year: "2025",
  },
  {
    slug: "dailo",
    title: "Dailo",
    description: "A quiet dashboard for focus, routines and daily momentum.",
    href: "https://dailoapp.vercel.app",
    tags: "TipTap · Pomodoro",
    year: "2024",
  },
  {
    slug: "dot-wars",
    title: "Dot Wars",
    description: "A realtime multiplayer arena built around movement and timing.",
    href: "https://dot-wars.vercel.app/",
    tags: "Multiplayer · Realtime",
    year: "2023",
  },
  {
    slug: "rst-iot",
    title: "RST-IoT",
    description: "An IoT requirements specification tool published at WER 2021.",
    href: "http://wer.inf.puc-rio.br/WERpapers/artigos/artigos_WER21/WER_2021_paper_5.pdf",
    tags: "Academic · IoT",
    year: "2021",
  },
];

export const featuredProjects: ProjectCardData[] = projects.slice(0, 2).map((project) => ({
  ...project,
  description: project.homeDescription ?? project.description,
}));
