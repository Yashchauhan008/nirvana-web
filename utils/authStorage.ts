const KEYS = {
  user: "user",
  token: "token",
  tokenExpiresAt: "token_expires_at",
  /** JWT from PUT /cart/:id — guest cart identity (never overwrite customer auth token). */
  guestCartToken: "guest_cart_token",
} as const;

/** Customer JWT only — requires persisted profile + optional expiry window. */
export function getStoredCustomerAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const userJson = localStorage.getItem(KEYS.user);
    if (!userJson) return null;

    const expRaw = localStorage.getItem(KEYS.tokenExpiresAt);
    if (expRaw) {
      const ms = Date.parse(expRaw);
      if (!Number.isNaN(ms) && Date.now() >= ms) {
        clearStoredAuth();
        return null;
      }
    }
    const token = localStorage.getItem(KEYS.token);
    if (!token) {
      clearStoredAuth();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function getStoredUserJson(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(KEYS.user);
  } catch {
    return null;
  }
}

export function setStoredAuth(
  userJson: string,
  token: string,
  expiresAtIso: string,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.user, userJson);
  localStorage.setItem(KEYS.token, token);
  localStorage.setItem(KEYS.tokenExpiresAt, expiresAtIso);
}

/** Persist guest cart JWT without touching customer auth keys. */
export function setGuestCartToken(jwt: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.guestCartToken, jwt);
}

export function getGuestCartToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(KEYS.guestCartToken);
  } catch {
    return null;
  }
}

export function clearGuestCartToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.guestCartToken);
}

/**
 * Before guest_cart_token existed, guest JWT lived in `token` without `user`.
 * Move once so login merge + cart HTTP never confuse guest vs customer Bearer.
 */
export function migrateLegacyGuestTokenFromTokenSlot(): void {
  if (typeof window === "undefined") return;
  try {
    const token = localStorage.getItem(KEYS.token);
    const user = localStorage.getItem(KEYS.user);
    const existingGuest = localStorage.getItem(KEYS.guestCartToken);
    if (token && !user && !existingGuest) {
      localStorage.setItem(KEYS.guestCartToken, token);
      localStorage.removeItem(KEYS.token);
      localStorage.removeItem(KEYS.tokenExpiresAt);
    }
  } catch {
    /* ignore */
  }
}

/** Legacy guest JWT still stored only under `token` with no user row. */
export function getLegacyGuestTokenFromSharedSlot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(KEYS.token);
    const user = localStorage.getItem(KEYS.user);
    if (!token || user) return null;
    return token;
  } catch {
    return null;
  }
}

export function setStoredUserJson(userJson: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.user, userJson);
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.user);
  localStorage.removeItem(KEYS.token);
  localStorage.removeItem(KEYS.tokenExpiresAt);
  localStorage.removeItem(KEYS.guestCartToken);
}

export function resolveAuthorizationBearer(cfg: {
  method?: string;
  url?: string;
  baseURL?: string;
}): string | null {
  const urlPath = `${cfg.baseURL ?? ""}${cfg.url ?? ""}`;
  const isCustomerLoginPost =
    cfg.method?.toLowerCase() === "post" &&
    urlPath.includes("/customers/login");

  const guestDedicated = getGuestCartToken();
  const legacyGuest = getLegacyGuestTokenFromSharedSlot();
  const guestForMerge = guestDedicated ?? legacyGuest;

  if (isCustomerLoginPost && guestForMerge) {
    return guestForMerge;
  }

  const customer = getStoredCustomerAuthToken();
  if (customer) return customer;

  return guestDedicated ?? legacyGuest;
}
