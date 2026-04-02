"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const CAUSES = [
  "Fillers & Botox voor Solange & Vicky",
  "Haartransplantatie voor Ruben & Dominique",
  "Pokémonkaarten voor het goede doel (Dominique)",
  "Een te gek teamuitje bij Ruben z'n ouders thuis",
  "Eindelijk een normale auto voor Claire die niet iedere 3 weken kapotgaat (en een dak heeft)",
];

const PAYPAL_BLUE = "#003087";
const PAYPAL_LIGHT = "#009cde";

export default function DonateButton({ onDonated }: { onDonated: () => void }) {
  const { data: session } = useSession();
  const [open, setOpen]           = useState(false);
  const [cause, setCause]         = useState("");
  const [amount, setAmount]       = useState("");
  const [step, setStep]           = useState<"form" | "gotcha">("form");
  const [loading, setLoading]     = useState(false);

  function openModal() {
    setCause("");
    setAmount("");
    setStep("form");
    setOpen(true);
  }

  async function handlePay() {
    if (!cause || !amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cause, amount }),
      });
      onDonated();
    } catch {
      // still show gotcha even if network fails
    }
    setLoading(false);
    setStep("gotcha");
  }

  return (
    <>
      {/* Donate button */}
      <motion.button
        onClick={openModal}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${PAYPAL_BLUE}, ${PAYPAL_LIGHT})`,
          color: "white",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.5px",
        }}
        whileHover={{ scale: 1.04, filter: "brightness(1.12)" }}
        whileTap={{ scale: 0.96 }}
      >
        <PayPalLogo />
        Doneer
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.88)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "#fafafa" }}
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* PayPal header */}
              <div
                className="flex items-center justify-center gap-2 py-4 px-6"
                style={{ background: `linear-gradient(135deg, ${PAYPAL_BLUE}, ${PAYPAL_LIGHT})` }}
              >
                <PayPalLogo size={22} white />
                <span style={{ color: "white", fontWeight: 800, fontSize: "18px", letterSpacing: "0.5px" }}>
                  PayPal
                </span>
              </div>

              {step === "form" ? (
                <div className="p-6">
                  <p style={{ color: "#333", fontWeight: 700, fontSize: "15px", marginBottom: "16px" }}>
                    Ik doneer voor:
                  </p>

                  {/* Cause options */}
                  <div className="space-y-2 mb-5">
                    {CAUSES.map((c, i) => (
                      <label
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                        style={{
                          background: cause === c ? "rgba(0,156,222,0.1)" : "rgba(0,0,0,0.04)",
                          border: `1.5px solid ${cause === c ? PAYPAL_LIGHT : "transparent"}`,
                        }}
                      >
                        <input
                          type="radio"
                          name="cause"
                          value={c}
                          checked={cause === c}
                          onChange={() => setCause(c)}
                          className="mt-0.5 accent-blue-500"
                        />
                        <span style={{ color: "#333", fontSize: "13px", lineHeight: 1.4 }}>
                          <span style={{ color: PAYPAL_BLUE, fontWeight: 700, marginRight: "4px" }}>
                            {String.fromCharCode(96 + i + 1)}.
                          </span>
                          {c}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Amount */}
                  <div className="mb-5">
                    <p style={{ color: "#555", fontSize: "12px", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.5px" }}>
                      BEDRAG (€)
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ border: `1.5px solid ${amount ? PAYPAL_LIGHT : "#ddd"}`, background: "white" }}>
                      <span style={{ color: "#555", fontWeight: 700 }}>€</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="0,00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 outline-none bg-transparent"
                        style={{ color: "#333", fontSize: "16px", fontWeight: 600 }}
                      />
                    </div>
                  </div>

                  {/* Pay button */}
                  <motion.button
                    onClick={handlePay}
                    disabled={!cause || !amount || parseFloat(amount) <= 0 || loading || !session}
                    className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-40"
                    style={{ background: `linear-gradient(135deg, ${PAYPAL_BLUE}, ${PAYPAL_LIGHT})`, border: "none", cursor: "pointer" }}
                    whileHover={{ filter: "brightness(1.1)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {loading ? "Bezig..." : !session ? "Log in om te doneren" : `Betaal via PayPal${amount ? ` €${parseFloat(amount).toFixed(2)}` : ""}`}
                  </motion.button>

                  <p style={{ color: "#aaa", fontSize: "10px", textAlign: "center", marginTop: "10px" }}>
                    Veilig betalen via PayPal
                  </p>
                </div>
              ) : (
                <GotchaScreen cause={cause} amount={amount} onClose={() => setOpen(false)} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GotchaScreen({ cause, amount, onClose }: { cause: string; amount: string; onClose: () => void }) {
  return (
    <motion.div
      className="p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        style={{ fontSize: "52px", lineHeight: 1 }}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
      >
        😏
      </motion.div>
      <motion.p
        style={{ color: "#1a1a1a", fontWeight: 800, fontSize: "17px", marginTop: "16px", lineHeight: 1.4 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Je dacht toch niet echt dat we hier geld gingen inzamelen....
      </motion.p>
      <motion.p
        style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        Beetje sus.....
      </motion.p>
      <motion.button
        onClick={onClose}
        className="mt-6 px-6 py-2 rounded-xl text-sm font-bold text-white"
        style={{ background: `linear-gradient(135deg, #003087, #009cde)`, border: "none", cursor: "pointer" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ filter: "brightness(1.1)" }}
        whileTap={{ scale: 0.97 }}
      >
        Sluiten
      </motion.button>
    </motion.div>
  );
}

function PayPalLogo({ size = 18, white = false }: { size?: number; white?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.828l-1.145 7.24h3.479c.458 0 .848-.332.92-.784l.38-2.409.686-4.352h2.19c4.298 0 7.664-1.747 8.647-6.797.12-.617.127-1.17.037-1.693z"
        fill={white ? "white" : PAYPAL_BLUE}
      />
    </svg>
  );
}
