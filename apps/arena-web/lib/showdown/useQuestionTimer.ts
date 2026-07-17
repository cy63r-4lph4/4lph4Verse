"use client";

import { useEffect, useState } from "react";
import type { MatchQuestion } from "./types";

export function useQuestionTimer(mq: MatchQuestion | null) {
  const [, tick] = useState(0);

  useEffect(() => {
    if (!mq?.startedAt || !mq?.endsAt) return;
    const id = setInterval(() => tick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, [mq?.id, mq?.startedAt, mq?.endsAt]);

  if (!mq?.startedAt || !mq?.endsAt) {
    return { isCountingDown: false, countdownSeconds: 0, secondsLeft: 0, pct: 0 };
  }

  const startedAt = new Date(mq.startedAt).getTime();
  const endsAt = new Date(mq.endsAt).getTime();
  const now = Date.now();

  const isCountingDown = now < startedAt;
  const countdownSeconds = Math.max(1, Math.ceil((startedAt - now) / 1000));

  const timeLimitMs = endsAt - startedAt;
  const msLeft = isCountingDown ? timeLimitMs : Math.max(0, endsAt - now);
  const pct = timeLimitMs > 0 ? (msLeft / timeLimitMs) * 100 : 0;

  return {
    isCountingDown,
    countdownSeconds,
    secondsLeft: Math.ceil(msLeft / 1000),
    pct,
  };
}