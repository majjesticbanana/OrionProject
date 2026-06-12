"use client";

import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  subtitle?: string;
}

export default function Footer({ subtitle = "Class 10S4 · A student workshop" }: FooterProps) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Image className="foot-mark" src="/nueva-logo.png" alt="Nueva logo" width={60} height={60} />
            <div className="foot-brand">Nueva</div>
            <p>{subtitle}</p>
          </div>

          <div className="foot-links" aria-label="Footer navigation">
            <Link href="/#about">About</Link>
            <Link href="/#projects">Workshop</Link>
            <Link href="/#try">Valkyrie</Link>
            <Link href="/arcade">Arcade</Link>
            <Link href="/alacritas">Alacritas</Link>
            <Link href="/#team">Team</Link>
          </div>
        </div>

        <div className="copyr">
          &copy; {new Date().getFullYear()} Nueva &middot; Class 10S4 &middot; Built in cardboard, caf&eacute; light, and prototype energy.
        </div>
      </div>
    </footer>
  );
}
