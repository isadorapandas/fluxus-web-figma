import { useEffect, useRef, useState } from "react";
import { motion, rgba } from "motion/react";

// ─── Design constants ────────────────────────────────────────────────────────
// Cores usadas em todo o site para texto, bordas e elementos decorativos.
const GOLD = "#c49a3c";
const GOLD_DIM = "rgba(196,154,60,0.18)";
const GOLD_MID = "rgba(196,154,60,0.45)";
const TEXT = "#e0d4bc";
const TEXT_DIM = "rgba(224,212,188,0.58)";
const TEXT_FAINT = "rgba(224,212,188,0.28)";
const BG = /* "#0c0a07";*/ "rgba(74, 0, 128, 0.18)"; // Slightly transparent background for depth effect

// ─── SVG helpers ─────────────────────────────────────────────────────────────
// Componentes React que desenham arte vetorial usada como fundo e elementos
// gráficos decorativos na página.

function RecursiveSquares({
  depth = 8,
  angleStep = 4.5,
}: {
  depth?: number;
  angleStep?: number;
}) {
  return (
    <svg viewBox="-200 -200 400 400" className="w-full h-full" aria-hidden="true">
      {Array.from({ length: depth }, (_, i) => {
        const scale = Math.pow(0.75, i);
        const size = 380 * scale;
        const rot = i * angleStep;
        const op = 0.06 + i * (0.55 / depth);
        return (
          <rect
            key={i}
            x={-size / 2}
            y={-size / 2}
            width={size}
            height={size}
            fill="none"
            stroke={GOLD}
            strokeWidth={0.9}
            opacity={op}
            transform={`rotate(${rot})`}
          />
        );
      })}
      {/* Desenha linhas de conexão em espiral entre os cantos dos quadrados.
          Esses elementos reforçam o estilo geométrico e o efeito de profundidade. */}
      {Array.from({ length: depth - 1 }, (_, i) => {
        const s0 = Math.pow(0.75, i) * 190;
        const s1 = Math.pow(0.75, i + 1) * 190;
        const r0 = (i * angleStep * Math.PI) / 180;
        const r1 = ((i + 1) * angleStep * Math.PI) / 180;
        return (
          <line
            key={`c${i}`}
            x1={s0 * Math.cos(r0 - Math.PI / 4)}
            y1={s0 * Math.sin(r0 - Math.PI / 4)}
            x2={s1 * Math.cos(r1 - Math.PI / 4)}
            y2={s1 * Math.sin(r1 - Math.PI / 4)}
            stroke={GOLD}
            strokeWidth="0.4"
            opacity="0.22"
          />
        );
      })}
    </svg>
  );
}

// MedalSvg renders the golden medal graphic used in the Award section.
function MedalSvg() {
  const rays = Array.from({ length: 20 }, (_, i) => {
    const angle = (i * 18 * Math.PI) / 180;
    return { x1: 90 + 66 * Math.cos(angle), y1: 90 + 66 * Math.sin(angle), x2: 90 + 80 * Math.cos(angle), y2: 90 + 80 * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 180 180" aria-hidden="true" className="w-28 h-28">
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={GOLD} strokeWidth="0.8" opacity="0.35" />
      ))}
      <circle cx="90" cy="90" r="62" fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.2" />
      <circle cx="90" cy="90" r="56" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.55" />
      <circle cx="90" cy="90" r="46" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.18" />
      <text
        x="90"
        y="80"
        textAnchor="middle"
        fill={GOLD}
        fontSize="30"
        fontWeight="bold"
        fontFamily="'Playfair Display', Georgia, serif"
        opacity="0.95"
      >
        II
      </text>
      <text
        x="90"
        y="106"
        textAnchor="middle"
        fill={GOLD}
        fontSize="8"
        letterSpacing="3"
        fontFamily="'JetBrains Mono', monospace"
        opacity="0.5"
      >
        PLACE
      </text>
    </svg>
  );
}

// ─── Grid background ─────────────────────────────────────────────────────────

function GridBg() {
  // This fixed <div> draws the subtle grid background covering the entire viewport.
  // It is purely decorative and does not interfere with pointer events.
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        backgroundImage:
          "linear-gradient(rgba(196,154,60,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(196,154,60,0.045) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
  );
}

// ─── Section divider ─────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  // Divider renders a horizontal section title bar with gradient lines on each side.
  // Use it before each major page section to keep the layout consistent.
  return (
    <div className="flex items-center gap-6 mb-20">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD_MID})` }} />
      <span
        className="font-mono text-[10px] tracking-[0.5em] uppercase shrink-0"
        style={{ color: GOLD }}
      >
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD_MID})` }} />
    </div>
  );
}

// ─── Corner bracket ornament ─────────────────────────────────────────────────

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  // Corner renders a small decorative bracket in one of the four page corners.
  // It is used to create a subtle frame around the page content.
  const cls = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }[pos];
  return (
    <div
      className={`absolute w-8 h-8 pointer-events-none ${cls}`}
      style={{ borderColor: GOLD_MID }}
    />
  );
}

// ─── Navigation bar and scroll state ─────────────────────────────────────────
// NAV_LINKS defines the page sections available in the main navigation menu.
const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Development" },
  { href: "#award", label: "Marble World Jam" },
  { href: "#team", label: "Team" },
];

function Nav({ active }: { active: string }) {
  // `scrolled` controls the nav background and border when the page scrolls.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Add a scroll listener to update the navigation style after scrolling down.
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(12,10,7,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${GOLD_DIM}` : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Site brand link that scrolls the page to the home section */}
        <a
          href="#home"
          className="font-heading font-bold text-xl tracking-[0.4em] uppercase transition-colors duration-300 hover:opacity-80"
          style={{ color: GOLD }}
        >
          Fluxus
        </a>

        {/* Desktop navigation links for the main sections */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const id = href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={href}
                href={href}
                className="font-mono text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
                style={{ color: isActive ? GOLD : "rgba(224,212,188,0.5)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEXT)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive ? GOLD : "rgba(224,212,188,0.5)")
                }
              >
                {label}
              </a>
            );
          })}
        </div>

        {/* Primary call-to-action button linking to the playable demo */}
        <a
          href="https://visgraf.github.io/fluxus/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 transition-all duration-300"
          style={{ border: `1px solid ${GOLD_MID}`, color: GOLD }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = GOLD;
            e.currentTarget.style.color = "#2d034c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = GOLD;
          }}
        >
          Play Now →
        </a>
      </div>
    </nav>
  );
}

// ─── Hero section with animated background visuals ─────────────────────────
function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Large rotating decorative geometry placed on the right side */}
      <motion.div
        className="absolute right-[-8%] top-[50%] w-[58vw] max-w-[820px] aspect-square opacity-55"
        style={{ translateY: "-50%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      >
        <RecursiveSquares depth={9} angleStep={4} />
      </motion.div>

      {/* Smaller counter-rotating decorative geometry for depth */}
      <motion.div
        className="absolute right-[5%] top-[50%] w-[24vw] max-w-[360px] aspect-square opacity-20"
        style={{ translateY: "-50%" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <RecursiveSquares depth={5} angleStep={8} />
      </motion.div>

      {/* Four corner accent lines to frame the hero section visually */}
      <div className="absolute top-20 left-6 w-12 h-12" style={{ borderTop: `1px solid ${GOLD_MID}`, borderLeft: `1px solid ${GOLD_MID}` }} />
      <div className="absolute top-20 right-6 w-12 h-12" style={{ borderTop: `1px solid ${GOLD_MID}`, borderRight: `1px solid ${GOLD_MID}` }} />
      <div className="absolute bottom-10 left-6 w-12 h-12" style={{ borderBottom: `1px solid ${GOLD_MID}`, borderLeft: `1px solid ${GOLD_MID}` }} />
      <div className="absolute bottom-10 right-6 w-12 h-12" style={{ borderBottom: `1px solid ${GOLD_MID}`, borderRight: `1px solid ${GOLD_MID}` }} />

      {/* Main hero content block centered on the page */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-20 w-full">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Gaming slogan  above the title */}
          <p
            className="font-mono text-[17px] tracking-[0.5em] uppercase mb-7"
            style={{ color: GOLD }}
          >
            ENTER THE IMPOSSIBLE.
          </p>

          {/* Main title of the webpage */}
          <h1
            className="font-heading font-black tracking-tight leading-[0.86] mb-9"
            style={{
              fontSize: "clamp(5.5rem, 15vw, 13rem)",
              color: TEXT,
              textShadow: `0 0 120px rgba(196,154,60,0.12)`,
            }}
          >
            FLUXUS
          </h1>

          {/* Subtitle with competition recognition */}
          <p
            className="font-mono text-[10px] tracking-[0.5em] uppercase mb-7"
            style={{ color: GOLD }}
          >
            Marble World Jam · 2nd place
          </p>

          {/* Paragraph describing the project theme and inspiration */}
          <p
            className="font-body text-xl leading-[1.7] mb-10 max-w-md"
            style={{ color: TEXT_DIM }}
          >
            Explore recursive worlds, impossible portals, and non-Euclidean spaces where every threshold rewrites the rules of space.
            Geometry becomes narrative. Space becomes puzzle.
            An immersive 3D puzzle-adventure inspired by M.&nbsp;C.&nbsp;Escher {" "}
            <em style={{ color: "rgba(196,154,60,0.85)", fontStyle: "italic" }}>Print Gallery</em>{" "}
            — where impossible worlds become fully navigable.
            {/*Um puzzle-aventura 3D imersivo inspirado na{" "}
            <em style={{ color: "rgba(196,154,60,0.85)", fontStyle: "italic" }}>Galeria de Gravuras</em>{" "}
            de M.&nbsp;C.&nbsp;Escher — onde mundos impossíveis se tornam
            completamente navegáveis. */} 
          </p>

          {/* Hero call-to-action buttons: play now and scroll down */}
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://visgraf.github.io/fluxus/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-mono text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-300"
              style={{ background: GOLD, color: BG }}
              onMouseEnter={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = GOLD;
              }}
              onMouseLeave={(e) => {
              e.currentTarget.style.background = GOLD;
              e.currentTarget.style.color = "#2d034c";
              }}
            >
              PLAY NOW <span aria-hidden>→</span>
            </a>
            <a
              href="https://www.youtube.com/watch?v=V5vRlMJPbjc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-mono text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-300"
              style={{ border: `1px solid ${GOLD_MID}`, color: GOLD }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = GOLD;
                e.currentTarget.style.color = "#2d034c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = GOLD;
              }}
            >
              WATCH TRAILER <span aria-hidden>→</span>
            </a>
            <a
              href="#about"
              className="font-mono text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
              style={{ color: TEXT_FAINT }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = GOLD;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = TEXT_FAINT;
              }}
            >
              Explorar ↓
            </a>
          </div>
        </motion.div>
      </div>

      {/* Soft gradient fade at the bottom of the hero section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${BG}, transparent)` }}
      />
    </section>
  );
}

// ─── About section content and math concept cards ───────────────────────────
const MATH_CONCEPTS = [
  { label: "Geometria de Möbius", desc: "Base matemática do universo do jogo" },
  { label: "Esfera de Riemann", desc: "Fundamento topológico dos espaços" },
  { label: "Distorções Conformes", desc: "Preservam ângulos, distorcem espaço" },
  { label: "Auto-Similaridade Droste", desc: "Mundos que contêm a si mesmos" },
];

function About() {
  return (
    <section id="about" className="relative py-36">
      {/* About section wrapper with padding and layout constraints */}
      <div className="max-w-7xl mx-auto px-8">
        {/* Section title divider component */}
        <Divider label="About the game" />
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main about text with heading and descriptive paragraphs */}
            <h2
              className="font-heading font-bold leading-[0.9] mb-8"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)", color: TEXT }}
            >
              Mundos<br />Impossíveis
            </h2>
            <p className="font-body text-lg leading-[1.75] mb-6" style={{ color: TEXT_DIM }}>
              Inspirado pela <em style={{ color: "rgba(196,154,60,0.85)" }}>Galeria de Gravuras</em> de
              M. C. Escher — a obra que contém a si mesma — Fluxus transforma conceitos
              matemáticos em experiência navegável. Cada sala dobra sobre si mesma, cada
              portal revela uma versão alternativa do mesmo espaço.
            </p>
            <p className="font-body text-lg leading-[1.75] mb-10" style={{ color: TEXT_DIM }}>
              Construído sobre geometria de Möbius e a Esfera de Riemann, o jogo usa
              distorções conformes, inversões esféricas e mapeamentos logarítmicos não
              como ornamentos — mas como mecânicas de jogo fundamentais. A transformação
              matemática é a linguagem artística.
            </p>
            <div
              className="pl-6 py-1"
              style={{ borderLeft: `2px solid ${GOLD_MID}` }}
            >
              {/* Highlighted quote block inside the about section */}
              <p className="font-body text-base italic" style={{ color: "rgba(224,212,188,0.4)" }}>
                "O impossível, em Fluxus, não é uma limitação — é o caminho."
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Map math concept cards to the right-side panel */}
            {MATH_CONCEPTS.map(({ label, desc }) => (
              <div
                key={label}
                className="p-5 transition-all duration-400 group cursor-default"
                style={{ border: `1px solid ${GOLD_DIM}` }}
                onMouseEnter={(e) => (e.currentTarget.style.border = `1px solid ${GOLD_MID}`)}
                onMouseLeave={(e) => (e.currentTarget.style.border = `1px solid ${GOLD_DIM}`)}
              >
                <div
                  className="w-1.5 h-1.5 mb-3 transition-transform duration-300 group-hover:scale-125"
                  style={{ background: GOLD }}
                />
                <p
                  className="font-mono text-[10px] tracking-[0.15em] uppercase mb-1.5"
                  style={{ color: GOLD }}
                >
                  {label}
                </p>
                <p className="font-body text-sm" style={{ color: "rgba(224,212,188,0.42)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Features section cards describing gameplay mechanics ───────────────────
const FEATURES = [
  {
    icon: "◈",
    title: "Portais Impossíveis",
    desc: "Manipule portais que conectam espaços geometricamente incompatíveis. Cada portal é uma janela para uma versão alternativa do mesmo ambiente — em escala, orientação ou dimensão diferentes.",
  },
  {
    icon: "⟁",
    title: "Transmissores de Energia",
    desc: "Posicione transmissores para direcionar feixes de energia através de superfícies curvas e espaços dobrados. A trajetória revela a curvatura oculta do espaço ao redor.",
  },
  {
    icon: "⊙",
    title: "Ambientes 360°",
    desc: "Navegue por mundos completamente imersivos onde o horizonte se curva sobre si mesmo. Espaços que torcem, escalam e se reconectam através de transições recursivas.",
  },
  {
    icon: "∞",
    title: "Realidades Recursivas",
    desc: "Salas que se dobram em si mesmas, mundos dentro de mundos. Inspirados diretamente na Galeria de Gravuras — o jogo que contém o jogo que o contém.",
  },
];

function Features() {
  return (
    <section id="features" className="relative py-36">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section title and explanation for the mechanics section */}
        <Divider label="Development" />
        <h2
          className="font-heading font-bold leading-[0.9] text-center mb-16"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: TEXT }}
        >
          Como o Impossível<br />Torna-se Jogável
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-9 overflow-hidden transition-all duration-500 group"
              style={{ border: `1px solid ${GOLD_DIM}` }}
              onMouseEnter={(e) => (e.currentTarget.style.border = `1px solid ${GOLD_MID}`)}
              onMouseLeave={(e) => (e.currentTarget.style.border = `1px solid ${GOLD_DIM}`)}
            >
              {/* Subtle hover grid that appears when the card is hovered */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(196,154,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(196,154,60,0.03) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Icon representing the feature */}
              <span
                className="block text-5xl leading-none mb-6"
                style={{ color: GOLD, fontFamily: "serif" }}
              >
                {f.icon}
              </span>
              <h3
                className="font-heading font-bold text-2xl mb-4"
                style={{ color: TEXT }}
              >
                {f.title}
              </h3>
              <p className="font-body text-base leading-[1.7]" style={{ color: TEXT_DIM }}>
                {f.desc}
              </p>

              {/* Decorative accent in the bottom-right corner of each feature card */}
              <div
                className="absolute bottom-0 right-0 w-7 h-7 transition-colors duration-300"
                style={{
                  borderRight: `1px solid ${GOLD_DIM}`,
                  borderBottom: `1px solid ${GOLD_DIM}`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Award ────────────────────────────────────────────────────────────────────

function Award() {
  return (
    <section id="award" className="relative py-44 overflow-hidden">
      {/* Centered background recursive geometry — faint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
        <div className="w-[1000px] h-[1000px]">
          <RecursiveSquares depth={11} angleStep={2.5} />
        </div>
      </div>

      {/* Horizontal rule above */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD_MID}, transparent)` }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
        <Divider label="Recognition" />

        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.75 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <MedalSvg />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p
            className="font-mono text-[11px] tracking-[0.45em] uppercase mb-5"
            style={{ color: GOLD }}
          >
            Marble World Jam
          </p>
          <h2
            className="font-heading font-black leading-[0.88] mb-7"
            style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: TEXT }}
          >
            2nd Place
          </h2>
          <p
            className="font-body text-lg leading-[1.7] max-w-xl mx-auto"
            style={{ color: TEXT_DIM }}
          >
            Fluxus conquistou o segundo lugar na competição Marble World Jam,
            desenvolvido com Marble 1.1. Reconhecimento pela inovação na
            interseção entre matemática, arte generativa e design de jogos.
          </p>
          <br/>
          <a
              href="https://jam.worldlabs.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-mono text-sm tracking-[0.12em] uppercase px-8 py-4 transition-all duration-300"
              style={{ border: `1px solid ${GOLD_MID}`, color: GOLD }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = GOLD;
                e.currentTarget.style.color = "#2d034c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = GOLD;
              }}
            >
              Visit the Jam Museum <span aria-hidden>→</span>
            </a>

          <div className="flex items-center justify-center gap-6 mt-12">
            <div className="h-px w-20" style={{ background: GOLD_MID }} />
            <span style={{ color: GOLD, fontSize: "1.1rem" }}>◈</span>
            <div className="h-px w-20" style={{ background: GOLD_MID }} />
          </div>
        </motion.div>
      </div>

      {/* Horizontal rule below */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD_MID}, transparent)` }}
      />
    </section>
  );
}

// ─── Team section with project contributors ─────────────────────────────────
const TEAM = [
  { name: "Bernardo Dias", initials: "BD" },
  { name: "Enzo Ribeiro", initials: "ER" },
  { name: "Luis Zerkowski", initials: "LZ" },
  { name: "Luiz Velho", initials: "LV" },
  { name: "Rafael Romeiro", initials: "RR" },
];

function Team() {
  return (
    <section id="team" className="relative py-36">
      <div className="max-w-7xl mx-auto px-8">
        <Divider label="Equipe" />
        <h2
          className="font-heading font-bold leading-[0.9] text-center mb-16"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: TEXT }}
        >
          Os Criadores<br />do Impossível
        </h2>

        {/* Team cards created from the TEAM list */}
        <div className="flex flex-wrap justify-center gap-4">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="flex flex-col items-center text-center p-8 min-w-[176px] transition-all duration-300 group"
              style={{ border: `1px solid ${GOLD_DIM}` }}
              onMouseEnter={(e) => (e.currentTarget.style.border = `1px solid ${GOLD_MID}`)}
              onMouseLeave={(e) => (e.currentTarget.style.border = `1px solid ${GOLD_DIM}`)}
            >
              {/* Circular avatar with initials for each team member */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105"
                style={{ border: `1px solid ${GOLD_MID}` }}
              >
                <span className="font-mono text-xs" style={{ color: GOLD }}>
                  {member.initials}
                </span>
              </div>
              <p className="font-body text-[15px]" style={{ color: TEXT }}>
                {member.name}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer-style credit line inside the team section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div
            className="inline-flex items-center gap-6 px-10 py-4"
            style={{ border: `1px solid rgba(196,154,60,0.07)` }}
          >
            <div className="h-px w-5" style={{ background: GOLD_MID }} />
            <p
              className="font-mono text-[9px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(224,212,188,0.28)" }}
            >
              VISGRAF · Laboratório de Computação Gráfica
            </p>
            <div className="h-px w-5" style={{ background: GOLD_MID }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer section with external links and copyright notice ──────────────
function Footer() {
  return (
    <footer
      className="relative py-12"
      style={{ borderTop: `1px solid rgba(196,154,60,0.1)` }}
    >
      {/* Footer container with brand label, useful links, and copyright text */}
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p
            className="font-heading font-bold text-base tracking-[0.38em] uppercase mb-1"
            style={{ color: GOLD }}
          >
            Fluxus
          </p>
          <p
            className="font-mono text-[9px] tracking-[0.28em] uppercase"
            style={{ color: "rgba(224,212,188,0.22)" }}
          >
            Mathematics · Geometry · World Models · Magic · Puzzle
          </p>
        </div>

        {/* Footer link list rendered from a hard-coded array */}
        <div className="flex items-center gap-8">
          {[
            { href: "https://visgraf.github.io/fluxus/", label: "PLAY NOW →" },
            /*{ href: "https://visgraf.github.io/worlds360/fluxus-1/", label: "Projeto →" },*/
            { href: "https://www.visgraf.impa.br/home/index.php", label: "Visgraf LAB →" },
            { href: "https://www.visgraf.impa.br/home/index.php", label: "Worlds 360 →" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-300"
              style={{ color: "rgba(224,212,188,0.38)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(224,212,188,0.38)")}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Copyright text at the bottom of the page */}
        <p
          className="font-mono text-[9px] tracking-[0.12em] uppercase"
          style={{ color: /*"rgba(224,212,188,0.16)" */ GOLD_DIM }}
        >
          © 2026 VISGRAF
        </p>
      </div>
    </footer>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  // `active` tracks which section is currently visible on the screen.
  // This value is passed to <Nav /> so the nav link for the visible section can be highlighted.
  const [active, setActive] = useState("home");

  useEffect(() => {
    // Observe each section by its `id` to detect when it enters the viewport.
    const ids = ["home", "about", "features", "award", "team"];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { threshold: 0.3 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    // Disconnect the observer when the component unmounts.
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: BG, color: TEXT, minHeight: "100vh", overflowX: "hidden" }}>
      {/* Background grid layer behind all content */}
      <GridBg />
      {/* Sticky top navigation bar */}
      <Nav active={active} />
      {/* Main content sections of the page */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Features />
        <Award />
        <Team />
      </main>
      {/* Footer shown at the end of the page */}
      <Footer />
    </div>
  );
}
