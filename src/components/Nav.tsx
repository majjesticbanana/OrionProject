"use client";

import Link from "next/link";
import Image from "next/image";

interface NavProps {
  activeLink?: string;
}

export default function Nav({ activeLink }: NavProps) {
  return (
    <nav>
      <div className="wrap nav-inner">
        <Link href="/#top" className="brand">
          <Image className="mark" src="/nueva-logo.png" alt="Nueva logo" width={34} height={34} />
          Nueva
        </Link>
        <ul className="navlinks">
          <li><Link href="/#about" className={activeLink === "about" ? "active" : ""}>About</Link></li>
          <li><Link href="/#projects" className={activeLink === "projects" ? "active" : ""}>Workshop</Link></li>
          <li><Link href="/#try" className={activeLink === "try" ? "active" : ""}>Valkyrie</Link></li>
          <li><Link href="/arcade" className={activeLink === "arcade" ? "active" : ""}>Arcade</Link></li>
          <li><Link href="/#team" className={activeLink === "team" ? "active" : ""}>Team</Link></li>
        </ul>
      </div>
    </nav>
  );
}
