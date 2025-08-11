import Hero from "@/sections/Hero";

const Index = () => {
  return (
    <main>
      <Hero />
      <section id="experience" className="container py-24">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">Experience</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {[1,2,3,4].map((i) => (
              <article key={i} className="min-w-[320px] p-6 rounded-xl border bg-card/50 backdrop-blur-md hover-scale">
                <h3 className="text-xl font-semibold">Role {i}</h3>
                <p className="text-sm text-muted-foreground">Highlights • Metrics • Impact</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="container py-24">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <article key={i} className="group relative rounded-xl border bg-card/50 p-4 backdrop-blur-md hover-scale">
              <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-teal/20 to-magenta/20" />
              <h3 className="mt-4 text-lg font-medium">Case Study {i}</h3>
              <p className="text-sm text-muted-foreground">AI • Security • Systems</p>
            </article>
          ))}
        </div>
      </section>

      <section id="leadership" className="container py-24">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">Leadership</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => (
            <article key={i} className="p-6 rounded-xl border bg-card/50 backdrop-blur-md">
              <h3 className="font-semibold">Organization {i}</h3>
              <p className="text-sm text-muted-foreground">Role • Years • Outcomes</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="container py-24">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">Let’s build the future. Together.</h2>
        <form className="max-w-2xl grid grid-cols-1 gap-4">
          <input className="w-full rounded-md bg-secondary/40 border p-3" placeholder="Your email" aria-label="Your email" />
          <textarea className="w-full rounded-md bg-secondary/40 border p-3" rows={5} placeholder="Tell me about your project" aria-label="Project details" />
          <div>
            <a href="mailto:mdzaky@example.com" className="sr-only">Email</a>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Index;
