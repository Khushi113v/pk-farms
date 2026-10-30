"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductBySlug } from "@/lib/product-data";

// "The journey of a single drop": it starts with the cow being fed and then milked by hand. One drop of that
// milk leaves the farmer's pail and glides down a winding trail as you scroll, its tip always pointing back
// along the trail. The background lives through a whole day while it travels (dawn, morning, night, the next
// dawn, golden ghee). Each step's drawing comes alive as the drop reaches it, the drop turns golden at the last
// step, sinks into the jar and the numbers count up. All motion is code (SVG + CSS). The first two drawings
// were traced from farm pictures into /images/process/grazing-art.svg and milking-art.svg, one group per moving part.

// Top of the lid in the jar photo (fraction of its box)
const JAR_LID = 0.05;
// The drop starts hanging from the milk pail: its tip just touches the pail's bottom (px below it)
const HANG = 23;
// The drop rides at this height of the screen while the page scrolls
const RIDE = 0.55;
// A step lights up once the drop reaches this far down it (0 = its top, 0.5 = its middle)
const LIGHT_AT = 0.18;

// Background through the day, one colour per stop: the milk pail (dawn), each step after it, then the jar
const SKY = ["#FCEDE1", "#FBF5E8", "#E9EDF6", "#FCEFE2", "#FBF6EA", "#FBEED5", "#FBEED5"];
const SKY_RGB = SKY.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));

// Drawing palette: before the drop arrives everything is a pale sketch, then it turns to ink with soft tints
const PALETTE_ON = {
  color: "#33402F",
  "--pk-paper": "#FFFDF8",
  "--pk-milk": "#FFFFFF",
  "--pk-tint": "#EEE5D1",
  "--pk-clay": "#EBCDB0",
  "--pk-wood": "#E3CDA6",
  "--pk-gold": "#DDA43C",
  "--pk-gold-soft": "#F3DDA6",
  "--pk-dark": "#3A4136",
  "--pk-flow": "#C3CCD1",
  // used by the traced cow drawings: pink udder and ears, grey horns and hooves, steel pail, and the open field
  // (light and dark grass, bushes, far hills, fence rails)
  "--pk-leaf": "#D8DDAF",
  "--pk-blush": "#F4D3C1",
  "--pk-ash": "#A7A69B",
  "--pk-steel": "#E4E7E5",
  "--pk-grass": "#87956A",
  "--pk-bush": "#C2C895",
  "--pk-hill": "#DCDCC2",
  "--pk-bark": "#9A8461",
} as React.CSSProperties;
const PALETTE_OFF = {
  color: "#CCC4AF",
  "--pk-paper": "#FCFAF4",
  "--pk-milk": "#FFFFFF",
  "--pk-tint": "#F0ECE1",
  "--pk-clay": "#EFEADF",
  "--pk-wood": "#EFEADF",
  "--pk-gold": "#E8E2D2",
  "--pk-gold-soft": "#F1EDE2",
  "--pk-dark": "#E2DCCC",
  "--pk-flow": "#E6E1D4",
  "--pk-leaf": "#ECEADF",
  "--pk-blush": "#F1EDE2",
  "--pk-ash": "#E2DCCC",
  "--pk-steel": "#F0EEE8",
  "--pk-grass": "#DCD9C8",
  "--pk-bush": "#E8E6D8",
  "--pk-hill": "#EFEDE3",
  "--pk-bark": "#DED7C6",
} as React.CSSProperties;

type Step = {
  time: string;
  title: string;
  text: string;
  Art: () => JSX.Element;
  // Bottom of the milk pail in this step's drawing (fractions of it): the drop starts here
  pail?: { x: number; y: number };
};

const STEPS: Step[] = [
  {
    time: "4:30 AM",
    title: "Fed on fresh green fodder",
    text: "Before sunrise our desi cows are fed fresh green fodder, dry straw and a little grain. A calm, well-fed cow gives rich, wholesome milk.",
    Art: CowGrazing,
  },
  {
    time: "5:00 AM",
    title: "Milked by hand at dawn",
    text: "At first light our desi cows are milked by hand, slowly and calmly. Warm, fresh A2 milk goes straight into a clean steel pail.",
    Art: CowMilking,
    pail: { x: 0.4226, y: 0.955 },
  },
  {
    time: "7:00 AM",
    title: "Boiled on a clay chulha",
    text: "The milk simmers gently on a wood-fed clay chulha until it froths, then cools down slowly in the open air.",
    Art: PotOnChulha,
  },
  {
    time: "Overnight",
    title: "Set into curd",
    text: "A spoon of yesterday's curd is stirred in. The clay matka keeps it just right while it sets thick through the night.",
    Art: MatkaOvernight,
  },
  {
    time: "Next dawn",
    title: "Churned with a wooden bilona",
    text: "The bilona spins one way, then the other, as the rope is pulled by hand. Little by little, soft makkhan floats up.",
    Art: BilonaChurn,
  },
  {
    time: "Same morning",
    title: "Fresh white makkhan",
    text: "The makkhan is scooped out by hand. The chhaas left behind is enjoyed on the farm, so not a drop is wasted.",
    Art: MakkhanBowl,
  },
  {
    time: "2 to 3 slow hours",
    title: "Slow-cooked to golden ghee",
    text: "On the lowest flame in a heavy iron kadhai, the makkhan turns clear and golden and fills the kitchen with its aroma. Then it is strained into glass jars.",
    Art: KadhaiGhee,
  },
];
// The step the drop starts from (milking). The steps before it are shown lit from the start.
const START = Math.max(0, STEPS.findIndex((s) => s.pail));

export default function GheeProcessSection() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const jarRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLSpanElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const artRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reached, setReached] = useState(START);
  const [landed, setLanded] = useState(false);
  const [landedOnce, setLandedOnce] = useState(false);
  const ghee = getProductBySlug("pure-desi-cow-ghee");

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const clip = clipRef.current;
    const drop = dropRef.current;
    const gold = goldRef.current;
    if (!root || !svg || !path || !clip || !drop || !gold) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pts: { x: number; y: number }[] = [];
    let stops: number[] = []; // heights of: the milk pail, each step after it, the jar
    let startY = 0;
    let endY = 0;
    let stepYs: number[] = []; // middle of each step
    let lightYs: number[] = []; // where each step lights up
    let cur = NaN;
    let raf = 0;
    let lastT = 0;
    let shownStep = -2;
    let shownLanded = false;

    // x of the trail at a given height (the trail only ever runs downwards)
    const xAt = (y: number) => {
      const n = pts.length;
      if (!n) return 0;
      if (y <= pts[0].y) return pts[0].x;
      if (y >= pts[n - 1].y) return pts[n - 1].x;
      let lo = 0;
      let hi = n - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (pts[mid].y < y) lo = mid;
        else hi = mid;
      }
      const a = pts[lo];
      const b = pts[hi];
      return a.x + (b.x - a.x) * ((y - a.y) / (b.y - a.y || 1));
    };

    // The trail: from the pail, down past the steps, into the jar
    const layout = () => {
      const sr = root.getBoundingClientRect();
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
      };
      const W = Math.round(sr.width);
      const H = Math.round(sr.height);
      svg.setAttribute("width", String(W));
      svg.setAttribute("height", String(H));
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      clip.setAttribute("width", String(W));

      const line = box(lineRef.current!);
      const lx = line.x + line.w / 2;
      const track = box(trackRef.current!);
      const t0 = track.y;
      const t1 = track.y + track.h;
      // The trail starts at the bottom of the milk pail in the milking drawing, and the drop hangs from it.
      // (Measured on the picture's column, which is never scaled, so the start is exact.)
      const pail = STEPS[START].pail ?? { x: 0.5, y: 1 };
      const art = artRefs.current[START];
      const pic = art ? box(art) : { x: lx, y: t0, w: 0, h: 0 };
      const sx = pic.x + pic.w * pail.x;
      const sy = pic.y + pic.h * pail.y;
      const jar = box(jarRef.current!);
      const jx = jar.x + jar.w / 2;
      const jy = jar.y + jar.h * JAR_LID;
      const steps = stepRefs.current.map((li) => (li ? box(li) : { x: 0, y: t0, w: 0, h: 0 }));
      stepYs = steps.map((b) => b.y + b.h / 2);
      lightYs = steps.map((b) => b.y + b.h * LIGHT_AT);

      // Straight down while the drop hangs from the pail, then one smooth curve across to the line, straight down
      // past the rest of the steps and into the jar. The curve is as long and gentle as it can be while it still
      // passes clear of the next step's picture and text, on every screen size.
      const hangEnd = sy + HANG;
      const xOnCurve = (len: number, y: number) => {
        // The curve leaves and meets the line vertically: find how far along it is at height y, then its x
        const u = Math.min(1, Math.max(0, (y - hangEnd) / len));
        let t = u;
        for (let k = 0; k < 8; k++) {
          const f = 1.5 * t - 1.5 * t * t + t * t * t - u;
          t = Math.min(1, Math.max(0, t - f / (1.5 - 3 * t + 3 * t * t || 1)));
        }
        return sx + (lx - sx) * (3 * t * t - 2 * t * t * t);
      };
      const next = stepRefs.current[START + 1];
      const blocks = next ? Array.from(next.children, (el) => box(el)) : [];
      let bend = 160;
      while (bend > 70 && blocks.some((b) => Math.abs(xOnCurve(bend, b.y - 6) - (b.x + b.w / 2)) < b.w / 2 + 12)) bend -= 5;
      const way = [
        { x: sx, y: sy },
        { x: sx, y: hangEnd },
        { x: lx, y: hangEnd + bend },
        { x: lx, y: t1 },
        { x: jx, y: jy },
      ];
      let d = `M${way[0].x} ${way[0].y}`;
      for (let i = 1; i < way.length; i++) {
        const a = way[i - 1];
        const b = way[i];
        const k = (b.y - a.y) * 0.5;
        d += `C${a.x} ${a.y + k} ${b.x} ${b.y - k} ${b.x} ${b.y}`;
      }
      path.setAttribute("d", d);

      const total = path.getTotalLength();
      pts = [];
      for (let l = 0; l < total; l += 3) {
        const p = path.getPointAtLength(l);
        pts.push({ x: p.x, y: p.y });
      }
      const end = path.getPointAtLength(total);
      pts.push({ x: end.x, y: end.y });
      startY = hangEnd;
      endY = jy;
      stops = [startY, ...stepYs.slice(START + 1), jy];
    };

    // Where the drop should be for the current scroll position
    const targetY = () => Math.min(endY, Math.max(startY, window.innerHeight * RIDE - root.getBoundingClientRect().top));

    const draw = (y: number, gap: number) => {
      // Reveal the trail only behind the drop
      clip.setAttribute("height", String(Math.max(0, y - 8)));
      // Tip points back along the trail; the drop stretches a little while it moves
      const x = xAt(y);
      // (measured from the trail just behind the drop, so it hangs straight under the pail at the start)
      const angle = (Math.atan2(-(xAt(y) - xAt(y - 12)), 12) * 180) / Math.PI;
      const s = reduce ? 1 : 1 + Math.min(0.22, gap / 300);
      // Sinks into the jar at the very end
      const sink = Math.min(1, Math.max(0, (endY - y) / 30));
      drop.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -68%) rotate(${angle.toFixed(1)}deg) scale(${(1 / Math.sqrt(s)).toFixed(3)}, ${s.toFixed(3)})`;
      drop.style.opacity = sink.toFixed(3);

      // Time of day: blend the background between the stops either side of the drop
      let i = 0;
      while (i < stops.length - 2 && y >= stops[i + 1]) i++;
      const t = Math.min(1, Math.max(0, (y - stops[i]) / (stops[i + 1] - stops[i] || 1)));
      const a = SKY_RGB[i];
      const b = SKY_RGB[i + 1];
      root.style.backgroundColor = `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(",")})`;
      // Milk turns into golden ghee between the last two steps
      const g0 = lightYs[lightYs.length - 2] ?? endY;
      const g1 = lightYs[lightYs.length - 1] ?? endY;
      gold.style.opacity = Math.min(1, Math.max(0, (y - g0) / (g1 - g0 || 1))).toFixed(3);

      let n = -1;
      lightYs.forEach((ly, k) => {
        if (y >= ly) n = k;
      });
      if (n !== shownStep) {
        shownStep = n;
        setReached(n);
      }
      const isLanded = y >= endY - 1;
      if (isLanded !== shownLanded) {
        shownLanded = isLanded;
        setLanded(isLanded);
        if (isLanded) setLandedOnce(true);
      }
    };

    // Ease the drop towards its target every frame, so wheel jumps become a smooth glide
    const tick = (time: number) => {
      raf = 0;
      const dt = lastT ? Math.min(64, time - lastT) : 16.7;
      lastT = time;
      const target = targetY();
      if (Number.isNaN(cur) || reduce) cur = target;
      else cur += (target - cur) * (1 - Math.pow(0.9, dt / 16.7));
      if (Math.abs(target - cur) < 0.3) cur = target;
      draw(cur, Math.abs(target - cur));
      if (cur !== target) raf = requestAnimationFrame(tick);
      else lastT = 0;
    };

    const kick = () => {
      const r = root.getBoundingClientRect();
      // Pause the drawings' animations while the section is off screen
      root.classList.toggle("pkp-live", r.bottom > 0 && r.top < window.innerHeight);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const relayout = () => {
      layout();
      kick();
    };

    layout();
    cur = targetY();
    draw(cur, 0);
    kick();

    const ro = new ResizeObserver(relayout);
    ro.observe(root);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", relayout);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", relayout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={rootRef} className="pkp-root relative py-12 md:py-20 overflow-hidden" style={{ backgroundColor: SKY[0] }}>
      <style>{CSS}</style>

      {/* Dotted trail: only the part behind the drop is visible (drawn above the drawings, so it starts right at the pail) */}
      <svg ref={svgRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-[15]" fill="none">
        <defs>
          <clipPath id="pkp-trail-clip">
            <rect ref={clipRef} x="0" y="0" width="0" height="0" />
          </clipPath>
        </defs>
        <path
          ref={pathRef}
          clipPath="url(#pkp-trail-clip)"
          stroke="#AFA488"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeDasharray="0 9"
        />
      </svg>

      {/* The drop: its tip points back along the trail */}
      <div
        ref={dropRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform [filter:drop-shadow(0_4px_4px_rgba(31,45,36,0.22))]"
        style={{ transform: "translate3d(-200px, -200px, 0)", transformOrigin: "50% 68%" }}
      >
        <span className="relative block">
          <Drop />
          <span ref={goldRef} className="absolute inset-0" style={{ opacity: 0 }}>
            <Drop gold />
          </span>
        </span>
      </div>

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">Farm to jar · the bilona way</p>
          <h2 className="mt-2 font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[50px] leading-[1.08]">
            The journey of a <span className="italic text-brand-funk">single drop</span>
          </h2>
          <p className="mt-3 text-brand-ink/70 text-sm md:text-[17px] leading-relaxed">
            From a fresh morning&apos;s milk to golden ghee, it takes a full day, a night and many caring hands. Scroll to follow it.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Steps */}
        <div ref={trackRef} className="relative mt-8 md:mt-12">
          {/* Marks where the trail runs: left on phones, centre on desktop */}
          <span ref={lineRef} aria-hidden className="absolute top-0 left-[17px] sm:left-[21px] md:left-1/2 w-px h-px" />

          <ol>
            {STEPS.map((s, i) => {
              const on = i <= reached;
              const even = i % 2 === 0;
              return (
                <li
                  key={s.title}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className={`pkp-step ${on ? "pkp-on" : ""} relative grid grid-cols-[34px_100px_1fr] sm:grid-cols-[42px_150px_1fr] md:grid-cols-[1fr_200px_1fr] lg:grid-cols-[1fr_240px_1fr] items-center gap-x-3 sm:gap-x-5 md:gap-x-0 py-4 md:py-5 ${
                    // a little more room on tablets for the drop's curve out of the milking pail
                    i === START + 1 ? "sm:pt-20 md:pt-16 lg:pt-5" : ""
                  }`}
                  style={on ? PALETTE_ON : PALETTE_OFF}
                >
                  {/* Picture */}
                  <div
                    ref={(el) => {
                      artRefs.current[i] = el;
                    }}
                    className={`row-start-1 col-start-2 w-full md:w-[230px] lg:w-[260px] ${
                      even ? "md:col-start-1 md:justify-self-end" : "md:col-start-3 md:justify-self-start"
                    }`}
                  >
                    <div className="pkp-art relative aspect-square w-full">
                      <s.Art />
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    className={`row-start-1 col-start-3 min-w-0 transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-[.45] translate-y-2"} ${
                      even ? "md:col-start-3 md:justify-self-start" : "md:col-start-1 md:justify-self-end md:text-right"
                    }`}
                  >
                    <p className={`flex items-center gap-2.5 md:gap-3 ${even ? "" : "md:flex-row-reverse"}`}>
                      <span
                        className={`font-hero italic leading-none text-[26px] md:text-[36px] transition-colors duration-700 ${on ? "text-brand-funk" : "text-[#BDB49D]"}`}
                      >
                        0{i + 1}
                      </span>
                      <span aria-hidden className="h-px w-7 md:w-10 bg-[#B9A77E]" />
                      <span className="text-[10.5px] md:text-xs font-semibold uppercase tracking-[0.22em] text-[#9A7B3F]">{s.time}</span>
                    </p>
                    <h3 className="mt-3 font-hero font-semibold text-brand-ink text-[19px] sm:text-[21px] md:text-[28px] leading-tight">{s.title}</h3>
                    <p className={`mt-2 max-w-[430px] text-[13.5px] md:text-[16px] leading-relaxed text-brand-ink/70 ${even ? "" : "md:ml-auto"}`}>
                      {s.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Finale: the golden drop sinks into the jar and the numbers count up */}
        <div className="relative mt-4 md:mt-6 text-center">
          {/* Room for the trail to curve into the jar */}
          <div aria-hidden className="h-20" />

          <div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-14 gap-y-5">
            <Stat to={30} unit="L" label="of fresh A2 milk" run={landedOnce} className="order-2 md:order-1 w-[42%] md:w-[210px] md:text-right" />

            <div className="order-1 md:order-2 w-full md:w-auto flex justify-center">
              <div ref={jarRef} className={`relative w-[190px] md:w-[250px] aspect-square ${landed ? "pkp-landed" : ""}`}>
                <span aria-hidden className="pkp-a pkp-rays absolute -inset-[28%] rounded-full" />
                <span
                  aria-hidden
                  className="pkp-glow absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(246,213,138,0.95)_0%,rgba(246,213,138,0)_70%)]"
                />
                <span aria-hidden className="pkp-jar-ripple" />
                {ghee && (
                  <Link href={`/products/${ghee.slug}`} className="absolute inset-0" aria-label={ghee.name}>
                    <Image src={ghee.image} alt={ghee.name} fill sizes="250px" className="object-contain drop-shadow-[0_18px_22px_rgba(31,20,10,0.28)]" />
                  </Link>
                )}
              </div>
            </div>

            <Stat to={1} unit="kg" label="of golden bilona ghee" run={landedOnce} className="order-3 w-[42%] md:w-[210px] md:text-left" />
          </div>

          <h3 className="mt-7 font-hero font-bold text-brand-ink text-[28px] sm:text-[34px] md:text-[44px] leading-[1.1]">
            Patience, <span className="italic text-brand-funk">in every spoon.</span>
          </h3>
          <p className="mt-2 text-sm md:text-base text-brand-ink/70">No machines, no shortcuts. Just milk, time and a wooden bilona.</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <Link
              href="/products/pure-desi-cow-ghee"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white text-sm font-semibold transition-colors"
            >
              Shop A2 Ghee
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center h-11 px-6 rounded-full border border-brand-funk text-brand-funk bg-white/70 hover:bg-white text-sm font-semibold transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pieces ---------- */

// A glossy drop: soft shading, a fine outline and a highlight, in milk white or golden ghee
function Drop({ gold = false }: { gold?: boolean }) {
  const id = gold ? "pkp-drop-gold" : "pkp-drop-milk";
  return (
    <svg width="29" height="39" viewBox="0 0 22 30" aria-hidden className="block overflow-visible">
      <defs>
        <radialGradient id={id} cx="0.38" cy="0.64" r="0.72">
          {gold ? (
            <>
              <stop offset="0" stopColor="#FFF1C8" />
              <stop offset="0.45" stopColor="#EDBA52" />
              <stop offset="1" stopColor="#B57818" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.55" stopColor="#F6F4EE" />
              <stop offset="1" stopColor="#D0CCC0" />
            </>
          )}
        </radialGradient>
      </defs>
      <path
        d="M11 1.2C11 1.2 2.6 11.6 2.6 19.2A8.4 8.4 0 0 0 19.4 19.2C19.4 11.6 11 1.2 11 1.2Z"
        fill={`url(#${id})`}
        stroke={gold ? "#8A5A12" : "#4A4F45"}
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <path d="M6.6 16.4C6.8 13.8 8.1 11.4 9.3 9.8" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.95" />
      <ellipse cx="7.5" cy="20.8" rx="1.25" ry="2" fill="#FFFFFF" opacity="0.9" />
      <path d="M15.6 23.2a5 5 0 0 1 -2.6 2.6" stroke={gold ? "#FFE3A0" : "#FFFFFF"} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

// Number that counts up once the drop has landed (shows the real number, faded, until then)
function Stat({ to, unit, label, run, className = "" }: { to: number; unit: string; label: string; run: boolean; className?: string }) {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    setV(0);
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return (
    <div className={`transition-opacity duration-700 ${run ? "opacity-100" : "opacity-40"} ${className}`}>
      <p className="font-hero font-bold text-brand-funk leading-none text-[44px] md:text-[60px]">
        {v}
        <span className="ml-1 text-[22px] md:text-[28px] text-brand-tan">{unit}</span>
      </p>
      <p className="mt-1.5 text-[12px] md:text-sm text-brand-ink/70">{label}</p>
    </div>
  );
}

/* ---------- Illustrations: fine ink lines with soft tints (pale until the drop reaches them) ---------- */

function Art({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block w-full h-full overflow-visible"
      aria-hidden
    >
      {children}
    </svg>
  );
}

// Rounded so the server and the browser draw exactly the same numbers
const r2 = (n: number) => Math.round(n * 100) / 100;

function Ground({ y, from = 30, to = 170 }: { y: number; from?: number; to?: number }) {
  return <path d={`M${from} ${y}H${to}`} strokeWidth={1.2} opacity={0.45} />;
}

function Steam({ xs, y }: { xs: number[]; y: number }) {
  return (
    <>
      {xs.map((x, i) => (
        <path
          key={x}
          className="pkp-a pkp-steam"
          style={{ animationDelay: `${i * 0.5}s` }}
          d={`M${x} ${y}q-6 -8 0 -16q6 -8 0 -16q-5 -6 0 -12`}
          strokeWidth={1.5}
        />
      ))}
    </>
  );
}

function Flames({ base }: { base: number }) {
  const b = base;
  return (
    <>
      <path className="pkp-a pkp-flicker" style={{ animationDelay: ".15s" }} d={`M84 ${b}C79 ${b - 5} 80 ${b - 12} 84 ${b - 17}C88 ${b - 12} 89 ${b - 5} 84 ${b}Z`} fill="var(--pk-gold-soft)" strokeWidth={1.3} />
      <path className="pkp-a pkp-flicker" style={{ animationDelay: ".45s" }} d={`M116 ${b}C111 ${b - 5} 112 ${b - 12} 116 ${b - 17}C120 ${b - 12} 121 ${b - 5} 116 ${b}Z`} fill="var(--pk-gold-soft)" strokeWidth={1.3} />
      <path className="pkp-a pkp-flicker" d={`M100 ${b}C90 ${b - 7} 92 ${b - 18} 100 ${b - 27}C108 ${b - 18} 110 ${b - 7} 100 ${b}Z`} fill="var(--pk-gold)" strokeWidth={1.5} />
      <path className="pkp-a pkp-flicker" style={{ animationDelay: ".3s" }} d={`M100 ${b}C95 ${b - 4} 96 ${b - 10} 100 ${b - 15}C104 ${b - 10} 105 ${b - 4} 100 ${b}Z`} fill="var(--pk-gold-soft)" stroke="none" />
      <circle className="pkp-a pkp-ember" cx="94" cy={b - 22} r="1.2" fill="var(--pk-gold)" stroke="none" />
      <circle className="pkp-a pkp-ember" style={{ animationDelay: ".7s" }} cx="106" cy={b - 24} r="1" fill="var(--pk-gold)" stroke="none" />
    </>
  );
}

// The first two drawings were traced from farm pictures into plain SVG files (pale fills, soft detail lines);
// each moving part is its own group there, drawn here with <use> so it can be animated.
const GRAZING_ART = "/images/process/grazing-art.svg";
const MILKING_ART = "/images/process/milking-art.svg";

// Tufts of grass that sway in the breeze: [group, x, y of the tuft's foot, delay in s]
const TUFTS: [string, number, number, number][] = [
  ["tuftA", 29.3, 157.5, 0],
  ["tuftB", 151.6, 162.8, -1.1],
  ["tuftC", 23.7, 134.3, -0.5],
  ["tuftD", 79.4, 166.7, -1.7],
  ["tuftE", 89.1, 151.1, -0.8],
  ["tuftF", 141.6, 143.4, -1.4],
];

// 1. A desi cow grazing in an open field in the morning sun: her head dips into the grass as she eats, her tail
// swishes, the bell on her neck rope swings, tufts of grass sway in the breeze and the sun glows
function CowGrazing() {
  return (
    <Art>
      <circle className="pkp-a pkp-moonglow" cx="74.5" cy="47.1" r="19" fill="var(--pk-gold-soft)" stroke="none" />
      <circle cx="74.5" cy="47.1" r="13.4" fill="var(--pk-gold-soft)" stroke="none" />
      <use href={`${GRAZING_ART}#back`} />
      <use href={`${GRAZING_ART}#base`} />
      {/* only the tail's tuft swings, from where it joins the tail */}
      <g className="pkp-a pkp-tail" style={{ transformOrigin: "190.4px 111.1px" }}>
        <use href={`${GRAZING_ART}#tail`} />
      </g>
      {/* the head turns from where it joins the neck, so the muzzle dips into the grass */}
      <g className="pkp-a pkp-graze" style={{ transformOrigin: "96.6px 100.6px" }}>
        <use href={`${GRAZING_ART}#head`} />
        <use href={`${GRAZING_ART}#forelock`} />
      </g>
      {/* the bell hangs from the end of her neck rope */}
      <g className="pkp-a pkp-bell" style={{ transformOrigin: "101.2px 106.9px" }}>
        <path d="M101.2 106.9V109.8" strokeWidth={1} />
        <path d="M98.4 117.8C98.4 113.4 99.4 109.8 101.2 109.8C103 109.8 104 113.4 104 117.8Z" fill="var(--pk-gold)" strokeWidth={1} />
        <path d="M97.6 117.8H104.8" strokeWidth={1.2} />
        <circle cx="101.2" cy="118.9" r=".95" fill="currentColor" stroke="none" />
      </g>
      {/* the grass she is eating stays in front of her muzzle */}
      <use href={`${GRAZING_ART}#grass`} />
      {TUFTS.map(([id, x, y, delay]) => (
        <g key={id} className="pkp-a pkp-blades" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${delay}s` }}>
          <use href={`${GRAZING_ART}#${id}`} />
        </g>
      ))}
    </Art>
  );
}

// 2. The farmer milking the cow at sunrise: his hands squeeze and milk streams into the pail (the drop starts at
// its bottom); the cow nods, swishes her tail and her bell swings, the sun comes up and birds pass
function CowMilking() {
  return (
    <Art>
      <g className="pkp-a pkp-sunrise">
        <g className="pkp-a pkp-spin">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line
                key={i}
                x1={r2(104 + Math.cos(a) * 15)}
                y1={r2(30 + Math.sin(a) * 15)}
                x2={r2(104 + Math.cos(a) * 20)}
                y2={r2(30 + Math.sin(a) * 20)}
                strokeWidth={1.2}
                opacity={0.7}
              />
            );
          })}
        </g>
        <circle cx="104" cy="30" r="10" fill="var(--pk-gold-soft)" strokeWidth={1.5} />
      </g>
      <path className="pkp-a pkp-bird" d="M22 26q4 -4 8 0q4 -4 8 0" strokeWidth={1.3} />
      <path className="pkp-a pkp-bird" style={{ animationDelay: "1.4s" }} d="M34 36q3 -3 6 0q3 -3 6 0" strokeWidth={1.2} />

      <use href={`${MILKING_ART}#base`} />
      {/* the whole tuft swings outward, away from the farmer, from where it joins the tail */}
      <g className="pkp-a pkp-tail-out" style={{ transformOrigin: "12px 133px" }}>
        <use href={`${MILKING_ART}#tail`} />
      </g>
      <g className="pkp-a pkp-nod" style={{ transformOrigin: "152px 92px" }}>
        <use href={`${MILKING_ART}#head`} />
      </g>
      <g className="pkp-a pkp-bell" style={{ transformOrigin: "164px 113px" }}>
        <use href={`${MILKING_ART}#bell`} />
      </g>
      <g className="pkp-a pkp-squeeze">
        <use href={`${MILKING_ART}#hands`} />
      </g>

      <path className="pkp-a pkp-flow" d="M76.4 147.6Q77.6 154 79.8 160.4" stroke="var(--pk-flow)" strokeWidth={1} strokeDasharray="3 5" />
      <ellipse className="pkp-a pkp-ripple" cx="80.5" cy="161.6" rx="4" ry="1" strokeWidth={0.8} />
    </Art>
  );
}

// 3. Milk frothing in a pot on a wood-fed clay chulha
function PotOnChulha() {
  return (
    <Art>
      <Steam xs={[78, 100, 122]} y={46} />
      <Ground y={172} />
      <path d="M46 134L54 172H146L154 134Z" fill="var(--pk-clay)" strokeWidth={2} />
      <path d="M60 146h4M74 154h3M128 148h4M136 160h3M64 164h3M120 162h3" strokeWidth={1.2} opacity={0.5} />
      <path d="M82 172V158Q100 140 118 158V172Z" fill="var(--pk-dark)" strokeWidth={1.8} />
      <Flames base={170} />

      <path d="M56 72H144V102Q144 132 100 134Q56 132 56 102Z" fill="var(--pk-paper)" strokeWidth={2} />
      <path d="M124 80V114M131 78V110M137 78V104" strokeWidth={1} opacity={0.45} />
      <path d="M60 92H140" strokeWidth={1.2} strokeDasharray="1 5" />
      <path d="M56 84h-8v9h8M144 84h8v9h-8" strokeWidth={1.8} />
      <path className="pkp-a pkp-froth" d="M58 72q4 -10 12 -7q6 -10 16 -5q8 -10 18 -2q9 -8 18 0q9 -5 14 3q7 -1 8 11Z" fill="var(--pk-milk)" strokeWidth={1.6} />
      <circle className="pkp-a pkp-pop" cx="78" cy="60" r="2.4" fill="var(--pk-milk)" strokeWidth={1} />
      <circle className="pkp-a pkp-pop" style={{ animationDelay: ".55s" }} cx="104" cy="54" r="2.8" fill="var(--pk-milk)" strokeWidth={1} />
      <circle className="pkp-a pkp-pop" style={{ animationDelay: "1.1s" }} cx="126" cy="60" r="2.2" fill="var(--pk-milk)" strokeWidth={1} />
      <path d="M50 72H150" strokeWidth={2.6} />
    </Art>
  );
}

// 4. Clay matka of curd under the moon, a cloud drifting by and a time-lapse clock
function MatkaOvernight() {
  return (
    <Art>
      <circle className="pkp-a pkp-moonglow" cx="150" cy="46" r="24" fill="var(--pk-gold-soft)" stroke="none" />
      <path d="M146 26a19 19 0 1 0 20 27a15 15 0 1 1 -20 -27Z" fill="var(--pk-gold-soft)" strokeWidth={1.6} />
      <path className="pkp-a pkp-cloud" d="M120 64q2 -8 10 -6q4 -8 13 -4q8 -2 9 6q7 1 6 7H121q-5 -1 -1 -3Z" fill="var(--pk-paper)" strokeWidth={1.4} />
      <Ground y={168} />

      <circle cx="42" cy="146" r="15" fill="var(--pk-paper)" strokeWidth={1.6} />
      <path d="M42 134v2.5M54 146h-2.5M42 158v-2.5M30 146h2.5" strokeWidth={1.3} />
      <path className="pkp-a pkp-hand-h" style={{ transformOrigin: "42px 146px" }} d="M42 146V139" strokeWidth={1.8} />
      <path className="pkp-a pkp-hand-m" style={{ transformOrigin: "42px 146px" }} d="M42 146H51" strokeWidth={1.3} />

      <path d="M86 72Q52 86 52 122Q52 164 100 166Q148 164 148 122Q148 86 114 72Z" fill="var(--pk-clay)" strokeWidth={2} />
      <path d="M130 96Q142 116 136 142M138 104Q146 120 142 136" strokeWidth={1} opacity={0.45} />
      <path d="M58 112Q100 123 142 112" strokeWidth={1.3} strokeDasharray="1 5" />
      <path d="M56 132Q100 145 144 132" strokeWidth={1.4} />
      <path d="M86 62H114V74H86Z" fill="var(--pk-clay)" strokeWidth={1.8} />
      <path d="M78 64Q100 36 122 64Z" fill="var(--pk-paper)" strokeWidth={1.8} />
      <path d="M88 55Q100 47 112 55M84 60Q100 52 116 60" strokeWidth={1} opacity={0.55} />
      <path d="M82 66H118" strokeWidth={1.8} />
      <g className="pkp-a pkp-sway" style={{ transformOrigin: "117px 66px" }}>
        <path d="M115 66q7 5 4 14M118 66q10 2 12 11" strokeWidth={1.4} />
      </g>
    </Art>
  );
}

// 5. Wooden bilona churning curd in a matka, rope pulled in turn
function BilonaChurn() {
  return (
    <Art>
      <Ground y={184} from={26} to={174} />
      <path d="M158 20H168V180H158Z" fill="var(--pk-wood)" strokeWidth={1.8} />
      <path d="M161 40V70M165 92V130M161 142V170" strokeWidth={1} opacity={0.5} />
      <path d="M148 180H178" strokeWidth={2.6} />
      <path d="M158 34Q132 26 108 32" strokeWidth={1.5} />
      <ellipse cx="100" cy="32" rx="9" ry="4" fill="var(--pk-paper)" strokeWidth={1.6} />

      <g className="pkp-a pkp-pull-l">
        <path d="M95 62Q68 62 46 74" strokeWidth={1.5} />
        <rect x="26" y="69" width="20" height="9" rx="4.5" fill="var(--pk-wood)" strokeWidth={1.6} />
      </g>
      <g className="pkp-a pkp-pull-r">
        <path d="M105 64Q124 70 134 84" strokeWidth={1.5} />
        <rect x="129" y="85" width="18" height="8" rx="4" fill="var(--pk-wood)" strokeWidth={1.6} transform="rotate(30 138 89)" />
      </g>

      <defs>
        <clipPath id="pkp-stick-clip">
          <rect x="95" y="24" width="10" height="102" rx="5" />
        </clipPath>
      </defs>
      <rect x="95" y="24" width="10" height="102" rx="5" fill="var(--pk-wood)" stroke="none" />
      <g clipPath="url(#pkp-stick-clip)">
        <g className="pkp-a pkp-stick">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={`M92 ${4 + i * 9}L108 ${-3 + i * 9}`} strokeWidth={1.2} opacity={0.55} />
          ))}
        </g>
      </g>
      <rect x="95" y="24" width="10" height="102" rx="5" strokeWidth={1.8} />
      <path d="M93 58L107 52M93 65L107 59" strokeWidth={3.6} />
      <path d="M93 58L107 52M93 65L107 59" stroke="var(--pk-paper)" strokeWidth={1.8} />

      <circle className="pkp-a pkp-splash" cx="84" cy="114" r="2.2" fill="var(--pk-milk)" strokeWidth={1.1} />
      <circle className="pkp-a pkp-splash" style={{ animationDelay: ".35s" }} cx="117" cy="112" r="1.8" fill="var(--pk-milk)" strokeWidth={1.1} />
      <circle className="pkp-a pkp-splash" style={{ animationDelay: ".7s" }} cx="92" cy="110" r="1.5" fill="var(--pk-milk)" strokeWidth={1} />
      <path d="M74 124Q42 136 42 156Q42 180 100 182Q158 180 158 156Q158 136 126 124Z" fill="var(--pk-clay)" strokeWidth={2} />
      <path d="M136 140Q147 152 141 168M143 146Q150 156 146 166" strokeWidth={1} opacity={0.45} />
      <path d="M52 150Q100 161 148 150" strokeWidth={1.3} strokeDasharray="1 5" />
      <ellipse cx="100" cy="124" rx="27" ry="6.5" fill="var(--pk-milk)" strokeWidth={1.8} />
      <ellipse className="pkp-a pkp-ripple" cx="100" cy="124.5" rx="12" ry="2.6" strokeWidth={0.9} />
    </Art>
  );
}

// 6. Bowl of fresh white makkhan with a wooden spoon and a glass of chhaas
function MakkhanBowl() {
  return (
    <Art>
      <Ground y={168} from={20} to={182} />

      <path d="M148 106L152 162H176L180 106Z" fill="var(--pk-paper)" strokeWidth={1.6} />
      <path d="M150 122L153 160H175L178 122Z" fill="var(--pk-tint)" stroke="none" />
      <path d="M150 122H178" strokeWidth={1.1} />
      <circle className="pkp-a pkp-rise" cx="160" cy="154" r="1.8" fill="var(--pk-paper)" strokeWidth={1} />
      <circle className="pkp-a pkp-rise" style={{ animationDelay: ".5s" }} cx="168" cy="152" r="1.5" fill="var(--pk-paper)" strokeWidth={1} />
      <circle className="pkp-a pkp-rise" style={{ animationDelay: "1s" }} cx="164" cy="156" r="1.6" fill="var(--pk-paper)" strokeWidth={1} />
      <circle className="pkp-a pkp-rise" style={{ animationDelay: "1.5s" }} cx="171" cy="155" r="1.3" fill="var(--pk-paper)" strokeWidth={1} />

      <g className="pkp-a pkp-rock-spoon" style={{ transformOrigin: "78px 92px" }}>
        <path d="M78 92L42 46" strokeWidth={6} />
        <path d="M78 92L42 46" stroke="var(--pk-wood)" strokeWidth={3.4} />
      </g>

      <path d="M24 100A68 13 0 0 1 160 100" strokeWidth={1.8} />
      <g className="pkp-a pkp-breathe">
        <path d="M44 100Q38 76 64 76Q72 56 96 62Q118 54 126 78Q146 82 140 100Z" fill="var(--pk-milk)" strokeWidth={1.8} />
        <path d="M70 82q6 -5 12 0M98 72q6 -5 12 0M116 88q5 -4 10 0" strokeWidth={1.2} />
        <path d="M56 94Q62 86 70 88" strokeWidth={1} opacity={0.4} />
      </g>
      <path d="M24 100Q30 150 92 152Q154 150 160 100Z" fill="var(--pk-gold-soft)" strokeWidth={2} />
      <path d="M24 100A68 13 0 0 0 160 100" strokeWidth={1.8} />
      <path d="M132 110Q140 128 128 142M142 108Q148 122 140 134" strokeWidth={1} opacity={0.45} />
      <path d="M72 152Q92 160 112 152" strokeWidth={1.8} />
    </Art>
  );
}

// 7. Iron kadhai of golden ghee on the fire, aroma rising
function KadhaiGhee() {
  return (
    <Art>
      {[70, 90, 110, 130].map((x, i) => (
        <path
          key={x}
          className="pkp-a pkp-aroma"
          style={{ animationDelay: `${i * 0.5}s` }}
          d={`M${x} 66q-9 -7 0 -14q9 -7 0 -14q-7 -5 0 -10`}
          stroke="var(--pk-gold)"
          strokeWidth={1.5}
          strokeDasharray="3 4"
        />
      ))}
      <Ground y={182} />
      <Flames base={168} />
      <path d="M60 178L140 166M60 166L140 178" strokeWidth={5} />
      <path d="M60 178L140 166M60 166L140 178" stroke="var(--pk-wood)" strokeWidth={2.6} />

      <path d="M30 84A70 13 0 0 1 170 84" strokeWidth={1.8} />
      <path d="M30 84Q36 138 100 140Q164 138 170 84Z" fill="var(--pk-dark)" strokeWidth={2} />
      <path d="M46 98Q52 120 70 130" stroke="var(--pk-paper)" strokeWidth={1.2} opacity={0.3} />
      <defs>
        <clipPath id="pkp-ghee-clip">
          <ellipse cx="100" cy="85" rx="62" ry="9" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="85" rx="62" ry="9" fill="var(--pk-gold)" stroke="none" />
      <g clipPath="url(#pkp-ghee-clip)">
        <rect className="pkp-a pkp-shimmer" x="40" y="74" width="14" height="22" fill="#FFF3C4" opacity={0.6} stroke="none" />
      </g>
      <ellipse cx="100" cy="85" rx="62" ry="9" strokeWidth={1.6} />
      {[
        [72, 86, 2.4, 0],
        [88, 84, 2.8, 0.35],
        [104, 83, 3.2, 0.7],
        [120, 86, 2.4, 1.05],
        [134, 85, 2, 1.4],
      ].map(([cx, cy, r, d]) => (
        <circle
          key={cx}
          className="pkp-a pkp-pop"
          style={{ animationDelay: `${d}s` }}
          cx={cx}
          cy={cy}
          r={r}
          fill="var(--pk-gold-soft)"
          strokeWidth={1}
        />
      ))}
      <path d="M30 84A70 13 0 0 0 170 84" strokeWidth={1.8} />
      <path d="M30 82q-15 -2 -13 10q2 7 13 4M170 82q15 -2 13 10q-2 7 -13 4" strokeWidth={1.8} />
    </Art>
  );
}

/* ---------- Animations (all prefixed pkp- so nothing else on the site is affected) ---------- */

const CSS = `
.pkp-root svg * { transition: fill .8s ease; }
.pkp-art { transform: scale(.96); transform-origin: 50% 100%; transition: color .8s ease, transform .9s cubic-bezier(.2,.8,.2,1); }
.pkp-on .pkp-art { transform: scale(1); }

.pkp-flow { animation: pkp-flow .5s linear infinite; }
.pkp-ripple { transform-box: fill-box; transform-origin: center; animation: pkp-ripple 1.6s ease-out infinite; }
.pkp-splash { transform-box: fill-box; animation: pkp-splash 1.2s ease-in-out infinite; }
.pkp-spin { transform-box: fill-box; transform-origin: center; animation: pkp-spin 16s linear infinite; }
.pkp-sunrise { animation: pkp-sunrise 1.8s cubic-bezier(.2,.8,.2,1) both; }
.pkp-bird { opacity: 0; animation: pkp-bird 7s ease-in-out infinite; }
.pkp-rock { animation: pkp-rock 2.4s ease-in-out infinite alternate; }
.pkp-steam { opacity: 0; transform-box: fill-box; animation: pkp-steam 2.4s ease-in-out infinite; }
.pkp-froth { transform-box: fill-box; transform-origin: 50% 100%; animation: pkp-froth 1.4s ease-in-out infinite; }
.pkp-flicker { transform-box: fill-box; transform-origin: 50% 100%; animation: pkp-flicker .8s ease-in-out infinite; }
.pkp-ember { opacity: 0; transform-box: fill-box; animation: pkp-ember 1.6s ease-out infinite; }
.pkp-moonglow { opacity: .3; transform-box: fill-box; transform-origin: center; animation: pkp-moonglow 3s ease-in-out infinite; }
.pkp-cloud { animation: pkp-cloud 6s ease-in-out infinite alternate; }
.pkp-sway { animation: pkp-sway 1.8s ease-in-out infinite alternate; }
.pkp-hand-h { animation: pkp-turn 4.8s linear infinite; }
.pkp-hand-m { animation: pkp-turn .8s linear infinite; }
.pkp-pull-l { animation: pkp-pull-l 1s ease-in-out infinite alternate; }
.pkp-pull-r { animation: pkp-pull-r 1s ease-in-out infinite alternate; }
.pkp-stick { animation: pkp-stick 1s ease-in-out infinite alternate; }
.pkp-breathe { transform-box: fill-box; transform-origin: 50% 100%; animation: pkp-breathe 2.6s ease-in-out infinite; }
.pkp-rock-spoon { animation: pkp-rock-spoon 2.2s ease-in-out infinite alternate; }
.pkp-rise { transform-box: fill-box; animation: pkp-rise 1.8s ease-in infinite; }
.pkp-aroma { opacity: 0; animation: pkp-aroma 2.8s ease-in-out infinite; }
.pkp-pop { transform-box: fill-box; transform-origin: center; animation: pkp-pop 1.4s ease-in-out infinite; }
.pkp-shimmer { animation: pkp-shimmer 2.8s ease-in-out infinite; }
.pkp-graze { animation: pkp-graze 3.2s ease-in-out infinite; }
.pkp-blades { animation: pkp-blades 2.4s ease-in-out infinite alternate; }
.pkp-tail { animation: pkp-tail 1.7s ease-in-out infinite alternate; }
.pkp-tail-out { animation: pkp-tail-out 1.5s ease-in-out infinite alternate; }
.pkp-bell { animation: pkp-bell 1.2s ease-in-out infinite alternate; }
.pkp-nod { animation: pkp-nod 3.4s ease-in-out infinite; }
.pkp-squeeze { animation: pkp-squeeze .75s ease-in-out infinite; }

/* The jar glows, golden rays turn and a ripple spreads once the drop lands in it */
.pkp-glow { opacity: .45; transform: scale(.9); transition: opacity .8s ease, transform .8s ease; }
.pkp-landed .pkp-glow { opacity: 1; transform: scale(1.06); }
.pkp-rays { opacity: 0; transition: opacity 1.2s ease; background: repeating-conic-gradient(from 0deg, rgba(226,162,48,.2) 0deg 4deg, rgba(226,162,48,0) 4deg 15deg); -webkit-mask: radial-gradient(circle, #000 22%, transparent 68%); mask: radial-gradient(circle, #000 22%, transparent 68%); animation: pkp-spin 44s linear infinite; }
.pkp-landed .pkp-rays { opacity: 1; }
.pkp-jar-ripple { position: absolute; left: 50%; top: 5%; width: 46%; height: 10%; border-radius: 50%; border: 1.5px solid rgba(226,162,48,.75); opacity: 0; transform: translate(-50%, -50%) scale(.2); pointer-events: none; }
.pkp-landed .pkp-jar-ripple { animation: pkp-jar-ripple 1.2s ease-out 1; }

/* Steps the drop has not reached yet stay still, and nothing moves while the section is off screen */
.pkp-step:not(.pkp-on) .pkp-a,
.pkp-root:not(.pkp-live) .pkp-a { animation-play-state: paused !important; }

@keyframes pkp-flow { to { stroke-dashoffset: -32; } }
@keyframes pkp-ripple { 0% { transform: scale(.3); opacity: .85; } 100% { transform: scale(2.3); opacity: 0; } }
@keyframes pkp-splash { 0%, 100% { transform: translateY(0); opacity: 0; } 45% { transform: translateY(-13px); opacity: 1; } }
@keyframes pkp-spin { to { transform: rotate(360deg); } }
@keyframes pkp-sunrise { from { transform: translateY(22px); opacity: .25; } to { transform: translateY(0); opacity: 1; } }
@keyframes pkp-bird { 0% { transform: translate(0, 0); opacity: 0; } 15% { opacity: .9; } 50% { transform: translate(50px, -6px); } 85% { opacity: .9; } 100% { transform: translate(100px, 2px); opacity: 0; } }
@keyframes pkp-rock { from { transform: rotate(-3deg); } to { transform: rotate(3deg); } }
@keyframes pkp-steam { 0% { transform: translateY(8px) scaleX(.9); opacity: 0; } 35% { opacity: .75; } 100% { transform: translateY(-20px) scaleX(1.15); opacity: 0; } }
@keyframes pkp-froth { 0%, 100% { transform: scaleY(.82); } 50% { transform: scaleY(1.2); } }
@keyframes pkp-flicker { 0%, 100% { transform: scale(1, 1); } 30% { transform: scale(.86, 1.2); } 65% { transform: scale(1.06, .92); } }
@keyframes pkp-ember { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-16px); opacity: 0; } }
@keyframes pkp-moonglow { 0%, 100% { opacity: .15; transform: scale(.9); } 50% { opacity: .55; transform: scale(1.2); } }
@keyframes pkp-cloud { from { transform: translateX(-16px); } to { transform: translateX(14px); } }
@keyframes pkp-sway { from { transform: rotate(-9deg); } to { transform: rotate(7deg); } }
@keyframes pkp-turn { to { transform: rotate(360deg); } }
@keyframes pkp-pull-l { from { transform: translateX(-11px); } to { transform: translateX(6px); } }
@keyframes pkp-pull-r { from { transform: translateX(6px); } to { transform: translateX(-11px); } }
@keyframes pkp-stick { from { transform: translateY(-9px); } to { transform: translateY(9px); } }
@keyframes pkp-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04, 1.07); } }
@keyframes pkp-rock-spoon { from { transform: rotate(-5deg); } to { transform: rotate(4deg); } }
@keyframes pkp-rise { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-34px); opacity: 0; } }
@keyframes pkp-aroma { 0% { transform: translateY(10px); opacity: 0; } 35% { opacity: 1; } 100% { transform: translateY(-18px); opacity: 0; } }
@keyframes pkp-pop { 0%, 100% { transform: scale(.4); opacity: 0; } 50% { transform: scale(1.25); opacity: 1; } }
@keyframes pkp-shimmer { 0% { transform: translateX(-40px) skewX(-20deg); } 60%, 100% { transform: translateX(140px) skewX(-20deg); } }
@keyframes pkp-graze { 0%, 100% { transform: rotate(0deg); } 22%, 42%, 62% { transform: rotate(-3deg); } 32%, 52% { transform: rotate(-1.8deg); } 82% { transform: rotate(.6deg); } }
@keyframes pkp-blades { from { transform: skewX(-5deg); } to { transform: skewX(5deg); } }
@keyframes pkp-tail { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
@keyframes pkp-tail-out { from { transform: rotate(0deg); } to { transform: rotate(8deg); } }
@keyframes pkp-bell { from { transform: rotate(-9deg); } to { transform: rotate(9deg); } }
@keyframes pkp-nod { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(2.5deg); } }
@keyframes pkp-squeeze { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(1px); } }
@keyframes pkp-jar-ripple { 0% { opacity: .95; transform: translate(-50%, -50%) scale(.2); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); } }

@media (prefers-reduced-motion: reduce) {
  .pkp-root .pkp-a { animation: none !important; }
  .pkp-root .pkp-steam, .pkp-root .pkp-aroma, .pkp-root .pkp-bird { opacity: .5; }
}
`;
