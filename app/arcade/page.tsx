import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import RevealObserver from "@/components/RevealObserver";
import ArcadeCabinet from "./ArcadeCabinet";
import ArcadeGames from "./ArcadeGames";
import Fx from "../fx/Fx";
import Swirls from "../fx/Swirls";
import "./arcade.css";

export const metadata: Metadata = {
  title: "The Arcade — Nueva",
  description: "The Arcade — retro games designed and built by Nueva. Browse the cabinet.",
};

export default function ArcadePage() {
  return (
    <>
      <ScrollProgress />
      <RevealObserver />
      <Fx />
      <Nav activeLink="arcade" />

      {/* HERO */}
      <div className="wrap" id="top">
        <section className="ahero">
          <Swirls />
          <div>
            <div className="eyebrow">Welcome to</div>
            <h1>The Arcade</h1>
            <div className="htag">Built &middot; Pixel &middot; Head-to-head</div>
            <p className="lead">
              Retro games we <b>designed and built ourselves</b>, played on modern controllers. Old soul, new tech &mdash; and the engine that keeps the caf&eacute; buzzing. Browse the cabinet below.
            </p>
            <ArcadeStats />
            <div className="cta-row">
              <a href="#cabinet" className="btn btn-primary">Browse games</a>
              <Link href="/" className="btn btn-ghost">&larr; Back to Nueva</Link>
            </div>
          </div>
          <ArcadeCabinet />
        </section>
      </div>

      {/* FILTER DECK */}
      <ArcadeGames />

      <Footer subtitle="The Arcade" />
    </>
  );
}

function ArcadeStats() {
  const GAMES = [
    { status: "live" },
    { status: "live" },
    { status: "live" },
    { status: "live" },
    { status: "live" },
    { status: "live" },
    { status: "live" },
    { status: "live" },
  ];
  const nLive = GAMES.filter((g) => g.status === "live").length;
  return (
    <div className="hstats">
      <div className="hstat">
        <div className="n">{String(nLive).padStart(2, "0")}</div>
        <div className="l">Playable now</div>
      </div>
      <div className="hstat">
        <div className="n">{String(GAMES.length - nLive).padStart(2, "0")}</div>
        <div className="l">On the bench</div>
      </div>
      <div className="hstat">
        <div className="n">{String(GAMES.length).padStart(2, "0")}</div>
        <div className="l">Total cabinet</div>
      </div>
    </div>
  );
}
