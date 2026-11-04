"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductBySlug } from "@/lib/product-data";

// "From flower to jar": one honeybee leaves a wild flower and weaves down a trail as you scroll, past each step of
// how raw honey is made, and lands on the lid of the jar. Each step's drawing comes alive as the bee reaches it and
// the background warms from morning green to honey gold. All motion is code (SVG + CSS).

// The bee flies at this height of the screen while the page scrolls
const RIDE = 0.55;
// A step lights up once the bee reaches this far down it (0 = its top, 0.5 = its middle)
const LIGHT_AT = 0.18;
// Top of the lid in the jar photo (fraction of its box): the bee lands here
const JAR_LID = 0.035;

// Background from the flower to the jar, one colour per stop: the flower, each step after it, then the jar
const SKY = [
  "#F5F7EC",
  "#FBF3EE",
  "#F6F5E7",
  "#FBF3E1",
  "#FBF0D9",
  "#FAECD0",
  "#FAE9C8",
  "#F9E6C1",
];
const SKY_RGB = SKY.map((h) =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)),
);

// Drawing palette: before the bee arrives everything is a pale sketch, then it turns to ink with soft tints
const PALETTE_ON = {
  color: "#33402F",
  "--hn-paper": "#FFFDF8",
  "--hn-sun": "#F3DDA6",
  "--hn-petal": "#F6CDBF",
  "--hn-daisy": "#FFFFFF",
  "--hn-mustard": "#F7DE7E",
  "--hn-pollen": "#F2C14E",
  "--hn-leaf": "#D2DEB6",
  "--hn-honey": "#E3A23B",
  "--hn-honey-soft": "#F5D58C",
  "--hn-amber": "#EFC46C",
  "--hn-wax": "#F9E9B8",
  "--hn-wood": "#E3CDA6",
  "--hn-roof": "#CDB28A",
  "--hn-bee": "#F2C14E",
  "--hn-wing": "#F7FAFC",
  "--hn-dark": "#3A4136",
  "--hn-glass": "#EEF3F1",
  "--hn-steel": "#E4E7E5",
  "--hn-cloth": "#F6F0E2",
} as React.CSSProperties;
const PALETTE_OFF = {
  color: "#CCC4AF",
  "--hn-paper": "#FCFAF4",
  "--hn-sun": "#F1EDE2",
  "--hn-petal": "#F1EDE2",
  "--hn-daisy": "#FCFAF4",
  "--hn-mustard": "#F1EDE2",
  "--hn-pollen": "#ECE6D6",
  "--hn-leaf": "#ECEADF",
  "--hn-honey": "#E6DFCD",
  "--hn-honey-soft": "#F1EDE2",
  "--hn-amber": "#ECE6D6",
  "--hn-wax": "#F3F0E6",
  "--hn-wood": "#EFEADF",
  "--hn-roof": "#E6E0D0",
  "--hn-bee": "#ECE6D6",
  "--hn-wing": "#FCFAF4",
  "--hn-dark": "#E2DCCC",
  "--hn-glass": "#F4F2EC",
  "--hn-steel": "#F0EEE8",
  "--hn-cloth": "#F4F1E9",
} as React.CSSProperties;

type Step = {
  time: string;
  title: string;
  text: string;
  Art: () => JSX.Element;
  // Where the bee sits in this step's drawing before it flies (fractions of it)
  start?: { x: number; y: number };
};

const STEPS: Step[] = [
  {
    time: "Sunrise",
    title: "Wild blossoms wake up",
    text: "As the sun warms the forest edge, our bees fly out to wild flowers and blossoming trees, from one bloom to the next.",
    Art: Blossoms,
    start: { x: 0.705, y: 0.38 },
  },
  {
    time: "All day long",
    title: "A sip of nectar",
    text: "Flower after flower, each bee sips the sweet nectar (ras) and carries it home in her honey stomach, dusted with pollen.",
    Art: NectarSip,
  },
  {
    time: "Every trip",
    title: "Home to the bee box",
    text: "Back at the wooden bee box, she hands the nectar to the house bees and dances to show the others where the flowers are.",
    Art: BeeBox,
  },
  {
    time: "Over many days",
    title: "Nectar turns to honey",
    text: "Inside the wax comb, the bees fan their wings day and night until the thin nectar thickens into rich, golden honey.",
    Art: Comb,
  },
  {
    time: "When it's ripe",
    title: "Sealed with beeswax",
    text: "When a cell is full and ripe, the bees seal it with a thin lid of wax. Only these full, sealed frames are taken out.",
    Art: CappedFrame,
  },
  {
    time: "Harvest day",
    title: "Spun out by hand",
    text: "The wax caps are sliced off by hand and the frames spun slowly. The honey is strained through clean cloth, never heated.",
    Art: Extractor,
  },
  {
    time: "Same day",
    title: "Straight into the jar",
    text: "Raw honey flows into glass jars with its natural pollen and aroma. Never heated, never blended with sugar syrup.",
    Art: JarPour,
  },
];
// The step the bee starts from (the wild flower)
const START = Math.max(
  0,
  STEPS.findIndex((s) => s.start),
);

export default function HoneyProcessSection() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const jarRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const beeRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLSpanElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const artRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reached, setReached] = useState(START);
  const [landed, setLanded] = useState(false);
  const [landedOnce, setLandedOnce] = useState(false);
  const honey = getProductBySlug("raw-honey");

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const clip = clipRef.current;
    const bee = beeRef.current;
    const face = faceRef.current;
    if (!root || !svg || !path || !clip || !bee || !face) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let pts: { x: number; y: number }[] = [];
    let stops: number[] = [];
    let startY = 0;
    let endY = 0;
    let lightYs: number[] = [];
    let cur = NaN;
    let raf = 0;
    let lastT = 0;
    let shownStep = -2;
    let shownLanded = false;
    // which way the bee faces (1 = right, -1 = left), eased so she turns round, and her tilt
    let want = 1;
    let flip = 1;
    let tilt = 0;

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

    // The trail: out of the flower sideways, into the middle, weaving gently down past the steps, onto the jar's lid
    const layout = () => {
      const sr = root.getBoundingClientRect();
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - sr.left,
          y: r.top - sr.top,
          w: r.width,
          h: r.height,
        };
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
      const t1 = track.y + track.h;
      const start = STEPS[START].start ?? { x: 0.5, y: 0.5 };
      const art = artRefs.current[START];
      const pic = art ? box(art) : { x: lx, y: track.y, w: 0, h: 0 };
      const sx = pic.x + pic.w * start.x;
      const sy = pic.y + pic.h * start.y;
      const jar = box(jarRef.current!);
      const jx = jar.x + jar.w / 2;
      // she stands on the lid: her feet (a third of her height below her centre) touch its top
      const jy = jar.y + jar.h * JAR_LID - bee.offsetHeight * 0.36;
      const steps = stepRefs.current.map((li) =>
        li ? box(li) : { x: 0, y: track.y, w: 0, h: 0 },
      );
      const stepYs = steps.map((b) => b.y + b.h / 2);
      lightYs = steps.map((b) => b.y + b.h * LIGHT_AT);

      // How far the bee can weave either side of the middle without touching a picture or its text
      let room = Infinity;
      for (const li of stepRefs.current) {
        if (!li || li.children.length < 2) continue;
        const [a, b] = Array.from(li.children, (el) => box(el));
        const [l, r] = a.x < b.x ? [a, b] : [b, a];
        room = Math.min(room, r.x - (l.x + l.w));
      }
      const amp = Math.max(
        0,
        Math.min(34, (room - (bee.offsetWidth || 34)) / 2 - 4),
      );

      const y0 = sy + Math.max(70, Math.abs(lx - sx) * 0.8);
      let d = `M${sx} ${sy}C${sx + (lx - sx) * 0.6} ${sy} ${lx} ${y0 - (y0 - sy) * 0.55} ${lx} ${y0}`;
      const n = Math.max(2, Math.round((t1 - y0) / 170));
      let px = lx;
      let py = y0;
      for (let i = 1; i <= n; i++) {
        const y = y0 + ((t1 - y0) * i) / n;
        const x = i === n ? lx : lx + (i % 2 ? amp : -amp);
        const k = (y - py) * 0.5;
        d += `C${px} ${py + k} ${x} ${y - k} ${x} ${y}`;
        px = x;
        py = y;
      }
      const k = (jy - t1) * 0.5;
      d += `C${lx} ${t1 + k} ${jx} ${jy - k} ${jx} ${jy}`;
      path.setAttribute("d", d);

      const total = path.getTotalLength();
      pts = [];
      for (let l = 0; l < total; l += 3) {
        const p = path.getPointAtLength(l);
        pts.push({ x: p.x, y: p.y });
      }
      const end = path.getPointAtLength(total);
      pts.push({ x: end.x, y: end.y });
      startY = sy;
      endY = jy;
      stops = [startY, ...stepYs.slice(START + 1), jy];
    };

    // Where the bee should be for the current scroll position
    const targetY = () =>
      Math.min(
        endY,
        Math.max(
          startY,
          window.innerHeight * RIDE - root.getBoundingClientRect().top,
        ),
      );

    // Face the way she is flying and lean into it a little; level out when she stops. Returns true once settled.
    const steer = (y: number, moving: number, dt: number) => {
      let lean = 0;
      if (moving) {
        const dx = (xAt(y + 10) - xAt(y - 10)) * moving;
        if (dx > 1.5) want = 1;
        else if (dx < -1.5) want = -1;
        lean = Math.max(
          -28,
          Math.min(28, (Math.atan2(20 * moving, Math.abs(dx)) * 180) / Math.PI),
        );
      }
      const k = reduce ? 1 : 1 - Math.pow(0.8, dt / 16.7);
      flip += (want - flip) * k;
      tilt += (lean - tilt) * k;
      if (Math.abs(want - flip) < 0.02) flip = want;
      if (Math.abs(lean - tilt) < 0.2) tilt = lean;
      face.style.transform = `rotate(${(tilt * Math.sign(flip || 1)).toFixed(1)}deg) scaleX(${(-flip).toFixed(3)})`;
      return flip === want && tilt === lean;
    };

    const draw = (y: number) => {
      // Reveal the trail only behind the bee
      clip.setAttribute("height", String(Math.max(0, y - 6)));
      bee.style.transform = `translate3d(${xAt(y).toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -64%)`;

      // Background: blend between the stops either side of the bee
      let i = 0;
      while (i < stops.length - 2 && y >= stops[i + 1]) i++;
      const t = Math.min(
        1,
        Math.max(0, (y - stops[i]) / (stops[i + 1] - stops[i] || 1)),
      );
      const a = SKY_RGB[i];
      const b = SKY_RGB[i + 1];
      root.style.backgroundColor = `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(",")})`;

      let n = -1;
      lightYs.forEach((ly, k) => {
        if (y >= ly) n = k;
      });
      n = Math.max(n, START);
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

    // Ease the bee towards her target every frame, so wheel jumps become a smooth flight
    const tick = (time: number) => {
      raf = 0;
      const dt = lastT ? Math.min(64, time - lastT) : 16.7;
      lastT = time;
      const target = targetY();
      if (Number.isNaN(cur) || reduce) cur = target;
      else cur += (target - cur) * (1 - Math.pow(0.9, dt / 16.7));
      if (Math.abs(target - cur) < 0.3) cur = target;
      const moving = Math.abs(target - cur) > 0.5 ? Math.sign(target - cur) : 0;
      const settled = steer(cur, moving, dt);
      draw(cur);
      if (cur !== target || !settled) raf = requestAnimationFrame(tick);
      else lastT = 0;
    };

    const kick = () => {
      const r = root.getBoundingClientRect();
      // Pause the drawings' animations while the section is off screen
      root.classList.toggle(
        "hny-live",
        r.bottom > 0 && r.top < window.innerHeight,
      );
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const relayout = () => {
      layout();
      kick();
    };

    layout();
    cur = targetY();
    steer(cur, 0, 16.7);
    draw(cur);
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
    <section
      ref={rootRef}
      className="hny-root relative py-12 md:py-20 overflow-hidden"
      style={{ backgroundColor: SKY[0] }}
    >
      <style>{CSS}</style>

      {/* Dotted flight path: only the part behind the bee is visible */}
      <svg
        ref={svgRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[15]"
        fill="none"
      >
        <defs>
          <clipPath id="hny-trail-clip">
            <rect ref={clipRef} x="0" y="0" width="0" height="0" />
          </clipPath>
        </defs>
        <path
          ref={pathRef}
          clipPath="url(#hny-trail-clip)"
          stroke="#CFA45A"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeDasharray="0 9"
        />
      </svg>

      {/* The bee: she turns to face the way she flies */}
      <div
        ref={beeRef}
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 z-20 will-change-transform ${landed ? "hny-resting" : ""}`}
        style={{ transform: "translate3d(-200px, -200px, 0)" }}
      >
        <span className="hny-a hny-bob block">
          <span
            ref={faceRef}
            className="block [filter:drop-shadow(0_3px_3px_rgba(31,45,36,0.22))]"
          >
            <FlyingBee />
          </span>
        </span>
      </div>

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">
            Flower to jar · the wild way
          </p>
          <h2 className="mt-2 font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[50px] leading-[1.08]">
            The journey of a{" "}
            <span className="italic text-brand-funk">little bee</span>
          </h2>
          <p className="mt-3 text-brand-ink/70 text-sm md:text-[17px] leading-relaxed">
            Real honey is made by bees, not machines: millions of flower visits
            and weeks of patient work in the hive. Scroll to fly along with one
            bee.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Steps */}
        <div ref={trackRef} className="relative mt-8 md:mt-12">
          {/* Marks where the trail runs: down the centre */}
          <span
            ref={lineRef}
            aria-hidden
            className="absolute top-0 left-1/2 w-px h-px"
          />

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
                  className={`hny-step ${on ? "hny-on" : ""} relative grid grid-cols-[1fr_22px_1fr] sm:grid-cols-[1fr_40px_1fr] md:grid-cols-[1fr_200px_1fr] lg:grid-cols-[1fr_240px_1fr] items-center gap-x-2.5 sm:gap-x-4 md:gap-x-0 py-4 md:py-5`}
                  style={on ? PALETTE_ON : PALETTE_OFF}
                >
                  {/* Picture */}
                  <div
                    ref={(el) => {
                      artRefs.current[i] = el;
                    }}
                    className={`row-start-1 w-full max-w-[150px] sm:max-w-[180px] md:max-w-none md:w-[230px] lg:w-[260px] ${
                      even
                        ? "col-start-1 justify-self-end"
                        : "col-start-3 justify-self-start"
                    }`}
                  >
                    <div className="hny-art relative aspect-square w-full">
                      <s.Art />
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    className={`row-start-1 min-w-0 transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-[.45] translate-y-2"} ${
                      even
                        ? "col-start-3 justify-self-start"
                        : "col-start-1 justify-self-end text-right"
                    }`}
                  >
                    <p
                      className={`flex items-center gap-1.5 sm:gap-2.5 md:gap-3 ${even ? "" : "flex-row-reverse"}`}
                    >
                      <span
                        className={`font-hero italic leading-none text-[22px] sm:text-[26px] md:text-[36px] transition-colors duration-700 ${on ? "text-brand-funk" : "text-[#BDB49D]"}`}
                      >
                        0{i + 1}
                      </span>
                      <span
                        aria-hidden
                        className="hidden sm:block h-px w-7 md:w-10 bg-[#B9A77E]"
                      />
                      <span className="text-[9px] sm:text-[10.5px] md:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.22em] text-[#9A7B3F]">
                        {s.time}
                      </span>
                    </p>
                    <h3 className="mt-2 sm:mt-3 font-hero font-semibold text-brand-ink text-[16px] sm:text-[21px] md:text-[28px] leading-tight">
                      {s.title}
                    </h3>
                    <p
                      className={`mt-1.5 sm:mt-2 max-w-[430px] text-[12px] sm:text-[13.5px] md:text-[16px] leading-relaxed text-brand-ink/70 ${even ? "" : "ml-auto"}`}
                    >
                      {s.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Finale: the bee lands on the jar and the numbers count up */}
        <div className="relative mt-4 md:mt-6 text-center">
          {/* Room for the trail to come down onto the jar */}
          <div aria-hidden className="h-20" />

          <div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-14 gap-y-5">
            <HoneyStat
              to={2}
              unit="M+"
              label={"flower visits for every 500 g"}
              run={landedOnce}
              className="order-2 md:order-1 w-[42%] md:w-[210px] md:text-right"
            />

            <div className="order-1 md:order-2 w-full md:w-auto flex justify-center">
              <div
                ref={jarRef}
                className={`relative w-[190px] md:w-[250px] aspect-square ${landed ? "hny-landed" : ""}`}
              >
                <span
                  aria-hidden
                  className="hny-a hny-rays absolute -inset-[28%] rounded-full"
                />
                <span
                  aria-hidden
                  className="hny-jarglow absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(247,204,120,0.95)_0%,rgba(247,204,120,0)_70%)]"
                />
                {honey && (
                  <Link
                    href={`/products/${honey.slug}`}
                    className="absolute inset-0"
                    aria-label={honey.name}
                  >
                    <Image
                      src={honey.image}
                      alt={honey.name}
                      fill
                      sizes="250px"
                      className="object-contain drop-shadow-[0_18px_22px_rgba(31,20,10,0.28)]"
                    />
                  </Link>
                )}
              </div>
            </div>

            <HoneyStat
              to={100}
              unit="%"
              label="raw, never heated"
              run={landedOnce}
              className="order-3 w-[42%] md:w-[210px] md:text-left"
            />
          </div>

          <h3 className="mt-7 font-hero font-bold text-brand-ink text-[28px] sm:text-[34px] md:text-[44px] leading-[1.1]">
            Nature&apos;s sweetness,{" "}
            <span className="italic text-brand-funk">untouched.</span>
          </h3>
          <p className="mt-2 text-sm md:text-base text-brand-ink/70">
            Raw, unheated and never blended with sugar syrup. Just honey, the
            way the bees made it.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <Link
              href="/products/raw-honey"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white text-sm font-semibold transition-colors"
            >
              Shop Raw Honey
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

// The honeybee that flies the trail: facing left, wings beating, in fixed colours (she is never a pale sketch)
function FlyingBee() {
  return (
    <svg
      viewBox="-15 -18 30 27.5"
      aria-hidden
      className="block w-[28px] sm:w-[34px] h-auto overflow-visible"
    >
      <g
        fill="none"
        stroke="#3B3122"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g transform="rotate(-24 1.5 -4)">
          <ellipse
            className="hny-a hny-bee-wing"
            cx="1.5"
            cy="-9.6"
            rx="3.7"
            ry="6.2"
            fill="#FFFFFF"
            fillOpacity={0.88}
            strokeWidth={0.85}
          />
        </g>
        <g transform="rotate(14 4.6 -4)">
          <ellipse
            className="hny-a hny-bee-wing"
            style={{ animationDelay: "-.035s" }}
            cx="4.6"
            cy="-10.2"
            rx="4.1"
            ry="6.8"
            fill="#FFFFFF"
            fillOpacity={0.88}
            strokeWidth={0.85}
          />
        </g>
        <path d="M-1 5l-1.3 2.8M2 5.3l-.4 3M5 4.8l.9 2.7" strokeWidth={0.9} />
        <ellipse
          cx="2"
          cy="0"
          rx="8"
          ry="5.4"
          fill="#F4BF45"
          strokeWidth={1.05}
        />
        <path
          d="M0.2 -5.1Q-1.2 0 0.2 5.1M4.6 -4.8Q3.2 0 4.6 4.8"
          strokeWidth={1.9}
        />
        <path
          d="M-1.4 -3.3q3.2 -1.4 6.6 -.7"
          stroke="#FFFFFF"
          strokeWidth={0.9}
          opacity={0.75}
        />
        <path d="M9.9 0.3L12.6 0.8" strokeWidth={1.05} />
        <circle cx="-7" cy="-0.6" r="3.6" fill="#3B3122" stroke="none" />
        <circle cx="-8.3" cy="-1.5" r="0.8" fill="#FFFFFF" stroke="none" />
        <path
          d="M-8.4 -3.8Q-10 -8 -12.6 -8.6M-6.6 -4.1Q-7 -8.4 -9 -9.8"
          strokeWidth={0.9}
        />
      </g>
    </svg>
  );
}

// Number that counts up once the bee has landed (shows the real number, faded, until then)
function HoneyStat({
  to,
  unit,
  label,
  run,
  className = "",
}: {
  to: number;
  unit: string;
  label: string;
  run: boolean;
  className?: string;
}) {
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
    <div
      className={`transition-opacity duration-700 ${run ? "opacity-100" : "opacity-40"} ${className}`}
    >
      <p className="font-hero font-bold text-brand-funk leading-none text-[44px] md:text-[60px]">
        {v}
        <span className="ml-1 text-[22px] md:text-[28px] text-brand-tan">
          {unit}
        </span>
      </p>
      <p className="mt-1.5 text-[12px] md:text-sm text-brand-ink/70">{label}</p>
    </div>
  );
}

/* ---------- Illustrations: fine ink lines with soft tints (pale until the bee reaches them) ---------- */

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

// A flat-topped hexagon (one honeycomb cell)
const hex = (cx: number, cy: number, r: number) => {
  let d = "";
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 3) * k;
    d += `${k ? "L" : "M"}${r2(cx + r * Math.cos(a))} ${r2(cy + r * Math.sin(a))}`;
  }
  return `${d}Z`;
};

// Cells of a honeycomb laid over a box; kind: 0 = empty, 1 = honey, 2 = deep honey
const comb = (
  x0: number,
  y0: number,
  cols: number,
  rows: number,
  r: number,
  kindOf: (c: number, row: number) => number,
) => {
  const out: { d: string; cx: number; cy: number; kind: number }[] = [];
  const w = 1.5 * r;
  const h = Math.sqrt(3) * r;
  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < rows; row++) {
      const cx = x0 + c * w;
      const cy = y0 + row * h + (c % 2 ? h / 2 : 0);
      out.push({
        d: hex(cx, cy, r * 0.9),
        cx: r2(cx),
        cy: r2(cy),
        kind: kindOf(c, row),
      });
    }
  }
  return out;
};
// A tuft of grass: three blades from one root
const tuft = (x: number, y: number) =>
  `M${x - 2.5} ${y}q-1 -6 -4.5 -9M${x} ${y}q0 -7 1 -11.5M${x + 2.5} ${y}q1.5 -5 4.5 -8`;

const COMB_CELLS = comb(40, 54, 11, 8, 8.4, (c, row) => {
  const k = (c * 7 + row * 5 + ((c * row) % 4)) % 9;
  return k < 4 ? 1 : k < 6 ? 2 : 0;
});
const CAPPED_CELLS = comb(52, 58, 10, 6, 7.2, (c, row) =>
  c > 6 && row > 2 && (c + row) % 3 !== 0 ? 1 : 0,
);

function Petals({
  cx,
  cy,
  n,
  d,
  rx,
  ry,
  fill,
  sw = 1.2,
  start = -90,
}: {
  cx: number;
  cy: number;
  n: number;
  d: number;
  rx: number;
  ry: number;
  fill: string;
  sw?: number;
  start?: number;
}) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = start + (i * 360) / n;
        const x = r2(cx + Math.cos((a * Math.PI) / 180) * d);
        const y = r2(cy + Math.sin((a * Math.PI) / 180) * d);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={rx}
            ry={ry}
            transform={`rotate(${r2(a + 90)} ${x} ${y})`}
            fill={fill}
            strokeWidth={sw}
          />
        );
      })}
    </>
  );
}

// A little honeybee for the drawings, centred on 0,0 and facing left (flip faces right)
function MiniBee({
  s = 1,
  flip = false,
  sip = false,
  pollen = false,
}: {
  s?: number;
  flip?: boolean;
  sip?: boolean;
  pollen?: boolean;
}) {
  return (
    <g transform={`scale(${flip ? -s : s} ${s})`}>
      <g transform="rotate(-24 1.5 -4)">
        <ellipse
          className="hny-a hny-flap"
          cx="1.5"
          cy="-9.4"
          rx="3.5"
          ry="5.9"
          fill="var(--hn-wing)"
          strokeWidth={0.8}
        />
      </g>
      <g transform="rotate(14 4.5 -4)">
        <ellipse
          className="hny-a hny-flap"
          style={{ animationDelay: "-.05s" }}
          cx="4.5"
          cy="-10"
          rx="3.9"
          ry="6.5"
          fill="var(--hn-wing)"
          strokeWidth={0.8}
        />
      </g>
      <path d="M-1 4.8l-1.3 2.8M2 5.2l-.4 3M5 4.7l.9 2.7" strokeWidth={0.8} />
      <ellipse
        cx="2"
        cy="0"
        rx="7.8"
        ry="5.2"
        fill="var(--hn-bee)"
        strokeWidth={1}
      />
      <path
        d="M0.2 -5Q-1.2 0 0.2 5M4.6 -4.6Q3.2 0 4.6 4.6"
        stroke="var(--hn-dark)"
        strokeWidth={1.8}
      />
      <path d="M9.7 0.3L12.4 0.8" strokeWidth={1} />
      <circle cx="-7" cy="-0.6" r="3.5" fill="var(--hn-dark)" stroke="none" />
      <path
        d="M-8.4 -3.8Q-10 -8 -12.6 -8.6M-6.6 -4.1Q-7 -8.4 -9 -9.8"
        strokeWidth={0.8}
      />
      {sip && <path d="M-10.2 0.6L-13.8 2.4" strokeWidth={0.9} />}
      {pollen && (
        <circle
          cx="3.2"
          cy="7.6"
          r="1.6"
          fill="var(--hn-pollen)"
          strokeWidth={0.7}
        />
      )}
    </g>
  );
}

// 1. Wild flowers at sunrise: they sway, the big wild rose breathes, pollen drifts up (the bee starts on the rose)
function Blossoms() {
  return (
    <Art>
      <circle
        className="hny-a hny-sunglow"
        cx="44"
        cy="42"
        r="19"
        fill="var(--hn-sun)"
        stroke="none"
      />
      <g className="hny-a hny-spin">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={r2(44 + Math.cos(a) * 14)}
              y1={r2(42 + Math.sin(a) * 14)}
              x2={r2(44 + Math.cos(a) * 19)}
              y2={r2(42 + Math.sin(a) * 19)}
              strokeWidth={1.2}
              opacity={0.7}
            />
          );
        })}
      </g>
      <circle cx="44" cy="42" r="10" fill="var(--hn-sun)" strokeWidth={1.5} />
      <path
        d="M10 152Q44 130 82 146Q120 126 158 142Q178 136 192 146"
        strokeWidth={1.1}
        opacity={0.4}
      />
      <path d="M14 172H186" strokeWidth={1.2} opacity={0.45} />

      {/* wild mustard */}
      <g
        className="hny-a hny-sway"
        style={{ transformOrigin: "52px 172px", animationDelay: "-.7s" }}
      >
        <path
          d="M52 172C51 158 54 142 53 126M53 148C48 144 44 141 42 135M53 140C58 136 62 133 64 128"
          strokeWidth={1.4}
        />
        {[
          [53, 122],
          [41, 131],
          [65, 124],
        ].map(([x, y]) => (
          <g key={x}>
            <Petals
              cx={x}
              cy={y}
              n={4}
              d={3.3}
              rx={2.3}
              ry={3.3}
              fill="var(--hn-mustard)"
              sw={1}
              start={-45}
            />
            <circle
              cx={x}
              cy={y}
              r={1.3}
              fill="var(--hn-honey)"
              stroke="none"
            />
          </g>
        ))}
      </g>

      {/* daisy */}
      <g
        className="hny-a hny-sway"
        style={{ transformOrigin: "92px 172px", animationDelay: "-1.4s" }}
      >
        <path d="M92 172C93 154 88 130 90 110" strokeWidth={1.5} />
        <path
          d="M91 150C83 149 79 143 79 137C86 138 90 143 91 150Z"
          fill="var(--hn-leaf)"
          strokeWidth={1.2}
        />
        <Petals
          cx={90}
          cy={102}
          n={12}
          d={8.4}
          rx={2.2}
          ry={6.6}
          fill="var(--hn-daisy)"
          sw={1}
        />
        <circle
          cx="90"
          cy="102"
          r="4.4"
          fill="var(--hn-pollen)"
          strokeWidth={1.2}
        />
      </g>

      {/* wild rose, where the bee starts */}
      <g className="hny-a hny-sway" style={{ transformOrigin: "140px 172px" }}>
        <path d="M140 172C138 150 145 120 141 94" strokeWidth={1.6} />
        <path
          d="M140 142C127 140 120 130 122 121C132 123 139 131 140 142Z"
          fill="var(--hn-leaf)"
          strokeWidth={1.3}
        />
        <path
          d="M141 156C153 154 161 146 161 137C150 138 142 145 141 156Z"
          fill="var(--hn-leaf)"
          strokeWidth={1.3}
        />
        <g
          className="hny-a hny-bloom"
          style={{ transformOrigin: "141px 82px" }}
        >
          <Petals
            cx={141}
            cy={82}
            n={8}
            d={10.4}
            rx={5.4}
            ry={9.6}
            fill="var(--hn-petal)"
          />
          <circle
            cx="141"
            cy="82"
            r="6.6"
            fill="var(--hn-pollen)"
            strokeWidth={1.3}
          />
          <path
            d="M138.6 80.4h.01M143.2 79.6h.01M140.8 84.6h.01M144 83.8h.01M137.8 84h.01"
            strokeWidth={1.6}
          />
        </g>
      </g>

      <path
        d={tuft(24, 172) + tuft(114, 172) + tuft(172, 172)}
        strokeWidth={1.2}
      />
      {[0, 0.9, 1.8].map((d, i) => (
        <circle
          key={d}
          className="hny-a hny-rise"
          style={{ animationDelay: `${d}s` }}
          cx={136 + i * 5}
          cy={72}
          r={1.1}
          fill="var(--hn-pollen)"
          stroke="none"
        />
      ))}
    </Art>
  );
}

// 2. Close up on a flower: a bee sips nectar with her head deep in the bloom, wings beating, pollen floating about
function NectarSip() {
  return (
    <Art>
      <path d="M100 160C99 172 101 182 100 198" strokeWidth={1.8} />
      <path
        d="M100 184C86 183 76 174 76 164C89 164 98 172 100 184Z"
        fill="var(--hn-leaf)"
        strokeWidth={1.4}
      />
      <path
        d="M101 176C114 175 124 167 125 157C112 157 103 165 101 176Z"
        fill="var(--hn-leaf)"
        strokeWidth={1.4}
      />

      <g
        className="hny-a hny-sway-s"
        style={{ transformOrigin: "100px 198px" }}
      >
        <g transform="translate(100 117) scale(1.2) translate(-100 -124)">
          <Petals
            cx={100}
            cy={124}
            n={6}
            d={19}
            rx={11.5}
            ry={20}
            fill="var(--hn-petal)"
            sw={1.5}
            start={-90}
          />
          {Array.from({ length: 6 }, (_, i) => {
            const a = ((-90 + i * 60) * Math.PI) / 180;
            return (
              <path
                key={i}
                d={`M${r2(100 + Math.cos(a) * 15)} ${r2(124 + Math.sin(a) * 15)}L${r2(100 + Math.cos(a) * 30)} ${r2(124 + Math.sin(a) * 30)}`}
                strokeWidth={1}
                opacity={0.4}
              />
            );
          })}
          <circle
            cx="100"
            cy="124"
            r="11"
            fill="var(--hn-pollen)"
            strokeWidth={1.5}
          />
          {Array.from({ length: 10 }, (_, i) => {
            const a = ((i * 36 + 18) * Math.PI) / 180;
            return (
              <g key={i}>
                <path
                  d={`M${r2(100 + Math.cos(a) * 6)} ${r2(124 + Math.sin(a) * 6)}L${r2(100 + Math.cos(a) * 13.5)} ${r2(124 + Math.sin(a) * 13.5)}`}
                  strokeWidth={0.9}
                />
                <circle
                  cx={r2(100 + Math.cos(a) * 14.6)}
                  cy={r2(124 + Math.sin(a) * 14.6)}
                  r={1.4}
                  fill="var(--hn-honey)"
                  stroke="none"
                />
              </g>
            );
          })}
          <path
            className="hny-a hny-glint"
            d="M93.6 129c0 -2.4 2.2 -4.6 2.2 -4.6s2.2 2.2 2.2 4.6a2.2 2.2 0 0 1 -4.4 0Z"
            fill="var(--hn-honey-soft)"
            strokeWidth={0.9}
          />
          <path
            className="hny-a hny-glint"
            style={{ animationDelay: ".9s" }}
            d="M104.4 133c0 -1.8 1.7 -3.4 1.7 -3.4s1.7 1.6 1.7 3.4a1.7 1.7 0 0 1 -3.4 0Z"
            fill="var(--hn-honey-soft)"
            strokeWidth={0.8}
          />

          {/* the bee, head down in the flower */}
          <g transform="translate(111 109) rotate(-35)">
            <g className="hny-a hny-sip">
              <MiniBee s={1.7} sip pollen />
            </g>
          </g>
        </g>
      </g>

      {[
        [62, 96, 0],
        [140, 82, 0.8],
        [70, 66, 1.6],
        [150, 112, 2.2],
      ].map(([x, y, d]) => (
        <circle
          key={x}
          className="hny-a hny-float"
          style={{ animationDelay: `${d}s` }}
          cx={x}
          cy={y}
          r={1.4}
          fill="var(--hn-pollen)"
          strokeWidth={0.6}
        />
      ))}
    </Art>
  );
}

// 3. The wooden bee box at the forest edge: bees fly home to the entrance, one leaves, one dances on the landing board
function BeeBox() {
  return (
    <Art>
      <g opacity={0.8}>
        <path
          d="M30 92L16 118H24L12 140H48L36 118H44Z"
          fill="var(--hn-leaf)"
          strokeWidth={1.3}
        />
        <path d="M30 140V172" strokeWidth={1.6} />
        <path
          d="M170 96c-12 0 -20 9 -20 19c0 11 9 19 20 19s20 -8 20 -19c0 -10 -8 -19 -20 -19Z"
          fill="var(--hn-leaf)"
          strokeWidth={1.3}
        />
        <path d="M170 134V172M170 150l-6 -6M170 144l5 -5" strokeWidth={1.6} />
      </g>
      <path d="M8 172H192" strokeWidth={1.2} opacity={0.45} />

      {/* the box on its stand */}
      <path d="M68 162V172M132 162V172" strokeWidth={2.2} />
      <path d="M62 162H138" strokeWidth={2.6} />
      <path
        d="M78 158H122L128 162H72Z"
        fill="var(--hn-wood)"
        strokeWidth={1.4}
      />
      <path d="M66 124H134V158H66Z" fill="var(--hn-wood)" strokeWidth={1.8} />
      <path d="M66 95H134V124H66Z" fill="var(--hn-wood)" strokeWidth={1.8} />
      <path
        d="M58 95.5L100 70L142 95.5Z"
        fill="var(--hn-roof)"
        strokeWidth={1.8}
      />
      <path d="M60 95.5H140" strokeWidth={2.2} />
      <path d={hex(100, 85, 4.6)} fill="var(--hn-honey-soft)" strokeWidth={1} />
      <path d="M70 109.5H130M70 141H130" strokeWidth={1} opacity={0.4} />
      <path d="M78 103.5h9M113 103.5h9M78 132h9M113 132h9" strokeWidth={2.6} />
      <path d="M86 152.6H114" strokeWidth={3.6} />

      {/* flowers at its foot */}
      <path d="M50 172V161M150 172V158" strokeWidth={1.2} />
      <Petals
        cx={50}
        cy={158}
        n={5}
        d={2.6}
        rx={1.9}
        ry={2.8}
        fill="var(--hn-petal)"
        sw={0.9}
      />
      <circle cx="50" cy="158" r="1.3" fill="var(--hn-pollen)" stroke="none" />
      <Petals
        cx={150}
        cy={155}
        n={5}
        d={2.6}
        rx={1.9}
        ry={2.8}
        fill="var(--hn-mustard)"
        sw={0.9}
      />
      <circle cx="150" cy="155" r="1.3" fill="var(--hn-honey)" stroke="none" />
      <path
        d={tuft(41, 172) + tuft(59, 172) + tuft(141, 172) + tuft(160, 172)}
        strokeWidth={1.1}
      />

      {/* bees flying home, one heading out, one dancing */}
      <g transform="translate(96 150)">
        <g className="hny-a hny-home-l">
          <MiniBee s={0.6} flip />
        </g>
      </g>
      <g transform="translate(104 150)">
        <g className="hny-a hny-home-r" style={{ animationDelay: "-1.5s" }}>
          <MiniBee s={0.6} />
        </g>
      </g>
      <g transform="translate(100 148)">
        <g className="hny-a hny-out" style={{ animationDelay: "-2.2s" }}>
          <MiniBee s={0.55} flip />
        </g>
      </g>
      <g transform="translate(90 156)">
        <g className="hny-a hny-dance">
          <MiniBee s={0.5} flip />
        </g>
      </g>
    </Art>
  );
}

// 4. Inside the hive: a wax comb filling with honey; one bee fans her wings, one walks, one checks a cell
function Comb() {
  return (
    <Art>
      <defs>
        <clipPath id="hny-comb-clip">
          <path d="M38 52H162V158H38Z" />
        </clipPath>
      </defs>
      <path d="M30 44H170V166H30Z" fill="var(--hn-wood)" strokeWidth={2.2} />
      <path d="M38 52H162V158H38Z" fill="var(--hn-wax)" strokeWidth={1.2} />
      <g clipPath="url(#hny-comb-clip)">
        {COMB_CELLS.map((c) => (
          <path
            key={c.d}
            d={c.d}
            fill={
              c.kind === 2
                ? "var(--hn-amber)"
                : c.kind === 1
                  ? "var(--hn-honey-soft)"
                  : "var(--hn-wax)"
            }
            strokeWidth={0.8}
            strokeOpacity={0.6}
          />
        ))}
        {COMB_CELLS.filter((c) => c.kind === 2).map((c) => (
          <path
            key={`g${c.d}`}
            d={`M${r2(c.cx - 3.4)} ${r2(c.cy - 1.6)}q1.8 -2.2 4.6 -1.8`}
            stroke="#FFFFFF"
            strokeWidth={1}
            opacity={0.7}
          />
        ))}
      </g>

      {/* a little water leaving the nectar */}
      {[
        [84, 96, 0],
        [116, 138, 1.1],
        [66, 70, 2],
      ].map(([x, y, d]) => (
        <circle
          key={x}
          className="hny-a hny-rise"
          style={{ animationDelay: `${d}s` }}
          cx={x}
          cy={y}
          r={1.2}
          fill="var(--hn-paper)"
          strokeWidth={0.6}
        />
      ))}

      {/* the fanning bee and the air she moves */}
      <g transform="translate(128 78)">
        <g className="hny-fan">
          <MiniBee s={1} />
        </g>
      </g>
      {[0, 0.4, 0.8].map((d, i) => (
        <path
          key={d}
          className="hny-a hny-air"
          style={{ animationDelay: `${d}s` }}
          d={`M142 ${70 + i * 6}q4 -2.4 8 0t8 0`}
          strokeWidth={1}
        />
      ))}
      <g transform="translate(66 128)">
        <g className="hny-a hny-walk">
          <MiniBee s={0.95} flip />
        </g>
      </g>
      <g transform="translate(104 112) rotate(80)">
        <g className="hny-a hny-dip">
          <MiniBee s={0.9} />
        </g>
      </g>
    </Art>
  );
}

// 5. A full frame lifted from the box: every cell capped with wax, light gliding over it, a drop of honey falling
function CappedFrame() {
  return (
    <Art>
      <defs>
        <clipPath id="hny-cap-clip">
          <path d="M52 58H148V124H52Z" />
        </clipPath>
      </defs>
      <path d="M34 150H166V172H34Z" fill="var(--hn-wood)" strokeWidth={1.8} />
      <path
        d="M46 150V143M58 150V143M70 150V143M130 150V143M142 150V143M154 150V143"
        strokeWidth={2.6}
      />
      <path d="M40 160H160" strokeWidth={1} opacity={0.4} />

      <g className="hny-a hny-lift">
        <path d="M34 50H166" strokeWidth={3.4} />
        <path d="M44 50H156V130H44Z" fill="var(--hn-wood)" strokeWidth={1.8} />
        <path d="M52 58H148V124H52Z" fill="var(--hn-wax)" strokeWidth={1.2} />
        <g clipPath="url(#hny-cap-clip)">
          {CAPPED_CELLS.map((c) => (
            <path
              key={c.d}
              d={c.d}
              fill={c.kind ? "var(--hn-honey)" : "none"}
              strokeWidth={0.75}
              strokeOpacity={0.45}
            />
          ))}
          <path
            className="hny-a hny-sheen"
            d="M26 52h12l-22 80h-12Z"
            fill="#FFFFFF"
            stroke="none"
            opacity={0.5}
          />
        </g>
        <path
          className="hny-a hny-drip"
          d="M120 131c0 3 -2.4 5.4 -2.4 7.4a2.4 2.4 0 0 0 4.8 0c0 -2 -2.4 -4.4 -2.4 -7.4Z"
          fill="var(--hn-honey)"
          strokeWidth={0.9}
        />
      </g>

      <g transform="translate(166 82)">
        <g className="hny-a hny-hover">
          <MiniBee s={0.75} />
        </g>
      </g>
      <g transform="translate(30 108)">
        <g className="hny-a hny-hover" style={{ animationDelay: "-.7s" }}>
          <MiniBee s={0.7} flip />
        </g>
      </g>
    </Art>
  );
}

// 6. Harvest: the hand-cranked extractor spins, honey runs from its tap through a muslin cloth into a pot
function Extractor() {
  return (
    <Art>
      <path d="M16 172H184" strokeWidth={1.2} opacity={0.45} />
      <path d="M50 148L44 172M110 148L116 172M80 150V172" strokeWidth={2.2} />
      <path
        d="M42 72H118V140Q118 150 108 150H52Q42 150 42 140Z"
        fill="var(--hn-steel)"
        strokeWidth={1.8}
      />
      <ellipse
        cx="80"
        cy="72"
        rx="38"
        ry="7"
        fill="var(--hn-paper)"
        strokeWidth={1.8}
      />
      <path d="M46 98H114M46 124H114" strokeWidth={1} opacity={0.4} />
      <path
        d="M53 104V142M63 104V144"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        opacity={0.7}
      />
      <path d="M44 66H116" strokeWidth={2.4} />
      <rect
        x="73"
        y="55"
        width="14"
        height="11"
        rx="2"
        fill="var(--hn-steel)"
        strokeWidth={1.6}
      />
      <g className="hny-a hny-crank" style={{ transformOrigin: "92px 58px" }}>
        <path d="M92 58L106 50" strokeWidth={2.2} />
        <circle
          cx="106"
          cy="50"
          r="3.2"
          fill="var(--hn-wood)"
          strokeWidth={1.4}
        />
      </g>
      <circle
        cx="92"
        cy="58"
        r="1.8"
        fill="var(--hn-steel)"
        strokeWidth={1.2}
      />

      {/* tap, and the honey running out */}
      <path d="M118 132H129V138" strokeWidth={2.2} />
      <path d="M124 127.5v4.5" strokeWidth={2} />
      <path
        className="hny-a hny-pour"
        d="M129 139.5V152"
        stroke="var(--hn-honey)"
        strokeWidth={2.6}
        strokeDasharray="5 3"
      />

      {/* pot with a muslin cloth tied over it */}
      <path
        d="M108 152H150L146 172H112Z"
        fill="var(--hn-paper)"
        strokeWidth={1.8}
      />
      <path d="M110 160H148" strokeWidth={1} opacity={0.4} />
      <path
        d="M104 150.5Q129 163 154 150.5Q129 155 104 150.5Z"
        fill="var(--hn-cloth)"
        strokeWidth={1.3}
      />
      <ellipse
        cx="129"
        cy="154.6"
        rx="6.4"
        ry="1.7"
        fill="var(--hn-honey)"
        stroke="none"
      />
      <path d="M106 153.5l-2 4M152 153.5l2 4" strokeWidth={1} />

      {/* a bee hoping for a taste */}
      <g transform="translate(166 128)">
        <g className="hny-a hny-hover">
          <MiniBee s={0.6} />
        </g>
      </g>
    </Art>
  );
}

// 7. Into the jar: honey drizzles off a wooden dipper, the level rises and ripples
function JarPour() {
  return (
    <Art>
      <path d="M24 172H176" strokeWidth={1.2} opacity={0.45} />
      {[
        [38, 165],
        [47.5, 159.5],
        [47.5, 170.5],
        [57, 165],
      ].map(([x, y]) => (
        <path
          key={`${x}${y}`}
          d={hex(x, y, 5.6)}
          fill="var(--hn-honey-soft)"
          strokeWidth={1}
        />
      ))}
      <path d="M160 172V158" strokeWidth={1.2} />
      <Petals
        cx={160}
        cy={154}
        n={5}
        d={2.8}
        rx={2}
        ry={3}
        fill="var(--hn-petal)"
        sw={0.9}
      />
      <circle cx="160" cy="154" r="1.4" fill="var(--hn-pollen)" stroke="none" />

      {/* jar, filling up */}
      <path
        d="M68 104H132V158Q132 172 118 172H82Q68 172 68 158Z"
        fill="var(--hn-glass)"
        strokeWidth={1.8}
      />
      <g className="hny-a hny-level">
        <path
          d="M70.5 124Q100 128 129.5 124V158Q129.5 169.5 118 169.5H82Q70.5 169.5 70.5 158Z"
          fill="var(--hn-honey-soft)"
          stroke="none"
        />
        <path
          d="M70.5 124Q100 128 129.5 124"
          stroke="var(--hn-honey)"
          strokeWidth={1.2}
        />
      </g>
      <path
        d="M68 104H132V158Q132 172 118 172H82Q68 172 68 158Z"
        strokeWidth={1.8}
      />
      <path d="M74 95H126V104H74Z" fill="var(--hn-glass)" strokeWidth={1.8} />
      <path d="M72 95H128" strokeWidth={2.4} />
      <rect
        x="82"
        y="136"
        width="36"
        height="22"
        rx="3"
        fill="var(--hn-paper)"
        strokeWidth={1.2}
      />
      <path d={hex(100, 147, 5)} fill="var(--hn-honey)" strokeWidth={1} />
      <path d="M75 110V154" stroke="#FFFFFF" strokeWidth={2.4} opacity={0.75} />

      {/* the dipper turns slowly in the stream */}
      <g className="hny-a hny-twirl" style={{ transformOrigin: "104px 68px" }}>
        <path d="M148 24L111 61" strokeWidth={2.6} />
        <g transform="rotate(-45 104 68)">
          <ellipse
            cx="104"
            cy="68"
            rx="7.5"
            ry="10.5"
            fill="var(--hn-honey-soft)"
            strokeWidth={1.6}
          />
          <path
            d="M96.8 63H111.2M96.6 68H111.4M96.8 73H111.2"
            strokeWidth={1}
          />
        </g>
      </g>
      <path
        className="hny-a hny-pour"
        d="M103 79C101.4 92 100.4 106 100.2 124"
        stroke="var(--hn-honey)"
        strokeWidth={2.4}
        strokeDasharray="5 3"
      />
      <ellipse
        className="hny-a hny-ripple"
        cx="100"
        cy="125.6"
        rx="5.4"
        ry="1.3"
        stroke="var(--hn-honey)"
        strokeWidth={0.8}
      />
    </Art>
  );
}

/* ---------- Animations (all prefixed hny- so nothing else on the site is affected) ---------- */

const CSS = `
.hny-root svg * { transition: fill .8s ease; }
.hny-art { transform: scale(.96); transform-origin: 50% 100%; transition: color .8s ease, transform .9s cubic-bezier(.2,.8,.2,1); }
.hny-on .hny-art { transform: scale(1); }

/* the flying bee */
.hny-bob { animation: hny-bob .8s ease-in-out infinite alternate; }
.hny-bee-wing { transform-box: fill-box; transform-origin: 50% 100%; animation: hny-flap .07s linear infinite alternate; }
.hny-resting .hny-bee-wing { animation-duration: .45s; }

.hny-flap { transform-box: fill-box; transform-origin: 50% 100%; animation: hny-flap .09s linear infinite alternate; }
.hny-fan .hny-flap { animation-duration: .05s; }
.hny-spin { transform-box: fill-box; transform-origin: center; animation: hny-spin 18s linear infinite; }
.hny-sunglow { opacity: .3; transform-box: fill-box; transform-origin: center; animation: hny-sunglow 3.2s ease-in-out infinite; }
.hny-sway { animation: hny-sway 2.6s ease-in-out infinite alternate; }
.hny-sway-s { animation: hny-sway-s 3s ease-in-out infinite alternate; }
.hny-bloom { animation: hny-bloom 3s ease-in-out infinite; }
.hny-rise { opacity: 0; transform-box: fill-box; animation: hny-rise 2.6s ease-out infinite; }
.hny-float { opacity: 0; transform-box: fill-box; animation: hny-float 3.2s ease-in-out infinite; }
.hny-sip { animation: hny-sip 1.4s ease-in-out infinite; }
.hny-glint { transform-box: fill-box; transform-origin: center; animation: hny-glint 1.8s ease-in-out infinite; }
.hny-home-l { animation: hny-home-l 3.4s ease-in-out infinite; }
.hny-home-r { animation: hny-home-r 3.8s ease-in-out infinite; }
.hny-out { animation: hny-out 3.6s ease-in infinite; }
.hny-dance { animation: hny-dance 1.6s ease-in-out infinite; }
.hny-air { opacity: 0; animation: hny-air 1.2s ease-out infinite; }
.hny-walk { animation: hny-walk 3s ease-in-out infinite alternate; }
.hny-dip { animation: hny-dip 1.6s ease-in-out infinite; }
.hny-lift { animation: hny-lift 2.8s ease-in-out infinite alternate; }
.hny-sheen { animation: hny-sheen 3.4s ease-in-out infinite; }
.hny-drip { opacity: 0; transform-box: fill-box; transform-origin: 50% 0%; animation: hny-drip 2.4s ease-in infinite; }
.hny-hover { animation: hny-hover 1.3s ease-in-out infinite alternate; }
.hny-crank { animation: hny-turn 1.8s linear infinite; }
.hny-pour { animation: hny-pour .55s linear infinite; }
.hny-level { transform-box: fill-box; transform-origin: 50% 100%; animation: hny-level 4s ease-in-out infinite alternate; }
.hny-twirl { animation: hny-twirl 2.4s ease-in-out infinite alternate; }
.hny-ripple { transform-box: fill-box; transform-origin: center; animation: hny-ripple 1.4s ease-out infinite; }

/* The jar glows and golden rays turn once the bee lands on it */
.hny-jarglow { opacity: .45; transform: scale(.9); transition: opacity .8s ease, transform .8s ease; }
.hny-landed .hny-jarglow { opacity: 1; transform: scale(1.06); }
.hny-rays { opacity: 0; transition: opacity 1.2s ease; background: repeating-conic-gradient(from 0deg, rgba(227,162,59,.22) 0deg 4deg, rgba(227,162,59,0) 4deg 15deg); -webkit-mask: radial-gradient(circle, #000 22%, transparent 68%); mask: radial-gradient(circle, #000 22%, transparent 68%); animation: hny-spin 44s linear infinite; }
.hny-landed .hny-rays { opacity: 1; }

/* Steps the bee has not reached yet stay still, and nothing moves while the section is off screen */
.hny-step:not(.hny-on) .hny-a,
.hny-root:not(.hny-live) .hny-a { animation-play-state: paused !important; }

@keyframes hny-bob { from { transform: translateY(-1.5px); } to { transform: translateY(1.5px); } }
@keyframes hny-flap { from { transform: scaleY(1); } to { transform: scaleY(.3); } }
@keyframes hny-spin { to { transform: rotate(360deg); } }
@keyframes hny-sunglow { 0%, 100% { opacity: .2; transform: scale(.9); } 50% { opacity: .6; transform: scale(1.15); } }
@keyframes hny-sway { from { transform: rotate(-2.5deg); } to { transform: rotate(2.5deg); } }
@keyframes hny-sway-s { from { transform: rotate(-1.2deg); } to { transform: rotate(1.2deg); } }
@keyframes hny-bloom { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes hny-rise { 0% { transform: translate(0, 0); opacity: 0; } 20% { opacity: .9; } 100% { transform: translate(4px, -18px); opacity: 0; } }
@keyframes hny-float { 0% { transform: translate(0, 0); opacity: 0; } 25% { opacity: .9; } 100% { transform: translate(8px, -14px); opacity: 0; } }
@keyframes hny-sip { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(4deg); } }
@keyframes hny-glint { 0%, 100% { opacity: .6; transform: scale(.9); } 50% { opacity: 1; transform: scale(1.08); } }
@keyframes hny-home-l { 0% { transform: translate(-72px, -62px); opacity: 0; } 12% { opacity: 1; } 35% { transform: translate(-50px, -40px); } 55% { transform: translate(-36px, -20px); } 78% { transform: translate(-12px, -10px); } 92% { opacity: 1; } 100% { transform: translate(0, 0); opacity: 0; } }
@keyframes hny-home-r { 0% { transform: translate(66px, -64px); opacity: 0; } 12% { opacity: 1; } 40% { transform: translate(42px, -36px); } 62% { transform: translate(28px, -22px); } 82% { transform: translate(10px, -8px); } 92% { opacity: 1; } 100% { transform: translate(0, 0); opacity: 0; } }
@keyframes hny-out { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: 1; } 50% { transform: translate(26px, -30px); } 85% { opacity: 1; } 100% { transform: translate(60px, -72px); opacity: 0; } }
@keyframes hny-dance { 0%, 100% { transform: translateX(0) rotate(0deg); } 25% { transform: translateX(4px) rotate(9deg); } 50% { transform: translateX(8px) rotate(0deg); } 75% { transform: translateX(4px) rotate(-9deg); } }
@keyframes hny-air { 0% { transform: translateX(0); opacity: 0; } 30% { opacity: .8; } 100% { transform: translateX(10px); opacity: 0; } }
@keyframes hny-walk { from { transform: translate(0, 0); } to { transform: translate(14px, -4px); } }
@keyframes hny-dip { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(1.5px) rotate(-6deg); } }
@keyframes hny-lift { from { transform: translateY(2px); } to { transform: translateY(-3px); } }
@keyframes hny-sheen { 0% { transform: translateX(0); } 60%, 100% { transform: translateX(160px); } }
@keyframes hny-drip { 0% { transform: translateY(0) scale(.5); opacity: 0; } 18% { transform: translateY(0) scale(1); opacity: 1; } 55% { transform: translateY(2px) scaleY(1.25); opacity: 1; } 100% { transform: translateY(16px) scaleY(1.1); opacity: 0; } }
@keyframes hny-hover { from { transform: translate(0, 0); } to { transform: translate(3px, -4px); } }
@keyframes hny-turn { to { transform: rotate(360deg); } }
@keyframes hny-pour { to { stroke-dashoffset: -16; } }
@keyframes hny-level { from { transform: scaleY(.86); } to { transform: scaleY(1); } }
@keyframes hny-twirl { from { transform: rotate(-3deg); } to { transform: rotate(3deg); } }
@keyframes hny-ripple { 0% { transform: scale(.3); opacity: .9; } 100% { transform: scale(2.2); opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .hny-root .hny-a { animation: none !important; }
  .hny-root .hny-rise, .hny-root .hny-float, .hny-root .hny-air { opacity: .5; }
  .hny-root .hny-drip { opacity: 0; }
}
`;
