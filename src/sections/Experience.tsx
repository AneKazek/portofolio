import { useReveal } from "@/hooks/use-reveal";

const roles = [
  {
    title: "Penetration Tester",
    company: "HackerOne (Self-employed)",
    date: "Jan 2024 – Present",
    bullets: [
      "Identified and reported XSS, SQLi, and IDOR across web, API, and mobile.",
      "Authored high-quality reports with clear repro steps and remediation.",
      "Collaborated with global security teams for validation and fixes.",
    ],
  },
  {
    title: "System Administrator",
    company: "JustShop (Part-time)",
    date: "Jan 2023 – Oct 2023",
    bullets: [
      "Administered and maintained a 6-node hosting infrastructure.",
      "Mitigated DDoS attacks and hardened server configurations.",
      "Optimized performance and resource allocation for reliability.",
    ],
  },
];

export default function Experience() {
  const { containerRef } = useReveal();
  return (
    <section id="experience" className="container py-24" ref={containerRef as any}>
      <h2 className="text-3xl md:text-4xl font-semibold mb-8" data-reveal>Professional Experience</h2>
      <div className="relative" data-reveal>
        <div className="pointer-events-none absolute left-0 right-0 top-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="overflow-x-auto" role="region" aria-label="Experience timeline">
          <div className="flex gap-6 min-w-max pr-6 snap-x snap-mandatory">
            {roles.map((r, i) => (
              <article
                key={i}
                className="min-w-[320px] max-w-sm snap-start rounded-xl border bg-card/50 p-6 backdrop-blur-md hover-scale"
              >
                <div className="text-sm text-primary font-medium">{r.date}</div>
                <h3 className="mt-1 text-xl font-semibold">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.company}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {r.bullets.map((b, j) => (
                    <li key={j}>• {b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
