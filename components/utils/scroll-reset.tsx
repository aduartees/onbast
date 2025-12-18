"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll to top on every route change
    window.scrollTo(0, 0);
    
    // Also try to scroll main content containers if they exist
    // This handles cases where body overflow might be hidden or specific divs scroll
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [pathname]);

  return null;
}
