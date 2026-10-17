const SI = (slug: string) => `https://cdn.simpleicons.org/${slug}`;
const DI = (path: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

// Simple Icons dropped Azure/AWS, so those two come from devicon; the mask only uses alpha so source colour is irrelevant.
const TECH: [name: string, src: string][] = [
  ["Python", SI("python")],
  ["C++", SI("cplusplus")],
  ["Go", SI("go")],
  ["JavaScript", SI("javascript")],
  ["TypeScript", SI("typescript")],
  ["Dart", SI("dart")],
  ["Rust", SI("rust")],
  ["Azure", DI("azure/azure-original.svg")],
  ["Cloudflare", SI("cloudflare")],
  ["Firebase", SI("firebase")],
  ["Vercel", SI("vercel")],
  ["AWS", DI("amazonwebservices/amazonwebservices-plain-wordmark.svg")],
  ["Google Cloud", SI("googlecloud")],
  ["Anaconda", SI("anaconda")],
  ["Express.js", SI("express")],
  ["Flutter", SI("flutter")],
  ["Next.js", SI("nextdotjs")],
  ["MongoDB", SI("mongodb")],
  ["PostgreSQL", SI("postgresql")],
  ["Redis", SI("redis")],
  ["Supabase", SI("supabase")],
  ["SQLite", SI("sqlite")],
  ["Keras", SI("keras")],
  ["NumPy", SI("numpy")],
  ["Pandas", SI("pandas")],
  ["Plotly", SI("plotly")],
  ["PyTorch", SI("pytorch")],
  ["scikit-learn", SI("scikitlearn")],
  ["TensorFlow", SI("tensorflow")],
];

export default function TechMarquee() {
  // list is doubled so translateX(-50%) loops seamlessly
  return (
    <div
      aria-label="Tech stack"
      className="relative mt-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]"
    >
      <div className="tech-marquee-track flex gap-12 py-2">
        {[...TECH, ...TECH].map(([name, src], i) => (
          <span
            key={i}
            role="img"
            aria-label={name}
            title={name}
            className="block h-8 w-8 shrink-0 bg-[#c0c0c0] opacity-90 transition hover:opacity-100 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
            style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
          />
        ))}
      </div>
    </div>
  );
}
