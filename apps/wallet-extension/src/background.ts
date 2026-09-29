/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener(() => {
  console.log("Verse Wallet Extension installed");
});

// Store pending requests to resolve when popup approves
const pendingRequests = new Map<string, (response: any) => void>();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Verse background received message:", request, sender);

  const { method, params } = request;

  if (method === "eth_accounts" || method === "eth_requestAccounts") {
    chrome.storage.local.get(["verse_wallet_address"], (res) => {
      if (res.verse_wallet_address) {
        sendResponse({ result: [res.verse_wallet_address] });
      } else {
        // If eth_requestAccounts, we should theoretically open a prompt to connect.
        // For now, if no address, just return empty array
        sendResponse({ result: [] });
      }
    });
    return true; // async
  }

  if (method === "eth_chainId") {
    sendResponse({ result: "0xa4ec" }); // Celo mainnet mock, or base
    return;
  }

  if (method === "personal_sign" || method === "eth_sendTransaction") {
    // Open a popup window for approval
    const requestId = Date.now().toString();
    pendingRequests.set(requestId, sendResponse);

    chrome.windows.create({
      url: `popup.html?request=${requestId}&method=${method}`,
      type: "popup",
      width: 360,
      height: 600,
      focused: true
    });

    return true; // async response
  }

  // Fallback for unsupported methods
  sendResponse({ error: "Method not supported" });
});

