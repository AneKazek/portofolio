"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// ==========================================
// MINIMALIST GRAPH DATA & TYPES
// ==========================================
type NodeCategory = "identity" | "ai" | "security" | "systems" | "leadership" | "awards";

interface GraphNode {
  id: string;
  label: string;
  category: NodeCategory;
  radius: number;
  x: number; // 0 to 1
  y: number; // 0 to 1
  desc: string;
  stats?: string;
  isHub?: boolean;
}

interface GraphLink {
  source: string;
  target: string;
}

const CATEGORY_META: Record<NodeCategory, { label: string }> = {
  identity: { label: "Core Identity" },
  ai: { label: "AI & Data Science" },
  security: { label: "Cybersecurity & PenTest" },
  systems: { label: "Systems & Hardware" },
  leadership: { label: "Tech Leadership" },
  awards: { label: "Competitions & Podiums" },
};

// Safe distribution within x: [0.13, 0.87], y: [0.15, 0.78] so nothing is clipped
const INITIAL_NODES: GraphNode[] = [
  // Core Center
  { id: "dzaky", label: "Dzaky Haidar", category: "identity", radius: 18, x: 0.50, y: 0.44, isHub: true, desc: "AI Engineer, Penetration Tester & Systems Builder at ITS Surabaya.", stats: "Identity Hub" },

  // Major Clusters
  { id: "hub_ai", label: "AI & ML Core", category: "ai", radius: 13, x: 0.28, y: 0.28, isHub: true, desc: "Applied deep learning, neural computer vision & end-to-end data pipelines.", stats: "10+ Frameworks" },
  { id: "hub_sec", label: "Cybersecurity", category: "security", radius: 13, x: 0.72, y: 0.28, isHub: true, desc: "Penetration testing, vulnerability research, and security audits.", stats: "Practical PenTest" },
  { id: "hub_sys", label: "Systems & IoT", category: "systems", radius: 13, x: 0.26, y: 0.62, isHub: true, desc: "Low-level C/C++, Arduino prototyping & modern high-performance web engineering.", stats: "20+ Projects" },
  { id: "hub_lead", label: "Leadership", category: "leadership", radius: 13, x: 0.74, y: 0.62, isHub: true, desc: "Strategic executive lead, youth forums, and keynote speaker.", stats: "180+ Regional Inst." },
  { id: "hub_awards", label: "Podiums & Awards", category: "awards", radius: 13, x: 0.50, y: 0.70, isHub: true, desc: "National hackathon, data analytics & data mining champion record.", stats: "5+ National Awards" },

  // AI & Data Nodes (Extended)
  { id: "its_ai", label: "ITS AI Eng (B.Eng)", category: "ai", radius: 8, x: 0.15, y: 0.18, desc: "Pursuing Bachelor in Artificial Intelligence Engineering at ITS Surabaya.", stats: "Sep 2025 – Present" },
  { id: "pytorch", label: "PyTorch & DL", category: "ai", radius: 7.5, x: 0.35, y: 0.16, desc: "Neural architectures, model training, loss functions & computer vision.", stats: "Core Framework" },
  { id: "opencv", label: "Computer Vision / OpenCV", category: "ai", radius: 7, x: 0.25, y: 0.14, desc: "Real-time edge detection, spatial feature extraction, image augmentation.", stats: "Image Processing" },
  { id: "scikit", label: "Scikit / Pandas", category: "ai", radius: 7.5, x: 0.18, y: 0.36, desc: "Predictive analytics, feature engineering, and exploratory data analysis.", stats: "100K+ Data Points" },
  { id: "nlp", label: "NLP & LLM Systems", category: "ai", radius: 7, x: 0.38, y: 0.34, desc: "Transformers, contextual retrieval (RAG), and agentic embeddings.", stats: "Generative AI" },
  { id: "schem_nlc", label: "Schematics NLC Data", category: "ai", radius: 7, x: 0.12, y: 0.28, desc: "Real-time competition data streams and score tracking for 100+ national teams.", stats: "Oct 2025" },
  { id: "avalon", label: "Avalon Community", category: "ai", radius: 6.5, x: 0.32, y: 0.40, desc: "Collaborative machine learning benchmarks & enterprise data processing.", stats: "Active Member" },
  { id: "math", label: "Linear Algebra & Prob", category: "ai", radius: 6.5, x: 0.22, y: 0.22, desc: "Mathematical optimizations, matrix decomposition, loss convergence.", stats: "Foundations" },

  // Security Nodes (Extended)
  { id: "pentest", label: "Penetration Testing", category: "security", radius: 9, x: 0.85, y: 0.18, desc: "Practical red-team testing, web vulnerabilities (OWASP Top 10), and privilege escalation.", stats: "Hands-on Experience" },
  { id: "burp", label: "Burp Suite & Proxies", category: "security", radius: 7.5, x: 0.65, y: 0.16, desc: "Automated & manual web application security testing and request interception.", stats: "Security Tooling" },
  { id: "owasp", label: "OWASP Top 10", category: "security", radius: 7, x: 0.76, y: 0.14, desc: "Mitigation of SQLi, SSRF, XSS, broken access control & IDORs.", stats: "Web App Security" },
  { id: "netsec", label: "Network Security", category: "security", radius: 7.5, x: 0.88, y: 0.30, desc: "Packet analysis, protocol security, firewall rules, and traffic auditing.", stats: "Network Auditing" },
  { id: "wireshark", label: "Wireshark & Nmap", category: "security", radius: 6.5, x: 0.80, y: 0.22, desc: "Active packet sniffing, port scanning, and perimeter attack surface discovery.", stats: "Recon & Forensics" },
  { id: "ctf", label: "CTF Challenges", category: "security", radius: 7, x: 0.70, y: 0.38, desc: "Hands-on reverse engineering, cryptography, web exploitation & forensics.", stats: "Competitive CTF" },
  { id: "exploit", label: "Binary & Crypto", category: "security", radius: 6.5, x: 0.64, y: 0.32, desc: "Low-level memory exploitation concepts, hashing, and cipher attacks.", stats: "Security Science" },

  // Systems & Hardware Nodes (Extended)
  { id: "arduino", label: "Arduino & Microcontrollers", category: "systems", radius: 8, x: 0.14, y: 0.52, desc: "Started in junior high school building hardware IoT systems and microcontroller circuits.", stats: "Origin: 2020" },
  { id: "iot_sensors", label: "IoT Sensors & SPI/I2C", category: "systems", radius: 6.5, x: 0.12, y: 0.62, desc: "Hardware bus protocols, telemetry sensing, serial communication.", stats: "Hardware Layer" },
  { id: "cpp", label: "C / C++ Systems", category: "systems", radius: 7.5, x: 0.18, y: 0.70, desc: "Memory-conscious computational algorithms, low-level architecture, problem solving.", stats: "Core Foundation" },
  { id: "nextjs", label: "Next.js 15 & React 19", category: "systems", radius: 8, x: 0.36, y: 0.64, desc: "Modern fullstack architecture, responsive UI, micro-animations & state sync.", stats: "Web Architecture" },
  { id: "docker", label: "Docker & Linux", category: "systems", radius: 7, x: 0.16, y: 0.64, desc: "Containerized environments, Linux kernel hardening, script automation.", stats: "DevOps / Infra" },
  { id: "postgres", label: "PostgreSQL & Convex", category: "systems", radius: 6.5, x: 0.28, y: 0.72, desc: "Reactive cloud databases, relational indexing, and real-time websockets.", stats: "Data Persistence" },
  { id: "typescript", label: "TypeScript Ecosystem", category: "systems", radius: 6.5, x: 0.38, y: 0.56, desc: "Type-safe engineering across browser, worker runtimes, and APIs.", stats: "Fullstack" },

  // Leadership Nodes (Extended)
  { id: "fores", label: "FORES Sleman Chair", category: "leadership", radius: 8.5, x: 0.86, y: 0.54, desc: "General Chair & Strategic Lead directing youth organizations and massive event logistics.", stats: "Jan 2024 – Jan 2025" },
  { id: "sman1", label: "Head of Computer Club", category: "leadership", radius: 7.5, x: 0.85, y: 0.68, desc: "Led 50+ members at SMAN 1 Mlati in tech literacy and coding workshops.", stats: "2022 – 2024" },
  { id: "kemenag", label: "Ministry of Rel. Affairs", category: "leadership", radius: 7.5, x: 0.72, y: 0.72, desc: "Managed communication for 180+ institutions; keynote speaker on leadership.", stats: "Jun 2025" },
  { id: "events", label: "Large Event Operations", category: "leadership", radius: 6.5, x: 0.88, y: 0.62, desc: "Coordinated budgets, cross-functional teams, and regional sponsorships.", stats: "1000+ Attendees" },
  { id: "speaking", label: "Public Speaking & Talks", category: "leadership", radius: 6.5, x: 0.78, y: 0.54, desc: "Youth empowerment speaker and technology workshop presenter.", stats: "Multiple Keynotes" },

  // Awards Nodes (Extended)
  { id: "unpad", label: "2nd Data Analytics UNPAD", category: "awards", radius: 7.5, x: 0.40, y: 0.68, desc: "National 2nd Place Data Analytics Competition (DAC IFEST UNPAD).", stats: "National Podium" },
  { id: "uny", label: "2nd Data Mining UNY", category: "awards", radius: 7.5, x: 0.60, y: 0.68, desc: "2nd Place Data Mining National Competition at UNY.", stats: "National Podium" },
  { id: "dinacom", label: "3rd Place Hackathon", category: "awards", radius: 7.5, x: 0.50, y: 0.58, desc: "3rd Place National Hackathon DINACOM building fullstack solutions.", stats: "National Podium" },
  { id: "uinic", label: "3rd Place Web Dev UINIC", category: "awards", radius: 7, x: 0.44, y: 0.74, desc: "3rd Place Web Development Competition UINIC 2025.", stats: "National Podium" },
  { id: "usk", label: "Finalist USK Big Data", category: "awards", radius: 6.5, x: 0.56, y: 0.74, desc: "National finalist in USK Big Data Analytics 2025.", stats: "Finalist" },
  { id: "schem_setter", label: "Problem Setter Schematics", category: "awards", radius: 7, x: 0.50, y: 0.64, desc: "Technical Problem Setter and Jury for national computer science competition.", stats: "National Committee" },
];

const INITIAL_LINKS: GraphLink[] = [
  // Core Identity Connections
  { source: "dzaky", target: "hub_ai" },
  { source: "dzaky", target: "hub_sec" },
  { source: "dzaky", target: "hub_sys" },
  { source: "dzaky", target: "hub_lead" },
  { source: "dzaky", target: "hub_awards" },

  // AI & Data Mesh
  { source: "hub_ai", target: "its_ai" },
  { source: "hub_ai", target: "pytorch" },
  { source: "hub_ai", target: "opencv" },
  { source: "hub_ai", target: "scikit" },
  { source: "hub_ai", target: "nlp" },
  { source: "hub_ai", target: "schem_nlc" },
  { source: "hub_ai", target: "avalon" },
  { source: "hub_ai", target: "math" },
  { source: "its_ai", target: "pytorch" },
  { source: "its_ai", target: "math" },
  { source: "pytorch", target: "opencv" },
  { source: "pytorch", target: "nlp" },
  { source: "schem_nlc", target: "scikit" },
  { source: "avalon", target: "scikit" },

  // Security Mesh
  { source: "hub_sec", target: "pentest" },
  { source: "hub_sec", target: "burp" },
  { source: "hub_sec", target: "owasp" },
  { source: "hub_sec", target: "netsec" },
  { source: "hub_sec", target: "wireshark" },
  { source: "hub_sec", target: "ctf" },
  { source: "hub_sec", target: "exploit" },
  { source: "pentest", target: "burp" },
  { source: "pentest", target: "owasp" },
  { source: "netsec", target: "wireshark" },
  { source: "ctf", target: "exploit" },
  { source: "pentest", target: "netsec" },

  // Systems & Hardware Mesh
  { source: "hub_sys", target: "arduino" },
  { source: "hub_sys", target: "iot_sensors" },
  { source: "hub_sys", target: "cpp" },
  { source: "hub_sys", target: "nextjs" },
  { source: "hub_sys", target: "docker" },
  { source: "hub_sys", target: "postgres" },
  { source: "hub_sys", target: "typescript" },
  { source: "arduino", target: "iot_sensors" },
  { source: "arduino", target: "cpp" },
  { source: "nextjs", target: "typescript" },
  { source: "nextjs", target: "postgres" },
  { source: "docker", target: "cpp" },

  // Leadership Mesh
  { source: "hub_lead", target: "fores" },
  { source: "hub_lead", target: "sman1" },
  { source: "hub_lead", target: "kemenag" },
  { source: "hub_lead", target: "events" },
  { source: "hub_lead", target: "speaking" },
  { source: "fores", target: "events" },
  { source: "kemenag", target: "speaking" },
  { source: "sman1", target: "speaking" },

  // Awards Mesh
  { source: "hub_awards", target: "unpad" },
  { source: "hub_awards", target: "uny" },
  { source: "hub_awards", target: "dinacom" },
  { source: "hub_awards", target: "uinic" },
  { source: "hub_awards", target: "usk" },
  { source: "hub_awards", target: "schem_setter" },
  { source: "unpad", target: "scikit" },
  { source: "uny", target: "scikit" },
  { source: "dinacom", target: "nextjs" },
  { source: "uinic", target: "nextjs" },
  { source: "schem_setter", target: "schem_nlc" },

  // Cross-Domain Bridges (Multi-disciplinary Synapses)
  { source: "hub_sec", target: "docker" },
  { source: "hub_ai", target: "cpp" },
  { source: "dzaky", target: "arduino" },
  { source: "dzaky", target: "fores" },
  { source: "dzaky", target: "pentest" },
  { source: "nlp", target: "nextjs" },
  { source: "netsec", target: "docker" },
];

interface Packet {
  sourceId: string;
  targetId: string;
  progress: number;
  speed: number;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  type?: "bio" | "tech" | "education" | "security" | "leadership" | "awards" | "cv" | "general";
}

const FREQUENT_QUESTIONS = [
  { id: "who_am_i", label: "Who am I?", query: "Who am I?" },
  { id: "tech_stack", label: "Tech Stack & Superpowers", query: "What is your tech stack and technical superpowers?" },
  { id: "its_ai", label: "ITS & AI Engineering", query: "Tell me about your studies at ITS AI Engineering." },
  { id: "security", label: "Cybersecurity & PenTest", query: "What is your background in penetration testing?" },
  { id: "leadership", label: "Leadership Highlights", query: "What leadership roles have you held?" },
  { id: "awards", label: "Competition Podiums", query: "What competitions have you won?" },
  { id: "download_cv", label: "Download CV", query: "Where can I download your resume / CV?" },
];

export default function About() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeOffsets = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Filter & Selected Node State
  const [selectedCategory, setSelectedCategory] = useState<NodeCategory | "all">("all");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // Chatbot State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Greetings. I am Dzaky's Neural Identity Agent. Explore the interactive Knowledge Graph on the left, or select any prompt below to review my background, AI research, and security engineering.",
      timestamp: "Just now",
      type: "general",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll chat container to bottom strictly without triggering window scroll
  useEffect(() => {
    const el = chatBottomRef.current?.parentElement;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Handle answering question
  const handleQuery = useCallback((query: string, typeHint?: string) => {
    const qLower = query.toLowerCase();

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse: ChatMessage;

      if (typeHint === "who_am_i" || (!typeHint && (qLower.includes("who am i") || qLower.includes("siapa") || qLower.includes("perkenalan")))) {
        botResponse = {
          id: "b_" + Date.now(),
          sender: "bot",
          type: "bio",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "Here is the summary of my journey and background:",
        };
      } else if (typeHint === "tech_stack" || qLower.includes("tech") || qLower.includes("stack") || qLower.includes("skill") || qLower.includes("python") || qLower.includes("framework")) {
        botResponse = {
          id: "b_" + Date.now(),
          sender: "bot",
          type: "tech",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "Core technical capabilities across AI/ML, Cybersecurity, and Software Systems:",
        };
      } else if (typeHint === "its_ai" || qLower.includes("its") || qLower.includes("kuliah") || qLower.includes("academic") || qLower.includes("curriculum") || qLower.includes("laboratory")) {
        botResponse = {
          id: "b_" + Date.now(),
          sender: "bot",
          type: "education",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "Academic focus & Laboratory involvement at ITS Surabaya:",
        };
      } else if (typeHint === "security" || qLower.includes("security") || qLower.includes("cyber") || qLower.includes("pentest") || qLower.includes("hack")) {
        botResponse = {
          id: "b_" + Date.now(),
          sender: "bot",
          type: "security",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "I bring hands-on experience as a Penetration Tester, conducting web app security evaluations (OWASP Top 10), vulnerability assessments, and CTF challenges. I embed a strict security-first mindset into every system I build.",
        };
      } else if (typeHint === "leadership" || qLower.includes("lead") || qLower.includes("organisasi") || qLower.includes("fores") || qLower.includes("kemenag")) {
        botResponse = {
          id: "b_" + Date.now(),
          sender: "bot",
          type: "leadership",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "Executive leadership track record:\n• General Chair & Strategic Lead at FORES (Sleman Rohis Forum) managing youth organizations and large operations.\n• Keynote Speaker & Secretary for Ministry of Religious Affairs DIY coordinating 180+ regional institutions.\n• Head of Computer Club at SMAN 1 Mlati driving IT literacy for 50+ members.",
        };
      } else if (typeHint === "awards" || qLower.includes("award") || qLower.includes("juara") || qLower.includes("lomba") || qLower.includes("competition")) {
        botResponse = {
          id: "b_" + Date.now(),
          sender: "bot",
          type: "awards",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "National competition track record:\n• 2nd Place Data Analytics — DAC IFEST UNPAD (2025)\n• 2nd Place Data Mining — UNY National Competition (2025)\n• 3rd Place Hackathon — DINACOM (2026)\n• 3rd Place Web Dev — UINIC (2025)\n• Finalist USK Big Data (2025)\n• Technical Lead & Problem Setter — Schematics 2026",
        };
      } else if (typeHint === "download_cv" || qLower.includes("cv") || qLower.includes("resume") || qLower.includes("download")) {
        botResponse = {
          id: "b_" + Date.now(),
          sender: "bot",
          type: "cv",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "You can download my verified technical CV directly below:",
        };
      } else {
        botResponse = {
          id: "b_" + Date.now(),
          sender: "bot",
          type: "general",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Query acknowledged for "${query}". You can select any node in the Knowledge Graph to inspect it, or ask about "Who am I?", "Tech Stack", "Cybersecurity", or "Download CV".`,
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 380);
  }, []);

  // ==========================================
  // MINIMALIST GRAPH CANVAS RENDERER
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const parent = canvas.parentElement;
    let width = (canvas.width = parent ? parent.clientWidth : 600);
    let height = (canvas.height = parent ? parent.clientHeight : 600);

    // Precise ResizeObserver so canvas buffer never stretches or warps
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          width = canvas.width = Math.round(w);
          height = canvas.height = Math.round(h);
        }
      }
    });

    if (parent) {
      resizeObserver.observe(parent);
    }

    // Initial white/silver data packets traveling along edges
    const packets: Packet[] = [];
    const PACKET_COUNT = 20;
    for (let i = 0; i < PACKET_COUNT; i++) {
      const link = INITIAL_LINKS[Math.floor(Math.random() * INITIAL_LINKS.length)];
      packets.push({
        sourceId: link.source,
        targetId: link.target,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Subtle minimalist grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Precompute screen positions with gentle micro-breathing & user dragging offsets
      const nodeMap = new Map<string, { x: number; y: number; node: GraphNode }>();
      INITIAL_NODES.forEach((n, idx) => {
        const floatX = Math.sin(time + idx * 0.7) * 2;
        const floatY = Math.cos(time + idx * 0.9) * 2;
        const offset = nodeOffsets.current.get(n.id) || { x: 0, y: 0 };
        const sx = n.x * width + floatX + offset.x;
        const sy = n.y * height + floatY + offset.y;
        nodeMap.set(n.id, { x: sx, y: sy, node: n });
      });

      // 1. Draw Links (Minimalist clean lines)
      INITIAL_LINKS.forEach((link) => {
        const s = nodeMap.get(link.source);
        const t = nodeMap.get(link.target);
        if (!s || !t) return;

        const isRelated =
          hoveredNode &&
          (hoveredNode.id === s.node.id || hoveredNode.id === t.node.id);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);

        if (isRelated) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
          ctx.lineWidth = 1.8;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 6;
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 2. Kaspersky Cybermap Style: White/Silver Light Packets
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          const newLink = INITIAL_LINKS[Math.floor(Math.random() * INITIAL_LINKS.length)];
          p.sourceId = newLink.source;
          p.targetId = newLink.target;
        }

        const s = nodeMap.get(p.sourceId);
        const t = nodeMap.get(p.targetId);
        if (!s || !t) return;

        const px = s.x + (t.x - s.x) * p.progress;
        const py = s.y + (t.y - s.y) * p.progress;

        // Packet head
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Subtle packet trail
        const trailLen = 0.07;
        const trailX = px - (t.x - s.x) * trailLen;
        const trailY = py - (t.y - s.y) * trailLen;
        const grad = ctx.createLinearGradient(trailX, trailY, px, py);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0.7)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.restore();
      });

      // 3. Monochromatic Radar Pulses from Hubs
      nodeMap.forEach(({ x, y, node }) => {
        if (node.isHub) {
          const pulse = (time * 1.3 + (node.id === "dzaky" ? 0 : 2)) % 3;
          const r = node.radius + pulse * 12;
          const alpha = Math.max(0, 1 - pulse / 3) * 0.35;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      // 4. Draw Nodes (Minimalist Grayscale)
      nodeMap.forEach(({ x, y, node }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;
        const isDimmed =
          selectedCategory !== "all" && node.category !== selectedCategory;

        ctx.save();
        if (isDimmed) ctx.globalAlpha = 0.2;

        // Outer ring glow
        if (isHovered || isSelected || node.id === "dzaky") {
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = isHovered || isSelected ? 18 : 12;
        }

        // Outer ring border
        ctx.strokeStyle = isHovered || isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = isHovered || isSelected ? 2 : node.isHub ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(x, y, node.radius + (isHovered ? 2.5 : 0), 0, Math.PI * 2);
        ctx.stroke();

        // Node Body Gradient (Clean Charcoal to Jet Black)
        const grad = ctx.createRadialGradient(x, y, 1, x, y, node.radius);
        grad.addColorStop(0, isHovered || isSelected ? "#52525b" : "#27272a");
        grad.addColorStop(0.7, "#18181b");
        grad.addColorStop(1, "#09090b");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner white/gray core dot
        ctx.fillStyle = isHovered || isSelected || node.id === "dzaky" ? "#ffffff" : "#a1a1aa";
        ctx.beginPath();
        ctx.arc(x, y, node.isHub ? 3 : 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Text Label
        ctx.shadowBlur = 0;
        ctx.fillStyle = isHovered || isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.65)";
        ctx.font = `${node.isHub ? "600 10.5px" : "400 9px"} monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.label, x, y + node.radius + 4);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Interactive Dragging and Hover Mechanics
    let isDragging = false;
    let draggedNodeId: string | null = null;
    let dragStartPos = { x: 0, y: 0 };
    let hasMoved = false;

    const getNodeAt = (mx: number, my: number): GraphNode | null => {
      for (const node of INITIAL_NODES) {
        const offset = nodeOffsets.current.get(node.id) || { x: 0, y: 0 };
        const sx = node.x * width + offset.x;
        const sy = node.y * height + offset.y;
        const dist = Math.hypot(mx - sx, my - sy);
        if (dist <= node.radius + 9) {
          return node;
        }
      }
      return null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const target = getNodeAt(mx, my);
      if (target) {
        isDragging = true;
        draggedNodeId = target.id;
        dragStartPos = { x: mx, y: my };
        hasMoved = false;
        canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (isDragging && draggedNodeId) {
        const dx = mx - dragStartPos.x;
        const dy = my - dragStartPos.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
        
        const curr = nodeOffsets.current.get(draggedNodeId) || { x: 0, y: 0 };
        nodeOffsets.current.set(draggedNodeId, {
          x: curr.x + dx,
          y: curr.y + dy,
        });
        dragStartPos = { x: mx, y: my };
        return;
      }

      const found = getNodeAt(mx, my);
      setHoveredNode(found);
      canvas.style.cursor = found ? "grab" : "default";
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && !hasMoved && draggedNodeId) {
        const clickedNode = INITIAL_NODES.find((n) => n.id === draggedNodeId);
        if (clickedNode) setSelectedNode(clickedNode);
      } else if (!isDragging && !hasMoved) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const target = getNodeAt(mx, my);
        setSelectedNode(target);
      }
      isDragging = false;
      draggedNodeId = null;
      canvas.style.cursor = hoveredNode ? "grab" : "default";
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedCategory, hoveredNode, selectedNode]);

  return (
    <section
      id="about"
      className="relative w-full snap-start h-screen max-h-screen overflow-hidden bg-black text-white flex flex-col justify-between"
    >
      {/* Target anchor for Timeline's scroll button */}
      <span id="next" className="absolute top-0 left-0" />

      {/* Subtle minimalist background matrix */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-3 md:px-6 flex-1 flex flex-col justify-between h-full min-h-0 overflow-hidden">
        {/* Section Header: Uniform with Hero & Timeline */}
        <header className="mb-2 shrink-0 flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.08] pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.25em] text-[#ff2e63] uppercase">
                03 / Identity
              </span>
              <span className="text-[10px] text-white/30">•</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                Knowledge Graph &amp; Neural Agent
              </span>
            </div>
            <h2 className="mt-1 text-base font-light tracking-tight text-white/90 md:text-lg">
              Interactive <span className="font-semibold text-white">Identity Graph</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 font-mono text-[9.5px] text-white/40">
            <span>
              ENTITIES: <strong className="text-white/80 font-normal">39</strong>
            </span>
            <span>
              EDGES: <strong className="text-white/80 font-normal">58</strong>
            </span>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[8.5px] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff2e63] animate-pulse" />
              <span>LIVE MATRIX</span>
            </div>
          </div>
        </header>

        {/* Main 2-Column Grid: Left Graph & Right Chatbot with Matching Fixed Heights */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6 items-stretch flex-1 min-h-0 h-[calc(100vh-100px)] max-h-[720px]">
          {/* ======================================================== */}
          {/* LEFT COLUMN: KNOWLEDGE GRAPH VISUALIZATION */}
          {/* ======================================================== */}
          <div className="relative flex flex-col rounded-2xl border border-white/10 bg-[#07090e]/80 shadow-2xl backdrop-blur-xl lg:col-span-7 h-full min-h-0 overflow-hidden">
            {/* Graph Card Header */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#ff2e63]" />
                <h3 className="font-mono text-[10.5px] uppercase tracking-widest text-white/80">
                  Relationship Visualization
                </h3>
              </div>

              {/* Minimalist filter pills */}
              <div className="flex flex-wrap items-center gap-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-all ${
                    selectedCategory === "all"
                      ? "border border-white/30 bg-white text-black font-semibold"
                      : "border border-transparent bg-white/[0.04] text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  All
                </button>
                {(Object.keys(CATEGORY_META) as NodeCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-all ${
                      selectedCategory === cat
                        ? "border border-white/30 bg-white text-black font-semibold"
                        : "border border-transparent bg-white/[0.04] text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Canvas Graph */}
            <div
              ref={containerRef}
              className="relative flex-1 w-full min-h-0 overflow-hidden"
            >
              <canvas
                ref={canvasRef}
                className="h-full w-full"
                title="Click any node to inspect details"
              />

              {/* HUD corner markers */}
              <span className="pointer-events-none absolute left-3 top-3 font-mono text-[8.5px] text-white/30">
                ┌ MATRIX // DRAG &amp; CLICK NODES
              </span>
              <span className="pointer-events-none absolute right-3 top-3 font-mono text-[8.5px] text-white/30">
                PULSE: ACTIVE ┐
              </span>

              {/* Minimalist Node Details Popup */}
              {selectedNode && (
                <div className="absolute right-4 top-4 z-20 w-64 rounded-xl border border-white/25 bg-[#0f0f13]/95 p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white">
                        {CATEGORY_META[selectedNode.category].label}
                      </span>
                      <h4 className="mt-2 text-xs font-semibold text-white">
                        {selectedNode.label}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-white/40 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] font-light leading-relaxed text-white/70">
                    {selectedNode.desc}
                  </p>

                  {selectedNode.stats && (
                    <div className="mt-2.5 rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[9px] text-white/80">
                      METRIC: <strong className="text-white">{selectedNode.stats}</strong>
                    </div>
                  )}

                  <div className="mt-3">
                    <button
                      onClick={() => {
                        handleQuery(`Tell me more about ${selectedNode.label}`);
                      }}
                      className="w-full rounded border border-white/20 bg-white/10 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-black transition"
                    >
                      Ask Chatbot about this →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Entity Types Legend (Matches Mirofish layout, placed cleanly in card footer) */}
            <div className="shrink-0 border-t border-white/10 bg-[#060608] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                ENTITY TYPES:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {(Object.keys(CATEGORY_META) as NodeCategory[]).map((cat) => (
                  <div key={cat} className="flex items-center gap-1.5 font-mono text-[9px] text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                    <span>{cat.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: INTERACTIVE PERSONA CHATBOT */}
          {/* ======================================================== */}
          <div className="flex flex-col h-full min-h-0 rounded-2xl border border-white/10 bg-[#07090e]/80 shadow-2xl backdrop-blur-xl lg:col-span-5 overflow-hidden">
            {/* Chatbot Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                {/* Clean Upright Avatar */}
                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/20 bg-black">
                  <Image
                    src="/images/profile.jpg"
                    alt="Dzaky Haidar"
                    fill
                    sizes="28px"
                    className="object-cover object-top"
                  />
                  <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-[#ff2e63]" />
                </div>
                <div>
                  <h3 className="font-mono text-[11px] font-medium tracking-wide text-white">
                    Dzaky AI Agent
                  </h3>
                  <p className="font-mono text-[8.5px] text-white/40">
                    Neural Identity &amp; Persona
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-white/60">
                AGENT READY
              </div>
            </div>

            {/* Quick Frequent Question Buttons */}
            <div className="shrink-0 border-b border-white/[0.08] bg-white/[0.015] px-3 py-2">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-white/40">
                  SUGGESTED PROMPTS:
                </span>
                <span className="font-mono text-[8.5px] text-white/30">CLICK TO ASK</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {FREQUENT_QUESTIONS.map((fq) => (
                  <button
                    key={fq.id}
                    onClick={() => handleQuery(fq.query, fq.id)}
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[9px] text-white/70 transition-all hover:border-[#ff2e63]/50 hover:bg-white/10 hover:text-white"
                  >
                    {fq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 space-y-3 overflow-y-auto p-3.5 scrollbar-thin"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="mb-1 flex items-center gap-1.5 px-1 font-mono text-[8px] text-white/35">
                    <span>{m.sender === "user" ? "YOU" : "DZAKY_AI"}</span>
                    <span>•</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[92%] rounded-xl p-3 text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-white text-black font-normal shadow"
                        : "border border-white/10 bg-white/[0.03] text-white/80"
                    }`}
                  >
                    {m.text && <p className="whitespace-pre-line">{m.text}</p>}

                    {/* Rich Response: "Who am I" (Forced Upright Photo & Exact 3 Paragraphs) */}
                    {m.type === "bio" && (
                      <div className="mt-2.5 space-y-2.5 border-t border-white/[0.08] pt-2.5 text-white/80">
                        {/* Profile Photo Display - Upright & Creative Minimalist */}
                        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 p-2">
                          <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-white/15 bg-black">
                            <Image
                              src="/images/profile.jpg"
                              alt="Muhammad Dzaky Haidar"
                              fill
                              sizes="56px"
                              className="object-cover object-top"
                            />
                          </div>
                          <div>
                            <h4 className="font-mono text-[11px] font-semibold text-white">
                              Muhammad Dzaky Haidar
                            </h4>
                            <p className="font-mono text-[9px] text-white/60">
                              B.Eng in AI @ ITS Surabaya
                            </p>
                            <p className="mt-0.5 font-mono text-[8.5px] text-[#ff2e63]">
                              Penetration Tester &amp; Systems
                            </p>
                          </div>
                        </div>

                        {/* Exact 3 Paragraphs */}
                        <p className="text-[11px] leading-relaxed font-light text-white/70">
                          I began my journey in junior high school, experimenting with C++ and Arduino to build early hardware projects. That curiosity grew into a passion for creating impactful tech solutions that blend software and hardware.
                        </p>
                        <p className="text-[11px] leading-relaxed font-light text-white/70">
                          Today, I study Artificial Intelligence at Institut Teknologi Sepuluh Nopember (ITS) and apply security-first thinking from hands-on experience as a Penetration Tester. I love building systems that are intelligent, performant, and secure.
                        </p>
                        <p className="text-[11px] leading-relaxed font-light text-white/70">
                          Through leadership roles across organizations, I developed strong communication and project management skills. This combination of technical depth and leadership helps me deliver end-to-end results with clarity and impact.
                        </p>

                        {/* Action buttons inside chat */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a
                            href="/cv/CV.pdf"
                            download="CV.pdf"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white bg-white px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-black hover:bg-white/85 transition"
                          >
                            <span>Download CV</span>
                            <span>↓</span>
                          </a>
                          <button
                            onClick={() => handleQuery("What competitions have you won?")}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[9px] text-white/70 hover:bg-white/10 hover:text-white transition"
                          >
                            <span>Podium Record</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rich Response: Education / ITS AI Engineering */}
                    {m.type === "education" && (
                      <div className="mt-2.5 space-y-2 border-t border-white/[0.08] pt-2.5 text-white/80">
                        <div className="rounded-lg border border-white/10 bg-black/40 p-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#ff2e63]">
                              B.Eng. in Artificial Intelligence
                            </span>
                            <span className="font-mono text-[8.5px] text-white/40">
                              2025 – Present
                            </span>
                          </div>
                          <h5 className="mt-1 font-mono text-xs font-semibold text-white">
                            Institut Teknologi Sepuluh Nopember (ITS Surabaya)
                          </h5>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
                            Enrolled in the Department of Artificial Intelligence Engineering. Core coursework covers Advanced Deep Learning, Graph Neural Networks, Computer Vision, Mathematical Optimizations, and Distributed Computing.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {["Deep Learning", "Computer Vision", "Graph Neural Networks", "Python", "Mathematical Foundations"].map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[8.5px] text-white/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rich Response: Tech Stack */}
                    {m.type === "tech" && (
                      <div className="mt-2.5 space-y-2 border-t border-white/[0.08] pt-2 text-white/80">
                        <div className="rounded-lg border border-white/10 bg-black/40 p-2">
                          <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#ff2e63]">
                            AI &amp; Data Science:
                          </span>
                          <p className="mt-0.5 font-mono text-[9px] text-white/70">
                            Python, PyTorch, TensorFlow, Scikit-Learn, Pandas, OpenCV, EDA pipelines.
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/40 p-2">
                          <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#ff2e63]">
                            Cybersecurity &amp; PenTesting:
                          </span>
                          <p className="mt-0.5 font-mono text-[9px] text-white/70">
                            Burp Suite, Nmap, Wireshark, OWASP Top 10, Network Security, Exploit Analysis.
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/40 p-2">
                          <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#ff2e63]">
                            Systems, Hardware &amp; Web:
                          </span>
                          <p className="mt-0.5 font-mono text-[9px] text-white/70">
                            C / C++, Arduino IoT, Next.js 15, React 19, TypeScript, Docker, Linux, PostgreSQL.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Rich Response: CV Download Card */}
                    {m.type === "cv" && (
                      <div className="mt-2.5 rounded-lg border border-white/15 bg-black/40 p-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#ff2e63]">
                              PDF RESUME
                            </span>
                            <h5 className="font-mono text-[11px] font-medium text-white">
                              CV.pdf
                            </h5>
                            <p className="font-mono text-[8.5px] text-white/40">
                              Verified Technical Resume
                            </p>
                          </div>
                          <a
                            href="/cv/CV.pdf"
                            download="CV.pdf"
                            className="flex items-center gap-1 rounded-full bg-white px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-black hover:bg-white/85 transition"
                          >
                            <span>Download</span>
                            <span>↓</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/50 w-fit">
                  <span className="h-1 w-1 animate-bounce rounded-full bg-[#ff2e63]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:0.2s]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-white/40 [animation-delay:0.4s]" />
                  <span className="ml-1 font-mono text-[8.5px]">Dzaky AI is typing...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Text Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inputVal.trim()) return;
                handleQuery(inputVal.trim());
                setInputVal("");
              }}
              className="border-t border-white/[0.08] bg-black/30 p-2.5"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask a question about Dzaky..."
                  className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-xs text-white placeholder-white/30 outline-none transition focus:border-white/30 focus:bg-white/[0.07]"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black font-bold transition hover:bg-white/85 disabled:opacity-20"
                >
                  ↑
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
