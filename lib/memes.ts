export type MemeType = "positive" | "negative" | "balanced";

export interface Meme {
  text: string;
  subtext?: string;
  emoji: string;
  mediaUrl: string;   // local /media/*.mp4 or remote gif
  isVideo: boolean;
  type: MemeType;
}

// Helper to encode filenames with spaces/special chars
function media(filename: string): string {
  return `/media/${encodeURIComponent(filename)}`;
}

// ─── Known media files ────────────────────────────────────────────────────────
export const MEDIA = {
  blikje:              media("blikje in de water.mp4"),
  schande:             media("Schande.mp4"),
  michaelScottNo:      media("michael-scott-no-god-please-no.mp4"),
  heetJeEchtZo:        media("Heet je echt zo.mp4"),
  tubularBells:        media("tubular-bells.mp3"),
  bassieAdriaaan:      media("bassie-adriaan-achtergrondmuziek.mp3"),
  happyBirthday:       media("happy-birthday.mp3"),
  kutkind:             media("kutkind.m4a"),
  // Rosine's life advise
  iWannaGoHome:        media("i-wanna-go-home.mp4"),
  moneyglitch:         media("Moneyglitch.mp4"),
  bossRaise:           media("when-you-ask-your-boss-for-a-raise.mp4"),
  letsPush:            media("lets-push-almost-weekend.mp4"),
  // Dominique meme
  shutUpGetBack:       media("shut-up-get-back-to-work.mp4"),
} as const;

// ─── Random memes (for the Random Memes button) ───────────────────────────────
export interface RandomMeme {
  file: string;
  label: string;
}

export const RANDOM_MEMES: RandomMeme[] = [
  { file: media("Rundfunk - De hele klas heeft een onvoldoende.mp4"),    label: "De hele klas heeft een onvoldoende" },
  { file: media("Vrachtautochauffeur betaald niks  -   New Kids.mp4"),   label: "Vrachtautochauffeur betaalt niks" },
  { file: media("wat-wil-jij-later-worden.mp4"),                                                               label: "Wat wil jij later worden?" },
  { file: media("water-wil-je-mij-vergiftigen.mp4"),                     label: "Water, wil je mij vergiftigen?" },
  { file: media("ik lijk op je- de-shayrons life.mp4"),                  label: "Ik lijk op je" },
  { file: media("www.dumpert.nl - Kamasutrabeurs.mp4"),                  label: "Kamasutrabeurs" },
  { file: media("had-je-een-probleem-thug-life.mp4"),                    label: "Had je een probleem?" },
  { file: media("boodschap.mp4"),                                        label: "BOODSCHAP!!!" },
  { file: media("De verkeerde kant.mp4"),                                label: "De verkeerde kant" },
  { file: media("ik-ga-alleen-naar-de-speeltuin.mp4"),                   label: "Ik ga alleen naar de speeltuin" },
  { file: media("Ik heb shi daggoetje geswiped je heet nu gemairo.mp4"), label: "Je heet nu gemairo" },
  { file: media("Ik wil gewoon toeteren. - Sluipschutters.mp4"),         label: "Ik wil gewoon toeteren" },
  { file: media("je-moet-me-niet-bellen.mp4"),                                                                 label: "Je moet me niet bellen" },
  { file: media("Kindje Slaan.mp4"),                                     label: "Kindje Slaan" },
  { file: media("pelle-houdt-van-maaien.mp4"),                           label: "Pelle houdt van maaien" },
  { file: media("Vlogger glijdt uit.mp4"),                               label: "Vlogger glijdt uit" },
  { file: media("Waterhoofd.mp4"),                                       label: "Waterhoofd" },
  { file: media("56-ans.mp4"),                                           label: "56 ans" },
  { file: media("ca-te-donnera-des-couleurs.mp4"),                       label: "Ça te donnera des couleurs" },
  { file: media("ta-geule.mp4"),                                         label: "Ta gueule" },
  { file: media("plante.mp4"),                                           label: "Plante" },
];

// ─── Rosine's life advise (sequential, always starts with iWannaGoHome) ───────
export const ROSINE_MEMES: RandomMeme[] = [
  { file: MEDIA.iWannaGoHome,  label: "I wanna go home" },
  { file: MEDIA.moneyglitch,   label: "Moneyglitch" },
  { file: MEDIA.bossRaise,     label: "When you ask your boss for a raise" },
  { file: MEDIA.letsPush,      label: "Rosine on Monday: It's almost weekend" },
];

// ─── Wat zou Dominique nu denken? ─────────────────────────────────────────────
export const DOMINIQUE_MEME: RandomMeme = {
  file: MEDIA.shutUpGetBack,
  label: "Shut Up & Get Back to Work",
};

// ─── Vote memes ───────────────────────────────────────────────────────────────
export const positiveMemes: Meme[] = [
  {
    text: "Ik vind het helemaal mooi! 🙌",
    subtext: "Net als die man met zijn blikje",
    emoji: "🥫",
    mediaUrl: MEDIA.blikje,
    isVideo: true,
    type: "positive",
  },
  {
    text: "Ik vind het helemaal mooi! 🙌",
    subtext: "Het team staat achter je, Dom!",
    emoji: "🎉",
    mediaUrl: MEDIA.blikje,
    isVideo: true,
    type: "positive",
  },
  {
    text: "TOP! Helemaal mooi! ⭐",
    subtext: "Goedgekeurd door het team",
    emoji: "⭐",
    mediaUrl: MEDIA.blikje,
    isVideo: true,
    type: "positive",
  },
];

export const negativeMemes: Meme[] = [
  {
    text: "SCHANDE! 😤",
    subtext: "Het team spreekt zich uit",
    emoji: "😤",
    mediaUrl: MEDIA.schande,
    isVideo: true,
    type: "negative",
  },
  {
    text: "NO NO NO NO NO! 😱",
    subtext: "Michael Scott is teleurgesteld",
    emoji: "😱",
    mediaUrl: MEDIA.michaelScottNo,
    isVideo: true,
    type: "negative",
  },
  {
    text: "NOOOO! 💀",
    subtext: "The Office had meer verwacht",
    emoji: "💀",
    mediaUrl: MEDIA.michaelScottNo,
    isVideo: true,
    type: "negative",
  },
  {
    text: "God please no! 😬",
    subtext: "Vertrouwen: NOPE",
    emoji: "😬",
    mediaUrl: MEDIA.michaelScottNo,
    isVideo: true,
    type: "negative",
  },
];

export const balancedMeme: Meme = {
  text: "Precies in balans! ⚖️",
  subtext: "50/50 — Dominique kan nog alle kanten op",
  emoji: "⚖️",
  mediaUrl: MEDIA.heetJeEchtZo,
  isVideo: true,
  type: "balanced",
};

export function getRandomMeme(type: MemeType): Meme {
  if (type === "balanced") return balancedMeme;
  const list = type === "positive" ? positiveMemes : negativeMemes;
  return list[Math.floor(Math.random() * list.length)];
}

export const TAGLINES = [
  "Hoeveel vertrouwen heeft het team in Dominique?",
  "De eerlijke meting van het team",
  "Gebaseerd op échte teamopinies",
  "Team Manager performance indicator — unofficial edition",
  "Want iemand moet het bijhouden",
  "Betrouwbaarder dan officiële feedback",
];
