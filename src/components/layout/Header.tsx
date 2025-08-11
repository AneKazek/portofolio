import { cn } from "@/lib/utils";
import { useWindowScroll } from "@uidotdev/usehooks";
import MagneticButton from "../MagneticButton";

const navLinks = [
  { href: "#projects", label: "Work" },
  { href: "#skills", label: "Services" },
  { href: "#contact", label: "Start a Project" },
];

export default function Header() {
  const [{ y }] = useWindowScroll();
  const isScrolled = y && y > 40;

  return (
    <header
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        isScrolled ? "opacity-100" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
    >
      <nav className="flex items-center gap-1 rounded-lg border bg-card/40 p-1 backdrop-blur-md">
        {navLinks.map((link) => (
          <MagneticButton key={link.href} href={link.href}>
            {link.label}
          </MagneticButton>
        ))}
      </nav>
    </header>
  );
}