"use client";

import { inject } from "@vercel/analytics";

export function VercelAnalytics() {
  // Inject Vercel Web Analytics
  // This must run on the client side
  inject();
  
  return null;
}
