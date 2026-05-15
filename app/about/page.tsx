import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — how voting works on Most Hated",
  description:
    "How the Most Hated leaderboard works, who we list, how voting works, and how to request a correction or takedown.",
};

const FAQ = [
  {
    q: "What is Most Hated?",
    a: "Most Hated is a curated, real-time leaderboard ranking the world's most-disliked public figures across politics, tech, business, entertainment and sport. Visitors cast one reaction per person — angry, clown, disgust, cringe, or overrated — and the leaderboard updates live.",
  },
  {
    q: "Who is on the list?",
    a: "Only public figures with documented public criticism — heads of state, billionaire CEOs, household-name celebrities and influencers. We do not list private individuals. The list is curated; users cannot add names.",
  },
  {
    q: "How does voting work?",
    a: "Pick one of five reactions on any figure. Each reaction counts as +1 hate. You can only react once per figure, ever, from a given device. Identity is a hashed cookie + IP pair — anonymous, not tied to any account.",
  },
  {
    q: "Can I change or remove my reaction?",
    a: "No. Reactions are permanent so totals can't be gamed by toggling.",
  },
  {
    q: "What if someone is wrongly listed?",
    a: "Email hello@mosthated.example. We respond to genuine takedown and correction requests promptly.",
  },
  {
    q: "How is the leaderboard ranked?",
    a: "By total hate count for the selected time window — Today (24h), This Week (7d), or All Time. Ties break alphabetically.",
  },
];

export default function AboutPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
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

        <section id="faq" className="mt-14">
          <h2 className="font-display tracking-tightest text-3xl sm:text-4xl">
            FREQUENTLY ASKED
          </h2>
          <ul className="mt-5 space-y-5">
            {FAQ.map((item, i) => (
              <li key={i} className="border-l-2 border-ink pl-4">
                <h3 className="font-display tracking-tightest text-xl sm:text-2xl">
                  {item.q}
                </h3>
                <p className="mt-1 text-base text-mute leading-relaxed">{item.a}</p>
              </li>
            ))}
          </ul>
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
