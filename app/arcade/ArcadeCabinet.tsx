"use client";

import { useEffect, useRef } from "react";

export default function ArcadeCabinet() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = document.getElementById("cabStage");
    if (!wrap || !stage || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = wrap.closest(".ahero");
    let tx = 0, ty = 0, txT = 0, tyT = 0, py = 0, pyT = 0, sx = 0, sxT = 0, raf = 0;

    function onScroll() {
      const h = hero ? (hero as HTMLElement).offsetHeight : innerHeight;
      const p = Math.max(0, Math.min(1, (scrollY || 0) / (h * 0.9)));
      pyT = p * -16;
      sxT = p * 3.5;
      kick();
    }
    function frame() {
      raf = 0;
      tx += (txT - tx) * 0.1;
      ty += (tyT - ty) * 0.1;
      py += (pyT - py) * 0.12;
      sx += (sxT - sx) * 0.12;
      stage!.style.transform =
        "translateY(" + py.toFixed(2) + "px) rotateX(" + (tx + sx).toFixed(2) + "deg) rotateY(" + ty.toFixed(2) + "deg)";
      if (Math.abs(txT - tx) > 0.02 || Math.abs(tyT - ty) > 0.02 || Math.abs(pyT - py) > 0.1 || Math.abs(sxT - sx) > 0.02) kick();
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    const onPointerMove = (e: PointerEvent) => {
      const r = wrap!.getBoundingClientRect();
      tyT = ((e.clientX - r.left) / r.width - 0.5) * 12;
      txT = -((e.clientY - r.top) / r.height - 0.5) * 12;
      kick();
    };
    const onPointerLeave = () => { txT = 0; tyT = 0; kick(); };

    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cabwrap" ref={wrapRef}>
      <div className="cab-stage" id="cabStage">
        <div className="cab">
          <svg viewBox="0 0 200 264" aria-hidden="true">
            <defs><clipPath id="scr"><rect x="72" y="68" width="56" height="40" rx="1" /></clipPath></defs>
            <path className="bp-thin" d="M16 16h14M16 16v14 M184 16h-14M184 16v14 M16 248h14M16 248v-14 M184 248h-14M184 248v-14" />
            <rect className="bp-fill" x="62" y="30" width="76" height="200" rx="6" />
            <rect className="bp-line draw" x="62" y="30" width="76" height="200" rx="6" />
            <rect className="bp-fill mqglow anim" x="70" y="37" width="60" height="18" rx="2" />
            <rect className="bp-line-2 draw d2" x="70" y="37" width="60" height="18" rx="2" />
            <text className="bp-label fade" x="100" y="49" textAnchor="middle" style={{ fontSize: "8px", fill: "var(--blueprint)", letterSpacing: ".3em" }}>NUEVA</text>
            <rect className="bp-line draw d2" x="66" y="62" width="68" height="52" rx="3" />
            <rect className="bp-line-2 draw d2" x="72" y="68" width="56" height="40" rx="1" />
            <g className="fade" clipPath="url(#scr)">
              <rect className="bp-fill" x="72" y="68" width="56" height="40" />
              <path className="bp-thin" d="M72 78h56 M72 88h56 M72 98h56" opacity=".35" />
              <rect className="scanline anim" x="72" y="68" width="56" height="2" fill="#2f5d8a" opacity=".35" />
              <rect className="ball anim" x="84" y="74" width="7" height="7" fill="#2f5d8a" />
              <rect className="paddle anim" x="91" y="102" width="18" height="3" rx="1.5" fill="#f1dfcc" />
            </g>
            <path className="bp-fill" d="M58 128 H142 L148 152 H52 Z" />
            <path className="bp-line draw d3" d="M58 128 H142 L148 152 H52 Z" />
            <circle className="bp-line-2 draw d3" cx="82" cy="144" r="7" />
            <circle className="bp-line-2 draw d3" cx="118" cy="144" r="7" />
            <g className="jb1 anim"><path className="bp-line-2" d="M82 144v-13" /><circle className="bp-dot" cx="82" cy="129" r="3" /></g>
            <g className="jb2 anim"><path className="bp-line-2" d="M118 144v-13" /><circle className="bp-dot" cx="118" cy="129" r="3" /></g>
            <circle className="bp-line-2 fade" cx="98" cy="147" r="2.4" />
            <circle className="bp-line-2 fade" cx="105" cy="147" r="2.4" />
            <circle className="bp-dot led anim" cx="138" cy="146" r="2.4" />
            <path className="bp-line-2 draw d4" d="M64 162 H136" />
            <rect className="bp-line draw d4" x="86" y="190" width="28" height="24" rx="1" />
            <path className="bp-thin fade" d="M100 195v5 M94 207h12" />
            <path className="bp-line-2 draw d4" d="M64 222 H136" />
            <path className="bp-dash fade" d="M158 30 V230" />
            <path className="bp-line-2 fade" d="M154 30h8 M154 230h8" />
            <text className="bp-label fade" x="163" y="130" transform="rotate(90 163 130)">H 200</text>
            <text className="bp-label fade" x="22" y="246">NUEVA / ARCADE</text>
            <text className="bp-label fade" x="150" y="246">FIG.01</text>
          </svg>
        </div>
        <p className="cue"><span>&#9662; Scroll</span></p>
      </div>
    </div>
  );
}
