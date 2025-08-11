import { Badge } from "@/components/ui/badge";
import { useReveal } from "@/hooks/use-reveal";

const items = [
  {
    title: "Honorary Council, Provincial Student Forum (Forum Rohis DIY)",
    highlights:
      "Provided strategic advice, assisted in policy-making, and mentored branches at the provincial level.",
    skills: ["Strategic Planning", "Policy Making", "Mentorship"],
  },
  {
    title: "Active Member of Tech & Cyber Communities",
    highlights:
      "Shared technical knowledge, managed web content, and contributed to software development in Jogja Cyber Security, Meta4Sec, and Saka Kominfo.",
    skills: ["Community Engagement", "Knowledge Sharing", "Content Management"],
  },
  {
    title: "Leadership at Rohis SMA Negeri 1 Mlati",
    highlights:
      "Acting President, Head of Mosque Committee, Event Chairman; led teams and executed a major event end-to-end.",
    skills: ["Project Management", "Team Leadership", "Event Management"],
  },
  {
    title: "Research & Academic Leadership",
    highlights:
      "Head of Research and Innovation Division, Class President, Head of Computer Club; led 4 tech-based innovations for a school program.",
    skills: ["Innovation Leadership", "R&D", "Public Speaking"],
  },
];

export default function Leadership() {
  const { containerRef } = useReveal();
  return (
    <section id="leadership" className="container py-24" ref={containerRef as any}>
      <h2 className="text-3xl md:text-4xl font-semibold mb-8" data-reveal>Organizational & Leadership</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4" data-reveal>
        {items.map((it, i) => (
          <article key={i} className="rounded-xl border bg-card/50 p-6 backdrop-blur-md hover-scale">
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.highlights}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {it.skills.map((s) => (
                <Badge key={s} variant="outline">{s}</Badge>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
