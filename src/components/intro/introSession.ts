/**
 * Session-scoped "have we already played the first-load intro" flag
 * (spec §5.1: "runs once per session"). `sessionStorage` is exactly the
 * right primitive: it survives client-side navigation away from and back to
 * `/`, but resets on a new tab/session, which is what "once per session"
 * means here.
 *
 * Both helpers are safe to call from anywhere (SSR included) — they no-op to
 * a conservative default (`hasPlayedIntro` -> true, i.e. "skip") when
 * `window`/`sessionStorage` isn't available, so a server call can never
 * accidentally decide to play the intro.
 */
const KEY = "kb-intro-played";

export function hasPlayedIntro(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    // Storage disabled/unavailable (e.g. some private-browsing configs) —
    // safest default is to skip rather than risk playing the intro on every
    // navigation.
    return true;
  }
}

export function markIntroPlayed(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    /* ignore — non-fatal, worst case the intro can replay this session */
  }
}
