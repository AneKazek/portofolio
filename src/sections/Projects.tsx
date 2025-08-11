import TiltCard from "@/components/motion/TiltCard";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useReveal } from "@/hooks/use-reveal";

const projects = [
  {
    title: "TaniMaju: AI-Powered Agricultural DSS",
    tags: ["Artificial Intelligence", "Decision Support System", "Web Platform"],
    description:
      "An AI-based Decision Support System for Indonesian agriculture that provides real-time, data-driven recommendations to address climate variability.",
  },
  {
    title: "IoT-Based Vehicle Starter with Face Recognition",
    tags: ["IoT", "Computer Vision", "Face Recognition", "Security"],
    description:
      "A vehicle security system replacing conventional keys with a smartphone-controlled face recognition system.",
  },
  {
    title: "Wireless Body Temperature Monitor for Android",
    tags: ["IoT", "Android Development", "Health-Tech", "Arduino"],
    description:
      "A remote body temperature monitoring solution that wirelessly sends data to an Android device, built as a safe alternative during the pandemic.",
  },
  {
    title: "Automatic Water Faucet with Ultrasonic Sensor",
    tags: ["IoT", "Arduino", "Smart Home", "Sustainability"],
    description:
      "An automatic faucet using an ultrasonic sensor to conserve water via touchless flow control.",
  },
  {
    title: "Automated Light Switch with Light Sensor",
    tags: ["IoT", "Arduino", "Smart Home", "Energy Saving"],
    description:
      "Automated lighting using a light sensor to reduce electricity waste based on ambient light levels.",
  },
];

export default function Projects() {
  const { containerRef } = useReveal();
  return (
    <section id="projects" className="container py-24" ref={containerRef as any}>
      <h2 className="text-3xl md:text-4xl font-semibold mb-8" data-reveal>Project Portfolio</h2>
      <div className="grid gap-6 md:grid-cols-3" data-reveal>
        {projects.map((p, i) => (
          <Dialog key={i}>
            <DialogTrigger asChild>
              <TiltCard
                className="group relative rounded-xl border bg-card/50 p-4 backdrop-blur-md hover-scale"
                intensity={8}
              >
                <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-teal/20 to-magenta/20" />
                <h3 className="mt-4 text-lg font-medium">{p.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              </TiltCard>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{p.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <p className="text-muted-foreground">{p.description}</p>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
