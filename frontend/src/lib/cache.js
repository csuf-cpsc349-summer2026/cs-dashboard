// Module-scoped, in-memory only — survives component unmount/remount across
// navigation within a session, but naturally resets on full page reload.
const cache = new Map();

export function getCached(key) {
  return cache.get(key);
}

export function setCached(key, value) {
  cache.set(key, value);
}
