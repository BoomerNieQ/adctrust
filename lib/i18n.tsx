"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "nl" | "fr";

export const translations = {
  nl: {
    // Header / page
    headerSub: "Vertrouwensbarometer",
    titleMain: "Vertrouwen in",
    subtitle: "Team Manager",
    voteInterval: "Stem elke 30 seconden · Alleen voor medewerkers",
    langToggle: "🇫🇷 Frans",

    // Auth
    loginButton: "Log in om te stemmen",
    loginOnly: "Alleen voor medewerkers",
    logout: "Uitloggen",
    loginTitle: "Inloggen",
    loginEmailPlaceholder: "voornaam.achternaam@dhl.com",
    loginSubmit: "Inloggen",
    loginLoading: "Bezig...",
    loginError: "Gebruik je werk e-mailadres.",
    loginErrorGeneral: "Er ging iets mis. Probeer opnieuw.",
    loginEmailLabel: "E-mailadres",
    loginHi: "👋 Hoi",
    loginCancel: "Annuleren",
    adminBtn: "⚙️ Admin",

    // Score labels
    scoreLabel: "HUIDIGE SCORE",
    totalVotes: "TOTAAL STEMMEN",
    positive: "POSITIEF",
    negative: "NEGATIEF",
    currentStatus: "Huidige status",

    // LeftPanel trust levels
    trustAbsolute: "Absoluut vertrouwen",
    trustStrong: "Sterk vertrouwen",
    trustLight: "Licht vertrouwen",
    trustDoubtful: "Twijfelachtig",
    trustNeutral: "Neutraal",
    trustLightDistrust: "Licht wantrouwen",
    trustDistrust: "Wantrouwen",
    trustStrongDistrust: "Sterk wantrouwen",
    trustCrisis: "Crisis!",
    trustLabel: "Vertrouwen",
    distrustLabel: "Wantrouwen",

    // Status messages (barometer center)
    statusVeryHigh: "🏆 Dominique is de beste Team Manager!",
    statusHigh: "😊 Overwegend vertrouwen in Dominique!",
    statusModerate: "🤔 Positief, maar het kan altijd beter, Dom",
    statusSlightlyPositive: "😐 Twijfelachtig — net boven nul",
    statusNeutral: "⚖️ Precies in balans!",
    statusSlightlyNegative: "😕 Lichtelijk wantrouwig...",
    statusNegative: "😠 Het vertrouwen daalt",
    statusVeryNegative: "💀 Pakket vermist — net als het vertrouwen",
    statusCrisis: "🚨 CRISIS! Dominique heeft wat uit te leggen!",

    // Balance easter egg
    balanceTitle: "⚖️ Precies in balans!",
    balanceSubtitle: "50/50 — Dominique kan nog alle kanten op",

    // Reset
    resetConfirm: "Alle stemmen verwijderen? Dit kan niet ongedaan worden gemaakt.",
    resetSuccess: "Reset geslaagd!",
    resetError: "Fout",
    resetBtn: "🗑️ Reset alle stemmen",

    // Vote buttons
    votePositive: "+1 Vertrouwen",
    voteNegative: "-1 Wantrouwen",

    // Buttons
    btnRandomMemes: "🎲 Random Memes",
    btnDominiqueMeme: "🤔 Wat zou Dominique nu denken?",
    btnGuestbook: "📖 Guestbook",
    btnRuben: "🫶 Ruben waarderen",
    btnRosine: "💅 Rosine's life advise",
    btnBirthdays: "🎂 Verjaardagen",
    btnWeeklyMemes: "🌮 Dominique's aanbevolen memes",

    // Meme overlay / modals close
    clickToClose: "Klik om te sluiten",

    // Random meme
    randomMemeTitle: "Random Meme",

    // Dominique meme
    dominiqueMemeTitle: "Dominique's gedachten",

    // Guestbook
    guestbookTitle: "📖 Guestbook",
    guestbookSubtitle: "Laat een berichtje achter voor Dominique",
    guestbookPlaceholder: "Schrijf iets...",
    guestbookSend: "Verstuur",
    guestbookEmpty: "Nog geen berichten. Wees de eerste!",
    guestbookLoginPrompt: "Log in om een berichtje achter te laten.",
    guestbookClose: "Sluiten",

    // Ruben
    rubenFeels: "Ruben feels appreciated 🫶",
    rubenClose: "Klik om te sluiten",

    // Birthday
    birthdayTitle: "🎂 Verjaardagen",
    birthdaySubtitle: "Verjaardagskalender van het team",
    birthdayAdd: "Voeg jouw verjaardag toe",
    birthdayAddBtn: "Toevoegen",
    birthdayEmpty: "Nog geen verjaardagen. Voeg die van jezelf toe!",
    birthdayClose: "Sluiten",
    birthdayHappy: "Gefeliciteerd",
    birthdayClickClose: "Klik om te sluiten",
    birthdayToday: "heeft vandaag verjaardag! 🎉",
    birthdayAlreadyAdded: "Je hebt je verjaardag al toegevoegd.",
    birthdaySelectDay: "Dag",
    birthdaySelectMonth: "Maand",
    birthdayBannerToday: "heeft vandaag verjaardag! 🎉",

    // Welcome modal
    welcomeBack: "Welkom terug,",
    welcomeNew: "Welkom,",
    welcomeReturningMsg: "Fijn dat je er weer bij bent! Jouw stem telt.",
    welcomeNewMsg: "Leuk dat je erbij bent! Stem mee over Dominique.",
    welcomeClose: "Naar de barometer! 🌡️",

    // Weekly memes
    weeklyTitle: "🌮 Dominique's aanbevolen memes",
    weeklySubtitle: "Deze week door Dominique persoonlijk geselecteerd",
    weeklyEasterEgg: "🥚 Easter egg gevonden!",
    weeklyNext: "Volgende →",
    weeklyClose: "Sluiten",

    // Activity feed
    activityTitle: "📊 Live activiteit",
    activityTotal: (n: number) => `${n} ${n === 1 ? "stem" : "stemmen"} in totaal`,
    activityEmpty: "Nog geen stemmen. Wees de eerste!",
    activityRefresh: "Ververst elke 5 seconden",
    activityMore: "meer",
    activityLess: "minder",
    activityIn: "vertrouwen in",
    activityJustNow: "zojuist",
    activityMinAgo: (m: number) => `${m} minuut${m !== 1 ? "en" : ""} geleden`,
    activityHourAgo: (h: number) => `${h} uur geleden`,
    activityDayAgo: (d: number) => `${d} dag${d !== 1 ? "en" : ""} geleden`,

    // Score counter
    scoreJustNow: "zojuist",
    scoreMinAgo: (m: number) => `${m} minuut${m !== 1 ? "en" : ""} geleden`,
    scoreHourAgo: (h: number) => `${h} uur geleden`,
    scoreDayAgo: (d: number) => `${d} dag${d !== 1 ? "en" : ""} geleden`,
    scoreVotedSingular: "persoon heeft gestemd",
    scoreVotedPlural: "mensen hebben gestemd",
    scoreLastVote: "Laatste stem:",
    scoreRecentVoters: "Recente stemmers",

    // Stats
    statsTitle: "Statistieken",
    statsLoading: "Statistieken laden...",
    statsEmpty: "Nog geen statistieken — stem als eerste!",
    statsPerDay: "📅 Score per dag",
    statsLast14: "Laatste 14 dagen",
    statsPerMonth: "🗓️ Per maand",
    statsMoreTrust: "Meer vertrouwen",
    statsLessTrust: "Minder vertrouwen",
    statsVotesSuffix: (n: number) => `${n} stem${n !== 1 ? "men" : ""}`,

    // Days / months short
    daysShort: ["zo","ma","di","wo","do","vr","za"],
    monthsShort: ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],
    months: ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"],
  },
  fr: {
    headerSub: "Baromètre de confiance",
    titleMain: "Confiance en",
    subtitle: "Team Manager",
    voteInterval: "Voter toutes les 30 secondes · Employés uniquement",
    langToggle: "🇳🇱 Néerlandais",

    loginButton: "Se connecter pour voter",
    loginOnly: "Employés uniquement",
    logout: "Se déconnecter",
    loginTitle: "Connexion",
    loginEmailPlaceholder: "prenom.nom@dhl.com",
    loginSubmit: "Connexion",
    loginLoading: "Chargement...",
    loginError: "Utilisez votre adresse e-mail professionnelle.",
    loginErrorGeneral: "Une erreur s'est produite. Réessayez.",
    loginEmailLabel: "Adresse e-mail",
    loginHi: "👋 Bonjour",
    loginCancel: "Annuler",
    adminBtn: "⚙️ Admin",

    scoreLabel: "SCORE ACTUEL",
    totalVotes: "TOTAL VOTES",
    positive: "POSITIF",
    negative: "NÉGATIF",
    currentStatus: "Statut actuel",

    trustAbsolute: "Confiance absolue",
    trustStrong: "Grande confiance",
    trustLight: "Légère confiance",
    trustDoubtful: "Douteux",
    trustNeutral: "Neutre",
    trustLightDistrust: "Légère méfiance",
    trustDistrust: "Méfiance",
    trustStrongDistrust: "Grande méfiance",
    trustCrisis: "Crise !",
    trustLabel: "Confiance",
    distrustLabel: "Méfiance",

    statusVeryHigh: "🏆 Dominique est le meilleur Team Manager !",
    statusHigh: "😊 Grande confiance en Dominique !",
    statusModerate: "🤔 Positif, mais on peut toujours faire mieux",
    statusSlightlyPositive: "😐 Incertain — juste au-dessus de zéro",
    statusNeutral: "⚖️ Parfaitement équilibré !",
    statusSlightlyNegative: "😕 Légèrement méfiant...",
    statusNegative: "😠 La confiance diminue",
    statusVeryNegative: "💀 Colis perdu — comme la confiance",
    statusCrisis: "🚨 CRISE ! Dominique a des explications à donner !",

    balanceTitle: "⚖️ Parfaitement équilibré !",
    balanceSubtitle: "50/50 — Dominique peut encore aller dans tous les sens",

    resetConfirm: "Supprimer tous les votes ? Cette action est irréversible.",
    resetSuccess: "Réinitialisation réussie !",
    resetError: "Erreur",
    resetBtn: "🗑️ Réinitialiser les votes",

    votePositive: "+1 Confiance",
    voteNegative: "-1 Méfiance",

    btnRandomMemes: "🎲 Mèmes aléatoires",
    btnDominiqueMeme: "🤔 Que penserait Dominique ?",
    btnGuestbook: "📖 Livre d'or",
    btnRuben: "🫶 Apprécier Ruben",
    btnRosine: "💅 Conseils de Rosine",
    btnBirthdays: "🎂 Anniversaires",
    btnWeeklyMemes: "🌮 Mèmes recommandés par Dominique",

    clickToClose: "Cliquez pour fermer",
    randomMemeTitle: "Mème aléatoire",
    dominiqueMemeTitle: "Les pensées de Dominique",

    guestbookTitle: "📖 Livre d'or",
    guestbookSubtitle: "Laissez un message pour Dominique",
    guestbookPlaceholder: "Écrivez quelque chose...",
    guestbookSend: "Envoyer",
    guestbookEmpty: "Pas encore de messages. Soyez le premier !",
    guestbookLoginPrompt: "Connectez-vous pour laisser un message.",
    guestbookClose: "Fermer",

    rubenFeels: "Ruben se sent apprécié 🫶",
    rubenClose: "Cliquez pour fermer",

    birthdayTitle: "🎂 Anniversaires",
    birthdaySubtitle: "Calendrier d'anniversaires de l'équipe",
    birthdayAdd: "Ajoutez votre anniversaire",
    birthdayAddBtn: "Ajouter",
    birthdayEmpty: "Pas encore d'anniversaires. Ajoutez le vôtre !",
    birthdayClose: "Fermer",
    birthdayHappy: "Joyeux anniversaire",
    birthdayClickClose: "Cliquez pour fermer",
    birthdayToday: "fête son anniversaire aujourd'hui ! 🎉",
    birthdayAlreadyAdded: "Vous avez déjà ajouté votre anniversaire.",
    birthdaySelectDay: "Jour",
    birthdaySelectMonth: "Mois",
    birthdayBannerToday: "fête son anniversaire aujourd'hui ! 🎉",

    welcomeBack: "Bon retour,",
    welcomeNew: "Bienvenue,",
    welcomeReturningMsg: "Ravi de vous revoir ! Votre vote compte.",
    welcomeNewMsg: "Bienvenue ! Votez pour Dominique.",
    welcomeClose: "Vers le baromètre ! 🌡️",

    weeklyTitle: "🌮 Mèmes recommandés par Dominique",
    weeklySubtitle: "Cette semaine sélectionnés personnellement par Dominique",
    weeklyEasterEgg: "🥚 Easter egg trouvé !",
    weeklyNext: "Suivant →",
    weeklyClose: "Fermer",

    activityTitle: "📊 Activité en direct",
    activityTotal: (n: number) => `${n} vote${n !== 1 ? "s" : ""} au total`,
    activityEmpty: "Pas encore de votes. Soyez le premier !",
    activityRefresh: "Actualisation toutes les 5 secondes",
    activityMore: "plus de",
    activityLess: "moins de",
    activityIn: "confiance en",
    activityJustNow: "à l'instant",
    activityMinAgo: (m: number) => `il y a ${m} minute${m !== 1 ? "s" : ""}`,
    activityHourAgo: (h: number) => `il y a ${h} heure${h !== 1 ? "s" : ""}`,
    activityDayAgo: (d: number) => `il y a ${d} jour${d !== 1 ? "s" : ""}`,

    scoreJustNow: "à l'instant",
    scoreMinAgo: (m: number) => `il y a ${m} minute${m !== 1 ? "s" : ""}`,
    scoreHourAgo: (h: number) => `il y a ${h} heure${h !== 1 ? "s" : ""}`,
    scoreDayAgo: (d: number) => `il y a ${d} jour${d !== 1 ? "s" : ""}`,
    scoreVotedSingular: "personne a voté",
    scoreVotedPlural: "personnes ont voté",
    scoreLastVote: "Dernier vote :",
    scoreRecentVoters: "Votants récents",

    statsTitle: "Statistiques",
    statsLoading: "Chargement des statistiques...",
    statsEmpty: "Pas encore de statistiques — votez en premier !",
    statsPerDay: "📅 Score par jour",
    statsLast14: "14 derniers jours",
    statsPerMonth: "🗓️ Par mois",
    statsMoreTrust: "Plus de confiance",
    statsLessTrust: "Moins de confiance",
    statsVotesSuffix: (n: number) => `${n} vote${n !== 1 ? "s" : ""}`,

    daysShort: ["di","lu","ma","me","je","ve","sa"],
    monthsShort: ["jan","fév","mar","avr","mai","jui","jul","aoû","sep","oct","nov","déc"],
    months: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
  },
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LangContext = createContext<{ lang: Lang; t: any; setLang: (l: Lang) => void }>({
  lang: "nl",
  t: translations.nl,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nl");

  useEffect(() => {
    const stored = localStorage.getItem("adctrust-lang") as Lang | null;
    if (stored === "nl" || stored === "fr") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("adctrust-lang", l);
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
