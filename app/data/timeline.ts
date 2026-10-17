export type TimelineItem = {
  when: string;
  org: string;
  role: string;
  category: "Leadership" | "AI & Data Science" | "Software & Web" | "Awards";
  desc: string;
  tags: string[];
};

// Source: public/cv (latest CV). Focused on AI, Data Science, Software Engineering & Tech Leadership.
export const timeline: TimelineItem[] = [
  {
    when: "2022 – 2024",
    org: "SMAN 1 Mlati",
    role: "Head of Computer Club",
    category: "Leadership",
    desc: "Led 50+ members, coordinating tech programs, computer literacy workshops, and school-wide IT initiatives.",
    tags: ["Leadership", "Community", "IT Foundation"],
  },
  {
    when: "Jan 2024 – Jan 2025",
    org: "FORES — Sleman Rohis Forum",
    role: "General Chair & Strategic Lead",
    category: "Leadership",
    desc: "Spearheaded youth organizations across Sleman, working closely with local stakeholders, managing communications and large-scale event operations.",
    tags: ["Executive", "Public Relations", "Management"],
  },
  {
    when: "Jun 2025 – Jul 2025",
    org: "Ministry of Religious Affairs DIY",
    role: "Secretary & Keynote Speaker",
    category: "Leadership",
    desc: "Managed formal communications and 180+ administrative documents for 180+ regional institutions, serving as core keynote speaker.",
    tags: ["Public Speaking", "Governance", "Administration"],
  },
  {
    when: "Sep 2025 – Present",
    org: "Institut Teknologi Sepuluh Nopember (ITS)",
    role: "B.Eng. in Artificial Intelligence Engineering",
    category: "AI & Data Science",
    desc: "Deepening theoretical and applied machine learning, neural architectures, computer vision, data science workflows, and mathematical foundations.",
    tags: ["Deep Learning", "Python", "Data Science", "Algorithms"],
  },
  {
    when: "Oct 2025 – Nov 2025",
    org: "Schematics NLC 2025",
    role: "Data Systems & Quarter-Final Analytics",
    category: "AI & Data Science",
    desc: "Operated real-time competition data feeds and high-velocity score tracking for 100+ national competitive teams.",
    tags: ["Data Pipelines", "Realtime Analytics", "Fast-Paced"],
  },
  {
    when: "Nov 2025 – Present",
    org: "Avalon AI Community",
    role: "Data Science & ML Practitioner",
    category: "AI & Data Science",
    desc: "Active participation in applied machine learning benchmarks and processing enterprise-scale datasets (100K+ rows) with exploratory data analytics.",
    tags: ["Machine Learning", "Big Data", "Predictive Modeling", "Pandas"],
  },
  {
    when: "May 2026 – Present",
    org: "Schematics 2026",
    role: "Problem Setter & Technical Lead",
    category: "Software & Web",
    desc: "Authoring and verifying computational challenges and technical problems for 500+ national contenders across 5 competitive tracks.",
    tags: ["Problem Solving", "Architecture", "System Verification"],
  },
  {
    when: "2025 – 2026",
    org: "National Competitions",
    role: "Competition Track Record",
    category: "Awards",
    desc: "2nd Place Data Analytics (DAC IFEST UNPAD) · 2nd Place Data Mining (UNY) · 3rd Place Hackathon (DINACOM) · 3rd Place Web Dev (UINIC) · Finalist USK Big Data.",
    tags: ["Data Analytics", "Data Mining", "Hackathon Winner"],
  },
];
