"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, Crown, Swords, Radio } from "lucide-react";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { useShowdownState } from "@verse/arena-web/lib/showdown/useShowdownState";
import { useQuestionTimer } from "@verse/arena-web/lib/showdown/useQuestionTimer";
import { getActiveMatchQuestion, getMaxRound, getRoundMatches } from "@verse/arena-web/lib/showdown/types";
import { VersusIgnition } from "@verse/arena-web/components/ui/showdown/VersusIgnition";
import { CombatantHUD } from "@verse/arena-web/components/ui/showdown/CombatantHUD";
import { DuelRing } from "@verse/arena-web/components/ui/duel/DuelRing";
import { QRJoinOverlay } from "@verse/arena-web/components/ui/showdown/QRJoinOverlay";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

function getRoundLabel(roundIndex: number, totalRounds: number) {
  const remaining = totalRounds - roundIndex;
  if (remaining === 1) return "Final";
  if (remaining === 2) return "Semi-Final";
  if (remaining === 3) return "Quarter-Final";
  return `Round ${roundIndex + 1}`;
}

function ArenaBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[140px] pointer-events-none" />
    </>
  );
}

export default function TournamentDisplayPage() {
  const params = useParams<{ id: string; showdownId: string }>();
  const token = useArenaToken();
  const { state } = useShowdownState(params.showdownId, token);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ArenaBackdrop />
      <QRJoinOverlay />

      {!state && (
        <div className="h-full grid place-items-center relative z-10">
          <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Establishing uplink…</p>
        </div>
      )}

      {state && <DisplayBody state={state} />}
    </div>
  );
}

function DisplayBody({ state }: { state: any }) {
  if (state.showdown.status === "draft" || state.showdown.status === "lobby" || state.showdown.status === "seeding") {
    return <WaitingRoom title={state.showdown.title} participants={state.participants} status={state.showdown.status} />;
  }

  if (state.showdown.status === "complete") {
    const champion = state.participants.find((p: any) => p.id === state.showdown.championId);
    return <ChampionScreen champion={champion} allParticipants={state.participants} title={state.showdown.title} />;
  }

  const maxRound = getMaxRound(state);
  const currentRound = getRoundMatches(state, maxRound);
  const activeMatch = currentRound.find((m: any) => m.status === "active");

  if (!activeMatch) {
    return (
      <div className="h-full grid place-items-center relative z-10">
        <div className="flex flex-col items-center gap-3">
          <Swords size={32} className="text-white/20" />
          <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Awaiting next engagement…</p>
        </div>
      </div>
    );
  }

  return (
    <ArenaView
      match={activeMatch}
      participants={state.participants}
      roundLabel={getRoundLabel(maxRound, state.showdown.totalRounds ?? maxRound + 1)}
    />
  );
}

function WaitingRoom({ title, participants, status }: { title: string; participants: any[]; status: string }) {
  const label = status === "lobby" ? "Assembling Fighters" : status === "seeding" ? "Drawing the Bracket" : "Arena Standing By";

  return (
    <div className="h-full flex flex-col items-center justify-center relative z-10 px-10 gap-10">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="flex flex-col items-center gap-4"
      >
        <Trophy size={52} className="text-amber-400" style={{ filter: "drop-shadow(0 0 20px rgba(251,191,36,.5))" }} />
        <p className="font-display text-[11px] font-black text-amber-400/70 uppercase tracking-[.5em]">{label}</p>
      </motion.div>

      <h1
        className="font-display text-5xl font-black text-white uppercase tracking-tight text-center"
        style={{ textShadow: "0 0 32px hsl(var(--primary) / .4)" }}
      >
        {title}
      </h1>

      {participants.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
          {participants.map((p: any) => (
            <div key={p.id} className="flex flex-col items-center gap-2">
              <ArenaAvatar src={dicebearUrl(p.arenaUser.user.username)} size="lg" glow glowColor="primary" />
              <p className="font-display text-[10px] font-bold text-white/60 uppercase tracking-wide max-w-[80px] truncate text-center">
                {p.arenaUser.user.username}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArenaView({ match, participants, roundLabel }: { match: any; participants: any[]; roundLabel: string }) {
  const activeQ = getActiveMatchQuestion(match);
  const { isCountingDown, countdownSeconds, secondsLeft, pct } = useQuestionTimer(activeQ);
  const a = participants.find((p: any) => p.id === match.playerAId);
  const b = participants.find((p: any) => p.id === match.playerBId);
  const aAnswered = activeQ?.answers.some((ans: any) => ans.participantId === match.playerAId);
  const bAnswered = activeQ?.answers.some((ans: any) => ans.participantId === match.playerBId);

  return (
    <div className="h-full flex flex-col items-center justify-center px-10 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
        <span className="font-display text-xs font-black uppercase tracking-[.4em] text-primary">{roundLabel}</span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
      </motion.div>

      <AnimatePresence mode="wait">
        {isCountingDown ? (
          <motion.div key="ignition" exit={{ opacity: 0 }}>
            <VersusIgnition
              playerA={{ name: a?.arenaUser.user.username ?? "?", avatar: dicebearUrl(a?.arenaUser.user.username ?? "a") }}
              playerB={{ name: b?.arenaUser.user.username ?? "?", avatar: dicebearUrl(b?.arenaUser.user.username ?? "b") }}
              countdownSeconds={countdownSeconds}
              roundLabel={roundLabel}
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
                className="mt-10 rounded-2xl border border-white/[0.07] bg-black/30 backdrop-blur-sm p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
                <p className="font-display text-[9px] font-black text-primary/60 uppercase tracking-[.3em] mb-3">
                  Intel Prompt
                </p>
                <p className="font-display text-xl font-black text-white text-center mb-6">{activeQ.question.prompt}</p>
                <div className="grid grid-cols-2 gap-3">
                  {activeQ.question.options.map((opt: string, i: number) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 font-display text-sm text-white/80 uppercase tracking-wide"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChampionScreen({ champion, allParticipants, title }: { champion: any; allParticipants: any[]; title: string }) {
  if (!champion) {
    return (
      <div className="h-full grid place-items-center relative z-10">
        <p className="font-display text-2xl font-black text-white/40 uppercase">Tournament Cancelled</p>
      </div>
    );
  }

  const name = champion.arenaUser.user.username;

  return (
    <div className="h-full flex flex-col items-center justify-center gap-8 relative z-10">
      <div className="relative flex items-center justify-center">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3 + i * 0.5, opacity: 0 }}
            transition={{ duration: 1.6 + i * 0.15, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
            className="absolute h-28 w-28 rounded-full border"
            style={{ borderColor: i % 2 === 0 ? "rgba(251,191,36,0.35)" : "hsl(var(--primary) / .25)" }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.6, duration: 1 }}
          className="relative"
        >
          <ArenaAvatar src={dicebearUrl(name)} size="2xl" glow glowColor="warning" />
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-3 -right-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400"
            style={{ boxShadow: "0 0 30px rgba(251,191,36,.8)" }}
          >
            <Crown size={20} className="text-black" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="font-display text-xs uppercase tracking-[.6em] text-amber-400 font-black mb-4"
        >
          Tournament Resolved
        </motion.p>
        <h1 className="font-display text-7xl font-black uppercase text-white tracking-tight leading-none">{name}</h1>
        <p className="mt-4 font-display text-xl font-bold text-amber-300 uppercase tracking-widest">{title}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap justify-center gap-4 max-w-3xl px-6"
      >
        {allParticipants.map((p: any) => {
          const isChamp = p.id === champion.id;
          return (
            <div key={p.id} className={`flex flex-col items-center gap-1.5 ${isChamp ? "" : "opacity-35"}`}>
              <ArenaAvatar src={dicebearUrl(p.arenaUser.user.username)} size="sm" glow={isChamp} glowColor="warning" />
              <p className="font-display text-[9px] font-bold text-white/50 text-center max-w-[56px] truncate">
                {p.arenaUser.user.username}
              </p>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}