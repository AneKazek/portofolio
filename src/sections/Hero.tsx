import NeuronScene from "@/components/visuals/NeuronScene";
import HeroModel from "@/components/three/HeroModel";
import MagneticButton from "@/components/MagneticButton";
import { Helmet } from "react-helmet-async";

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-hero">
      <Helmet>
        <title>Muhammad Dzaky Haidar — AI Engineer, Cybersecurity, Tech Leader</title>
        <meta name="description" content="Cinematic, story-driven portfolio built for tech recruiters and founders." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Muhammad Dzaky Haidar',
            jobTitle: ['AI Engineer', 'Cybersecurity Analyst', 'Tech Leader'],
            url: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
          })}
        </script>
      </Helmet>
      <NeuronScene />
      <div className="container py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-enter">
            <span className="inline-block text-sm tracking-widest uppercase text-muted-foreground">Portfolio</span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Muhammad Dzaky Haidar
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              AI Engineer • Cybersecurity Analyst • Tech Leader
            </p>
            <p className="max-w-xl text-muted-foreground">
              I craft intelligent systems and secure infrastructures that scale. Performance-focused, security-first, built to ship.
            </p>
            <div className="flex items-center gap-4">
              <MagneticButton href="#contact">Let’s talk</MagneticButton>
              <a href="#projects" className="story-link text-sm">View projects</a>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-md">
            <HeroModel />
          </div>
        </div>
      </div>
      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <div className="h-8 w-5 rounded-full border border-border/70 flex items-start justify-center p-1">
          <span className="h-2 w-1 rounded-full bg-teal animate-fade-in" />
        </div>
      </div>
    </header>
  );
}
