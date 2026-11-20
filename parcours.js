// Le guide : 11 étapes en 3 parties (16/11, resserré à partir de mes 23 semaines de labo).
// agent = id d'un dessin d'agents.js (illustration) ; temps en heures (temps actif avec Claude Code).
const ACTES = [
  { n: 1, titre: "Mettre en route", de: 1, a: 3, c: "#3B82F6",
    resume: "Le but : un premier agent sur ton vieux PC, que tu peux joindre depuis ton téléphone, à l'écrit ou à la voix." },
  { n: 2, titre: "Tes agents", de: 4, a: 9, c: "#0EA5E9",
    resume: "Le but : des agents faits pour toi, qui comprennent tes demandes, rangent, retrouvent, te tiennent à jour et vérifient que tout tourne." },
  { n: 3, titre: "Voir et aller plus loin", de: 10, a: 11, c: "#1E3A8A",
    resume: "Le but : voir tes agents travailler, et inventer les prochains pour tes propres projets." },
];

const ETAPES = [
  { s: 1, titre: "Préparer le labo", but: "Un dossier, un journal de bord et quelques règles, pour avancer une étape à la fois.", agent: null, temps: 15 / 60,
    quoi: "Un dossier, un journal où chaque étape a sa ligne, et une règle simple : un petit projet à la fois, construit avec Claude Code." },
  { s: 2, titre: "Un premier agent sur le PC", but: "Faire tourner ton premier agent IA sur ton vieux PC.", agent: null, temps: 25 / 60,
    quoi: "J'ai d'abord essayé un modèle installé sur le PC : 103 secondes par réponse, trop lent. Avec Claude Haiku dans le cloud : moins de 6 secondes. Le vieux PC orchestre, le cloud réfléchit." },
  { s: 3, titre: "Joignable depuis ton téléphone", but: "Parler à ton agent depuis ton téléphone, à l'écrit ou à la voix, 24 h/24.", agent: "bob", temps: 45 / 60,
    quoi: "Un bot Telegram tourne sur le PC et redémarre tout seul s'il plante. J'y envoie des messages et des vocaux, transcrits en 2 secondes." },
  { s: 4, titre: "L'aiguillage", but: "Un agent principal qui comprend ta demande et l'envoie au bon agent.", agent: "gerard", temps: 30 / 60,
    quoi: "Chaque message passe par l'aiguillage. Si j'écris juste un prénom, l'agent me montre ce qu'il sait faire. Souvent, une règle simple suffit, sans IA." },
  { s: 5, titre: "Une mémoire", but: "Une base où tes agents rangent tout ce que tu leur confies.", agent: null, temps: 20 / 60,
    quoi: "Une base de données en ligne où mes agents rangent idées, journal et projets. Je peux même lui poser des questions en français." },
  { s: 6, titre: "Ton premier agent métier", but: "Un agent pour le besoin qui compte le plus pour toi.", agent: "lola", temps: 25 / 60,
    quoi: "Le mien range mes idées : je lui envoie un reel Instagram avec un mot, il le résume et le classe. Le tien peut ranger des recettes, des factures, ton sport…" },
  { s: 7, titre: "Retrouver ce que tu as rangé", but: "Retrouver une idée ou une note en la décrivant avec tes mots.", agent: "ginette", temps: 20 / 60,
    quoi: "« L'idée sur les agences d'agents » : ma bibliothécaire la retrouve sans le numéro, avec mes notes." },
  { s: 8, titre: "Une veille sur ton sujet", but: "Être au courant des nouveautés de ton sujet, et voir ce qu'elles changent pour tes idées.", agent: "jeanmi", temps: 30 / 60,
    quoi: "Chaque samedi, ma veille lit une dizaine de sources sur l'IA, puis regarde quelle nouveauté peut améliorer une de mes idées." },
  { s: 9, titre: "Le contrôle du soir", but: "Savoir chaque soir si tes agents ont bien travaillé.", agent: "monique", temps: 25 / 60,
    quoi: "Chaque soir, un agent vérifie les erreurs, les tâches faites ou ratées et la mémoire du PC, puis m'envoie un petit bilan." },
  { s: 10, titre: "Tes propres projets", but: "Transformer une envie en plan, puis créer l'agent qui va avec.", agent: "josiane", temps: 30 / 60,
    quoi: "Quand j'ai une idée, je la fais cadrer (besoin, faisabilité, plan), puis Claude Code construit l'agent avec moi. C'est comme ça que tout ce labo est né." },
  { s: 11, titre: "Ton tableau de bord de pilotage", but: "Piloter tous tes agents depuis un seul écran : qui tourne, ce qu'ils ont fait, ce qui coince.", agent: null, temps: 40 / 60,
    quoi: "Labo Admin : d'un coup d'œil, les agents en service, leur dernier passage et le prochain, l'activité en direct, les alertes et ce qui attend ma validation. Je l'ouvre aussi depuis mon téléphone.",
    visuel: "dashboard" },
];

// Bonus fun, après la dernière étape (pas compté dans le total)
const BONUS = { s: "bonus", titre: "Bonus : une mini-ville pour tes agents", but: "Voir tes agents vivre dans une petite ville en pixel art, juste pour le plaisir.", agent: "mairie", temps: 45 / 60,
  quoi: "Agent City : chaque agent a son bureau, se met en route quand il travaille et rentre dormir la nuit. Je la regarde depuis mon téléphone.",
  visuel: "ville" };

// Un prompt par étape (l'utilisateur choisit toujours ses agents).
const DEMANDES = {
  1: "Crée mon labo dans ce dossier. Un JOURNAL.md avec un tableau (étape, projet, statut, temps, ce que j'ai appris). Un CLAUDE.md qui dit qui je suis (je débute, je ne code pas), quel ordinateur j'ai (regarde-le toi-même : système, processeur, mémoire) et les règles du labo : aucune clé secrète dans le code ni dans la conversation, tout dans un fichier .env exclu de git ; une étape = un petit projet ; lire JOURNAL.md au début et le mettre à jour à la fin. Initialise git.",
  2: "Crée mon premier agent : un petit programme qui tourne sur cet ordinateur, reçoit une demande en français et répond. Aide-moi à obtenir une clé API Anthropic et range-la dans .env. Mesure d'abord si mon ordinateur peut faire tourner un modèle local ; sinon utilise Claude Haiku, rapide et léger. Garde la configuration dans un fichier config.yaml.",
  3: "Rends mon agent joignable 24 h/24 depuis mon téléphone : un bot Telegram qui tourne sur cet ordinateur et accepte aussi les messages vocaux (transcrits par un service rapide). Guide-moi pour créer le bot avec @BotFather (la clé va dans .env), fais-le démarrer tout seul avec l'ordinateur et redémarrer s'il plante (adapte-toi à mon système : Mac, Windows ou Linux), empêche la mise en veille, et n'autorise que mon compte Telegram.",
  4: "Crée l'aiguillage : chaque message reçu par le bot est envoyé au bon agent. Utilise des règles simples quand elles suffisent (un prénom, un mot-clé, un lien) et l'IA seulement sinon. Si j'écris juste le prénom d'un agent, montre ce qu'il sait faire avec des boutons. Chaque agent signe ses réponses avec le prénom que je lui donne. Demande-moi d'abord quels prénoms et quelle personnalité je veux.",
  5: "Donne une mémoire à mon labo : une base de données (par exemple Supabase, ou de simples fichiers si c'est plus adapté). Guide-moi pour créer le compte s'il en faut un, range les clés dans .env, et montre-moi que je peux retrouver ce qui y est rangé.",
  6: "Crée mon premier agent métier. Demande-moi d'abord ce dont j'ai le plus besoin au quotidien (ranger des idées, des liens, des recettes, des factures, suivre mon sport, tenir un journal…), son prénom, et comment je lui envoie les choses depuis Telegram. Propose-moi 3 idées si je ne sais pas. Branche-le à l'aiguillage et à la mémoire.",
  7: "Crée un agent qui retrouve ce que j'ai rangé, même si je ne me souviens plus des mots exacts (« l'idée sur… »). Demande-moi son prénom et où il doit chercher. Branche-le à l'aiguillage.",
  8: "Crée un agent de veille. Demande-moi d'abord mon sujet, les sources que j'aime et quand je veux le résumé. Il lit les nouveautés, m'envoie un résumé sur Telegram, et me signale quand une nouveauté peut améliorer une de mes idées rangées.",
  9: "Crée un agent qui vérifie chaque soir que mes agents ont bien travaillé (erreurs, tâches faites ou ratées, mémoire de l'ordinateur) et m'envoie un court bilan. Demande-moi à quelle heure. Le code mesure, l'IA formule, et chaque constat est prouvé.",
  10: "Aide-moi à créer mon premier projet à moi. Ajoute d'abord une commande /cadrage qui transforme une idée en fiche (besoin, faisabilité, plan en 3 étapes). Puis pose-moi quelques questions sur mon quotidien, propose-moi 3 idées d'agents utiles pour moi, cadre celle que je choisis, construis-la et branche-la au bot avec le prénom que je lui donne.",
  11: "Crée mon tableau de bord de pilotage : une page web privée, visible aussi depuis mon téléphone (par exemple avec Tailscale), sans l'ouvrir à tout internet. Elle montre mes agents en service, leur dernier passage et le prochain, l'activité en direct, les alertes et ce qui attend ma validation. Demande-moi d'abord ce que je veux voir en premier. Elle lit les journaux et la mémoire de mes agents, sans rien modifier.",
  bonus: "Bonus, juste pour le plaisir : dessine une petite ville en pixel art (avec des dessins libres de droits, par exemple ceux de Kenney) où chacun de mes agents a son bureau et se déplace quand il travaille. La page lit les journaux du bot pour savoir qui fait quoi. Rends-la visible depuis mon téléphone de façon privée.",
};

// 16/11 : durée de chaque étape = temps actif avec Claude Code (réestimé, en minutes)
const duree = h => { const t = Math.round(h * 60); if (t < 60) return `${t} min`; const H = Math.floor(t / 60), M = t % 60; return M ? `${H} h ${String(M).padStart(2, "0")}` : `${H} h`; };
const dureePartie = a => duree(ETAPES.filter(e => e.s >= a.de && e.s <= a.a).reduce((x, e) => x + e.temps, 0));
const dureeTotale = () => duree(ETAPES.reduce((x, e) => x + e.temps, 0));
const REGLES_PROMPT = "Règles : lis d'abord JOURNAL.md et CLAUDE.md pour reprendre là où on en est. Explique-moi simplement et propose un plan court avant de coder. Adapte-toi à mon ordinateur (Mac, Windows ou Linux). Aucune clé secrète dans le code ni dans la conversation : tout va dans .env. Construis avec moi pas à pas, teste devant moi, fais un commit git, puis ajoute la ligne de l'étape dans JOURNAL.md.";
const promptEtape = e => `${e.s === "bonus" ? "Bonus" : `Étape ${e.s}`} de mon labo (environ ${duree(e.temps)}).\nLe but : ${e.but}\n\n${DEMANDES[e.s]}\n\n${REGLES_PROMPT}`;
const promptTout = () => [
  "Je veux transformer mon vieil ordinateur en agent IA personnel, un petit projet par étape, en suivant les 11 étapes ci-dessous. Je débute et je ne code pas : c'est toi qui écris le code, moi je décide et je teste.",
  "",
  "Le but final : un bot Telegram toujours allumé sur cet ordinateur, que je pilote depuis mon téléphone ; derrière lui, des agents que JE choisis, chacun avec le prénom et le métier que je lui donne ; une petite ville en pixel art et un tableau de bord pour les voir travailler. Je ne veux pas copier les agents de quelqu'un d'autre : à chaque étape, pars de MON besoin. Avant chaque nouvel agent, pose-moi tes questions, propose-moi 2 ou 3 idées adaptées à ma vie si je n'en ai pas, et laisse-moi choisir.",
  "",
  ...ETAPES.map(e => `Étape ${e.s} (environ ${duree(e.temps)}) · ${e.but} ${DEMANDES[e.s]}`),
  `Bonus facultatif (environ ${duree(BONUS.temps)}) · ${BONUS.but} ${DEMANDES.bonus}`,
  "",
  "Comment on travaille : commence par l'étape 1. Une seule étape à la fois. À la fin de chacune, teste avec moi, mets à jour JOURNAL.md, résume ce qu'on a fait, puis attends que j'écrive « étape suivante ». Tu peux adapter l'ordre ou sauter une étape qui ne me sert pas : demande-moi d'abord.",
  REGLES_PROMPT,
].join("\n");
async function copierTexte(txt, bouton) {
  let ok = false;
  try { await navigator.clipboard.writeText(txt); ok = true; } catch (e) {
    const t = document.createElement("textarea");
    t.value = txt; t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    try { ok = document.execCommand("copy"); } catch (e2) {}
    t.remove();
  }
  if (bouton) {
    const avant = bouton.dataset.lib || bouton.textContent;
    bouton.dataset.lib = avant;
    bouton.textContent = ok ? "Copié ✓" : "Copie impossible";
    bouton.classList.toggle("ok", ok);
    setTimeout(() => { bouton.textContent = avant; bouton.classList.remove("ok"); }, 2200);
  }
  return ok;
}
