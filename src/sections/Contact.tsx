import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReveal } from "@/hooks/use-reveal";
import { Github, Linkedin } from "lucide-react";

export default function Contact() {
  const { containerRef } = useReveal();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const message = String(form.get("message") || "");
    const subject = encodeURIComponent(`Portfolio Inquiry — ${name}`);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    window.location.href = `mailto:mdzaky@example.com?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="container py-24" ref={containerRef as any}>
      <h2 className="text-3xl md:text-4xl font-semibold mb-6" data-reveal>Let’s build the future. Together.</h2>
      <form className="max-w-2xl grid grid-cols-1 gap-4" onSubmit={handleSubmit} data-reveal>
        <Input name="name" placeholder="Your name" aria-label="Your name" required />
        <Input type="email" name="email" placeholder="Your email" aria-label="Your email" required />
        <Textarea name="message" rows={5} placeholder="Tell me about your project" aria-label="Project details" required />
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">Contact Me</Button>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <Linkedin className="size-5" />
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="size-5" />
          </a>
        </div>
      </form>
    </section>
  );
}
