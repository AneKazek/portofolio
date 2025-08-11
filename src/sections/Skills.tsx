import { Badge } from "@/components/ui/badge";
import { useReveal } from "@/hooks/use-reveal";

export default function Skills() {
  const { containerRef } = useReveal();
  return (
    <section id="skills" className="container py-24" ref={containerRef as any}>
      <h2 className="text-3xl md:text-4xl font-semibold mb-8" data-reveal>Skills & Certifications</h2>

      <div className="grid gap-10 md:grid-cols-2" data-reveal>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-2">AI & Machine Learning</div>
              <div className="flex flex-wrap gap-2">
                {["Python","NLP","Azure AI Services","Computer Vision","Generative AI"].map((s)=> (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Cybersecurity</div>
              <div className="flex flex-wrap gap-2">
                {["Penetration Testing","OWASP Top 10","Vulnerability Management","Web Application Security"].map((s)=> (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Development</div>
              <div className="flex flex-wrap gap-2">
                {["Dart","Flutter","C++","Java","PHP","Arduino","Git","GitHub"].map((s)=> (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Certifications</h3>
          <div className="space-y-3">
            {[
              "Microsoft Applied Skills: Build a natural language processing solution with Azure AI Language",
              "Microsoft Certified: Azure AI Fundamentals",
              "Utilization of Artificial Intelligence (AI) for Learning Processes (MySertifikasi)",
            ].map((c) => (
              <div key={c} className="rounded-lg border bg-card/50 p-4 text-sm text-muted-foreground">
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
