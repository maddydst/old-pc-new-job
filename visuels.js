// 18/11 : visuels maison (pas de captures) pour l'étape « tableau de bord » et le bonus « mini-ville »
const VISUELS = {
  dashboard: `<svg class="visuel" viewBox="0 0 640 360" role="img" aria-label="Illustration : un tableau de bord qui montre tes agents, sur l'ordi et sur le téléphone">
  <defs><linearGradient id="vdG" x1="0" x2="1"><stop offset="0" stop-color="#6B93FF"/><stop offset="1" stop-color="#3DD6F5"/></linearGradient></defs>
  <rect x="8" y="14" width="500" height="320" rx="16" fill="#fff" stroke="#D6E2FF" stroke-width="2"/>
  <rect x="8" y="14" width="500" height="34" rx="16" fill="#0F2A5F"/><rect x="8" y="34" width="500" height="14" fill="#0F2A5F"/>
  <circle cx="30" cy="31" r="5" fill="#FF6BA8"/><circle cx="46" cy="31" r="5" fill="#FFC53D"/><circle cx="62" cy="31" r="5" fill="#3DD6F5"/>
  <text x="258" y="36" text-anchor="middle" fill="#fff" font-size="13" font-family="Space Grotesk,sans-serif" font-weight="600">Mon tableau de bord</text>
  <rect x="8" y="48" width="96" height="286" fill="#F3F7FF"/>
  <g fill="#C7D6FA"><rect x="22" y="66" width="68" height="10" rx="5" fill="url(#vdG)"/><rect x="22" y="90" width="56" height="8" rx="4"/><rect x="22" y="110" width="62" height="8" rx="4"/><rect x="22" y="130" width="48" height="8" rx="4"/></g>
  <g font-family="DM Sans,sans-serif">
    <g transform="translate(120 62)"><rect width="118" height="64" rx="12" fill="#EEF3FF"/><text x="12" y="22" font-size="11" fill="#4B5B7C">Agents en service</text><text x="12" y="50" font-size="24" font-weight="700" fill="#0F2A5F" font-family="Space Grotesk,sans-serif">6</text><circle cx="100" cy="44" r="6" fill="#22C55E" class="v-pulse"/></g>
    <g transform="translate(248 62)"><rect width="118" height="64" rx="12" fill="#FFF7E0"/><text x="12" y="22" font-size="11" fill="#4B5B7C">À valider</text><text x="12" y="50" font-size="24" font-weight="700" fill="#0F2A5F" font-family="Space Grotesk,sans-serif">2</text></g>
    <g transform="translate(376 62)"><rect width="118" height="64" rx="12" fill="#FFEFF5"/><text x="12" y="22" font-size="11" fill="#4B5B7C">Alertes</text><text x="12" y="50" font-size="24" font-weight="700" fill="#0F2A5F" font-family="Space Grotesk,sans-serif">1</text></g>
    <g transform="translate(120 140)"><rect width="246" height="180" rx="12" fill="#fff" stroke="#E3EBFF" stroke-width="2"/>
      <text x="14" y="24" font-size="12" font-weight="600" fill="#0F2A5F">Tes agents</text>
      <g font-size="11" fill="#334155">
        <circle cx="20" cy="50" r="5" fill="#22C55E"/><text x="32" y="54">L'aiguilleur</text><text x="232" y="54" text-anchor="end" fill="#64748B">il y a 2 min</text>
        <circle cx="20" cy="78" r="5" fill="#22C55E"/><text x="32" y="82">Le facteur</text><text x="232" y="82" text-anchor="end" fill="#64748B">8 h 00</text>
        <circle cx="20" cy="106" r="5" fill="#FFC53D"/><text x="32" y="110">La veilleuse</text><text x="232" y="110" text-anchor="end" fill="#64748B">samedi</text>
        <circle cx="20" cy="134" r="5" fill="#22C55E"/><text x="32" y="138">L'archiviste</text><text x="232" y="138" text-anchor="end" fill="#64748B">22 h 00</text>
        <circle cx="20" cy="162" r="5" fill="#CBD5E1"/><text x="32" y="166">Ton agent</text><text x="232" y="166" text-anchor="end" fill="#64748B">à créer</text>
      </g></g>
    <g transform="translate(376 140)"><rect width="118" height="180" rx="12" fill="#0F2A5F"/>
      <text x="12" y="24" font-size="12" font-weight="600" fill="#fff">En direct</text>
      <path class="v-trace" d="M12 120 L30 104 L46 112 L62 82 L78 92 L94 64 L106 72" fill="none" stroke="url(#vdG)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <g fill="#9DB4F5" font-size="10"><text x="12" y="148">✓ résumé envoyé</text><text x="12" y="166">✓ idée rangée</text></g></g>
  </g>
  <g transform="translate(528 58)">
    <rect width="104" height="200" rx="18" fill="#0F2A5F"/><rect x="7" y="16" width="90" height="172" rx="10" fill="#fff"/>
    <rect x="38" y="6" width="28" height="5" rx="2.5" fill="#3B5BA9"/>
    <rect x="15" y="26" width="74" height="40" rx="8" fill="#EEF3FF"/><text x="23" y="42" font-size="9" fill="#4B5B7C" font-family="DM Sans,sans-serif">En service</text><text x="23" y="59" font-size="16" font-weight="700" fill="#0F2A5F" font-family="Space Grotesk,sans-serif">6</text>
    <g fill="#E3EBFF"><rect x="15" y="76" width="74" height="18" rx="6"/><rect x="15" y="100" width="74" height="18" rx="6"/><rect x="15" y="124" width="74" height="18" rx="6"/></g>
    <g><circle cx="24" cy="85" r="3.5" fill="#22C55E"/><circle cx="24" cy="109" r="3.5" fill="#22C55E"/><circle cx="24" cy="133" r="3.5" fill="#FFC53D"/></g>
    <rect x="15" y="152" width="74" height="24" rx="12" fill="url(#vdG)"/><text x="52" y="168" text-anchor="middle" font-size="10" font-weight="600" fill="#fff" font-family="DM Sans,sans-serif">Valider</text>
  </g>
</svg>`,

  ville: (() => {
    const bat = (x, w, h, c, toit) => `<g transform="translate(${x} ${236 - h})"><rect width="${w}" height="${h}" fill="${c}"/><rect y="-8" width="${w}" height="8" fill="${toit}"/>${
      Array.from({ length: Math.floor((h - 30) / 22) }, (_, r) => Array.from({ length: Math.floor((w - 8) / 16) }, (_, k) =>
        `<rect class="v-fen" x="${8 + k * 16}" y="${12 + r * 22}" width="8" height="10" fill="#FFE9A8" style="animation-delay:${((r * 3 + k * 7) % 9) * .4}s"/>`).join("")).join("")
    }<rect x="${w / 2 - 6}" y="${h - 20}" width="12" height="20" fill="#0F2A5F"/></g>`;
    const bot = (id, x, y, d) => `<g class="v-marche" style="animation-delay:${d}s"><image href="sprites/${id}-0.png" x="${x}" y="${y}" width="32" height="36" class="v-pix"/></g>`;
    return `<svg class="visuel" viewBox="0 0 640 300" role="img" aria-label="Illustration : une petite ville en pixel art où tes agents vont et viennent">
  <defs><linearGradient id="vvCiel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F2A5F"/><stop offset="1" stop-color="#3B5BA9"/></linearGradient></defs>
  <rect width="640" height="300" rx="16" fill="url(#vvCiel)"/>
  <g fill="#fff" opacity=".8"><rect x="60" y="30" width="3" height="3"/><rect x="180" y="54" width="3" height="3"/><rect x="300" y="24" width="3" height="3"/><rect x="430" y="46" width="3" height="3"/><rect x="590" y="70" width="3" height="3"/><rect x="250" y="80" width="2" height="2"/></g>
  <g fill="#FFE9A8"><rect x="540" y="26" width="30" height="30"/><rect x="552" y="26" width="18" height="18" fill="#3B5BA9" opacity=".0"/></g>
  ${bat(24, 92, 150, "#6B93FF", "#4A6FD6")}${bat(130, 70, 110, "#3DD6F5", "#22B3D1")}${bat(214, 120, 176, "#9DB4F5", "#6B93FF")}${bat(348, 80, 124, "#FF8FBF", "#E5679D")}${bat(442, 96, 160, "#6B93FF", "#4A6FD6")}${bat(552, 66, 100, "#FFC53D", "#E0A51C")}
  <rect y="236" width="640" height="64" fill="#2E7D4F"/><rect y="236" width="640" height="6" fill="#4CAF6E"/>
  <rect y="258" width="640" height="24" fill="#5B6478"/><g fill="#E5E7EB">${Array.from({ length: 16 }, (_, k) => `<rect x="${12 + k * 40}" y="268" width="20" height="4"/>`).join("")}</g>
  ${bot("gerard", 70, 226, 0)}${bot("lola", 250, 228, .6)}${bot("marie", 380, 226, 1.2)}${bot("josiane", 500, 228, .3)}${bot("mairie", 160, 230, .9)}
  <g transform="translate(262 40)"><rect width="116" height="26" rx="13" fill="#fff"/><text x="58" y="17" text-anchor="middle" font-size="11" font-weight="600" fill="#0F2A5F" font-family="DM Sans,sans-serif">Le facteur part ✉️</text></g>
</svg>`;
  })(),
};
