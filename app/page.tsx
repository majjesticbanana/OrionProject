import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import RevealObserver from "@/components/RevealObserver";
import BlueprintSchematic from "@/components/BlueprintSchematic";
import NavScrollHighlight from "@/components/NavScrollHighlight";
import Fx from "./fx/Fx";
import "./home.css";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <RevealObserver />
      <NavScrollHighlight />
      <Fx />
      <Nav />

      {/* HERO */}
      <div className="wrap" id="top">
        <section className="hero">
          <div className="hero-text" id="heroText">
            <div className="eyebrow">Class 10S4 &middot; A Student Workshop</div>
            <div className="wordmark" aria-label="Nueva">
              {"Nueva".split("").map((ch, i) => (
                <span key={i} className="wm" aria-hidden="true" style={{ "--i": i } as React.CSSProperties}>{ch}</span>
              ))}
              <svg className="swash" viewBox="0 0 600 36" preserveAspectRatio="none" aria-hidden="true">
                <path d="M8 24 C 130 6, 320 34, 592 14" />
              </svg>
            </div>
            <div className="project-tag">Design &middot; Build &middot; Gather</div>
            <p className="lead">
              We&apos;re a group of students who <b>build our own tech and games</b> &mdash; and bring them together in a retro arcade caf&eacute;. A workshop where the things our curiosity creates are also the things that bring people together to play, compete, and connect.
            </p>
            <div className="cta-row">
              <Link href="#projects" className="btn btn-primary">The Workshop</Link>
              <Link href="/arcade" className="btn btn-ghost">Play the Arcade</Link>
              <Link href="#try" className="btn btn-ghost">Meet Valkyrie</Link>
            </div>
          </div>
          <BlueprintSchematic />
        </section>
      </div>

      {/* TICKER TAPE */}
      <div className="tape" aria-hidden="true">
        <div className="tape-in">
          <span>NUEVA ARCADE <b>&#9670;</b> BUILT BY 10S4 <b>&#9670;</b> INSERT COIN <b>&#9670;</b> WORKSHOP &middot; ARCADE &middot; CAF&Eacute; <b>&#9670;</b> PRESS START <b>&#9670;</b>&nbsp;</span>
          <span>NUEVA ARCADE <b>&#9670;</b> BUILT BY 10S4 <b>&#9670;</b> INSERT COIN <b>&#9670;</b> WORKSHOP &middot; ARCADE &middot; CAF&Eacute; <b>&#9670;</b> PRESS START <b>&#9670;</b>&nbsp;</span>
        </div>
      </div>

      {/* ABOUT */}
      <div className="wrap">
        <section id="about">
          <span className="sec-num reveal">01 / About</span>
          <p className="about-text reveal" style={{ marginTop: ".5em" }}>
            A workshop run by students &mdash; where <b>curiosity</b> becomes real things, and those things bring people together.
          </p>
          <p className="reveal" style={{ maxWidth: "62ch", marginTop: "22px" }}>
            Nueva is class 10S4&apos;s workshop. Research and development is at our heart &mdash; we build our own
            AI, our own games, our own engineering. The arcade is what our R&amp;D into games became;
            the caf&eacute; grew from the arcade and our wish to give people a place to gather, talk, and connect.
            Built in cardboard and blueprint blue, because we&apos;d rather spend on ideas than on d&eacute;cor.
          </p>
        </section>
      </div>

      <div className="wrap"><div className="divider" /></div>

      {/* PILLARS */}
      <div className="wrap">
        <section>
          <div className="sec-head reveal" data-num="02">
            <span className="sec-num">02 / How it fits together</span>
            <h2>Making, and gathering.</h2>
            <p>One idea, three facets &mdash; they feed each other. What we build draws people in; the people who visit tell us what to build next.</p>
          </div>
          <div className="pillars reveal">
            <div className="pillar" data-n="A">
              <div className="pk">The Workshop (R&amp;D)</div>
              <p>Our innovation arm &mdash; the AI, the games, the engineering. Where our curiosity turns into things that work.</p>
            </div>
            <div className="pillar" data-n="B">
              <div className="pk">The Arcade</div>
              <p>Retro games we built ourselves, played on modern controllers. Old soul, new tech &mdash; and our revenue engine.</p>
            </div>
            <div className="pillar" data-n="C">
              <div className="pk">The Caf&eacute;</div>
              <p>The gathering bench. A warm place for anyone, of any mindset, to sit, play, talk, and connect.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap"><div className="divider" /></div>

      {/* PROJECTS / WORKSHOP */}
      <div className="wrap">
        <section id="projects">
          <div className="sec-head reveal" data-num="03">
            <span className="sec-num">03 / The Workshop</span>
            <h2>What we&apos;re building.</h2>
            <p>Our current bench. Some are running, some are still on the drawing board &mdash; all built by us.</p>
          </div>
          <div className="grid-4">
            <div className="proj reveal">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="12" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" />
                  <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
                </svg>
              </div>
              <h3>Valkyrie AI</h3>
              <p>Our IGCSE question-answering assistant, grounded in real past-paper mark schemes.</p>
              <span className="status live">Live</span>
            </div>
            <div className="proj reveal">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="3" /><path d="M7 12h3M8.5 10.5v3" />
                  <circle cx="16" cy="11" r="1" /><circle cx="18.5" cy="13.5" r="1" />
                </svg>
              </div>
              <h3>The Arcade</h3>
              <p>Pixel games we built &mdash; a penalty shootout and a boss fight &mdash; on modern controllers.</p>
              <span className="status live">Playable</span>
            </div>
            <div className="proj reveal">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 13l2-5h14l2 5" /><path d="M2 13h20v4H2z" />
                  <circle cx="7" cy="17.5" r="1.7" /><circle cx="17" cy="17.5" r="1.7" />
                </svg>
              </div>
              <h3>Delivery Car</h3>
              <p>Our remote-controlled car &mdash; being built into a runner that delivers around the caf&eacute;.</p>
              <span className="status">In progress</span>
            </div>
            <div className="proj more reveal">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <h3>More on the bench</h3>
              <p>New ideas land here as the workshop picks them up.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap"><div className="divider" /></div>

      {/* TRY IT (Valkyrie) */}
      <div className="wrap">
        <section id="try">
          <div className="sec-head reveal" data-num="04">
            <span className="sec-num">04 / From the bench</span>
            <h2>Meet Valkyrie.</h2>
            <p>
              Valkyrie is our IGCSE question-answering assistant. Ask it by paper reference like{" "}
              <code>0625/42/M/J/23 Q4</code>, or describe a question in plain words &mdash; it searches a
              library of real past papers, finds the matching official mark scheme, and walks you
              through the full answer, mark by mark.
            </p>
          </div>

          <div className="val-feats reveal">
            <div className="vf">
              <span className="vf-k">Retrieval, not guessing</span>
              <p>Every answer is grounded in an actual mark scheme &mdash; it explains how marks are really awarded rather than inventing them.</p>
            </div>
            <div className="vf">
              <span className="vf-k">Two ways to ask</span>
              <p>Look up an exact paper by its code, or ask conceptually and let Valkyrie find the closest match.</p>
            </div>
            <div className="vf">
              <span className="vf-k">Built by us</span>
              <p>We assembled the question library, the search pipeline, and the tutor that turns barebones mark schemes into clear explanations.</p>
            </div>
          </div>

          <div className="val-examples reveal">
            <span className="ex-label">Try asking by paper reference:</span>
            <span className="chip">0625/42/M/J/23 Q4</span>
          </div>

          <div className="ai-frame reveal">
            <iframe
              src="https://majjesticb-orion-qa.hf.space"
              title="Valkyrie — IGCSE Q&A"
              loading="lazy"
              allow="clipboard-write"
            />
          </div>
          <p className="ai-note">Powered by our retrieval pipeline + Gemini, hosted on Hugging Face.</p>
        </section>
      </div>

      <div className="wrap"><div className="divider" /></div>

      {/* TEAM */}
      <div className="wrap">
        <section id="team">
          <div className="sec-head reveal" data-num="05">
            <span className="sec-num">05 / The Team</span>
            <h2>The crew of 10S4.</h2>
            <p>The students behind Nueva.</p>
          </div>
          <div className="team-grid reveal">
            <div className="member"><div className="av">YM</div><div><h4>Yoonus Abdulla Musthafa</h4><span>Leader</span></div></div>
            <div className="member"><div className="av b">TS</div><div><h4>Thafheem Ali Shafeeq</h4><span>10S4</span></div></div>
            <div className="member"><div className="av">IF</div><div><h4>Ismail Haisham Faisal</h4><span>10S4</span></div></div>
            <div className="member"><div className="av b">MA</div><div><h4>Mohamed Alaan Ahmed</h4><span>10S4</span></div></div>
            <div className="member"><div className="av">IM</div><div><h4>Ismail Yanah Mohamed Mueen</h4><span>10S4</span></div></div>
            <div className="member"><div className="av b">AM</div><div><h4>Ahmed Mikyal Mazeed</h4><span>10S4</span></div></div>
            <div className="member"><div className="av">AS</div><div><h4>Ahmed Aahil Shamin</h4><span>10S4</span></div></div>
            <div className="member"><div className="av b">AA</div><div><h4>Ahmed Auz Afeef</h4><span>10S4</span></div></div>
            <div className="member"><div className="av">AJ</div><div><h4>Abdullah Dhaain Jamsheed</h4><span>10S4</span></div></div>
            <div className="member"><div className="av b">YN</div><div><h4>Yoosuf Nadhyan Nazim</h4><span>10S4</span></div></div>
            <div className="member"><div className="av">MA</div><div><h4>Mohammed Aloof Atheef</h4><span>10S4</span></div></div>
            <div className="member"><div className="av">MY</div><div><h4>Mohamed Yavin Ziyad</h4><span>10S4</span></div></div>

          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
