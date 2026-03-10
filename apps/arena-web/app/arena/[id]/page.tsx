"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import BattleStart   from "./modules/BattleStart";
import Countdown     from "./modules/Countdown";
import QuizGameplay  from "./modules/QuizGameplay";
import Result        from "./modules/Result";

type GameState = "MATCHING" | "COUNTDOWN" | "PLAYING" | "RESULTS";

interface BattleResult {
  score:          number;
  opponentScore:  number;
  correctAnswers: number;
  totalQuestions: number;
}

export default function ArenaPage({ params }: { params: { id: string } }) {
  const [gameState,    setGameState]    = useState<GameState>("MATCHING");
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black select-none">
      <AnimatePresence mode="wait">

        {/* PHASE 1: LOBBY & MATCHMAKING */}
        {gameState === "MATCHING" && (
          <motion.div
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
            transition={{ duration: 0.35 }}
            className="h-full"
          >
            <BattleStart
              quizId={params.id}
              onReady={() => setGameState("COUNTDOWN")}
            />
          </motion.div>
        )}

        {/* PHASE 2: TENSION BUILDING */}
        {gameState === "COUNTDOWN" && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)", scale: 1.06 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <Countdown onComplete={() => setGameState("PLAYING")} />
          </motion.div>
        )}

        {/* PHASE 3: ACTIVE COMBAT */}
        {gameState === "PLAYING" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <QuizGameplay
              quizId={params.id}
              onFinish={(result) => {
                setBattleResult(result);
                setGameState("RESULTS");
              }}
            />
          </motion.div>
        )}

        {/* PHASE 4: RESULTS */}
        {gameState === "RESULTS" && battleResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            <Result
              result={battleResult}
              onRematch={() => setGameState("MATCHING")}
              onExit={() => {/* router.push to course home */}}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}