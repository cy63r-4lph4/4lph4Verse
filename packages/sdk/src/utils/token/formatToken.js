/**
 * Format a token amount into a human-readable string.
 *
 * @param amount - Raw token amount (bigint | string | number).
 * @param decimals - Token decimals (default: 18).
 * @param precision - Number of decimals to keep in the output (default: 4).
 */
export function formatToken(amount, decimals = 18, precision = 4) {
    // Convert input to bigint
    const raw = typeof amount === "bigint" ? amount : BigInt(amount.toString());
    // Divide by decimals
    const divisor = BigInt(10) ** BigInt(decimals);
    const whole = raw / divisor;
    const fraction = raw % divisor;
    // Keep precision digits
    const fractionStr = fraction
        .toString()
        .padStart(decimals, "0")
        .slice(0, precision);
    return `${whole.toString()}.${fractionStr}`;
}
