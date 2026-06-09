"use client";

import { useEffect, useRef } from "react";

export default function BlueprintSchematic() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stage = root.querySelector<SVGElement>("#bpStage");
    const core = root.querySelector<SVGGElement>("#coreSpin");
    const satA = root.querySelector<SVGGElement>("#satA");
    const satB = root.querySelector<SVGGElement>("#satB");
    const spinA = root.querySelector<SVGGElement>("#satAspin");
    const spinB = root.querySelector<SVGGElement>("#satBspin");
    const gauge = root.querySelector<SVGCircleElement>("#bpGauge");
    const meshA = root.querySelector<SVGPathElement>("#meshA");
    const meshB = root.querySelector<SVGPathElement>("#meshB");
    const dimA = root.querySelector<SVGPathElement>("#dimA");
    const dims = root.querySelector<SVGGElement>("#bpDims");
    const readout = root.querySelector<SVGTextElement>("#bpReadout");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!stage || !core || !satA || !satB || !gauge || !meshA || !meshB || !dimA || !dims) return;

    // All refs validated above — alias with non-null types for inner functions
    const _satA = satA, _satB = satB, _meshA = meshA, _meshB = meshB;
    const _gauge = gauge, _dimA = dimA, _dims = dims, _core = core;
    const _stage = stage;

    const C = 100;
    const fmt = (p: number[]) => p[0].toFixed(2) + " " + p[1].toFixed(2);

    function cog(cx: number, cy: number, teeth: number, ro: number, ri: number) {
      let d = "",
        step = (Math.PI * 2) / teeth,
        tw = step * 0.34;
      for (let i = 0; i < teeth; i++) {
        const a = i * step;
        const pa = [cx + Math.cos(a - tw) * ri, cy + Math.sin(a - tw) * ri];
        const pb = [cx + Math.cos(a - tw * 0.55) * ro, cy + Math.sin(a - tw * 0.55) * ro];
        const pc = [cx + Math.cos(a + tw * 0.55) * ro, cy + Math.sin(a + tw * 0.55) * ro];
        const pd = [cx + Math.cos(a + tw) * ri, cy + Math.sin(a + tw) * ri];
        d += (i ? "L" : "M") + fmt(pa) + "L" + fmt(pb) + "L" + fmt(pc) + "L" + fmt(pd);
      }
      return d + "Z";
    }

    root.querySelector("#coreCog")?.setAttribute("d", cog(C, C, 18, 54, 46));
    root.querySelector("#satAcog")?.setAttribute("d", cog(0, 0, 7, 20, 15));
    root.querySelector("#satBcog")?.setAttribute("d", cog(0, 0, 7, 20, 15));

    let tk = "";
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2,
        big = i % 5 === 0,
        r1 = 92,
        r2 = 92 - (big ? 7 : 4);
      tk +=
        "M" + fmt([C + Math.cos(a) * r2, C + Math.sin(a) * r2]) +
        "L" + fmt([C + Math.cos(a) * r1, C + Math.sin(a) * r1]);
    }
    root.querySelector("#bpTicks")?.setAttribute("d", tk);

    const GC = 2 * Math.PI * 92;
    gauge.style.strokeDasharray = String(GC);
    dimA.style.strokeDasharray = "88";

    const seatA = { x: 50, y: 50 }, seatB = { x: 150, y: 150 };
    const expA = { x: 22, y: 22 }, expB = { x: 178, y: 178 };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let coreAng = 0, vel = 0, prog = 0, progT = 0, lastY = window.scrollY || 0;
    let tiltX = 0, tiltY = 0, tiltXT = 0, tiltYT = 0, raf = 0;

    function targetProgress() {
      const hero = root!.closest(".hero");
      const h = hero ? (hero as HTMLElement).offsetHeight : window.innerHeight;
      return Math.max(0, Math.min(1, (window.scrollY || 0) / (h * 0.85)));
    }

    function paint(p: number) {
      const ax = lerp(expA.x, seatA.x, p), ay = lerp(expA.y, seatA.y, p);
      const bx = lerp(expB.x, seatB.x, p), by = lerp(expB.y, seatB.y, p);
      _satA.setAttribute("transform", "translate(" + ax + " " + ay + ")");
      _satB.setAttribute("transform", "translate(" + bx + " " + by + ")");
      _satA.style.opacity = _satB.style.opacity = (0.22 + 0.78 * p).toFixed(3);
      _meshA.setAttribute("d", "M" + C + " " + C + "L" + ax.toFixed(1) + " " + ay.toFixed(1));
      _meshB.setAttribute("d", "M" + C + " " + C + "L" + bx.toFixed(1) + " " + by.toFixed(1));
      const la = Math.hypot(ax - C, ay - C), lb = Math.hypot(bx - C, by - C);
      _meshA.style.strokeDasharray = String(la);
      _meshA.style.strokeDashoffset = (la * (1 - p)).toFixed(2);
      _meshB.style.strokeDasharray = String(lb);
      _meshB.style.strokeDashoffset = (lb * (1 - p)).toFixed(2);
      _gauge.style.strokeDashoffset = (GC * (1 - p)).toFixed(2);
      _dimA.style.strokeDashoffset = (88 * (1 - p)).toFixed(2);
      _dims.style.opacity = (0.18 + 0.82 * p).toFixed(3);
      if (readout) readout.textContent = "ASSEMBLY " + String(Math.round(p * 100)).padStart(3, "0") + "%";
    }

    function spin() {
      _core.setAttribute("transform", "rotate(" + coreAng.toFixed(2) + " " + C + " " + C + ")");
      const s = (-coreAng * 2.7).toFixed(2);
      if (spinA) spinA.setAttribute("transform", "rotate(" + s + ")");
      if (spinB) spinB.setAttribute("transform", "rotate(" + s + ")");
    }

    if (reduce) {
      coreAng = 0;
      spin();
      const r = () => { prog = targetProgress(); paint(prog); };
      window.addEventListener("scroll", r, { passive: true });
      r();
      return () => window.removeEventListener("scroll", r);
    }

    function frame() {
      raf = 0;
      prog += (progT - prog) * 0.12;
      vel *= 0.90;
      coreAng += 0.22 + vel;
      spin();
      paint(prog);
      tiltX += (tiltXT - tiltX) * 0.08;
      tiltY += (tiltYT - tiltY) * 0.08;
      _stage.style.transform = "rotateX(" + tiltX.toFixed(2) + "deg) rotateY(" + tiltY.toFixed(2) + "deg)";
      kick();
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    const onScroll = () => {
      progT = targetProgress();
      const y = window.scrollY || 0;
      vel += (y - lastY) * 0.05;
      lastY = y;
      kick();
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = root!.getBoundingClientRect();
      tiltYT = ((e.clientX - r.left) / r.width - 0.5) * 10;
      tiltXT = -((e.clientY - r.top) / r.height - 0.5) * 10;
    };
    const onPointerLeave = () => { tiltXT = 0; tiltYT = 0; };

    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);

    progT = targetProgress();
    kick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="schematic" ref={rootRef} aria-hidden="true">
      <div className="stage" id="bpStage">
        <svg viewBox="0 0 200 200">
          <path className="bp-thin" d="M12 12h16M12 12v16 M188 12h-16M188 12v16 M12 188h16M12 188v-16 M188 188h-16M188 188v-16" />
          <path className="bp-dash" d="M100 16V184 M16 100H184" opacity=".22" />
          <path id="bpTicks" className="bp-line-2" opacity=".5" />
          <circle id="bpGauge" cx="100" cy="100" r="92" className="bp-accent" transform="rotate(-90 100 100)" />
          <path id="meshA" className="bp-dash" />
          <path id="meshB" className="bp-dash" />
          <g id="satA">
            <circle className="bp-fill" cx="0" cy="0" r="20" />
            <g id="satAspin">
              <path id="satAcog" className="bp-line-2" />
              <path className="bp-line-2" d="M0 -20V20M-20 0H20" opacity=".5" />
            </g>
            <circle className="bp-line" cx="0" cy="0" r="4" />
          </g>
          <g id="satB">
            <circle className="bp-fill" cx="0" cy="0" r="20" />
            <g id="satBspin">
              <path id="satBcog" className="bp-line-2" />
              <path className="bp-line-2" d="M0 -20V20M-20 0H20" opacity=".5" />
            </g>
            <circle className="bp-line" cx="0" cy="0" r="4" />
          </g>
          <g id="coreSpin">
            <circle className="bp-fill" cx="100" cy="100" r="54" />
            <path id="coreCog" className="bp-line" />
            <circle className="bp-line-2" cx="100" cy="100" r="40" />
            <g className="bp-line-2" opacity=".55">
              <path d="M100 60V140M60 100H140M71 71L129 129M129 71L71 129" />
            </g>
            <circle className="bp-line" cx="100" cy="100" r="13" />
          </g>
          <circle cx="100" cy="100" r="4" className="bp-dot" />
          <g id="bpDims">
            <path id="dimA" className="bp-line-2" d="M100 100H188" />
            <path className="bp-line-2" d="M188 96v8" />
            <text className="bp-label" x="120" y="95">R 54.0</text>
          </g>
          <text className="bp-label" x="13" y="180">NUEVA / FIG.01</text>
          <text className="bp-label" x="150" y="180">10S4</text>
          <text className="bp-label" id="bpReadout" x="13" y="192">ASSEMBLY 000%</text>
        </svg>
      </div>
    </div>
  );
}
