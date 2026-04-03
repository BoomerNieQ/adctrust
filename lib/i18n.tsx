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
    activityVotedPos: [
      (name: string) => `${name} staat vierkant achter Dominique! 💪`,
      (name: string) => `${name} gooit er een vette 👍 voor Dominique!`,
      (name: string) => `${name} heeft het volste vertrouwen in Dominique 🔥`,
      (name: string) => `${name} zweert bij Dominique als teammanager ⭐`,
      (name: string) => `${name} zet Dominique op een voetstuk 🏆`,
    ],
    activityVotedNeg: [
      (name: string) => `${name} heeft het even gehad met Dominique 💀`,
      (name: string) => `${name} geeft Dominique de rode kaart 🟥`,
      (name: string) => `${name} trekt de stekker eruit voor Dominique 😬`,
      (name: string) => `${name} twijfelt serieus aan Dominique 🤨`,
      (name: string) => `${name} stuurt Dominique naar de hoek 😤`,
    ],
    activityJustNow: "zojuist",
    activityMinAgo: (m: number) => `${m} minuut${m !== 1 ? "en" : ""} geleden`,
    activityHourAgo: (h: number) => `${h} uur geleden`,
    activityDayAgo: (d: number) => `${d} dag${d !== 1 ? "en" : ""} geleden`,

    // Exposed donations wallboard
    exposedTitle: "😏 EXPOSED DONATIONS",
    exposedSubtitle: "Gepakt. Rood op het gezicht. Voor altijd vastgelegd.",
    exposedEmpty: "Nog niemand sus genoeg geweest... tot nu toe.",
    exposedEntry: (name: string, cause: string, amount: string) => `${name} probeerde €${amount} te storten voor "${cause}" — klassiek.`,

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

    // Sus easter egg
    susTitle: "🤨 Sus...",
    susSubtitle: "Iemand stemt een beetje té enthousiast",

    // Dick easter egg
    dickLabel: "🔒 Streng vertrouwelijk",
    dickClose: "Sluiten",

    // Rosine
    rosineClose: "Klik om te sluiten · Knop opnieuw voor de volgende tip",

    // Taglines
    taglines: [
      "Hoeveel vertrouwen heeft het team in Dominique?",
      "De eerlijke meting van het team",
      "Gebaseerd op échte teamopinies",
      "Team Manager performance indicator — unofficial edition",
      "Want iemand moet het bijhouden",
      "Betrouwbaarder dan officiële feedback",
    ],

    // Gate selector
    gateChoose: "KIES UW TOEGANGSPOORT",
    gateQuestion: "Hoe wil je binnenkomen?",
    gateHpHint: "Type de incantatie",
    gateLotRHint: "Speak, friend, and enter",
    gateDhlSubtitle: "Pakket bezorging",
    gateDhlHint: "Volg uw waybill",

    // DHL gate
    dhlDeliveryTitle: "BEZORGINGSBERICHT · ADC TEAM",
    dhlDeliveryMsg: "Uw pakket staat klaar voor bezorging.\nVoer uw waybillnummer in om te volgen.",
    dhlRef: "Ref:",
    dhlWaybillLabel: "WAYBILL",
    dhlWaybillPlaceholder: "Voer waybill in...",
    dhlDigits: (n: number, total: number) => `${n} / ${total} cijfers`,
    dhlStep1: "Pakketinfo ontvangen",
    dhlStep2: "Vertrokken uit depot",
    dhlStep3: "Uit voor bezorging",
    dhlStep4: "Bezorgd!",
    dhlDelivered: "UW PAKKET IS BEZORGD — WELKOM",

    // Phone easter egg
    phoneIncoming: "INKOMEND GESPREK...",
    phoneAnswered: "Gesprek beëindigd",
    phoneCaller: "ADC Team",
    phoneGotcha: "Oh, dus je kunt toch een telefoon opnemen binnen de 10 seconden?",
    phoneGotchaSub: "Misschien op je werk ook eens proberen....",
    phoneHangUp: "Ophangen",

    // Donate button
    donateCauses: [
      "Fillers & Botox voor Solange & Vicky",
      "Haartransplantatie voor Ruben & Dominique",
      "Pokémonkaarten voor het goede doel (Dominique)",
      "Een te gek teamuitje bij Ruben z'n ouders thuis",
      "Eindelijk een normale auto voor Claire die niet iedere 3 weken kapotgaat (en een dak heeft)",
    ],
    donateFor: "Ik doneer voor:",
    donateAmount: "BEDRAG (€)",
    donatePlaceholder: "0,00",
    donateBtn: "Doneer",
    donatePay: (amount: string) => `Betaal via PayPal${amount ? ` €${amount}` : ""}`,
    donateLoginRequired: "Log in om te doneren",
    donateLoading: "Bezig...",
    donateSafe: "Veilig betalen via PayPal",
    donateGotcha: "Je dacht toch niet echt dat we hier geld gingen inzamelen....",
    donateGotchaSub: "Beetje sus.....",
    donateClose: "Sluiten",
    donateRecipient: "Bestemmeling: ADC Team · België",

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
    activityVotedPos: [
      (name: string) => `${name} soutient Dominique à fond ! 💪`,
      (name: string) => `${name} vote pour Dominique avec conviction 🔥`,
      (name: string) => `${name} fait confiance à Dominique les yeux fermés ⭐`,
      (name: string) => `${name} met Dominique sur un piédestal 🏆`,
      (name: string) => `${name} donne un gros 👍 à Dominique !`,
    ],
    activityVotedNeg: [
      (name: string) => `${name} a perdu confiance en Dominique 💀`,
      (name: string) => `${name} donne un carton rouge à Dominique 🟥`,
      (name: string) => `${name} doute sérieusement de Dominique 🤨`,
      (name: string) => `${name} envoie Dominique au coin 😤`,
      (name: string) => `${name} n'en peut plus de Dominique 😬`,
    ],
    activityJustNow: "à l'instant",
    activityMinAgo: (m: number) => `il y a ${m} minute${m !== 1 ? "s" : ""}`,
    activityHourAgo: (h: number) => `il y a ${h} heure${h !== 1 ? "s" : ""}`,
    activityDayAgo: (d: number) => `il y a ${d} jour${d !== 1 ? "s" : ""}`,

    // Exposed donations wallboard
    exposedTitle: "😏 EXPOSED DONATIONS",
    exposedSubtitle: "Pris en flagrant délit. Pour toujours gravé dans les annales.",
    exposedEmpty: "Personne n'a encore été assez suspect... pour l'instant.",
    exposedEntry: (name: string, cause: string, amount: string) => `${name} a tenté de verser €${amount} pour "${cause}" — classique.`,

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

    // Sus easter egg
    susTitle: "🤨 Suspect...",
    susSubtitle: "Quelqu'un vote avec un peu trop d'enthousiasme",

    // Dick easter egg
    dickLabel: "🔒 Strictement confidentiel",
    dickClose: "Fermer",

    // Rosine
    rosineClose: "Cliquez pour fermer · Rebouton pour le conseil suivant",

    // Taglines
    taglines: [
      "Combien l'équipe fait-elle confiance à Dominique ?",
      "La mesure honnête de l'équipe",
      "Basé sur les vraies opinions de l'équipe",
      "Indicateur de performance Team Manager — édition non officielle",
      "Parce que quelqu'un doit le suivre",
      "Plus fiable que les retours officiels",
    ],

    // Gate selector
    gateChoose: "CHOISISSEZ VOTRE ENTRÉE",
    gateQuestion: "Comment voulez-vous entrer ?",
    gateHpHint: "Tapez l'incantation",
    gateLotRHint: "Speak, friend, and enter",
    gateDhlSubtitle: "Livraison de colis",
    gateDhlHint: "Suivez votre lettre de voiture",

    // DHL gate
    dhlDeliveryTitle: "AVIS DE LIVRAISON · ÉQUIPE ADC",
    dhlDeliveryMsg: "Votre colis est prêt pour la livraison.\nEntrez votre numéro de lettre de voiture.",
    dhlRef: "Réf :",
    dhlWaybillLabel: "LETTRE DE VOITURE",
    dhlWaybillPlaceholder: "Entrez la lettre de voiture...",
    dhlDigits: (n: number, total: number) => `${n} / ${total} chiffres`,
    dhlStep1: "Informations reçues",
    dhlStep2: "Parti du dépôt",
    dhlStep3: "En cours de livraison",
    dhlStep4: "Livré !",
    dhlDelivered: "VOTRE COLIS EST LIVRÉ — BIENVENUE",

    // Phone easter egg
    phoneIncoming: "APPEL ENTRANT...",
    phoneAnswered: "Conversation terminée",
    phoneCaller: "Équipe ADC",
    phoneGotcha: "Ah, donc vous pouvez décrocher un téléphone en moins de 10 secondes ?",
    phoneGotchaSub: "Peut-être essayer ça au travail aussi....",
    phoneHangUp: "Raccrocher",

    // Donate button
    donateCauses: [
      "Fillers & Botox pour Solange & Vicky",
      "Greffe de cheveux pour Ruben & Dominique",
      "Cartes Pokémon pour la bonne cause (Dominique)",
      "Une super sortie d'équipe chez les parents de Ruben",
      "Enfin une voiture normale pour Claire qui ne tombe pas en panne toutes les 3 semaines (avec un toit).",
    ],
    donateFor: "Je donne pour :",
    donateAmount: "MONTANT (€)",
    donatePlaceholder: "0,00",
    donateBtn: "Faire un don",
    donatePay: (amount: string) => `Payer via PayPal${amount ? ` €${amount}` : ""}`,
    donateLoginRequired: "Connectez-vous pour faire un don",
    donateLoading: "Chargement...",
    donateSafe: "Paiement sécurisé via PayPal",
    donateGotcha: "Vous ne pensiez vraiment pas qu'on allait collecter de l'argent ici....",
    donateGotchaSub: "Un peu suspect.....",
    donateClose: "Fermer",
    donateRecipient: "Destinataire : Équipe ADC · Belgique",

    // Days / months short
    daysShort: ["di","lu","ma","me","je","ve","sa"],
    monthsShort: ["jan","fév","mar","avr","mai","jui","jul","aoû","sep","oct","nov","déc"],
    months: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
  },
};

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
