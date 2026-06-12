"use client";

import Link from "next/link";
import Image from "next/image";

interface NavProps {
  activeLink?: string;
}

const NAV_LINKS = [
  { key: "about", label: "About", href: "/#about", scroll: true },
  { key: "projects", label: "Workshop", href: "/#projects", scroll: true },
  { key: "try", label: "Valkyrie", href: "/#try", scroll: true },
  { key: "arcade", label: "Arcade", href: "/arcade", scroll: false },
  { key: "alacritas", label: "Alacritas", href: "/alacritas", scroll: false, spotlight: true },
  { key: "team", label: "Team", href: "/#team", scroll: true },
];

export default function Nav({ activeLink }: NavProps) {
  return (
    <nav aria-label="Main navigation">
      <div className="wrap nav-inner">
        <Link href="/#top" className="brand" aria-label="Nueva home">
          <Image className="mark" src="/nueva-logo.png" alt="Nueva logo" width={34} height={34} priority />
          Nueva
        </Link>

        <ul className="navlinks">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                data-scroll-link={link.scroll ? "true" : undefined}
                className={[activeLink === link.key ? "active" : "", link.spotlight ? "nav-spotlight" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
