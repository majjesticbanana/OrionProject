"use client";

import { useEffect } from "react";

export default function NavScrollHighlight() {
  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".navlinks a")];
    const secs = ["about", "projects", "try", "team"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const handler = () => {
      let cur = "";
      secs.forEach((s) => {
        if (s.getBoundingClientRect().top < 200) cur = s.id;
      });
      links.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + cur)
      );
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return null;
}
