/** Session TTL — 6 hours (AD-9). */
export const SESSION_TTL_MS = 6 * 60 * 60 * 1000;

/** Client séjour cookie — distinct from future Auth.js staff cookies. */
export const SESSION_COOKIE_NAME = "mt_session";

export const SESSION_COOKIE_MAX_AGE_SEC = Math.floor(SESSION_TTL_MS / 1000);
