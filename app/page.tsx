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
import BirthdayWidget from "@/components/BirthdayWidget";
import TitleSection from "@/components/TitleSection";
import PageFooter from "@/components/PageFooter";
import PageHeaderText from "@/components/PageHeaderText";
import BaconEasterEgg from "@/components/BaconEasterEgg";
import DonateButton from "@/components/DonateButton";
import RingingPhone from "@/components/RingingPhone";
import DonationWallboard from "@/components/DonationWallboard";

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

  return (
    <div className="relative min-h-screen overflow-x-clip" style={{ background: "#1C1C1C" }}>
      <WindmillBackground />

      {/* top stripe */}
      <div
        className="relative z-10 h-2 w-full"
        style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }}
      />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-5 sm:px-8 py-3 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <PageHeaderText />
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <AuthButton />
        </div>
      </header>

      <TitleSection />

      <BirthdayBanner />

      {/* Barometer — full width container */}
      <main className="relative z-10 px-4 sm:px-6 pb-16 max-w-[1400px] mx-auto">
        <VertrouwensBarometer initialData={initialData} />
      </main>

      {/* Birthday widget */}
      <section className="relative z-10 px-4 sm:px-6 pb-8 max-w-[1400px] mx-auto">
        <BirthdayWidget />
      </section>

      {/* Stats section — full width below barometer */}
      <section className="relative z-10 px-4 sm:px-6 pb-16 max-w-[1400px] mx-auto">
        <StatsSection />
      </section>

      {/* Exposed donations wallboard */}
      <DonationWallboard />

      {/* Pink fence decoration */}
      <div className="relative z-10 w-full overflow-hidden" style={{ height: "64px", marginBottom: "8px" }}>
        <PinkFence className="w-full h-full" />
      </div>

      {/* Mobile-only: donate inline (floaters hidden on narrow screens) */}
      <section className="relative z-10 flex flex-col items-center gap-4 pb-8 max-[1799px]:flex min-[1800px]:hidden">
        <DonateButton />
      </section>

      <PageFooter />

      <BackgroundMusic />
      <RosineMemes />
      <BaconEasterEgg />
      <RingingPhone />
      <DonateButton floating />

      {/* DHL bottom stripe */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10 h-1.5"
        style={{ background: "linear-gradient(to right, #D40511 50%, #FFCC00 50%)" }}
      />
    </div>
  );
}
