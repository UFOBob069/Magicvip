// Deterministic "floating lights" layer for the hero.
// - Two size tiers for depth (foreground dust + soft bokeh)
// - Seeded layout so SSR and client markup match
// - Extremely subtle: opacity peaks around 0.75, blurred bokeh stays under 0.2

const dust = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 53 + 11) % 100,
  top: (i * 37 + 23) % 100,
  size: 1 + ((i * 7) % 3),
  delay: (i % 12) * 0.7,
  duration: 10 + (i % 7),
}));

const bokeh = Array.from({ length: 6 }, (_, i) => ({
  left: (i * 181 + 40) % 100,
  top: (i * 73 + 15) % 100,
  size: 180 + (i % 4) * 60,
  tint: ["#e6c068", "#8aa6ff", "#f2a58a", "#e6c068", "#b8c6ff", "#f2d2a1"][i],
  delay: i * 1.8,
  duration: 22 + (i % 4) * 3,
}));

export function HeroParticles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Soft bokeh — blurred warm lights, mid-depth. */}
      {bokeh.map((p, i) => (
        <span
          key={`b${i}`}
          className="mvm-drift absolute block rounded-full blur-3xl"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.tint,
            opacity: 0.08,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Foreground dust — pin-prick lights gently floating up. */}
      {dust.map((p, i) => (
        <span
          key={`d${i}`}
          className="mvm-float absolute block rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: 0.35,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: "0 0 6px rgba(255,255,255,0.6)",
          }}
        />
      ))}
    </div>
  );
}
