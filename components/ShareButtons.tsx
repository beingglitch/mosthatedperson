"use client";

import { useState } from "react";
import { clsx } from "clsx";

export function ShareButtons({
  url,
  text,
}: {
  url: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  async function shareNative() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({
          url,
          text,
          title: text,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  }

  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const re = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;

  const linkClass =
    "px-3 py-2 border-2 border-ink bg-paper font-display tracking-wide text-sm hover:bg-ember transition-colors";

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        type="button"
        onClick={shareNative}
        className={clsx(linkClass, "bg-ink text-paper hover:bg-blood hover:text-paper")}
      >
        SHARE ↗
      </button>
      <a className={linkClass} href={tw} target="_blank" rel="noreferrer">
        𝕏
      </a>
      <a className={linkClass} href={wa} target="_blank" rel="noreferrer">
        WHATSAPP
      </a>
      <a className={linkClass} href={tg} target="_blank" rel="noreferrer">
        TELEGRAM
      </a>
      <a className={linkClass} href={fb} target="_blank" rel="noreferrer">
        FB
      </a>
      <a className={linkClass} href={re} target="_blank" rel="noreferrer">
        REDDIT
      </a>
      <button type="button" onClick={copy} className={linkClass}>
        {copied ? "COPIED ✓" : "COPY LINK"}
      </button>
    </div>
  );
}
