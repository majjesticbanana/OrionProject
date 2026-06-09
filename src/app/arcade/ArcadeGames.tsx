"use client";

import { useState, useMemo } from "react";

interface Game {
  title: string;
  genre: string;
  players: string;
  status: "live" | "dev" | "soon";
  href?: string;
  icon: string;
}

const GAMES: Game[] = [
  { title: "Nueva Penalty", genre: "Sports \u00b7 Skill", players: "2", status: "live", href: "/games/orion_penalty.html", icon: "ball" },
  { title: "Nueva Showdown", genre: "Action \u00b7 Boss", players: "1", status: "live", href: "/games/OrionShowdownSingleFile.html", icon: "boss" },
  { title: "Nueva Rider", genre: "Race \u00b7 Reflex", players: "1", status: "live", href: "/games/orion_rider.html", icon: "rocket" },
  { title: "Nueva Hoops", genre: "Sports \u00b7 Versus", players: "2", status: "live", href: "/games/orion_hoops.html", icon: "pong" },
  { title: "Nueva Depot", genre: "Co-op \u00b7 Sorting", players: "2", status: "live", href: "/games/orion_depot.html", icon: "pad" },
];

const ICONS: Record<string, string> = {
  ball: '<rect x="24" y="12" width="72" height="34" class="bp-line-2"/><path class="bp-thin" d="M24 23h72 M24 35h72 M42 12v34 M60 12v34 M78 12v34"/><circle cx="60" cy="58" r="7" class="bp-line"/><path class="bp-thin" d="M60 53l5 4-2 6h-6l-2-6z"/>',
  rocket: '<path class="bp-line" d="M60 12c9 8 11 23 9 36h-18c-2-13 0-28 9-36z"/><circle cx="60" cy="30" r="5" class="bp-line-2"/><path class="bp-line-2" d="M51 46l-9 13 13-5 M69 46l9 13-13-5"/><path class="bp-dash" d="M60 52v12 M54 52v8 M66 52v8"/>',
  boss: '<circle cx="60" cy="34" r="20" class="bp-line"/><circle cx="60" cy="34" r="11" class="bp-line-2"/><path class="bp-thin" d="M60 6v12 M60 50v12 M32 34h12 M76 34h12"/><rect x="55" y="29" width="10" height="10" class="bp-fill"/>',
  pad: '<rect x="22" y="22" width="76" height="32" rx="14" class="bp-line"/><path class="bp-line-2" d="M38 30v16 M30 38h16"/><circle cx="78" cy="34" r="3.4" class="bp-line-2"/><circle cx="86" cy="42" r="3.4" class="bp-line-2"/>',
  pong: '<rect x="22" y="20" width="6" height="22" class="bp-line"/><rect x="92" y="34" width="6" height="22" class="bp-line"/><circle cx="60" cy="38" r="4" class="bp-line"/><path class="bp-dash" d="M60 12v52"/>',
};

const META: Record<string, { pill: string; cls: string; build: string }> = {
  live: { pill: "Playable", cls: "live", build: "v1.0" },
  dev: { pill: "In dev", cls: "dev", build: "WIP" },
  soon: { pill: "Planned", cls: "", build: "\u2014" },
};

function thumb(icon: string) {
  const frame = '<path class="bp-thin" d="M6 6h8M6 6v8 M114 6h-8M114 6v8 M6 64h8M6 64v-8 M114 64h-8M114 64v-8"/>';
  return '<svg viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg">' + frame + (ICONS[icon] || ICONS.pad) + "</svg>";
}

function playersLabel(p: string) {
  return p === "1" ? "1P" : p === "2" ? "2P" : p + "P";
}

export default function ArcadeGames() {
  const [fStatus, setFStatus] = useState("all");
  const [fPlayers, setFPlayers] = useState("all");

  const filtered = useMemo(() => {
    return GAMES.filter((g) => {
      const okS = fStatus === "all" || (fStatus === "live" ? g.status === "live" : g.status !== "live");
      const okP = fPlayers === "all" || g.players === fPlayers;
      return okS && okP;
    });
  }, [fStatus, fPlayers]);

  return (
    <>
      {/* FILTER DECK */}
      <div className="deck">
        <div className="wrap">
          <div className="deck-inner">
            <div className="fgroup">
              <span className="flabel">Status</span>
              {[
                { val: "all", label: "All" },
                { val: "live", label: "Playable" },
                { val: "wip", label: "In progress" },
              ].map((f) => (
                <button
                  key={f.val}
                  className={`fchip${fStatus === f.val ? " on" : ""}`}
                  onClick={() => setFStatus(f.val)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="fgroup">
              <span className="flabel">Players</span>
              {[
                { val: "all", label: "All" },
                { val: "1", label: "1P" },
                { val: "2", label: "2P" },
              ].map((f) => (
                <button
                  key={f.val}
                  className={`fchip${fPlayers === f.val ? " on" : ""}`}
                  onClick={() => setFPlayers(f.val)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="readout">
              SHOWING {String(filtered.length).padStart(2, "0")} / {String(GAMES.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* GAMES GRID */}
      <div className="wrap">
        <section id="cabinet">
          <div className="sec-head reveal">
            <span className="sec-num">01 / The Cabinet</span>
            <h2>Pick a game.</h2>
            <p>Every title below is built by us. Playable ones launch in your browser; the rest are on the workbench.</p>
          </div>
          <div className="games">
            {filtered.length === 0 && (
              <p className="empty">No games match that filter &mdash; try widening it.</p>
            )}
            {filtered.map((g, i) => {
              const m = META[g.status] || META.soon;
              const fig = "FIG." + String(i + 1).padStart(2, "0");
              return (
                <article
                  key={g.title}
                  className="game reveal in"
                  style={{ transitionDelay: (i % 3) * 70 + "ms" }}
                >
                  <div className="plate">
                    <span className="fig">{fig}</span>
                    <span className={`gpill ${m.cls}`}>{m.pill}</span>
                    <div dangerouslySetInnerHTML={{ __html: thumb(g.icon) }} />
                  </div>
                  <div className="gbody">
                    <div className="gtag">{g.genre}</div>
                    <h3>{g.title}</h3>
                    <dl className="spec">
                      <div><dt>Players</dt><dd>{playersLabel(g.players)}</dd></div>
                      <div><dt>Genre</dt><dd>{g.genre.split(" \u00b7 ")[0]}</dd></div>
                      <div><dt>Build</dt><dd>{m.build}</dd></div>
                    </dl>
                    {g.status === "live" && g.href ? (
                      <a className="gbtn" href={g.href}>Play &#9654;</a>
                    ) : (
                      <span className="gbtn dis">{g.status === "soon" ? "Planned" : "In progress"}</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
