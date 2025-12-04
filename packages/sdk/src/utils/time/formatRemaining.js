export function formatRemaining(seconds, opts = {}) {
    const { showDays = true, minuteRounding = "ceil", zeroLabel = "0m", } = opts;
    const sec = Number.isFinite(seconds) ? Math.max(0, Number(seconds)) : 0;
    if (sec <= 0)
        return zeroLabel;
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
    const minutes = minuteRounding === "floor"
        ? Math.floor(minutesRaw)
        : minuteRounding === "round"
            ? Math.round(minutesRaw)
            : Math.ceil(minutesRaw); // default: ceil for countdowns
    return `${minutes}m`;
}
export default formatRemaining;
