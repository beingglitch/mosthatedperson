import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid sm:grid-cols-3 gap-4 text-sm">
        <div>
          <div className="font-display text-2xl leading-none tracking-tightest">
            MOST<span className="text-blood">·</span>HATED
          </div>
          <p className="mt-2 text-mute max-w-xs">
            A curated leaderboard of public figures. One reaction per visitor per person.
            No comments. No doxxing. Just receipts.
          </p>
        </div>
        <div>
          <div className="font-display tracking-wide text-sm uppercase mb-2">
            About
          </div>
          <ul className="space-y-1 text-mute">
            <li>
              <Link href="/about" className="linkish">
                What is this?
              </Link>
            </li>
            <li>
              <Link href="/about#how" className="linkish">
                How voting works
              </Link>
            </li>
            <li>
              <Link href="/about#takedown" className="linkish">
                Takedown / corrections
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-display tracking-wide text-sm uppercase mb-2">
            The fine print
          </div>
          <p className="text-mute">
            All listed individuals are public figures with documented public criticism.
            Voting is anonymous, rate-limited, and one reaction per person per visitor.
          </p>
        </div>
      </div>
      <div className="border-t border-line/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 text-xs text-mute flex justify-between">
          <span>© {new Date().getFullYear()} Most Hated</span>
          <span>Built for the meme, not for the harm.</span>
        </div>
      </div>
    </footer>
  );
}
