/**
 * Run a callback once the browser is idle, and return a function that
 * cancels it. Safari has no requestIdleCallback, so it gets a short timeout.
 */
export function whenIdle(
  callback: () => void,
  timeout: number,
  fallbackDelay = 200,
) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(() => callback(), { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(callback, fallbackDelay);
  return () => clearTimeout(id);
}
