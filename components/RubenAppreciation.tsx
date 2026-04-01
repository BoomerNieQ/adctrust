"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function RubenAppreciation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 rounded-full font-boogaloo font-bold text-sm shadow-lg"
        style={{
          background: "rgba(99,179,237,0.12)",
          border: "2px solid rgba(99,179,237,0.4)",
          color: "rgba(147,210,255,0.95)",
        }}
        whileHover={{ scale: 1.05, background: "rgba(99,179,237,0.22)" }}
        whileTap={{ scale: 0.95 }}
      >
        🫶 Ruben waarderen
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
            style={{ background: "rgba(8,8,8,0.93)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl text-center"
              style={{
                background: "#141414",
                border: "2px solid rgba(99,179,237,0.45)",
              }}
              initial={{ scale: 0.7, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #63B3ED 50%, #FFCC00 50%)" }} />

              <div className="px-6 pt-6 pb-2">
                <motion.p
                  className="font-boogaloo text-2xl font-bold"
                  style={{ color: "#63B3ED" }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Ruben feels appreciated 🫶
                </motion.p>
              </div>

              <div className="relative w-full" style={{ height: "320px" }}>
                <Image
                  src="/ruben.jpeg"
                  alt="Ruben"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  priority
                />
              </div>

              <div className="px-6 py-4">
                <p className="text-white/30 text-xs font-boogaloo">Klik om te sluiten</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
