/**
 * Format a token balance into a short human-readable string.
 *
 * Examples:
 *  - 1234 → "1.23k"
 *  - 5678900 → "5.68M"
 *  - 1230000000 → "1.23B"
 *
 * @param amount - Raw token amount (bigint | string | number).
 * @param decimals - Token decimals (default: 18).
 * @param precision - Decimal places to show (default: 2).
 */
export function formatBalance(amount, decimals = 18, precision = 2) {
    const raw = typeof amount === "bigint" ? amount : BigInt(amount.toString());
    const divisor = BigInt(10) ** BigInt(decimals);
    const value = Number(raw) / Number(divisor); // Convert to JS number for formatting
    if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(precision)}B`;
    }
    else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(precision)}M`;
    }
    else if (value >= 1000) {
        return `${(value / 1000).toFixed(precision)}k`;
    }
    else {
        return value.toFixed(precision);
    }
}
