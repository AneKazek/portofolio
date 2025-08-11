import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray("[data-timeline-item]");
      items.forEach((item: any) => {
        gsap.from(item, {
          opacity: 0,
          y: 100,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "top 60%",
            scrub: 1,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="container py-24" ref={sectionRef}>
      <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
        Professional Experience
      </h2>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-border" />
        <div className="space-y-12">
          {roles.map((r, i) => {
            const isOdd = i % 2 !== 0;
            return (
              <article
                key={i}
                className="relative flex items-center"
                data-timeline-item
              >
                <div
                  className={`w-1/2 flex ${
                    isOdd ? "justify-start pl-8" : "justify-end pr-8"
                  }`}
                >
                  <div className={isOdd ? "text-left" : "text-right"}>
                    <div className="text-sm text-primary font-medium">
                      {r.date}
                    </div>
                    <h3 className="mt-1 text-xl font-semibold">{r.title}</h3>
                    <p className="text-sm text-muted-foreground">{r.company}</p>
                  </div>
                </div>
                <div
                  className={`w-1/2 ${
                    isOdd ? "order-first" : ""
                  } flex ${isOdd ? "justify-end pr-8" : "justify-start pl-8"}`}
                >
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {r.bullets.map((b, j) => (
                      <li key={j}>• {b}</li>
                    ))}
                  </ul>
                </div>
                {/* Dot on the timeline */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
