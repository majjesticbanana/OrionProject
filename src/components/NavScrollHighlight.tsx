"use client";

import { useEffect } from "react";

export default function NavScrollHighlight() {
  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".navlinks a[data-scroll-link='true']")];
    const secs = ["about", "projects", "try", "team"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!links.length || !secs.length) return;

    const handler = () => {
      let cur = "";

      secs.forEach((section) => {
        if (section.getBoundingClientRect().top < 220) {
          cur = section.id;
        }
      });

      links.forEach((link) => {
        const href = link.getAttribute("href") || "";
        link.classList.toggle("active", Boolean(cur) && href.endsWith(`#${cur}`));
      });
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return null;
}
