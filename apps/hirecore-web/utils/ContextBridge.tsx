// A single tiny in-memory bridge.
// It only lives for the duration of navigation (client-side only).
let context: "worker" | "client" | undefined = undefined;

export function setContext(c?: "worker" | "client") {
  context = c;
}

export function consumeContext() {
  const c = context;
  context = undefined; 
  return c;
}
