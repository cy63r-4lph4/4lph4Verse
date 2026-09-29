// src/inpage.ts

// EIP-1193 Provider Implementation
class VerseProvider {
  private requestId = 0;
  private callbacks = new Map<number, { resolve: Function, reject: Function }>();

  constructor() {
    // Listen for responses from the content script
    window.addEventListener("message", (event) => {
      if (event.source !== window) return;
      
      const data = event.data;
      if (data && data.target === "verse-inpage") {
        const { id, response } = data;
        const callback = this.callbacks.get(id);
        if (callback) {
          if (response && response.error) {
            callback.reject(new Error(response.error));
          } else {
            callback.resolve(response?.result);
          }
          this.callbacks.delete(id);
        }
      }
    });
  }

  async request({ method, params }: { method: string, params?: any[] }): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      this.callbacks.set(id, { resolve, reject });

      // Send to content script
      window.postMessage({
        target: "verse-contentscript",
        id: id,
        message: { method, params }
      }, window.origin);
    });
  }
}

const provider = new VerseProvider();
(window as any).verse = provider;
// Conditionally inject as window.ethereum to support standard dApps, 
// if advanced mode / explicit override is desired.
if (!(window as any).ethereum) {
  (window as any).ethereum = provider;
}
