import { Badge } from "@/components/ui/badge";
import { useReveal } from "@/hooks/use-reveal";

export default function About() {
  const { containerRef } = useReveal();
  return (
    <section id="about" className="container py-24" ref={containerRef as any}>
      <h2 className="text-3xl md:text-4xl font-semibold mb-8" data-reveal>About Me</h2>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-5" data-reveal>
          <p className="text-muted-foreground">
            I began my journey in junior high school, experimenting with C++ and Arduino to build
            early hardware projects. That curiosity grew into a passion for creating impactful tech
            solutions that blend software and hardware.
          </p>
          <p className="text-muted-foreground">
            Today, I study Artificial Intelligence at Institut Teknologi Sepuluh Nopember (ITS) and
            apply security-first thinking from hands-on experience as a Penetration Tester. I love
            building systems that are intelligent, performant, and secure.
          </p>
          <p className="text-muted-foreground">
            Through leadership roles across organizations, I developed strong communication and
            project management skills. This combination of technical depth and leadership helps me
            deliver end-to-end results with clarity and impact.
          </p>
        </div>
        <aside className="space-y-3" data-reveal data-reveal-delay="100">
          <div className="rounded-xl border bg-card/50 p-5 backdrop-blur-md">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">ITS AI Engineering Student</Badge>
              <Badge>Penetration Tester</Badge>
              <Badge variant="outline">Tech Leader</Badge>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
