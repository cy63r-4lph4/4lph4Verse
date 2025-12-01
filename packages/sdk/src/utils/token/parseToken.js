/**
 * Parse a human-readable token amount into raw bigint (on-chain format).
 *
 * Examples:
 *  - "1.5" with 18 decimals → 1500000000000000000n
 *  - "1000" with 6 decimals → 1000000000n
 *
 * @param value - Human input (string | number).
 * @param decimals - Token decimals (default: 18).
 */
export function parseToken(value, decimals = 18) {
    const strValue = value.toString();
    // Split into whole + fractional parts
    const [wholeStr, fractionStr = ""] = strValue.split(".");
    const whole = BigInt(wholeStr || "0");
    const fraction = fractionStr.padEnd(decimals, "0").slice(0, decimals);
    const base = BigInt(10) ** BigInt(decimals);
    return whole * base + BigInt(fraction || "0");
}
