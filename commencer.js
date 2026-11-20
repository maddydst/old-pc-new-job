// Page « Commencer » : boutons Copier + mêmes mouvements que le reste du site, en léger.
(() => {
  const $ = (s, r = document) => (r ? r.querySelector(s) : null);
  const $$ = (s, r = document) => (r ? [...r.querySelectorAll(s)] : []);

  /* Copier un message (avec repli si le presse-papiers est refusé) */
  $$(".copier").forEach(b => b.addEventListener("click", async () => {
    if (b.dataset.tout !== undefined) { if (typeof promptTout === "function") copierTexte(promptTout(), b); return; }
    const txt = b.closest(".copie").querySelector("pre").innerText.trim();
    let ok = false;
    try { await navigator.clipboard.writeText(txt); ok = true; } catch (e) {
      const t = document.createElement("textarea");
      t.value = txt; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { ok = document.execCommand("copy"); } catch (e2) {}
      t.remove();
    }
    b.textContent = ok ? "Copié ✓" : "Sélectionnez le texte";
    b.classList.toggle("ok", ok);
    setTimeout(() => { b.textContent = "Copier"; b.classList.remove("ok"); }, 2200);
  }));

  if (!window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: .9 });

  let lenis = null;
  if (false && window.Lenis) {   // 16/11 : défilement natif (le défilement adouci ajoutait un retard sur le trackpad)
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const t = $(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: -80, duration: 1.4 }) : t.scrollIntoView({ behavior: "smooth" });
  }));
  const navFond = () => $(".nav").classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", navFond, { passive: true }); navFond();
  gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .2 } });

  // titres : lignes qui montent derrière un masque
  $$(".kin .line").forEach(l => (l.innerHTML = `<span class="li" style="display:inline-block">${l.innerHTML}</span>`));
  // 16/11 : le haut de page n'attend plus le JavaScript (petite animation CSS dès l'affichage, voir style.css)

  // étapes : le numéro s'allume, la carte glisse ; la ligne du guide se trace au scroll
  $$(".g-etape").forEach(e => {
    gsap.timeline({ scrollTrigger: { trigger: e, start: "top 85%" } })
      .from(e, { y: 30, opacity: 0, duration: 1 })
      .from($(".g-n", e), { scale: .4, opacity: 0, duration: .8, ease: "back.out(2.4)" }, .1)
      .from($$(".copie", e), { y: 16, opacity: 0, stagger: .1 }, .25);
    ScrollTrigger.create({ trigger: e, start: "top 60%", end: "bottom 40%", toggleClass: { targets: e, className: "on" } });
  });
  gsap.to(".guide-liste", { "--trace": 1, ease: "none", scrollTrigger: { trigger: ".guide-liste", start: "top 70%", end: "bottom 60%", scrub: .4 } });
  gsap.from(".cta .li", { yPercent: 115, duration: 1.1, scrollTrigger: { trigger: ".cta", start: "top 75%" } });
  addEventListener("load", () => ScrollTrigger.refresh());
})();
