import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Experience from "@/sections/Experience";
import Projects from "@/sections/Projects";
import Leadership from "@/sections/Leadership";
import Skills from "@/sections/Skills";
import Contact from "@/sections/Contact";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <main>
      <Helmet>
        <title>Muhammad Dzaky Haidar — AI Engineer & Cybersecurity</title>
        <meta name="description" content="Portfolio of Muhammad Dzaky Haidar, AI Engineer and Cybersecurity Analyst. Projects, experience, leadership, and contact." />
        <link rel="canonical" href="/" />
      </Helmet>

      <Hero />
      <About />
      <Experience />
      <Projects />
      <Leadership />
      <Skills />
      <Contact />
    </main>
  );
};

export default Index;
