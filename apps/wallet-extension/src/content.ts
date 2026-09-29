// src/content.ts

// Inject the inpage script into the DOM
const script = document.createElement("script");
script.src = chrome.runtime.getURL("assets/inpage.js");
script.onload = () => {
  script.remove(); // Clean up after injection
};
(document.head || document.documentElement).appendChild(script);

// Listen for messages from the injected script and forward them to the background script
window.addEventListener("message", (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;

  const data = event.data;
  if (data && data.target === "verse-contentscript") {
    // Forward to background script
    chrome.runtime.sendMessage(data.message, (response) => {
      // Send response back to the injected script
      window.postMessage({
        target: "verse-inpage",
        id: data.id,
        response: response
      }, window.origin);
    });
  }
});
