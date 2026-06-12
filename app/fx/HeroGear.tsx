"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   THE DRAFTING ENGINE — hero schematic
   A working instrument: three meshing gears (speeds locked to
   tooth ratios), a slotted plotter arm riding the main crank pin,
   a maroon ink trail left by the nib, and a live angle readout.
   Decorative; aria-hidden. Respects prefers-reduced-motion.
   ============================================================ */

/* deterministic gear outline (SSR-safe — no randomness) */
function gearPath(r: number, teeth: number, toothH: number, inner = 0.86): string {
  const pts: string[] = [];
  const steps = teeth * 4;
  for (let i = 0; i <= steps; i++) {
    const seg = i % 4;                     // 0 rise,1 top,2 fall,3 valley
    const th = (i / steps) * Math.PI * 2;
    const rad = seg === 1 || seg === 2 ? r + toothH : r * inner + (seg === 0 ? 0 : 0);
    const rr = seg === 1 || seg === 2 ? r + toothH : r;
    pts.push(`${(Math.cos(th) * rr).toFixed(1)} ${(Math.sin(th) * rr).toFixed(1)}`);
  }
  return "M" + pts.join(" L") + " Z";
}
function spokes(r: number, n: number): string {
  let d = "";
  for (let i = 0; i < n; i++) {
    const th = (i / n) * Math.PI * 2;
    d += `M${(Math.cos(th) * 14).toFixed(1)} ${(Math.sin(th) * 14).toFixed(1)} L${(Math.cos(th) * r).toFixed(1)} ${(Math.sin(th) * r).toFixed(1)} `;
  }
  return d;
}

const G1 = { x: 186, y: 224, r: 92, teeth: 22, spin: 17 };   // main wheel (s per rev)
const G2 = { x: 306, y: 130, r: 46, teeth: 11 };             // upper satellite
const G3 = { x: 96,  y: 300, r: 28, teeth: 7  };             // lower pinion
const PIVOT = { x: 352, y: 312 };                            // plotter arm anchor
const PIN_R = 58;                                            // crank pin radius on main wheel
const TRAIL_N = 64;

const g1d = gearPath(G1.r, G1.teeth, 10);
const g2d = gearPath(G2.r, G2.teeth, 8);
const g3d = gearPath(G3.r, G3.teeth, 7);
const g1s = spokes(G1.r * 0.66, 5);

export default function HeroGear() {
  const ref = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = ref.current, wrap = wrapRef.current;
    if (!svg || !wrap) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (id: string) => svg.querySelector<SVGGraphicsElement>("#" + id);
    const w1 = $("hgG1"), w2 = $("hgG2"), w3 = $("hgG3"),
      arm = $("hgArm"), nib = $("hgNib"), pin = $("hgPin"),
      trail = svg.querySelector<SVGPolylineElement>("#hgTrail"),
      readout = svg.querySelector<SVGTextElement>("#hgRead");
    if (!w1 || !w2 || !w3 || !arm || !nib || !pin || !trail) return;

    if (reduced) {                                  // static but composed pose
      const th = 0.8, px = G1.x + Math.cos(th) * PIN_R, py = G1.y + Math.sin(th) * PIN_R;
      const aa = (Math.atan2(py - PIVOT.y, px - PIVOT.x) * 180) / Math.PI;
      arm.setAttribute("transform", `rotate(${aa} ${PIVOT.x} ${PIVOT.y})`);
      pin.setAttribute("transform", `translate(${px} ${py})`);
      return;
    }

    let raf = 0, t0 = performance.now();
    const trailPts: string[] = [];
    let tickAcc = 0, tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const fine = matchMedia("(pointer: fine)").matches;
    if (fine) { wrap.addEventListener("pointermove", onMove); wrap.addEventListener("pointerleave", onLeave); }

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const a1 = (t / G1.spin) * 360;                       // main wheel angle (deg)
      const ratio12 = G1.teeth / G2.teeth, ratio13 = G1.teeth / G3.teeth;
      w1.setAttribute("transform", `rotate(${a1.toFixed(2)} ${G1.x} ${G1.y})`);
      w2.setAttribute("transform", `rotate(${(-a1 * ratio12 + 8).toFixed(2)} ${G2.x} ${G2.y})`);
      w3.setAttribute("transform", `rotate(${(-a1 * ratio13 + 14).toFixed(2)} ${G3.x} ${G3.y})`);

      // crank pin rides the main wheel; slotted arm pivots to follow it
      const th = (a1 * Math.PI) / 180;
      const px = G1.x + Math.cos(th) * PIN_R, py = G1.y + Math.sin(th) * PIN_R;
      pin.setAttribute("transform", `translate(${px.toFixed(1)} ${py.toFixed(1)})`);
      const aa = (Math.atan2(py - PIVOT.y, px - PIVOT.x) * 180) / Math.PI;
      arm.setAttribute("transform", `rotate(${aa.toFixed(2)} ${PIVOT.x} ${PIVOT.y})`);

      // nib = a point 132px out along the arm; lay down fading ink
      const ar = (aa * Math.PI) / 180;
      const nx = PIVOT.x + Math.cos(ar) * 132, ny = PIVOT.y + Math.sin(ar) * 132;
      nib.setAttribute("transform", `translate(${nx.toFixed(1)} ${ny.toFixed(1)})`);
      tickAcc += 1;
      if (tickAcc % 6 === 0) {
        trailPts.push(`${nx.toFixed(1)},${ny.toFixed(1)}`);
        if (trailPts.length > TRAIL_N) trailPts.shift();
        trail.setAttribute("points", trailPts.join(" "));
      }
      if (readout && tickAcc % 14 === 0) {
        const deg = ((a1 % 360) + 360) % 360;
        readout.textContent = "\u2220 " + deg.toFixed(0).padStart(3, "0") + "\u00b0 \u00b7 " + (60 / G1.spin).toFixed(1) + " RPM";
      }

      // pointer parallax (lerped)
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      const stage = wrap.querySelector<HTMLElement>(".stage");
      if (stage) stage.style.transform = `rotateX(${(-cy * 6).toFixed(2)}deg) rotateY(${(cx * 7).toFixed(2)}deg)`;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      if (fine) { wrap.removeEventListener("pointermove", onMove); wrap.removeEventListener("pointerleave", onLeave); }
    };
  }, []);

  return (
    <div className="schematic" ref={wrapRef} aria-hidden="true">
      <div className="stage">
        <svg ref={ref} viewBox="0 0 400 400">
          {/* sheet furniture */}
          <path className="bp-thin" d="M8 8h14M8 8v14 M392 8h-14M392 8v14 M8 392h14M8 392v-14 M392 392h-14M392 392v-14" />
          <path className="bp-dash" d="M186 14v420M-20 224h440" transform="translate(0 -10)" />
          <circle className="bp-dash" cx={G1.x} cy={G1.y} r={G1.r + 22} />

          {/* main wheel */}
          <g id="hgG1">
            <g transform={`translate(${G1.x} ${G1.y})`}>
              <path className="hg-teeth" d={g1d} />
              <circle className="bp-line" r={G1.r * 0.66} />
              <path className="bp-line-2" d={g1s} />
              <circle className="bp-fill" r={G1.r * 0.66} />
              <circle className="bp-line" r="14" />
              <circle className="bp-dot" r="4" />
            </g>
          </g>

          {/* satellites */}
          <g id="hgG2">
            <g transform={`translate(${G2.x} ${G2.y})`}>
              <path className="hg-teeth2" d={g2d} />
              <circle className="bp-line-2" r={G2.r * 0.55} />
              <circle className="bp-dot" r="3" />
            </g>
          </g>
          <g id="hgG3">
            <g transform={`translate(${G3.x} ${G3.y})`}>
              <path className="hg-teeth2" d={g3d} />
              <circle className="bp-line-2" r={G3.r * 0.5} />
              <circle className="bp-dot" r="2.5" />
            </g>
          </g>

          {/* ink trail + plotter arm (slotted link on the crank pin) */}
          <polyline id="hgTrail" className="hg-trail" points="" />
          <g id="hgArm">
            <line className="hg-arm" x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x + 150} y2={PIVOT.y} />
            <line className="hg-slot" x1={PIVOT.x + 36} y1={PIVOT.y} x2={PIVOT.x + 118} y2={PIVOT.y} />
          </g>
          <circle className="bp-line" cx={PIVOT.x} cy={PIVOT.y} r="9" />
          <circle className="bp-dot" cx={PIVOT.x} cy={PIVOT.y} r="3" />
          <g id="hgPin"><circle className="hg-pin" r="5" /></g>
          <g id="hgNib"><path className="hg-nibp" d="M0 -7 L5 4 L-5 4 Z" /></g>

          {/* callouts */}
          <path className="bp-thin" d={`M${G2.x + G2.r + 10} ${G2.y} h34`} />
          <text className="bp-label" x={G2.x + G2.r + 48} y={G2.y + 3}>R{G2.r}</text>
          <path className="bp-thin" d={`M${G1.x} ${G1.y + G1.r + 14} v22`} />
          <text className="bp-label" x={G1.x - 28} y={G1.y + G1.r + 48}>N={G1.teeth}T</text>
          <text id="hgRead" className="hg-read" x="20" y="385">&#8736; 000&#176; &#183; 2.3 RPM</text>
          <text className="bp-label" x="296" y="385">FIG. 00 &#8212; DRIVE</text>
        </svg>
      </div>
    </div>
  );
}
