"use client";

import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  subtitle?: string;
}

export default function Footer({ subtitle = "Class 10S4 \u00b7 A student workshop" }: FooterProps) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Image className="foot-mark" src="/nueva-logo.png" alt="Nueva logo" width={60} height={60} />
            <div className="foot-brand">Nueva</div>
            <p>{subtitle}</p>
          </div>
          <div className="foot-links">
            <Link href="/#about">About</Link>
            <Link href="/#projects">Workshop</Link>
            <Link href="/arcade">Arcade</Link>
            <Link href="/#try">Valkyrie</Link>
            <Link href="/#team">Team</Link>
          </div>
        </div>
        <div className="copyr">&copy; {new Date().getFullYear()} Nueva &middot; Class 10S4 &middot; Built in cardboard &amp; blueprint blue.</div>
      </div>
    </footer>
  );
}
