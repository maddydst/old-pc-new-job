// 16/11 : le site ne parle plus de MES agents. Ce sont des idées de métiers, sans prénom :
// chacun choisit les siens (les dessins pixel art servent juste d'illustration).
const AGENTS = [
  { id: "gerard", nom: "L'aiguilleur", court: "Aiguilleur", metier: "le chef d'accueil", c: "#FFC53D",
    txt: "Il reçoit tous tes messages, comprend ce que tu veux et passe la main au bon agent. C'est souvent le premier qu'on crée." },
  { id: "bob", nom: "Le facteur", court: "Facteur", metier: "le lien avec ton téléphone", c: "#FF7A45",
    txt: "Il garde ton PC joignable depuis ton téléphone, jour et nuit, et redémarre tout seul s'il tombe." },
  { id: "lola", nom: "Le rangeur d'idées", court: "Idées", metier: "pour ne plus rien perdre", c: "#FF5FA2",
    txt: "Tu lui envoies un lien, une photo ou une phrase : il résume l'idée et la range pour plus tard." },
  { id: "marie", nom: "Le journal", court: "Journal", metier: "ta mémoire de la journée", c: "#B794F6",
    txt: "Tu racontes ta journée, à l'écrit ou à la voix : il l'écrit proprement et te la ressort quand tu veux." },
  { id: "jeanmi", nom: "La veille", court: "Veille", metier: "l'actu de ton sujet", c: "#3DD6F5",
    txt: "Il lit les nouveautés sur le sujet qui te passionne et t'envoie un résumé, par exemple chaque samedi matin." },
  { id: "josiane", nom: "L'architecte", court: "Architecte", metier: "de l'idée au plan", c: "#4ADE80",
    txt: "Il transforme une idée floue en plan clair : le besoin, ce qu'il faut, les étapes." },
  { id: "ginette", nom: "Le bibliothécaire", court: "Biblio", metier: "il retrouve tout", c: "#F9A57B",
    txt: "Il retrouve une note ou une idée même si tu ne te souviens plus des mots exacts." },
  { id: "amelio", nom: "La boîte à idées", court: "Suggestions", metier: "ce qu'il faudrait améliorer", c: "#7CF2C2",
    txt: "Tu notes en une phrase ce qui pourrait marcher mieux. Il garde la liste pour la prochaine fois." },
  { id: "hugo", nom: "Le mécano", court: "Mécano", metier: "il améliore l'existant", c: "#60A5FA",
    txt: "Il regarde si une nouveauté peut rendre une de tes idées meilleure, et te le propose." },
  { id: "monique", nom: "Le contrôleur", court: "Contrôle", metier: "tout tourne ?", c: "#E879F9",
    txt: "Chaque soir, il vérifie que tes agents ont bien fait leur travail et te fait un petit bilan." },
  { id: "mairie", nom: "Le chef d'orchestre", court: "Chef", metier: "il répartit le travail", c: "#E6C36A",
    txt: "Tu lui donnes plusieurs choses à faire d'un coup : il découpe et confie chaque morceau au bon agent." },
];

// Accessoires dessinés au-dessus / à côté de la tête (viewBox 0 0 120 120)
const ACC = {
  gerard: `<rect x="57" y="4" width="6" height="22" rx="3" fill="#2A2D55"/>
    <rect x="47" y="-14" width="26" height="26" rx="8" fill="#1A1C3F" stroke="#2A2D55" stroke-width="2" transform="translate(0,6)"/>
    <circle class="tl-r" cx="54" cy="5" r="3.4"/><circle class="tl-a" cx="60" cy="5" r="3.4"/><circle class="tl-g" cx="66" cy="5" r="3.4"/>`,
  bob: `<path d="M30 34 Q30 14 60 14 Q90 14 90 34 Z" fill="#23408E"/><rect x="26" y="30" width="68" height="7" rx="3.5" fill="#1B2F6B"/>
    <rect x="52" y="18" width="16" height="9" rx="2" fill="#FFD27A"/><path d="M52 18 L60 24 L68 18" stroke="#B8862B" stroke-width="1.5" fill="none"/>`,
  lola: `<g class="bulb"><circle cx="60" cy="13" r="10" fill="#FFE066"/><rect x="55" y="22" width="10" height="6" rx="2" fill="#C9CBE0"/>
    <path d="M56 13 q4 -6 8 0" stroke="#E0A800" stroke-width="2" fill="none"/></g>
    <g class="rays" stroke="#FFE066" stroke-width="2.5" stroke-linecap="round"><path d="M42 8 l-5 -3"/><path d="M78 8 l5 -3"/><path d="M60 -3 v-3"/></g>`,
  marie: `<path class="quill" d="M98 10 C84 18 80 34 84 52 L88 50 C88 36 92 22 100 12 Z" fill="#F3EEFF"/><path d="M84 52 L80 62" stroke="#F3EEFF" stroke-width="2"/>`,
  jeanmi: `<path d="M28 34 L60 4 L92 34 Z" fill="#EEF2F8"/><path d="M40 26 h40 M46 20 h28" stroke="#B6BFD3" stroke-width="2"/>`,
  josiane: `<path d="M28 34 Q28 10 60 10 Q92 10 92 34 Z" fill="#FFD43B"/><rect x="22" y="30" width="76" height="7" rx="3.5" fill="#E8B800"/><rect x="56" y="10" width="8" height="22" rx="3" fill="#E8B800"/>`,
  ginette: `<circle cx="60" cy="16" r="12" fill="#7A4A3A"/><circle cx="60" cy="16" r="5" fill="#5E3629"/>`,
  amelio: `<g class="bub"><rect x="74" y="0" width="34" height="22" rx="8" fill="#F1FFF9"/><path d="M80 21 l-4 8 l10 -8z" fill="#F1FFF9"/>
    <circle cx="83" cy="11" r="2.6" fill="#1A1C3F"/><circle cx="91" cy="11" r="2.6" fill="#1A1C3F"/><circle cx="99" cy="11" r="2.6" fill="#1A1C3F"/></g>`,
  hugo: `<path d="M30 34 Q30 14 60 14 Q90 14 90 34 Z" fill="#1E4FA8"/><rect x="74" y="30" width="26" height="7" rx="3.5" fill="#163C80"/>
    <g class="wrench"><g transform="rotate(-35 104 70)"><rect x="100" y="52" width="8" height="34" rx="3" fill="#CFD6E6"/><path d="M96 50 a8 8 0 1 1 16 0 l-4 -2 l-4 4 l-4 -4 z" fill="#CFD6E6"/></g></g>`,
  monique: `<g class="clip"><rect x="92" y="54" width="22" height="30" rx="3" fill="#FFF4FE"/><rect x="98" y="50" width="10" height="7" rx="2" fill="#B35AC4"/>
    <path d="M96 64 h14 M96 70 h14 M96 76 h9" stroke="#C99BD3" stroke-width="2"/></g>
    <path d="M30 22 Q60 2 90 22" stroke="#9C3FB0" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  mairie: `<path d="M26 32 L60 8 L94 32 Z" fill="#F3E3B5"/><rect x="26" y="30" width="68" height="5" fill="#D9BF78"/>
    <rect x="59" y="-6" width="2.5" height="16" fill="#D9BF78"/><path class="flag" d="M61.5 -6 h14 l-4 4 l4 4 h-14 z" fill="#3B82F6"/>`,
};

const GLASSES = { ginette: true, monique: true };

// 16/11 : avatars en pixel art, les mêmes personnages qu'Agent City (Kenney RPG Urban, CC0), fabriqués par ../sprites.py.
// Même structure qu'avant (svg.bot > g.body) pour que les animations (saut, respiration, réseau) marchent pareil.
function avatar(id, color) {
  return `<svg class="bot" data-id="${id}" viewBox="0 0 16 18" aria-hidden="true">
    <ellipse class="shadow" cx="8" cy="16.7" rx="5" ry="1.1" fill="#0F2A5F" opacity=".16"/>
    <g class="body"><image class="sprite" href="sprites/${id}-0.png" x="0" y="0" width="16" height="16" preserveAspectRatio="none"/></g>
  </svg>`;
}

// 24 h dans le quartier (horaires réels des tâches planifiées)
const JOURNEE = [
  { h: "la nuit", qui: "bob", t: "Le facteur veille", d: "Ton PC reste allumé. Une coupure ? Il redémarre tout seul." },
  { h: "toutes les 10 min", qui: "monique", t: "Petite vérification", d: "Mémoire, erreurs, agents en route : tout est contrôlé, sans IA." },
  { h: "samedi 9:00", qui: "jeanmi", t: "La veille arrive", d: "Les nouveautés de ton sujet, résumées et envoyées sur ton téléphone." },
  { h: "quand tu veux", qui: "lola", t: "Une idée, un message", d: "Tu envoies un lien ou une phrase : l'idée est rangée, tu la retrouveras." },
  { h: "19:00", qui: "monique", t: "Le bilan du soir", d: "Ce qui a marché, ce qui a coincé : un petit résumé de la journée." },
  { h: "23:30", qui: "marie", t: "Le journal du jour", d: "Ce que tu as fait aujourd'hui, écrit pour toi." },
];
