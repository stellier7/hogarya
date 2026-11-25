type LogoProps = {
  tone?: "forest" | "ivory";
  variant?: "horizontal" | "vertical" | "mark";
  className?: string;
};

/**
 * Provisional architectural mark. Replace the paths, or this whole component,
 * when the official Hogar Ya SVG is added to the repository.
 */
export function Mark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M8 54V22h18v32" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M22 54V10h32v44" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 30h46" fill="none" stroke="#B89562" strokeWidth="1.6" />
      <path d="M36 36h10v10H36z" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Logo({ tone = "forest", variant = "horizontal", className = "" }: LogoProps) {
  const color = tone === "ivory" ? "text-ivory" : "text-forest";
  if (variant === "mark") {
    return (
      <span className={`inline-flex ${color} ${className}`}>
        <Mark />
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-3 ${color} ${variant === "vertical" ? "flex-col text-center" : ""} ${className}`}>
      <Mark className="h-11 w-11 shrink-0" />
      <span className="grid gap-1">
        <span className="display text-[1.35rem] leading-none tracking-[0.18em]">HOGAR YA</span>
        <span className="text-[0.62rem] uppercase tracking-[0.22em] opacity-75">Bienes raíces · Honduras</span>
      </span>
    </span>
  );
}
