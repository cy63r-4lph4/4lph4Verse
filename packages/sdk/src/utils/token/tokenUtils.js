import { formatToken } from "./formatToken";
import { formatBalance } from "./formatBalance";
import { parseToken } from "./parseToken";
export const TokenUtils = {
    format: formatToken,
    compact: formatBalance,
    parse: parseToken,
};
