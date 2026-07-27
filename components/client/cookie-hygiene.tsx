"use client";

import { useEffect } from "react";
import { cleanupStaleClientCookiesAction } from "@/domain/session/cleanup-cookies";

/** Nettoie les cookies fantômes après hydratation (Chrome, anciennes sessions). */
export function CookieHygiene() {
  useEffect(() => {
    void cleanupStaleClientCookiesAction();
  }, []);

  return null;
}
