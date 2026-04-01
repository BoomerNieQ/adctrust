export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { calculateScore } from "@/lib/score";
import AuthButton from "@/components/AuthButton";
import LanguageToggle from "@/components/LanguageToggle";
import WindmillBackground from "@/components/WindmillBackground";
import VertrouwensBarometer from "@/components/VertrouwensBarometer";
import StatsSection from "@/components/StatsSection";
import BackgroundMusic from "@/components/BackgroundMusic";
import PinkFence from "@/components/PinkFence";
import RosineMemes from "@/components/RosineMemes";
import BirthdayBanner from "@/components/BirthdayBanner";
import { TAGLINES } from "@/lib/memes";

async function getInitialData() {
  try {
    const [votes, positiveCount, negativeCount] = await Promise.all([
      prisma.vote.findMany({
        orderBy: { createdAt: "desc" },
        take: 15,
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
      prisma.vote.count({ where: { value: 1 } }),
      prisma.vote.count({ where: { value: -1 } }),
    ]);

    return {
      score: calculateScore(positiveCount, negativeCount),
      count: positiveCount + negativeCount,
      positiveCount,
      negativeCount,
      lastVote: votes[0]?.createdAt?.toISOString() ?? null,
      recentVoters: votes.map((v) => ({
        firstName: v.user.firstName,
        lastName: v.user.lastName,
        value: v.value,
        createdAt: v.createdAt.toISOString(),
      })),
    };
  } catch {
    return { score: 0, count: 0, positiveCount: 0, negativeCount: 0, lastVote: null, recentVoters: [] };
  }
}

export default async function Home() {
  const initialData = await getInitialData();
  const tagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#1C1C1C" }}>
      <WindmillBackground />

      {/* DHL top stripe */}
      <div
        className="relative z-10 h-2 w-full"
        style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }}
      />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-5 sm:px-8 py-3 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-white/40 font-boogaloo hidden sm:block text-sm">
            Vertrouwensbarometer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <AuthButton />
        </div>
      </header>

      {/* Title section */}
      <div className="relative z-10 text-center px-4 py-4 pb-6">
        <h1 className="text-5xl sm:text-6xl font-boogaloo text-white leading-tight">
          Vertrouwen in{" "}
          <span
            className="font-fredoka"
            style={{
              background: "linear-gradient(135deg, #FFCC00, #D40511)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Dominique
          </span>
        </h1>
        <p className="text-white/35 font-boogaloo mt-1 text-sm">
          Team Manager
        </p>
        <p
          className="mt-3 font-boogaloo text-base px-5 py-2 rounded-full inline-block"
          style={{
            color: "rgba(255,204,0,0.75)",
            background: "rgba(255,204,0,0.07)",
            border: "1px solid rgba(255,204,0,0.18)",
          }}
        >
          "{tagline}"
        </p>
      </div>

      <BirthdayBanner />

      {/* Barometer — full width container */}
      <main className="relative z-10 px-4 sm:px-6 pb-16 max-w-[1400px] mx-auto">
        <VertrouwensBarometer initialData={initialData} />
      </main>

      {/* Stats section — full width below barometer */}
      <section className="relative z-10 px-4 sm:px-6 pb-16 max-w-[1400px] mx-auto">
        <StatsSection />
      </section>

      {/* Pink fence decoration */}
      <div className="relative z-10 w-full overflow-hidden" style={{ height: "64px", marginBottom: "8px" }}>
        <PinkFence className="w-full h-full" />
      </div>

      <p className="relative z-10 text-white/15 text-xs text-center font-boogaloo pb-10">
        Stem elke 30 seconden · Alleen voor medewerkers
      </p>

      <BackgroundMusic />
      <RosineMemes />

      {/* DHL bottom stripe */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10 h-1.5"
        style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }}
      />
    </div>
  );
}
