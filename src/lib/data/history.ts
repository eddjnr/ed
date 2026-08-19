export type Experience = {
  period: string;
  title: string;
  company: string;
  location: string;
  description: string;
  homeDescription: string;
};

export type Education = {
  index: string;
  title: string;
  organization: string;
  period: string;
  dateTime?: string;
  credential?: string;
  description?: string;
};

export const experience: Experience[] = [
  {
    period: "2021–Present",
    title: "Frontend Specialist",
    company: "Conexa Saúde",
    location: "Remote",
    description:
      "Product interfaces, frontend architecture, design systems, SDK integrations and developer mentoring.",
    homeDescription: "Product interfaces, frontend architecture and design systems for healthcare.",
  },
  {
    period: "2021",
    title: "Systems Developer",
    company: "IlATec",
    location: "Remote",
    description: "Maintenance and development of financial systems using Aurelia and .NET.",
    homeDescription: "Internal systems and product experiences across web platforms.",
  },
  {
    period: "2019–2022",
    title: "Full-stack Developer",
    company: "Mowah Tecnologia",
    location: "Itacoatiara",
    description: "Industry 4.0 dashboards built with React, Node and WebSockets.",
    homeDescription: "Frontend and backend work on digital products for growing teams.",
  },
];

export const education: Education[] = [
  {
    index: "EDU",
    title: "Federal University of Amazonas",
    organization: "Bachelor’s degree in Software Engineering",
    period: "2016–2021",
  },
  {
    index: "C01",
    title: "IgniteReactJS",
    organization: "Rocketseat",
    period: "Issued Jul 2023",
    dateTime: "2023-07",
    credential: "1c34e258-a18c-433c-b063-017d5dd0ec3f",
    description:
      "TypeScript · Next.js · React · React Native · Node.js · GraphQL · REST APIs · Testing · Clean Architecture",
  },
  {
    index: "C02",
    title: "Scrum Foundation Professional Certificate",
    organization: "CertiProf",
    period: "Issued Jun 2020",
    dateTime: "2020-06",
    credential: "FLCLCBBCDD-SSHJLFGJ-WHKBNBWDDB",
  },
];
