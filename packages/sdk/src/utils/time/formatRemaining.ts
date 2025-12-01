/**
 * 4lph4verse — formatRemaining
 * Formats a remaining time in seconds into a compact human string.
 *
 * Rules (defaults):
 * - ≥ 1 day: "Xd Yh"
 * - ≥ 1 hour: "Xh Ym" (omit minutes when 0 → "Xh")
 * - < 1 hour: "Xm" (minutes are rounded up so 10s → "1m")
 * - ≤ 0: "0m"
 *
 * Examples:
 *   formatRemaining(0)         -> "0m"
 *   formatRemaining(59)        -> "1m"
 *   formatRemaining(60)        -> "1m"
 *   formatRemaining(65)        -> "2m"
 *   formatRemaining(3600)      -> "1h"
 *   formatRemaining(3661)      -> "1h 1m"
 *   formatRemaining(93600)     -> "1d 2h"
 */
export type FormatRemainingOptions = {
  /** Include days in the output when >= 1 day (default: true) */
  showDays?: boolean;
  /**
   * How to round minutes when under 1 hour (default: 'ceil').
   *  - 'ceil'  : 10s -> 1m
   *  - 'floor' : 59s -> 0m  (usually not desired for countdowns)
   *  - 'round' : 30s -> 1m
   */
  minuteRounding?: "ceil" | "floor" | "round";
  /** Label to use at or below zero (default: '0m') */
  zeroLabel?: string;
};

export function formatRemaining(
  seconds: number | null | undefined,
  opts: FormatRemainingOptions = {}
): string {
  const {
    showDays = true,
    minuteRounding = "ceil",
    zeroLabel = "0m",
  } = opts;

  const sec = Number.isFinite(seconds as number) ? Math.max(0, Number(seconds)) : 0;
  if (sec <= 0) return zeroLabel;

  const DAY = 86400;
  const HOUR = 3600;
  const MIN = 60;

  if (showDays && sec >= DAY) {
    const days = Math.floor(sec / DAY);
    const hours = Math.floor((sec % DAY) / HOUR);
    return `${days}d ${hours}h`;
  }

  if (sec >= HOUR) {
    const hours = Math.floor(sec / HOUR);
    const mins = Math.floor((sec % HOUR) / MIN);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  const minutesRaw = sec / MIN;
  const minutes =
    minuteRounding === "floor"
      ? Math.floor(minutesRaw)
      : minuteRounding === "round"
      ? Math.round(minutesRaw)
      : Math.ceil(minutesRaw); // default: ceil for countdowns

  return `${minutes}m`;
}

export default formatRemaining;
