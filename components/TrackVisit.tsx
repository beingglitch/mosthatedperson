"use client";

import { useEffect } from "react";

export function TrackVisit() {
  useEffect(() => {
    // Fire-and-forget. Only the first visit per cookie inserts a row.
    fetch("/api/track", {
      method: "POST",
      credentials: "include",
      keepalive: true,
    }).catch(() => {});
  }, []);
  return null;
}
