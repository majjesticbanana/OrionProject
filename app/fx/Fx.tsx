"use client";

import { useEffect } from "react";

/* Site-wide flourishes: the maroon plotter rail that draws itself down the
   left margin as you scroll, and the drafting-compass cursor (desktop only).
   Both bail out for touch devices and reduced-motion users. */
export default function Fx() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ---------- plotter rail ---------- */
    const rail = document.createElement("div");
    rail.id = "plotter";
    rail.innerHTML =
      '<div class="rail"></div><div class="fill"></div><div class="nib"></div>' +
      [12, 28, 44, 60, 76, 92].map((p) => `<div class="tick" style="top:${p}%"></div>`).join("");
    document.body.appendChild(rail);
    const fill = rail.querySelector<HTMLElement>(".fill")!;
    const nib = rail.querySelector<HTMLElement>(".nib")!;

    let raf = 0;
    let cur = 0, target = 0;
    const measure = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - innerHeight;
      target = max > 0 ? scrollY / max : 0;
      kick();
    };
    const frame = () => {
      raf = 0;
      cur += (target - cur) * 0.12;
      const pct = cur * 100;
      fill.style.height = pct + "%";
      nib.style.top = pct + "%";
      if (Math.abs(target - cur) > 0.0008) kick();
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    addEventListener("scroll", measure, { passive: true });
    addEventListener("resize", measure);
    measure();

    /* ---------- drafting cursor ---------- */
    let dot: HTMLElement | null = null, ring: HTMLElement | null = null;
    let craf = 0, dx = 0, dy = 0, rx = 0, ry = 0, shown = false;
    const fine = matchMedia("(pointer: fine)").matches;
    if (fine) {
      dot = document.createElement("div"); dot.id = "cur-dot";
      ring = document.createElement("div"); ring.id = "cur-ring";
      document.body.append(dot, ring);
      const cframe = () => {
        craf = 0;
        rx += (dx - rx) * 0.16;
        ry += (dy - ry) * 0.16;
        dot!.style.transform = `translate(${dx}px,${dy}px) rotate(45deg)`;
        ring!.style.transform = `translate(${rx}px,${ry}px)`;
        if (Math.abs(dx - rx) > 0.3 || Math.abs(dy - ry) > 0.3) ckick();
      };
      const ckick = () => { if (!craf) craf = requestAnimationFrame(cframe); };
      const onMove = (e: PointerEvent) => {
        dx = e.clientX; dy = e.clientY;
        if (!shown) { shown = true; document.body.classList.add("cur-on"); rx = dx; ry = dy; }
        ckick();
      };
      const onOver = (e: PointerEvent) => {
        const hot = (e.target as Element | null)?.closest?.("a,button,[role=button]");
        document.body.classList.toggle("cur-hot", !!hot);
      };
      const onLeave = () => { shown = false; document.body.classList.remove("cur-on"); };
      addEventListener("pointermove", onMove, { passive: true });
      addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      removeEventListener("scroll", measure);
      removeEventListener("resize", measure);
      rail.remove(); dot?.remove(); ring?.remove();
      document.body.classList.remove("cur-on", "cur-hot");
      if (raf) cancelAnimationFrame(raf);
      if (craf) cancelAnimationFrame(craf);
    };
  }, []);

  return null;
}
