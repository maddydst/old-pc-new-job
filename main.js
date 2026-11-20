// Motion design v3 — un seul concept : le fil de Gérard, qui porte ton message à travers toute la page.
// Une seule horloge (gsap.ticker pilote Lenis, ScrollTrigger et le shader). Tout est en transform/opacity,
// le shader ne tourne que quand le hero est visible, et rien ne bouge si « réduire les animations » est activé.
(() => {
  const $ = (s, r = document) => (r ? r.querySelector(s) : null);
  const $$ = (s, r = document) => (r ? [...r.querySelectorAll(s)] : []);
  const A = Object.fromEntries(AGENTS.map(a => [a.id, a]));
  const NS = "http://www.w3.org/2000/svg";
  const html = document.documentElement;
  const sansSvg = h => h.replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, "");
  const finIntro = () => { html.classList.remove("intro"); const i = $("#intro"); if (i) i.style.display = "none"; };
  // Filet de sécurité : si un script plante, rien ne reste caché.
  addEventListener("error", () => { finIntro(); window.gsap && gsap.set("[data-reveal], [data-card], [data-hero], .ch, .kin .grad", { clearProps: "all" }); });

  /* =====================================================================
     1. RENDU (même contenu qu'avant)
     ===================================================================== */
  const band = AGENTS.map(a => `<span class="band-item"><span class="av">${avatar(a.id, a.c)}</span>${a.nom}</span>`).join("");
  $("#band").innerHTML = band + band;
  $("#cards").innerHTML = AGENTS.map((a, i) => `
    <article class="card${i === 0 ? " big" : ""}" style="--c:${a.c}" data-card data-name="${a.nom}" data-c="${a.c}">
      <div class="av">${avatar(a.id, a.c)}</div>
      <h3>${a.nom}</h3><span class="role">${a.metier}</span>
      <p>${a.txt}</p>
    </article>`).join("") + `
    <article class="card toi" data-card>
      <div class="plus">+</div>
      <h3>Ton agent</h3><span class="role">à toi de l'inventer</span>
      <p>Un agent adapté à ta vie, avec le métier que tu veux. Quelques idées :</p>
      <div class="idees"><span>tes factures</span><span>tes recettes</span><span>ton sport</span><span>tes révisions</span><span>ton club</span><span>ton budget</span></div>
      <a class="btn" href="commencer.html"><span>Créer le mien</span></a>
    </article>`;
  $("#tl").insertAdjacentHTML("beforeend", JOURNEE.map(s => `
    <article class="tl-item" style="--c:${A[s.qui].c}" data-name="${A[s.qui].nom}" data-c="${A[s.qui].c}">
      <span class="h">${s.h}</span>
      <div class="row"><span class="av">${avatar(s.qui, A[s.qui].c)}</span><h3>${s.t}</h3></div>
      <p>${s.d}</p>
    </article>`).join(""));
  $("#crowd").innerHTML = AGENTS.map(a => `<span class="av" data-name="${a.nom}" data-c="${a.c}">${avatar(a.id, a.c)}</span>`).join("");
  // 16/11 : le fil en 6 étapes (données dans parcours.js), chaque étape mène à sa partie du parcours
  if ($("#actes") && typeof ACTES !== "undefined") $("#actes").innerHTML = ACTES.map(a => `
    <li class="acte" style="--c:${a.c}" data-reveal>
      <a href="parcours.html#acte-${a.n}">
        <span class="acte-n">${a.n}</span><span class="acte-s">${a.de === a.a ? `Étape ${a.de}` : `Étapes ${a.de} à ${a.a}`} · environ ${dureePartie(a)}</span>
        <h3>${a.titre}</h3><p>${a.resume}</p>
        <span class="acte-av">${ETAPES.filter(e => e.s >= a.de && e.s <= a.a && e.agent).map(e => `<span class="av" data-name="${A[e.agent].nom}" data-c="${A[e.agent].c}">${avatar(e.agent, A[e.agent].c)}</span>`).join("")}</span>
        <span class="acte-go">${a.de === a.a ? "Voir cette étape" : `Voir ces ${a.a - a.de + 1} étapes`} →</span>
      </a></li>`).join("");

  // Réseau : Gérard au centre, les 10 autres en ellipse
  const HUB = { x: 260, y: 220 }, POS = { gerard: HUB };
  const autres = AGENTS.filter(a => a.id !== "gerard");
  autres.forEach((a, i) => {
    const t = (-90 + 18 + i * 36) * Math.PI / 180;
    POS[a.id] = { x: HUB.x + 210 * Math.cos(t), y: HUB.y + 168 * Math.sin(t) };
  });
  const mk = (tag, at, parent) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); parent && parent.appendChild(e); return e; };
  autres.forEach(a => mk("line", { class: "ln", x1: HUB.x, y1: HUB.y, x2: POS[a.id].x, y2: POS[a.id].y }, $("#lines")));
  const NODE = {};
  const addNode = (a, size) => {
    const p = POS[a.id], g = mk("g", { class: "node", "data-name": a.nom, "data-c": a.c }, $("#nodes"));
    g.innerHTML = `<svg class="bot" data-id="${a.id}" x="${p.x - size / 2}" y="${p.y - size * .6}" width="${size}" height="${size * 1.125}" viewBox="0 0 16 18">${sansSvg(avatar(a.id, a.c))}</svg>`;
    if (a.id !== "gerard") mk("text", { class: "node-label", x: p.x, y: p.y + size * .62 }, g).textContent = a.court || a.nom;
    NODE[a.id] = g;
  };
  autres.forEach(a => addNode(a, 44));
  addNode(A.gerard, 84);
  const hotLine = (from, to) => {
    const l = mk("line", { class: "hotln", x1: POS[from].x, y1: POS[from].y, x2: POS[to].x, y2: POS[to].y, stroke: A[to].c }, $("#hot"));
    const len = Math.hypot(POS[to].x - POS[from].x, POS[to].y - POS[from].y);
    l.style.strokeDasharray = len; l.style.strokeDashoffset = len; l.style.opacity = 0;
    return l;
  };
  const ROUTES = [
    { to: "ginette", txt: "« L'idée sur les recettes ? » → le bibliothécaire" },
    { to: "lola", txt: "un lien à garder → le rangeur d'idées" },
    { to: "mairie", then: ["jeanmi", "monique"], txt: "« Fais la veille et le bilan » → le chef d'orchestre répartit" },
  ];
  ROUTES.forEach(r => { r.L = hotLine("gerard", r.to); r.subs = (r.then || []).map(t => hotLine(r.to, t)); });

  /* Yeux qui suivent le pointeur (ordi) */
  const fin = matchMedia("(pointer: fine)").matches;
  const bots = $$(".bot");
  const visibles = new Set();
  const ioBots = new IntersectionObserver(es => es.forEach(e => {
    e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target);
    const tw = e.target._respire; if (tw) e.isIntersecting ? tw.play() : tw.pause();
  }));
  bots.forEach(b => ioBots.observe(b));
  if (fin) {
    let px = innerWidth / 2, py = innerHeight / 3, sale = true;
    addEventListener("pointermove", e => { px = e.clientX; py = e.clientY; sale = true; }, { passive: true });
    addEventListener("scroll", () => (sale = true), { passive: true });
    (function regarde() {
      if (sale) {
        sale = false;
        visibles.forEach(b => {
          const r = b.getBoundingClientRect(), dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height * .45);
          const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260) * 3;
          const t = `translate(${(dx / d * k).toFixed(2)} ${(dy / d * k).toFixed(2)})`;
          b.querySelectorAll(".pupil").forEach(p => p.setAttribute("transform", t));
        });
      }
      requestAnimationFrame(regarde);
    })();
  }

  if (!window.gsap || !window.ScrollTrigger) { finIntro(); return; }   // CDN indisponible : page lisible, sans mouvement
  gsap.registerPlugin(ScrollTrigger);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { finIntro(); statique(); return; }
  gsap.defaults({ ease: "expo.out", duration: .9 });
  let leger = false;                                             // mode allégé (voir plus bas)

  /* =====================================================================
     2. UNE SEULE HORLOGE : Lenis branché sur le ticker GSAP
     ===================================================================== */
  let lenis = null;
  if (false && window.Lenis) {   // 16/11 : défilement natif (le défilement adouci ajoutait un retard sur le trackpad)
    lenis = new Lenis({ lerp: .16, smoothWheel: true, wheelMultiplier: 1.1 });   // 16/11 : plus vif (avant : 1,15 s d'inertie, jugé lent)
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href"), t = id === "#top" ? 0 : $(id);
    if (t === null) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: -8, duration: 1.6 }) : scrollTo({ top: t ? t.offsetTop : 0, behavior: "smooth" });
  }));

  /* =====================================================================
     3. AGENTS VIVANTS : clignent, respirent, et chacun a son geste
     ===================================================================== */
  // 16/11 : avatars pixel art (Agent City). Ils respirent, et leur geste = quelques pas sur place + un petit saut.
  bots.forEach(b => {
    const body = b.querySelector(".body");
    b._respire = gsap.to(body, { scaleY: 1.04, svgOrigin: "8 16", duration: gsap.utils.random(1.6, 2.4), ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });
  });
  const PAS = [1, 0, 2, 0, 1, 0, 2, 0];
  const marcher = b => {
    const img = b.querySelector(".sprite");
    if (!img) return;
    PAS.forEach((f, i) => gsap.delayedCall(i * .11, () => img.setAttribute("href", `sprites/${b.dataset.id}-${f}.png`)));
  };
  const geste = b => {
    if (!b || b._geste) return;
    const body = b.querySelector(".body");
    const tl = gsap.timeline({ onComplete: () => (b._geste = null) });
    b._geste = tl;
    marcher(b);
    tl.to(body, { y: -2.2, duration: .22, ease: "power2.out" }, .45).to(body, { y: 0, duration: .5, ease: "bounce.out" }, .67);
  };
  $$(".card, .tl-item, .crowd .av, .band-item, .node, .acte-av .av").forEach(el => {
    el.addEventListener("pointerenter", () => geste(el.querySelector(".bot")));
    el.addEventListener("pointerdown", () => geste(el.querySelector(".bot")));
  });
  // de temps en temps, un agent visible fait son geste tout seul
  setInterval(() => {
    if (document.hidden || html.classList.contains("leger")) return;
    const v = [...visibles].filter(b => !b.closest(".band"));
    if (v.length) geste(v[Math.floor(Math.random() * v.length)]);
  }, 2600);

  /* =====================================================================
     4. TYPOGRAPHIE CINÉTIQUE
     ===================================================================== */
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
  // graisse et inclinaison des titres selon la vitesse du scroll
  const typo = { w: 600, sk: 0 };
  const kinVus = new Set(), ioKin = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? kinVus.add(e.target) : kinVus.delete(e.target)));
  $$(".kin").forEach(h => ioKin.observe(h));
  const majTypo = () => kinVus.forEach(h => (h.style.transform = `skewY(${typo.sk.toFixed(2)}deg)`));   // inclinaison seule : la graisse variable relançait la mise en page à chaque image
  const vitesse = v => gsap.to(typo, { sk: gsap.utils.clamp(-2, 2, v * -.06), duration: .5, ease: "power3.out", overwrite: true, onUpdate: majTypo });
  if (lenis) lenis.on("scroll", l => vitesse(l.velocity));

  /* =====================================================================
     5. INTRO : un vieux PC s'allume (écran cathodique), la page s'ouvre
     ===================================================================== */
  let lancerRobot = () => {};                                         // la transformation du robot (définie plus bas)
  const heroEntre = () => {
    gsap.timeline()
      .from(".nav", { y: -16, opacity: 0, duration: .8 })
      .add(vague($(".hero h1")), .05)
      .from("[data-hero]", { y: 22, opacity: 0, stagger: .08 }, .35)
      .from(".robot", { y: 40, scale: .94, duration: 1.2 }, .45)
      .call(() => lancerRobot(), null, .9);
  };
  const intro = $("#intro");
  if (html.classList.contains("intro") && intro) {
    // 16/11 : l'intro est une animation CSS (sur la carte graphique) lancée dès l'affichage, sans attendre le
    // JavaScript : avant, elle saccadait sur téléphone pendant le chargement. Ici on ne fait que suivre son horloge.
    lenis && lenis.stop();
    const t0 = window.__introT0 || performance.now();
    const reste = ms => Math.max(0, ms - (performance.now() - t0));
    const finir = () => { finIntro(); lenis && lenis.start(); ScrollTrigger.refresh(); };
    const minuteurs = [setTimeout(heroEntre, reste(1350)), setTimeout(finir, reste(2050))];
    $(".intro-skip").addEventListener("click", () => { minuteurs.forEach(clearTimeout); heroEntre(); finir(); });
  } else {
    finIntro();
    heroEntre();
  }

  /* =====================================================================
     6. HERO : fond WebGL qui suit la souris (repli CSS sur iPhone)
     ===================================================================== */
  const heroBg = $(".hero-bg");
  if (false) {                                                                            // 16/11 : halos flous immobiles partout (repeints en continu)
    gsap.to(".g1", { x: 60, y: 40, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".g2", { x: -50, y: 30, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }
  gsap.to(heroBg, { yPercent: 16, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  (function shader() {
    if (!fin || innerWidth < 861) return;
    const c = $("#gl"), g = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!g) return;
    const src = (type, code) => { const s = g.createShader(type); g.shaderSource(s, code); g.compileShader(s); return g.getShaderParameter(s, g.COMPILE_STATUS) ? s : null; };
    const vs = src(g.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}");
    const fs = src(g.FRAGMENT_SHADER, `precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;
      vec3 b(vec2 u,vec2 c,float s,vec3 k){vec2 d=u-c;return k*exp(-dot(d,d)/s);}
      void main(){float a=r.x/r.y;vec2 u=gl_FragCoord.xy/r;u.x*=a;vec2 mm=m;mm.x*=a;
      vec3 col=vec3(.99,.995,1.);
      col=mix(col,vec3(.80,.91,.99),b(u,vec2(.22+.07*sin(t*.31),.86+.05*cos(t*.23)),.10,vec3(.75)).x);
      col=mix(col,vec3(.58,.77,.98),b(u,vec2(a*.86+.06*cos(t*.21),.58+.07*sin(t*.37)),.07,vec3(.55)).x);
      col=mix(col,vec3(.86,.93,1.),b(u,vec2(a*.55+.09*sin(t*.17),.08+.05*cos(t*.29)),.07,vec3(.6)).x);
      col=mix(col,vec3(.22,.45,.85),b(u,mm,.03,vec3(.42)).x);
      col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)*.03;
      gl_FragColor=vec4(col,1.);}`);
    if (!vs || !fs) return;
    const pr = g.createProgram(); g.attachShader(pr, vs); g.attachShader(pr, fs); g.linkProgram(pr); g.useProgram(pr);
    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(pr, "p"); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    const uR = g.getUniformLocation(pr, "r"), uT = g.getUniformLocation(pr, "t"), uM = g.getUniformLocation(pr, "m");
    const taille = () => { c.width = Math.round(c.clientWidth * .5); c.height = Math.round(c.clientHeight * .5); g.viewport(0, 0, c.width, c.height); };
    taille(); addEventListener("resize", taille);
    const m = { x: .7, y: .6, tx: .7, ty: .6 };
    $(".hero").addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); m.tx = (e.clientX - r.left) / r.width; m.ty = 1 - (e.clientY - r.top) / r.height; });
    let actif = true, dernier = 0;
    ScrollTrigger.create({ trigger: ".hero", start: "top bottom", end: "bottom top", onToggle: s => (actif = s.isActive) });
    gsap.ticker.add(t => {
      if (!actif || leger || document.hidden || t - dernier < 1 / 24) return;     // 30 images/s suffisent pour un fond flou
      dernier = t;
      m.x += (m.tx - m.x) * .12; m.y += (m.ty - m.y) * .12;
      g.uniform2f(uR, c.width, c.height); g.uniform1f(uT, t); g.uniform2f(uM, m.x, m.y);
      g.drawArrays(g.TRIANGLES, 0, 3);
    });
    heroBg.classList.add("gl-on");
  })();

  // nav : fond au défilement + barre de progression
  const navFond = () => $(".nav").classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", navFond, { passive: true }); navFond();
  gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .2 } });

  /* 16/11 : le vieux PC devient un robot (remplace le téléphone, jugé lent). Tout en transform/opacity. */
  if ($(".robot")) {
    // les agents tournent autour du robot (6 personnages pixel art)
    const orb = $("#rbOrbite"), tour = ["gerard", "lola", "marie", "jeanmi", "ginette", "monique"];
    tour.forEach(id => {
      const g = document.createElementNS(NS, "g");
      g.innerHTML = `<image href="sprites/${id}-0.png" x="-11" y="-11" width="22" height="22" style="image-rendering:pixelated"/>`;
      orb.appendChild(g);
    });
    const satellites = [...orb.children], orbite = { a: 0 };
    const placer = () => satellites.forEach((g, i) => {
      const t = orbite.a + i * Math.PI * 2 / satellites.length;
      g.setAttribute("transform", `translate(${(100 + Math.cos(t) * 96).toFixed(1)} ${(104 + Math.sin(t) * 40).toFixed(1)})`);
      g.style.opacity = .35 + .65 * (Math.sin(t) + 1) / 2;            // devant = net, derrière = pâle
    });
    placer();
    gsap.to(orbite, { a: Math.PI * 2, duration: 22, ease: "none", repeat: -1, onUpdate: placer });

    gsap.set("#rbJambes", { scaleY: 0, transformOrigin: "50% 0%" });
    gsap.set("#rbBrasG", { scaleX: 0, transformOrigin: "100% 50%" });
    gsap.set("#rbBrasD", { scaleX: 0, transformOrigin: "0% 50%" });
    gsap.set("#rbAntenne", { scaleY: 0, transformOrigin: "50% 100%" });
    gsap.set("#rbFlamme", { scaleY: 0, opacity: 0, transformOrigin: "50% 0%" });
    gsap.set(["#rbYeux", "#rbOrbite"], { opacity: 0 });
    const robot = gsap.timeline({ paused: true, defaults: { ease: "back.out(2.2)" } })
      .to("#rbEcran", { attr: { fill: "#E0F2FE" }, duration: .06, yoyo: true, repeat: 5, ease: "none" }, .3)
      .set("#rbDos", { opacity: 0 })
      .to("#rbYeux", { opacity: 1, duration: .25, ease: "power2.out" })
      .to("#rbClavier", { y: 34, opacity: 0, duration: .5, ease: "power2.in" }, "<")
      .to("#rbJambes", { scaleY: 1, duration: .6 }, "-=.1")
      .to("#rbBrasG", { scaleX: 1, duration: .6 }, "<.1")
      .to("#rbBrasD", { scaleX: 1, duration: .6 }, "<.08")
      .to("#rbAntenne", { scaleY: 1, duration: .5, ease: "back.out(3.5)" }, "<.15")
      .to("#rbFlamme", { scaleY: 1, opacity: 1, duration: .3, ease: "power2.out" })
      .to("#rbCorps", { y: -12, duration: .8, ease: "power2.out" }, "<")
      .to("#rbOmbre", { attr: { rx: 32 }, opacity: .07, duration: .8, ease: "power2.out" }, "<")
      .to("#rbOrbite", { opacity: 1, duration: .8, ease: "power2.out" }, "<.2")
      .fromTo(".rb-chip", { opacity: 0, scale: .6, y: 8 }, { opacity: 1, scale: 1, y: 0, duration: .5, stagger: .18 }, "<.3");
    // une fois robot : il flotte, cligne des yeux et salue
    gsap.to("#rbCorps", { y: -18, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 4 });
    gsap.to("#rbFlamme", { scaleY: .6, duration: .18, ease: "none", yoyo: true, repeat: -1, delay: 4 });
    gsap.timeline({ repeat: -1, repeatDelay: 3.2, delay: 5 })
      .to(".rb-oeil", { scaleY: .15, transformOrigin: "50% 50%", duration: .07 }).to(".rb-oeil", { scaleY: 1, duration: .12 });
    gsap.timeline({ repeat: -1, repeatDelay: 5, delay: 6 })
      .to("#rbBrasD", { rotation: -25, transformOrigin: "0% 50%", duration: .25, ease: "power2.out", yoyo: true, repeat: 3 });
    lancerRobot = () => robot.play(0);                                 // lancé par l'entrée du hero (voir heroEntre)
    $(".robot").addEventListener("click", () => {                      // clic : il redevient un vieux PC… et se retransforme
      gsap.timeline()
        .to(".rb-chip", { opacity: 0, duration: .2 })
        .call(() => robot.pause(0)).call(() => { gsap.set("#rbDos", { opacity: 1 }); robot.play(0); }, null, "+=.4");
    });
  }

  /* Bande des prénoms : accélère avec le scroll */
  const bandTw = gsap.to("#band", { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
  let bandV = 1;
  if (lenis) lenis.on("scroll", l => { const v = 1 + Math.min(4, Math.abs(l.velocity) / 10); if (Math.abs(v - bandV) > .25) { bandV = v; gsap.to(bandTw, { timeScale: v, duration: .4, overwrite: true }); } });

  /* Titres de section + apparitions */
  $$(".sec h2.kin").forEach(h => vague(h, { scrollTrigger: { trigger: h.closest("#marche") || h, start: h.closest("#marche") ? "top 70%" : "top 85%" } }));
  // ce qui est dans la scène épinglée part avec la section (sinon les positions sont décalées par l'épinglage)
  gsap.from("#marche [data-reveal]", { y: 22, opacity: 0, stagger: .08, scrollTrigger: { trigger: "#marche", start: "top 70%" } });
  gsap.set(".sec:not(#marche) [data-reveal]", { opacity: 0 });
  ScrollTrigger.batch(".sec:not(#marche) [data-reveal]", {
    start: "top 88%", once: true,
    onEnter: els => gsap.fromTo(els, { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: .07, overwrite: true }),
  });

  /* =====================================================================
     7. SCÈNE ÉPINGLÉE : le scroll fait avancer le message dans le réseau
     ===================================================================== */
  const steps = $$("#steps li"), cap = $("#netCap");
  const reseau = (tl, pause) => {
    const debuts = [];
    ROUTES.forEach(r => {
      const tous = [r.to, ...(r.then || [])];
      const autresN = Object.keys(NODE).filter(k => k !== "gerard" && !tous.includes(k)).map(k => NODE[k]);
      const anneaux = tous.map(k => mk("circle", { class: "anneau", cx: POS[k].x, cy: POS[k].y, r: 0, stroke: A[k].c }, $("#hot")));
      debuts.push(tl.duration());
      tl.fromTo(cap, { opacity: 0, y: 14, scale: .85 }, { opacity: 1, y: 0, scale: 1, duration: .6, ease: "back.out(2)" })
        .to(autresN, { opacity: .22, duration: .5, ease: "power2.out" }, "<")
        .fromTo("#p1", { attr: { cx: HUB.x, cy: -10 }, opacity: 1 }, { attr: { cy: HUB.y }, duration: .8, ease: "power2.in", immediateRender: false }, "<.2")
        .to("#hubhalo", { scale: 1.6, svgOrigin: `${HUB.x} ${HUB.y}`, duration: .25, yoyo: true, repeat: 1, ease: "sine.inOut" })
        .to(NODE.gerard, { scale: 1.08, svgOrigin: `${HUB.x} ${HUB.y}`, duration: .25, yoyo: true, repeat: 1, ease: "sine.inOut" }, "<")
        .set(r.L, { opacity: 1 })
        .to(r.L, { strokeDashoffset: 0, duration: .7, ease: "power3.inOut" })
        .to("#p1", { attr: { cx: POS[r.to].x, cy: POS[r.to].y }, duration: .7, ease: "power3.inOut" }, "<")
        .set("#p1", { opacity: 0 })
        .to(NODE[r.to], { scale: 1.6, svgOrigin: `${POS[r.to].x} ${POS[r.to].y}`, duration: .6, ease: "back.out(3)" }, "<")
        .fromTo(anneaux[0], { attr: { r: 10 }, opacity: 1 }, { attr: { r: 56 }, opacity: 0, duration: .9, ease: "power2.out", immediateRender: false }, "<");
      (r.then || []).forEach((t, k) => {
        tl.set(r.subs[k], { opacity: 1 }, k ? "<" : "+=.2")
          .fromTo(`#p${k + 2}`, { attr: { cx: POS[r.to].x, cy: POS[r.to].y }, opacity: 1 }, { attr: { cx: POS[t].x, cy: POS[t].y }, duration: .7, ease: "power3.inOut", immediateRender: false }, "<")
          .to(r.subs[k], { strokeDashoffset: 0, duration: .7, ease: "power3.inOut" }, "<")
          .to(NODE[t], { scale: 1.45, svgOrigin: `${POS[t].x} ${POS[t].y}`, duration: .6, ease: "back.out(3)" })
          .fromTo(anneaux[k + 1], { attr: { r: 10 }, opacity: 1 }, { attr: { r: 50 }, opacity: 0, duration: .9, ease: "power2.out", immediateRender: false }, "<");
      });
      if (r.then) tl.set(["#p2", "#p3"], { opacity: 0 });
      tl.to([r.L, ...r.subs, cap], { opacity: 0, duration: .5, ease: "power1.inOut" }, `+=${pause}`)
        .to(tous.map(o => NODE[o]), { scale: 1, duration: .5, ease: "power2.out" }, "<")
        .to(autresN, { opacity: 1, duration: .5 }, "<")
        .set([r.L, ...r.subs], { strokeDashoffset: (i, el) => el.style.strokeDasharray });
    });
    debuts.push(tl.duration());
    // légende et étapes calculées à partir de la position (juste dans les deux sens de scroll)
    tl.eventCallback("onUpdate", () => {
      const t = tl.time();
      let i = 0; while (i < ROUTES.length - 1 && t >= debuts[i + 1]) i++;
      const f = (t - debuts[i]) / (debuts[i + 1] - debuts[i]);
      if (cap.dataset.i !== String(i)) { cap.dataset.i = i; cap.textContent = ROUTES[i].txt; }
      const e = f < .28 ? 0 : f < .45 ? 1 : 2;
      steps.forEach((s, k) => s.classList.toggle("on", k === e));
      gsap.set("#sceneFill", { scaleX: tl.progress() });
      $("#sceneLbl").textContent = `${i + 1} / ${ROUTES.length}`;
    });
    return tl;
  };
  // 15/11 : plus d'épinglage (on avait l'impression d'être bloquée) : la scène joue toute seule dès qu'elle est à l'écran
  const scene = reseau(gsap.timeline({ repeat: -1, paused: true }), 1.6);
  ScrollTrigger.create({ trigger: "#net", start: "top 80%", end: "bottom 15%", onToggle: s => s.isActive ? scene.play() : scene.pause() });
  gsap.from("#nodes .node", { opacity: 0, y: 24, duration: 1.1, stagger: { each: .04, from: "random" }, scrollTrigger: { trigger: "#marche", start: "top 60%" } });

  /* Avant / après : la flèche se trace, l'« avant » pâlit, l'« après » s'allume */
  if ($(".ba")) {
    gsap.timeline({ scrollTrigger: { trigger: ".ba", start: "top 75%", end: "bottom 45%", scrub: .6 } })
      .fromTo("#baTrait", { strokeDashoffset: 110 }, { strokeDashoffset: 0, ease: "none" })
      .fromTo("#baPointe", { opacity: 0 }, { opacity: 1, ease: "none", duration: .2 })
      .fromTo(".ba-card.avant", { filter: "grayscale(0) brightness(1)" }, { filter: "grayscale(1) brightness(.75)", ease: "none" }, 0)
      .fromTo(".ba-card.apres", { "--lum": 0 }, { "--lum": 1, ease: "none" }, .3);
  }

  /* Cartes : cascade, lumière qui suit la souris */
  gsap.set("[data-card]", { opacity: 0 });
  ScrollTrigger.batch("[data-card]", {
    start: "top 90%", once: true,
    onEnter: els => gsap.fromTo(els, { y: 40, opacity: 0, rotateX: -10, transformPerspective: 900 }, { y: 0, opacity: 1, rotateX: 0, stagger: .07, duration: 1.1, overwrite: true }),
  });
  $$("[data-card]").forEach(c => c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  /* =====================================================================
     8. FRISE 24 H : la ligne se trace, le ciel passe de la nuit au jour
     ===================================================================== */
  gsap.to("#tlFill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#tl", start: "top 70%", end: "bottom 60%", scrub: .4 } });
  $$(".tl-item").forEach((it, i) => {
    const side = innerWidth > 860 ? (i % 2 ? -1 : 1) * 28 : 18;
    gsap.from(it, { x: side, opacity: 0, scrollTrigger: { trigger: it, start: "top 85%" } });
  });
  const J = $("#journee"), soleil = $(".soleil"), lune = $(".lune"), etoiles = $(".etoiles");
  const ciel = gsap.timeline({ defaults: { ease: "none", duration: 1 } })
    .fromTo(J, { "--sky1": "#08091C", "--sky2": "#0C0E25" }, { "--sky1": "#1E1A4D", "--sky2": "#7A3E6E" })   // aube
    .to(J, { "--sky1": "#1D4A9A", "--sky2": "#3F78CC" })                                                   // jour
    .to(J, { "--sky1": "#2E1C52", "--sky2": "#B5573F" })                                                   // crépuscule
    .to(J, { "--sky1": "#08091C", "--sky2": "#0C0E25" });                                                  // nuit
  ScrollTrigger.create({
    trigger: J, start: "top bottom", end: "bottom bottom", scrub: .5, animation: ciel,
    onUpdate: s => {
      const p = s.progress, W = innerWidth, H = innerHeight;
      const arc = (q, x0, x1) => ({ x: W * (x0 + (x1 - x0) * q), y: H * (.82 - Math.sin(Math.PI * q) * .62) });
      const qs = gsap.utils.clamp(0, 1, (p - .22) / .56);               // le soleil traverse entre 22 % et 78 %
      const sp = arc(qs, .08, .92);
      gsap.set(soleil, { x: sp.x, y: sp.y, opacity: qs > 0 && qs < 1 ? 1 : 0 });
      const ql = p < .5 ? .5 + p * 2 : (p - .75) * 2;                    // la lune se couche à l'aube, se relève le soir
      const lp = arc(gsap.utils.clamp(0, 1, ql), .08, .92);
      gsap.set(lune, { x: lp.x, y: lp.y, opacity: p < .25 || p > .75 ? .95 : 0 });
      gsap.set(etoiles, { opacity: gsap.utils.clamp(0, .8, (Math.abs(p - .5) - .2) * 3) });
    },
  });

  /* =====================================================================
     9. COMPTEURS EN ROULEAU
     ===================================================================== */
  $$(".roll").forEach(el => {
    const val = el.dataset.val || el.textContent;
    el.innerHTML = [...val].map(ch => /\d/.test(ch)
      ? `<span class="col" data-d="${ch}">${Array.from({ length: 20 }, (_, i) => `<span>${i % 10}</span>`).join("")}</span>`
      : `<span class="fix">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
    el.setAttribute("aria-label", val);
    const cols = $$(".col", el).reverse();
    gsap.fromTo(cols, { yPercent: 0 }, {
      yPercent: (i, c) => -((10 + +c.dataset.d) / 20) * 100, duration: 2.2, ease: "expo.out", stagger: .12,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  /* Fin : les onze arrivent un par un, puis chacun fait son geste */
  gsap.from("#crowd .av", {
    y: 40, opacity: 0, scale: .5, duration: .9, ease: "back.out(2.4)", stagger: .06,
    scrollTrigger: { trigger: "#crowd", start: "top 88%" },
    onComplete: () => $$("#crowd .bot").forEach((b, i) => gsap.delayedCall(i * .12, () => geste(b))),
  });

  /* =====================================================================
     10. CURSEUR MAISON + BOUTONS AIMANTÉS (ordi)
     ===================================================================== */
  if (false && fin) {   // 16/11 : curseur maison et boutons aimantés retirés (retard sous la souris, jugé gênant)
    html.classList.add("has-cur");
    const cur = $(".cur"), dot = $(".cur-dot"), ring = $(".cur-ring"), lbl = $(".cur-lbl");
    const dx = gsap.quickTo(dot, "x", { duration: .08, ease: "power3" }), dy = gsap.quickTo(dot, "y", { duration: .08, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: .35, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: .35, ease: "power3" });
    addEventListener("pointermove", e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", e => {
      const n = e.target.closest("[data-name]"), l = e.target.closest("a, button");
      cur.classList.toggle("nom", !!n && !l); cur.classList.toggle("lien", !!l);
      if (n && !l) { lbl.textContent = n.dataset.name; cur.style.setProperty("--cc", n.dataset.c || "#fff"); }
    });
    document.addEventListener("pointerleave", () => gsap.to([dot, ring], { opacity: 0, duration: .2 }));
    document.addEventListener("pointerenter", () => gsap.to([dot, ring], { opacity: 1, duration: .2 }));
    $$(".magnet").forEach(b => {
      const x = gsap.quickTo(b, "x", { duration: .4, ease: "power3" }), y = gsap.quickTo(b, "y", { duration: .4, ease: "power3" });
      const s = b.querySelector("span"), sx = gsap.quickTo(s, "x", { duration: .4 }), sy = gsap.quickTo(s, "y", { duration: .4 });
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect(), ddx = e.clientX - (r.left + r.width / 2), ddy = e.clientY - (r.top + r.height / 2);
        x(ddx * .3); y(ddy * .4); sx(ddx * .12); sy(ddy * .15);
      });
      b.addEventListener("pointerleave", () => gsap.to([b, s], { x: 0, y: 0, duration: .9, ease: "elastic.out(1, .35)" }));
    });
  }

  /* =====================================================================
     11. LE FIL DE GÉRARD : un trait qui se dessine au scroll, de section en section
     ===================================================================== */
  const fil = $("#fil"), main = $("main"), tete = $("#filHead");
  let segs = [], arrets = [];
  const docPos = (el, fx = .5, fy = .5) => {
    const r = el.getBoundingClientRect(), m = main.getBoundingClientRect();
    return { x: r.left - m.left + r.width * fx, y: r.top - m.top + r.height * fy };
  };
  const chemin = pts => pts.reduce((d, p, i) => {
    if (!i) return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    const a = pts[i - 1], dy = (p.y - a.y) * .55;
    return d + ` C${a.x.toFixed(1)} ${(a.y + dy).toFixed(1)} ${p.x.toFixed(1)} ${(p.y - dy).toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, "");
  const construireFil = () => {
    const H = main.scrollHeight;
    fil.setAttribute("height", H); fil.setAttribute("viewBox", `0 0 ${main.clientWidth} ${H}`);
    $("#filgrad").setAttribute("y2", H);
    ["#filTracks", "#filPaths", "#filStops"].forEach(s => ($(s).innerHTML = ""));
    const depart = docPos($(".robot") || $(".phone"), .5, 1), net = $(".net-wrap");
    const spacer = $(".marche-pin").parentElement.classList.contains("pin-spacer") ? $(".marche-pin").parentElement : null;
    const gerard = docPos($(".card.big .av")), tlTop = docPos($(".tl-line"), .5, 0), tlBas = docPos($(".tl-line"), .5, 1);
    const stats = docPos($(".stats"), .5, .5), arrivee = docPos($("#crowd"), .5, .5);
    let groupes;
    if (spacer) {                                                     // ordi : le fil entre dans la scène épinglée et en ressort
      const nx = docPos(net).x, haut = docPos(spacer, .5, 0).y, bas = docPos(spacer, .5, 1).y;
      groupes = [[depart, { x: nx, y: haut + 60 }], [{ x: nx, y: bas - 90 }, gerard, tlTop, tlBas, stats, arrivee]];
    } else {
      // téléphone : le fil longe la marge gauche pour ne jamais passer sur le texte
      const pts = [depart, docPos($(".ba")), docPos(net), docPos($("#actes")), gerard, tlTop, tlBas, stats, arrivee];
      groupes = [innerWidth < 861 ? pts.map(p => ({ x: 7, y: p.y })) : pts];
    }
    segs = groupes.map(pts => {
      const d = chemin(pts);
      mk("path", { d, class: "track" }, $("#filTracks"));
      const glow = { style: {} };   // 16/11 : plus de halo flou sur le fil (il repeignait toute la page à chaque image)
      const p = mk("path", { d, class: "trait" }, $("#filPaths"));
      const L = p.getTotalLength();
      [p, glow].forEach(e => { e.style.strokeDasharray = L; e.style.strokeDashoffset = L; });
      const N = 240, ys = [], ls = [];
      for (let i = 0; i <= N; i++) { const l = L * i / N; ls.push(l); ys.push(p.getPointAtLength(l).y); }
      return { p, glow, L, ys, ls };
    });
    arrets = groupes.flat().map(pt => ({ y: pt.y, el: mk("circle", { class: "stop", cx: pt.x, cy: pt.y, r: 5 }, $("#filStops")), on: false }));
    majFil();
  };
  const longueurA = (s, y) => {                                      // longueur dessinée quand la tête est à la hauteur y
    if (y <= s.ys[0]) return 0;
    let lo = 0, hi = s.ys.length - 1;
    if (y >= s.ys[hi]) return s.L;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; s.ys[mid] <= y ? (lo = mid) : (hi = mid); }
    const f = (y - s.ys[lo]) / ((s.ys[hi] - s.ys[lo]) || 1);
    return s.ls[lo] + (s.ls[hi] - s.ls[lo]) * f;
  };
  const majFil = () => {
    if (!segs.length) return;
    const y = (lenis ? lenis.scroll : scrollY) - (main.getBoundingClientRect().top + scrollY) + innerHeight * .62;
    let point = null;
    segs.forEach(s => {
      const l = longueurA(s, y);
      s.p.style.strokeDashoffset = s.glow.style.strokeDashoffset = s.L - l;
      if (l > 0 && l < s.L) point = s.p.getPointAtLength(l);
    });
    tete.classList.toggle("on", !!point);
    if (point) tete.setAttribute("transform", `translate(${point.x} ${point.y})`);
    arrets.forEach(a => {
      const on = y >= a.y;
      if (on !== a.on) {
        a.on = on; a.el.classList.toggle("on", on);
        if (on) gsap.fromTo(a.el, { attr: { r: 5 } }, { attr: { r: 11 }, duration: .25, yoyo: true, repeat: 1, ease: "power2.out" });
      }
    });
  };
  ScrollTrigger.addEventListener("refresh", construireFil);
  lenis ? lenis.on("scroll", majFil) : addEventListener("scroll", majFil, { passive: true });

  addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts.ready.then(() => ScrollTrigger.refresh());

  // Mode allégé automatique : si le Mac rame (moins de 40 img/s mesurées pendant 3 s), on coupe ce qui coûte
  // (shader, halos flous, respiration, gestes au hasard). ?leger le force, ?complet l'interdit.
  const allege = () => {
    if (leger) return;
    leger = true;
    html.classList.add("leger");
    heroBg.classList.remove("gl-on");
    bots.forEach(b => b._respire && b._respire.kill());
    $$(".glow").forEach(g => gsap.killTweensOf(g));
  };
  if (/[?&]leger/.test(location.search)) allege();
  else if (!/[?&]complet/.test(location.search)) {
    let n = 0, t0 = 0, essais = 0;
    const mesure = t => {
      if (leger || document.hidden) return;
      if (!t0) { t0 = t; n = 0; return; }
      n++;
      if (t - t0 >= 3) {                                         // fenêtre de 3 s, deux essais au maximum
        if (n / (t - t0) < 40) { allege(); gsap.ticker.remove(mesure); }
        else if (++essais >= 2) gsap.ticker.remove(mesure);
        t0 = 0;
      }
    };
    gsap.delayedCall(html.classList.contains("intro") ? 5 : 1.5, () => gsap.ticker.add(mesure));
  }

  // ?fps dans l'adresse : compteur d'images par seconde (pour vérifier sur l'i3)
  if (/[?&]fps/.test(location.search)) {
    const b = document.createElement("div");
    b.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:200;font:600 13px/1 monospace;padding:8px 10px;border-radius:8px;background:#000c;color:#4ADE80";
    document.body.appendChild(b);
    let n = 0, t0 = performance.now(), pire = 0, avant = t0;
    (function f(t) {
      n++; pire = Math.max(pire, t - avant); avant = t;
      if (t - t0 >= 1000) { const v = Math.round(n * 1000 / (t - t0)); b.textContent = `${v} img/s · pire ${Math.round(pire)} ms${leger ? " · allégé" : ""}`; b.style.color = v >= 50 ? "#4ADE80" : v >= 30 ? "#FFC53D" : "#FF4D4D"; n = 0; t0 = t; pire = 0; }
      requestAnimationFrame(f);
    })(t0);
  }

  function statique() {
    $("#mMeTxt").textContent = "Ginette, tu te souviens de l'idée sur les agences d'agents ?";
    $("#mBotTxt").textContent = "Oui ! Idée #9, « agences d'agents ». Je te remets le reel."; $("#mSig").textContent = "— Ginette";
    $("#routeTo").textContent = "Ginette"; $("#routeAv").innerHTML = avatar("ginette", A.ginette.c);
    $("#steps li").classList.add("on");
    $("#netCap").textContent = ROUTES[0].txt;
  }
})();
