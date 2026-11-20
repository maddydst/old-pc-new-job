// Page « Le parcours » : les 11 étapes une par une, reliées par le fil de Gérard.
// Même moteur que l'accueil (GSAP + ScrollTrigger + Lenis sur une seule horloge), en plus léger.
(() => {
  const $ = (s, r = document) => (r ? r.querySelector(s) : null);
  const $$ = (s, r = document) => (r ? [...r.querySelectorAll(s)] : []);
  const html = document.documentElement;
  const A = Object.fromEntries(AGENTS.map(a => [a.id, a]));
  const NS = "http://www.w3.org/2000/svg";
  const deux = n => String(n).padStart(2, "0");
  const euros = c => c === 0 ? "0 €" : c < .01 ? "< 1 ct" : `${(c * 100).toFixed(c < .1 ? 1 : 0).replace(".", ",")} ct`;
  const heures = h => `${String(h).replace(".", ",")} h`;
  addEventListener("error", () => window.gsap && gsap.set(".pas, .acte-tete > *, .ch, .kin .grad", { clearProps: "all" }));

  /* ---------- Rendu ---------- */
  $("#navActes").innerHTML = `<span class="nav-lbl">Parties</span>` + ACTES.map(a => `<a href="#acte-${a.n}" title="${a.titre}" aria-label="Partie ${a.n} : ${a.titre}">${a.n}</a>`).join("");
  $("#actesP").innerHTML = ACTES.map(a => `
    <section class="sec acte-bloc" id="acte-${a.n}" style="--c:${a.c}">
      <div class="wrap">
        <header class="acte-tete">
          <span class="acte-num">${deux(a.n)}</span>
          <div>
            <p class="eyebrow">Partie ${a.n} · ${a.de === a.a ? `étape ${a.de}` : `étapes ${a.de} à ${a.a}`} · environ ${dureePartie(a)}</p>
            <h2 class="kin"><span class="line">${a.titre}</span></h2>
            <p class="sub">${a.resume}</p>
          </div>
        </header>
        <ol class="pas-liste">
          ${[...ETAPES.filter(e => e.s >= a.de && e.s <= a.a), ...(a.n === ACTES.length ? [BONUS] : [])].map(e => `
          <li class="pas${e.s === "bonus" ? " bonus" : ""}" id="s${e.s}" data-s="${e.s}"${e.agent ? ` data-name="${A[e.agent].nom}" data-c="${A[e.agent].c}"` : ""}>
            <div class="pas-tete">
              ${e.agent ? `<span class="av">${avatar(e.agent, A[e.agent].c)}</span>` : `<span class="pas-badge">S${e.s}</span>`}
              <div><span class="pas-s">${e.s === "bonus" ? "Bonus fun" : `Étape ${e.s}`} · <span class="duree">environ ${duree(e.temps)}</span></span><h3>${e.titre}</h3></div>
            </div>
            <p class="but"><b>Le but</b>${e.but}</p>
            <p class="chez"><b>Chez moi</b>${e.quoi}</p>
            ${e.visuel && typeof VISUELS !== "undefined" ? `<div class="pas-visuel">${VISUELS[e.visuel]}</div>` : ""}
            <div class="pas-prompt"><button class="copier" type="button" data-s="${e.s}">Copier le prompt</button><details><summary>Voir le prompt</summary><pre>${promptEtape(e).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre></details></div>
          </li>`).join("")}
        </ol>
      </div>
    </section>`).join("");
  // boutons Copier : une étape, ou tout le parcours d'un coup
  document.addEventListener("click", ev => {
    const b = ev.target.closest(".copier");
    if (!b) return;
    if (b.dataset.tout !== undefined) return copierTexte(promptTout(), b);
    const e = b.dataset.s === "bonus" ? BONUS : ETAPES.find(x => x.s === +b.dataset.s);
    if (e) copierTexte(promptEtape(e), b);
  });
  $("#crowd").innerHTML = AGENTS.map(a => `<span class="av" data-name="${a.nom}" data-c="${a.c}">${avatar(a.id, a.c)}</span>`).join("");

  if (!window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: .9 });
  const fin = matchMedia("(pointer: fine)").matches;

  /* ---------- Une seule horloge ---------- */
  let lenis = null;
  if (false && window.Lenis) {   // 16/11 : défilement natif (le défilement adouci ajoutait un retard sur le trackpad)
    lenis = new Lenis({ lerp: .16, smoothWheel: true, wheelMultiplier: 1.1 });   // 16/11 : plus vif (avant : 1,15 s d'inertie, jugé lent)
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const t = $(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: -70, duration: 1.6 }) : t.scrollIntoView({ behavior: "smooth" });
  }));
  const navFond = () => $(".nav").classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", navFond, { passive: true }); navFond();
  gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .2 } });

  /* ---------- Agents : clignent et sautent ---------- */
  const bots = $$(".bot");
  const saut = b => {
    if (!b || gsap.isTweening(b.querySelector(".body"))) return;
    const img = b.querySelector(".sprite");
    if (img) [1, 0, 2, 0, 1, 0].forEach((f, i) => gsap.delayedCall(i * .11, () => img.setAttribute("href", `sprites/${b.dataset.id}-${f}.png`)));
    gsap.timeline().to(b.querySelector(".body"), { y: -2.2, duration: .22, ease: "power2.out" }, .3).to(b.querySelector(".body"), { y: 0, duration: .5, ease: "bounce.out" });
  };
  $$(".pas, .crowd .av").forEach(el => el.addEventListener("pointerenter", () => saut(el.querySelector(".bot"))));

  /* ---------- Typographie cinétique ---------- */
  const decoupe = h => {
    const marche = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(m => {
          if (!m) return;
          if (/^\s+$/.test(m)) return frag.appendChild(document.createTextNode(" "));
          const w = document.createElement("span"); w.className = "w";
          [...m].forEach(c => { const s = document.createElement("span"); s.className = "ch"; s.textContent = c; w.appendChild(s); });
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains("grad")) marche(n);
    });
    $$(".line", h).forEach(marche);
    return $$(".ch, .grad", h);
  };
  const vague = (h, extra = {}) => gsap.from(decoupe(h), { yPercent: 115, rotateX: -75, opacity: 0, duration: 1.1, stagger: .022, ...extra });
  const typo = { w: 600, sk: 0 };
  if (lenis) lenis.on("scroll", l => gsap.to(typo, {
    sk: gsap.utils.clamp(-2, 2, l.velocity * -.06), duration: .5, ease: "power3.out", overwrite: true,
    onUpdate: () => $$(".kin").forEach(h => { if (h.getBoundingClientRect().bottom > 0 && h.getBoundingClientRect().top < innerHeight) h.style.transform = `skewY(${typo.sk.toFixed(2)}deg)`; }),
  }));

  /* ---------- Entrées ---------- */
  document.fonts.ready.then(() => {
    gsap.timeline()
      .from(".nav", { y: -16, opacity: 0, duration: .8 })
      .add(vague($(".hero-p h1")), .05)
      .from(".hero-p .eyebrow, .hero-p .lead, .hero-p .hero-cta", { y: 20, opacity: 0, stagger: .08 }, .3)
      .from(".compteur", { x: -20, opacity: 0 }, .6);
    ScrollTrigger.refresh();
  });
  if (false) {                                                                            // 16/11 : halos flous immobiles partout
    gsap.to(".g1", { x: 60, y: 40, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".g2", { x: -50, y: 30, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }

  $$(".acte-bloc").forEach(b => {
    const tete = $(".acte-tete", b);
    gsap.timeline({ scrollTrigger: { trigger: tete, start: "top 80%" } })
      .from($(".acte-num", tete), { yPercent: 60, opacity: 0, scale: .6, duration: 1.2 })
      .add(vague($("h2", tete)), .1)
      .from($$(".eyebrow, .sub", tete), { y: 18, opacity: 0, stagger: .08 }, .2);
  });
  $$(".pas").forEach((p, i) => {
    const droite = innerWidth > 860 && i % 2 === 1;
    gsap.fromTo(p, { x: innerWidth > 860 ? (droite ? 40 : -40) : 20, opacity: 0, rotateY: droite ? -8 : 8, transformPerspective: 900 },
      { x: 0, opacity: 1, rotateY: 0, duration: 1.1, scrollTrigger: { trigger: p, start: "top 88%" } });
  });
  gsap.from("#crowd .av", { y: 40, opacity: 0, scale: .5, duration: .9, ease: "back.out(2.4)", stagger: .06, scrollTrigger: { trigger: "#crowd", start: "top 88%" },
    onComplete: () => $$("#crowd .bot").forEach((b, i) => gsap.delayedCall(i * .12, () => saut(b))) });

  /* ---------- Le fil : il serpente d'étape en étape ---------- */
  const fil = $("#fil"), main = $("main"), tete = $("#filHead"), cpt = $("#cptN");
  const mk = (tag, at, parent) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); parent.appendChild(e); return e; };
  let seg = null, arrets = [];
  const pos = (el, fx, fy) => {
    const r = el.getBoundingClientRect(), m = main.getBoundingClientRect();
    return { x: r.left - m.left + r.width * fx, y: r.top - m.top + r.height * fy };
  };
  const chemin = pts => pts.reduce((d, p, i) => {
    if (!i) return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    const a = pts[i - 1], dy = (p.y - a.y) * .55;
    return d + ` C${a.x.toFixed(1)} ${(a.y + dy).toFixed(1)} ${p.x.toFixed(1)} ${(p.y - dy).toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, "");
  const construire = () => {
    const H = main.scrollHeight, large = innerWidth > 860;
    fil.setAttribute("height", H); fil.setAttribute("viewBox", `0 0 ${main.clientWidth} ${H}`);
    $("#filgrad").setAttribute("y2", H);
    ["#filTracks", "#filPaths", "#filStops"].forEach(s => ($(s).innerHTML = ""));
    const pts = [{ ...pos($(".hero-p .hero-cta"), large ? .2 : 0, 1), arret: null }];
    if (!large) pts[0].x = 7;
    $$(".pas").forEach((p, i) => {
      const cote = large ? (i % 2 ? 0 : 1) : 0;                     // côté intérieur de la carte (vers le centre)
      const pt = pos(p, cote, .35);
      pts.push({ x: large ? pt.x + (cote ? 22 : -22) : 7, y: pt.y, arret: p });
    });
    pts.push({ ...pos($("#crowd"), .5, .5), arret: null });
    if (!large) pts[pts.length - 1].x = 7;
    const d = chemin(pts);
    mk("path", { d, class: "track" }, $("#filTracks"));
    const glow = { style: {} };
    const p = mk("path", { d, class: "trait" }, $("#filPaths"));
    const L = p.getTotalLength(), ys = [], ls = [];
    [p, glow].forEach(e => { e.style.strokeDasharray = L; e.style.strokeDashoffset = L; });
    for (let i = 0; i <= 400; i++) { const l = L * i / 400; ls.push(l); ys.push(p.getPointAtLength(l).y); }
    seg = { p, glow, L, ys, ls };
    arrets = pts.filter(x => x.arret).map(x => ({ y: x.y, carte: x.arret, el: mk("circle", { class: "stop", cx: x.x, cy: x.y, r: 6 }, $("#filStops")), on: false }));
    maj();
  };
  const longueurA = y => {
    const { ys, ls, L } = seg;
    if (y <= ys[0]) return 0;
    let lo = 0, hi = ys.length - 1;
    if (y >= ys[hi]) return L;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; ys[mid] <= y ? (lo = mid) : (hi = mid); }
    return ls[lo] + (ls[hi] - ls[lo]) * ((y - ys[lo]) / ((ys[hi] - ys[lo]) || 1));
  };
  const maj = () => {
    if (!seg) return;
    const y = scrollY - (main.getBoundingClientRect().top + scrollY) + innerHeight * .6;
    const l = longueurA(y);
    seg.p.style.strokeDashoffset = seg.glow.style.strokeDashoffset = seg.L - l;
    const ok = l > 0 && l < seg.L;
    tete.classList.toggle("on", ok);
    if (ok) { const pt = seg.p.getPointAtLength(l); tete.setAttribute("transform", `translate(${pt.x} ${pt.y})`); }
    let dernier = 1;
    arrets.forEach(a => {
      const on = y >= a.y;
      if (on && !isNaN(+a.carte.dataset.s)) dernier = +a.carte.dataset.s;
      if (on !== a.on) {
        a.on = on; a.el.classList.toggle("on", on); a.carte.classList.toggle("lit", on);
        if (on) { gsap.fromTo(a.el, { attr: { r: 6 } }, { attr: { r: 13 }, duration: .25, yoyo: true, repeat: 1, ease: "power2.out" }); saut(a.carte.querySelector(".bot")); }
      }
    });
    if (cpt.textContent !== deux(dernier)) {
      cpt.textContent = deux(dernier);
      gsap.fromTo(cpt, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .4, ease: "power3.out" });
    }
  };
  ScrollTrigger.addEventListener("refresh", construire);
  lenis ? lenis.on("scroll", maj) : addEventListener("scroll", maj, { passive: true });

  /* ---------- Curseur maison + boutons aimantés ---------- */
  if (false && fin) {   // 16/11 : curseur maison et boutons aimantés retirés (retard sous la souris)
    html.classList.add("has-cur");
    const cur = $(".cur"), dot = $(".cur-dot"), ring = $(".cur-ring"), lbl = $(".cur-lbl");
    const dx = gsap.quickTo(dot, "x", { duration: .08 }), dy = gsap.quickTo(dot, "y", { duration: .08 });
    const rx = gsap.quickTo(ring, "x", { duration: .35, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: .35, ease: "power3" });
    addEventListener("pointermove", e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", e => {
      const n = e.target.closest("[data-name]"), l = e.target.closest("a, button");
      cur.classList.toggle("nom", !!n && !l); cur.classList.toggle("lien", !!l);
      if (n && !l) { lbl.textContent = n.dataset.name; cur.style.setProperty("--cc", n.dataset.c || "#fff"); }
    });
    $$(".magnet").forEach(b => {
      const x = gsap.quickTo(b, "x", { duration: .4, ease: "power3" }), y = gsap.quickTo(b, "y", { duration: .4, ease: "power3" });
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .3); y((e.clientY - r.top - r.height / 2) * .4); });
      b.addEventListener("pointerleave", () => gsap.to(b, { x: 0, y: 0, duration: .9, ease: "elastic.out(1, .35)" }));
    });
  }

  addEventListener("load", () => ScrollTrigger.refresh());
})();
