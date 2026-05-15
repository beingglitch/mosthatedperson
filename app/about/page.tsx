import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — how voting works",
  description:
    "How the Most Hated leaderboard works, what we list, and how to request a correction or takedown.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="font-display tracking-tightest leading-[0.9] text-[clamp(40px,9vw,96px)]">
          ABOUT
        </h1>

        <section className="mt-8 space-y-4 text-base sm:text-lg leading-relaxed">
          <p>
            <strong>Most Hated</strong> is a people's leaderboard of public figures.
            Pick a reaction. Each reaction counts as a hate. We tally and rank.
          </p>
          <p>
            The list is <strong>curated</strong>. Users can't add names. We only list
            public figures with documented public criticism — politicians, executives,
            athletes, entertainers. No private individuals.
          </p>
        </section>

        <section id="how" className="mt-12">
          <h2 className="font-display tracking-tightest text-3xl sm:text-4xl">
            HOW VOTING WORKS
          </h2>
          <ul className="mt-4 space-y-3 text-base sm:text-lg list-disc pl-5">
            <li>
              <strong>Five reactions:</strong> 😡 angry, 🤡 clown, 🤮 disgust, 💀
              cringe, 🥱 overrated. All count as +1 hate, but we track which one
              dominates.
            </li>
            <li>
              <strong>One reaction per person per visitor</strong>, permanent. You
              can't switch and you can't double-vote. Identity is a hashed cookie + IP
              pair — anonymous, not tied to any account.
            </li>
            <li>
              <strong>Rate-limited</strong> to keep bots out.
            </li>
            <li>
              <strong>No comments or free text.</strong> Just pick an emoji.
            </li>
          </ul>
        </section>

        <section id="takedown" className="mt-12">
          <h2 className="font-display tracking-tightest text-3xl sm:text-4xl">
            CORRECTIONS / TAKEDOWN
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed">
            If you're listed and believe the listing is inaccurate, defamatory, or
            otherwise should be removed, email{" "}
            <a className="linkish" href="mailto:hello@mosthated.example">
              hello@mosthated.example
            </a>
            . We respond to genuine takedown requests promptly.
          </p>
        </section>

        <section className="mt-12 border-2 border-ink p-4 sm:p-5 bg-paper">
          <div className="font-display tracking-tightest text-2xl">THE LIMITS</div>
          <p className="mt-2 text-mute text-sm">
            This is satire-adjacent commentary on public figures who are widely and
            publicly criticized. Not an invitation to harass anyone. We do not
            tolerate doxxing, threats, or organized harassment. Hosts and registrars
            should consider this section before action.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
