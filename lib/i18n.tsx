"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "nl" | "fr";

export const translations = {
  nl: {
    // Header / page
    taglinePrefix: "",
    headerSub: "ADC · Vertrouwensbarometer",
    titleMain: "Vertrouwen in",
    subtitle: "Team Manager · ADC · DHL",
    voteInterval: "Stem elke 30 seconden",
    langToggle: "🇫🇷 Frans",

    // Auth
    loginButton: "Log in om te stemmen",
    loginOnly: "Alleen voor @dhl.com medewerkers",
    logout: "Uitloggen",
    loginTitle: "Inloggen",
    loginEmailPlaceholder: "jouw.naam@dhl.com",
    loginSubmit: "Inloggen",
    loginLoading: "Bezig...",
    loginError: "Alleen @dhl.com e-mailadressen zijn toegestaan.",
    loginErrorGeneral: "Er ging iets mis. Probeer opnieuw.",

    // Score labels
    scoreLabel: "HUIDIGE SCORE",
    totalVotes: "TOTAAL STEMMEN",
    positive: "POSITIEF",
    negative: "NEGATIEF",

    // Status
    statusVeryHigh: "Enorm veel vertrouwen! 🚀",
    statusHigh: "Hoog vertrouwen 💛",
    statusModerate: "Redelijk vertrouwen 👍",
    statusNeutral: "Neutraal ⚖️",
    statusLow: "Weinig vertrouwen 😬",
    statusVeryLow: "Heel weinig vertrouwen 😰",
    statusCrisis: "Vertrouwenscrisis! 🚨",

    // Buttons
    btnRandomMemes: "🎲 Random Memes",
    btnDominiqueMeme: "🤔 Wat zou Dominique nu denken?",
    btnGuestbook: "📖 Guestbook",
    btnRuben: "🫶 Ruben waarderen",
    btnRosine: "💅 Rosine's life advise",
    btnBirthdays: "🎂 Verjaardagen",
    btnWeeklyMemes: "🌮 Dominique's aanbevolen memes",

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
    birthdaySubtitle: "Team ADC verjaardagskalender",
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

    // Welcome
    welcomeTitle: "Welkom",
    welcomeBack: "Welkom terug",
    welcomeClose: "Klik om te sluiten",

    // Weekly memes
    weeklyTitle: "🌮 Dominique's aanbevolen memes",
    weeklySubtitle: "Deze week door Dominique persoonlijk geselecteerd",
    weeklyClose: "Sluiten",

    // Months
    months: ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"],
  },
  fr: {
    taglinePrefix: "",
    headerSub: "ADC · Baromètre de confiance",
    titleMain: "Confiance en",
    subtitle: "Team Manager · ADC · DHL",
    voteInterval: "Voter toutes les 30 secondes",
    langToggle: "🇳🇱 Néerlandais",

    loginButton: "Se connecter pour voter",
    loginOnly: "Uniquement pour les employés @dhl.com",
    logout: "Se déconnecter",
    loginTitle: "Connexion",
    loginEmailPlaceholder: "prenom.nom@dhl.com",
    loginSubmit: "Connexion",
    loginLoading: "Chargement...",
    loginError: "Seules les adresses @dhl.com sont autorisées.",
    loginErrorGeneral: "Une erreur s'est produite. Réessayez.",

    scoreLabel: "SCORE ACTUEL",
    totalVotes: "TOTAL VOTES",
    positive: "POSITIF",
    negative: "NÉGATIF",

    statusVeryHigh: "Confiance énorme ! 🚀",
    statusHigh: "Grande confiance 💛",
    statusModerate: "Confiance raisonnable 👍",
    statusNeutral: "Neutre ⚖️",
    statusLow: "Peu de confiance 😬",
    statusVeryLow: "Très peu de confiance 😰",
    statusCrisis: "Crise de confiance ! 🚨",

    btnRandomMemes: "🎲 Mèmes aléatoires",
    btnDominiqueMeme: "🤔 Que penserait Dominique ?",
    btnGuestbook: "📖 Livre d'or",
    btnRuben: "🫶 Apprécier Ruben",
    btnRosine: "💅 Conseils de Rosine",
    btnBirthdays: "🎂 Anniversaires",
    btnWeeklyMemes: "🌮 Mèmes recommandés par Dominique",

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
    birthdaySubtitle: "Calendrier d'anniversaires de l'équipe ADC",
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

    welcomeTitle: "Bienvenue",
    welcomeBack: "Bon retour",
    welcomeClose: "Cliquez pour fermer",

    weeklyTitle: "🌮 Mèmes recommandés par Dominique",
    weeklySubtitle: "Cette semaine sélectionnés personnellement par Dominique",
    weeklyClose: "Fermer",

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
