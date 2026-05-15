import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="font-display tracking-tightest leading-[0.85] text-[clamp(48px,12vw,140px)]">
          PAGE NOT FOUND
        </h1>
        <p className="mt-4 max-w-xl text-mute">
          We couldn't find what you're looking for. Try the leaderboard.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 bg-ink text-paper font-display tracking-wide px-4 py-3 hover:bg-blood transition-colors"
        >
          ← BACK TO THE LEADERBOARD
        </Link>
      </main>
      <Footer />
    </>
  );
}
