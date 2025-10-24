export function useRelayer() {
  const RELAYER_API = process.env.NEXT_PUBLIC_RELAYER_URL;

  return {
    isEnabled: !!RELAYER_API,
    async buildMetaTx({ from, to, data, chainId }: any) {
      return { from, to, data, chainId, timestamp: Date.now() };
    },
    async sendMetaTx(metaTx: any) {
      try {
        const res = await fetch(`${RELAYER_API}/relay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metaTx),
        });
        const json = await res.json();
        return { success: true, txHash: json.txHash };
      } catch (err) {
        console.error("Relayer failed:", err);
        return { success: false };
      }
    },
  };
}
