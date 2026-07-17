"use client";

import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { useShowdownState } from "@verse/arena-web/lib/showdown/useShowdownState";
import { useQuestionTimer } from "@verse/arena-web/lib/showdown/useQuestionTimer";
import { getActiveMatchQuestion, getMaxRound, getRoundMatches } from "@verse/arena-web/lib/showdown/types";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { VersusIgnition } from "@verse/arena-web/components/ui/showdown/VersusIgnition";
import { CombatantHUD } from "@verse/arena-web/components/ui/showdown/CombatantHUD";
import { DuelRing } from "@verse/arena-web/components/ui/showdown/DuelRing";
import { AnimatePresence, motion } from "framer-motion";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

export default function TournamentDisplayPage({ params }: { params: { showdownId: string } }) {
  const token = useArenaToken();
  const { state } = useShowdownState(params.showdownId, token);

  if (!state) {
    return (
      <EnergyBackground className="grid place-items-center" variant="duel">
        <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Establishing uplink…</p>
      </EnergyBackground>
    );
  }

  if (state.showdown.status === "draft" || state.showdown.status === "lobby") {
    return (
      <EnergyBackground className="grid place-items-center" variant="duel">
        <p className="font-display text-2xl font-black text-white uppercase">{state.showdown.title}</p>
        <p className="font-display text-[10px] font-bold text-white/30 uppercase tracking-[.3em] mt-3">
          Awaiting bracket construction…
        </p>
      </EnergyBackground>
    );
  }

  if (state.showdown.status === "complete") {
    const champion = state.participants.find((p) => p.id === state.showdown.championId);
    return (
      <EnergyBackground className="grid place-items-center" variant="duel">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <p className="font-display text-[10px] font-black text-primary/70 uppercase tracking-[.4em] mb-4">
            Tournament Resolved
          </p>
          <h1
            className="font-display text-6xl font-black text-white uppercase"
            style={{ textShadow: "0 0 32px hsl(var(--primary) / .5)" }}
          >
            {champion?.arenaUser.user.username}
          </h1>
        </motion.div>
      </EnergyBackground>
    );
  }

  const maxRound = getMaxRound(state);
  const currentRound = getRoundMatches(state, maxRound);
  const activeMatch = currentRound.find((m) => m.status === "active");

  if (!activeMatch) {
    return (
      <EnergyBackground className="grid place-items-center" variant="duel">
        <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Awaiting next engagement…</p>
      </EnergyBackground>
    );
  }

  return <ArenaView match={activeMatch} participants={state.participants} />;
}

function ArenaView({ match, participants }: { match: any; participants: any[] }) {
  const activeQ = getActiveMatchQuestion(match);
  const { isCountingDown, countdownSeconds, secondsLeft, pct } = useQuestionTimer(activeQ);
  const a = participants.find((p: any) => p.id === match.playerAId);
  const b = participants.find((p: any) => p.id === match.playerBId);
  const aAnswered = activeQ?.answers.some((ans: any) => ans.participantId === match.playerAId);
  const bAnswered = activeQ?.answers.some((ans: any) => ans.participantId === match.playerBId);

  return (
    <EnergyBackground className="flex flex-col items-center justify-center px-10" variant="duel">
      <AnimatePresence mode="wait">
        {isCountingDown ? (
          <motion.div key="ignition" exit={{ opacity: 0 }}>
            <VersusIgnition
              playerA={{ name: a?.arenaUser.user.username ?? "?", avatar: dicebearUrl(a?.arenaUser.user.username ?? "a") }}
              playerB={{ name: b?.arenaUser.user.username ?? "?", avatar: dicebearUrl(b?.arenaUser.user.username ?? "b") }}
              countdownSeconds={countdownSeconds}
              roundLabel={`Round ${match.round + 1}`}
            />
          </motion.div>
        ) : (
          <motion.div key="combat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl">
            <div className="flex items-center gap-6">
              <CombatantHUD
                name={a?.arenaUser.user.username ?? "?"}
                avatar={dicebearUrl(a?.arenaUser.user.username ?? "a")}
                score={match.scores[match.playerAId] ?? 0}
                side="left"
                answered={aAnswered}
              />
              <DuelRing pct={pct} seconds={secondsLeft} />
              <CombatantHUD
                name={b?.arenaUser.user.username ?? "?"}
                avatar={dicebearUrl(b?.arenaUser.user.username ?? "b")}
                score={match.playerBId ? match.scores[match.playerBId] ?? 0 : 0}
                side="right"
                answered={bAnswered}
              />
            </div>

            {activeQ && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-10 rounded-2xl border border-white/[0.07] bg-black/30 backdrop-blur-sm p-6"
              >
                <p className="font-display text-[9px] font-black text-primary/60 uppercase tracking-[.3em] mb-3">
                  Intel Prompt
                </p>
                <p className="font-display text-xl font-black text-white text-center mb-6">
                  {activeQ.question.prompt}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {activeQ.question.options.map((opt: string, i: number) => (
                    <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 font-display text-sm text-white/80 uppercase tracking-wide">
                      {opt}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </EnergyBackground>
  );
}