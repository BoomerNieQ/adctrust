"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Thermometer from "./Thermometer";
import VoteButtons from "./VoteButtons";
import MemeOverlay from "./MemeOverlay";
import ActivityFeed, { type VoteActivity } from "./ActivityFeed";
import LeftPanel from "./LeftPanel";
import WelcomeModal from "./WelcomeModal";
import LoginModal from "./LoginModal";
import { getRandomMeme, type Meme } from "@/lib/memes";
import { calculateScore } from "@/lib/score";
import { useLang } from "@/lib/i18n";
import RandomMemeButton from "./RandomMemeButton";
import RosineMemes from "./RosineMemes";
import DominiqueMeme from "./DominiqueMeme";
import Guestbook from "./Guestbook";
import RubenAppreciation from "./RubenAppreciation";
import BirthdayCalendar from "./BirthdayCalendar";
import BirthdayModal from "./BirthdayModal";
import { WeeklyMemesModal, useEasterEgg } from "./DominiqueWeeklyMemes";

interface ScoreData {
  score: number;
  count: number;
  positiveCount: number;
  negativeCount: number;
  lastVote: string | null;
  recentVoters: VoteActivity[];
}

interface VertrouwensBarometerProps {
  initialData: ScoreData;
}

function BalanceEasterEgg({ show }: { show: boolean }) {
  const { t } = useLang();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute text-5xl"
              style={{ left: `${10 + i * 20}%` }}
              initial={{ y: "100vh" }}
              animate={{ y: "-20vh", rotate: 360 }}
              transition={{ duration: 2.5, delay: i * 0.15, ease: "easeOut" }}
            >
              📦
            </motion.div>
          ))}
          <motion.div
            className="text-center px-8 py-4 rounded-2xl"
            style={{ background: "rgba(28,28,28,0.9)", border: "2px solid #FFCC00" }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.15, 1] }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-3xl font-boogaloo" style={{ color: "#FFCC00" }}>
              {t.balanceTitle}
            </p>
            <p className="text-white/60 font-boogaloo text-sm mt-1">
              {t.balanceSubtitle}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CrackVignette({ score }: { score: number }) {
  if (score > -50) return null;
  const intensity = (Math.abs(score) - 50) / 50;
  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        background: `radial-gradient(circle at 50% 50%, transparent 35%, rgba(212,5,17,${intensity * 0.35}) 100%)`,
      }}
    />
  );
}

function SusToast({ show }: { show: boolean }) {
  const { t } = useLang();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl"
          style={{ background: "#1C1C1C", border: "2px solid rgba(255,204,0,0.5)" }}
          initial={{ opacity: 0, y: -24, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.85 }}
        >
          <p className="font-boogaloo text-xl text-center" style={{ color: "#FFCC00" }}>{t.susTitle}</p>
          <p className="font-boogaloo text-xs text-center text-white/50 mt-0.5">{t.susSubtitle}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStatusLabel(score: number, t: any): string {
  if (score > 75)  return t.statusVeryHigh;
  if (score > 50)  return t.statusHigh;
  if (score > 25)  return t.statusModerate;
  if (score > 0)   return t.statusSlightlyPositive;
  if (score === 0) return t.statusNeutral;
  if (score > -25) return t.statusSlightlyNegative;
  if (score > -50) return t.statusNegative;
  if (score > -75) return t.statusVeryNegative;
  return t.statusCrisis;
}

function ResetButton() {
  const { t } = useLang();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const reset = async () => {
    if (!confirm(t.resetConfirm)) return;
    setBusy(true);
    const res = await fetch("/api/admin/reset", { method: "POST" });
    const data = await res.json();
    setMsg(res.ok ? t.resetSuccess : (data.error ?? t.resetError));
    setBusy(false);
    setTimeout(() => setMsg(""), 4000);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        onClick={reset}
        disabled={busy}
        className="px-4 py-2 rounded-lg font-boogaloo text-sm font-bold"
        style={{ background: "rgba(212,5,17,0.15)", border: "1px solid rgba(212,5,17,0.5)", color: "#D40511" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {busy ? `${t.loginLoading}` : t.resetBtn}
      </motion.button>
      {msg && <p className="text-xs font-boogaloo" style={{ color: msg === t.resetSuccess ? "#22c55e" : "#D40511" }}>{msg}</p>}
    </div>
  );
}

export default function VertrouwensBarometer({ initialData }: VertrouwensBarometerProps) {
  const { t } = useLang();
  const { data: session, status } = useSession();
  const [data, setData] = useState<ScoreData>(initialData);
  const [displayScore, setDisplayScore] = useState(initialData.score);
  const [isShaking, setIsShaking] = useState(false);
  const [currentMeme, setCurrentMeme] = useState<Meme | null>(null);
  const [cooldownMessage, setCooldownMessage] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [redFlash, setRedFlash] = useState(false);
  const [showSus, setShowSus] = useState(false);
  const consecutivePositiveRef = useRef(0);
  const [showLogin, setShowLogin] = useState(false);
  const [welcomeData, setWelcomeData] = useState<{ firstName: string; isReturning: boolean } | null>(null);
  const [birthdayNames, setBirthdayNames] = useState<string[] | null>(null);
  const easterEgg = useEasterEgg();

  const prevScoreRef = useRef(initialData.score);
  const prevStatusRef = useRef(status);
  const prevUserIdRef = useRef<string | null>(null);

  // Detect login → show welcome modal (once per session)
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const userId = session.user.id;
    if (prevStatusRef.current === "authenticated" && prevUserIdRef.current === userId) return;

    prevStatusRef.current = status;
    prevUserIdRef.current = userId;

    const key = `welcomed_${userId}`;
    const isReturning = !!sessionStorage.getItem(key);
    sessionStorage.setItem(key, "1");

    const firstName = (session.user as any).firstName ?? session.user.name ?? "Gebruiker";
    // Small delay so page renders first
    setTimeout(() => setWelcomeData({ firstName, isReturning }), 300);
  }, [status, session]);

  // Poll every 5 seconds
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/vote");
        if (res.ok) {
          const fresh: ScoreData = await res.json();
          setData(fresh);
          setDisplayScore(fresh.score);
        }
      } catch { /* silent */ }
    };
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  // Easter egg: score hits 0
  useEffect(() => {
    if (prevScoreRef.current !== 0 && displayScore === 0) {
      setShowBalance(true);
      setTimeout(() => setShowBalance(false), 3500);
    }
    prevScoreRef.current = displayScore;
  }, [displayScore]);

  const handleVote = useCallback(async (value: 1 | -1) => {
    const optimistic = calculateScore(
      data.positiveCount + (value === 1 ? 1 : 0),
      data.negativeCount + (value === -1 ? 1 : 0)
    );
    setDisplayScore(optimistic);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);

    if (value === -1) {
      setRedFlash(true);
      setTimeout(() => setRedFlash(false), 600);
      consecutivePositiveRef.current = 0;
    } else {
      consecutivePositiveRef.current += 1;
      if (consecutivePositiveRef.current >= 3) {
        setShowSus(true);
        setTimeout(() => setShowSus(false), 3500);
      }
    }

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const result = await res.json();

      if (!res.ok) {
        setDisplayScore(data.score);
        if (res.status === 429) {
          setCooldownMessage(result.error);
          setTimeout(() => setCooldownMessage(""), 6000);
        }
        return;
      }

      setDisplayScore(result.score);
      setData((prev) => ({
        ...prev,
        score: result.score,
        count: result.count,
        positiveCount: result.positiveCount,
        negativeCount: result.negativeCount,
      }));
      setCurrentMeme(
        result.score === 0
          ? getRandomMeme("balanced")
          : getRandomMeme(value === 1 ? "positive" : "negative")
      );
      setCooldownMessage("");
    } catch {
      setDisplayScore(data.score);
    }
  }, [displayScore, data.score]);

  const scoreColor =
    displayScore > 30 ? "#22c55e" :
    displayScore < -30 ? "#D40511" :
    "#FFCC00";

  return (
    <>
      {/* Overlays */}
      <SusToast show={showSus} />
      {redFlash && (
        <div
          className="fixed inset-0 pointer-events-none z-20 red-flash"
          style={{ background: "rgba(212,5,17,0.22)" }}
        />
      )}
      <CrackVignette score={displayScore} />
      <BalanceEasterEgg show={showBalance} />
      <MemeOverlay meme={currentMeme} onClose={() => setCurrentMeme(null)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <AnimatePresence>
        {welcomeData && (
          <WelcomeModal
            firstName={welcomeData.firstName}
            isReturning={welcomeData.isReturning}
            onClose={async () => {
              setWelcomeData(null);
              // Check birthdays
              try {
                const res = await fetch("/api/birthdays");
                if (res.ok) {
                  const entries: Array<{ day: number; month: number; user: { firstName: string; lastName: string } }> = await res.json();
                  const today = new Date();
                  const names = entries
                    .filter((e) => e.day === today.getDate() && e.month === today.getMonth() + 1)
                    .map((e) => `${e.user.firstName} ${e.user.lastName}`);
                  if (names.length > 0) setBirthdayNames(names);
                }
              } catch { /* silent */ }
            }}
          />
        )}
        {birthdayNames && (
          <BirthdayModal names={birthdayNames} onClose={() => setBirthdayNames(null)} />
        )}
      </AnimatePresence>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[300px_1fr_300px] gap-5 items-start w-full">

        {/* LEFT PANEL */}
        <div className="hidden lg:block">
          <LeftPanel
            score={displayScore}
            count={data.count}
            positiveCount={data.positiveCount}
            negativeCount={data.negativeCount}
            onAvatarClick={easterEgg.handleClick}
          />
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center gap-6">
          {/* Thermometer */}
          <Thermometer score={displayScore} isShaking={isShaking} />

          {/* Vote buttons */}
          <VoteButtons
            isLoggedIn={!!session}
            onVote={handleVote}
            cooldownMessage={cooldownMessage}
            onLoginRequest={() => setShowLogin(true)}
          />

          {/* Extra meme buttons */}
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex flex-wrap justify-center gap-2">
              <RandomMemeButton />
              <DominiqueMeme />
              <Guestbook />
              <BirthdayCalendar />
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-1">
              <RubenAppreciation />
            </div>
            {(session?.user as any)?.isAdmin && <ResetButton />}
            {/* Easter egg weekly memes modal */}
            <AnimatePresence>
              {easterEgg.open && (
                <WeeklyMemesModal onClose={() => easterEgg.setOpen(false)} />
              )}
            </AnimatePresence>
          </div>

          {/* Status message */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`status-${Math.floor(displayScore / 25)}`}
              className="text-center font-boogaloo text-xl px-4"
              style={{ color: scoreColor }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {getStatusLabel(displayScore, t)}
            </motion.p>
          </AnimatePresence>

          {/* Mobile: show left panel stats inline */}
          <div className="lg:hidden w-full">
            <LeftPanel
              score={displayScore}
              count={data.count}
              positiveCount={data.positiveCount}
              negativeCount={data.negativeCount}
            />
          </div>

          {/* Mobile: activity feed inline */}
          <div className="lg:hidden w-full">
            <ActivityFeed
              votes={data.recentVoters}
              totalCount={data.count}
              score={displayScore}
            />
          </div>
        </div>

        {/* RIGHT PANEL — Activity feed */}
        <div className="hidden lg:block">
          <ActivityFeed
            votes={data.recentVoters}
            totalCount={data.count}
            score={displayScore}
          />
        </div>
      </div>
    </>
  );
}
