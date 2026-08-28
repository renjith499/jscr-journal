import Link from "next/link";
import { ArrowRight, Gamepad2, GraduationCap, Sparkles } from "lucide-react";

export const metadata = {
  title: "Learning & Outreach | JSCR",
  description:
    "Interactive lessons and games that make computing and engineering concepts approachable for students and the wider public.",
};

const items = [
  {
    title: "Mahi's Vault",
    href: "/learn/mahis-vault",
    text: "A ten-stage cinematic platformer for young learners: solve arithmetic gates, time temple traps, and collect Data Cores that teach the history and generations of computers. Runs entirely in the browser.",
    Icon: Gamepad2,
    tag: "Game",
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-[75vh] bg-paper px-5 py-16 dark:bg-slate-950 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100">
            <GraduationCap size={34} />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-accent">
              JSCR Research Platform
            </p>
            <h1 className="mt-1 text-4xl font-extrabold text-primary dark:text-white sm:text-5xl">
              Learning &amp; Outreach
            </h1>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Hands-on lessons, games and explainers that make computing and
          engineering ideas approachable for students and the wider public.
          Everything here runs in your browser.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map(({ title, href, text, Icon, tag }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-xl border border-slate-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:border-accent dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100">
                  <Icon size={27} />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold tracking-wider text-slate-500 dark:bg-slate-800">
                  {tag.toUpperCase()}
                </span>
              </div>
              <h2 className="mt-7 text-2xl font-extrabold text-primary dark:text-white">
                {title}
              </h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                {text}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-extrabold text-accent">
                Open{" "}
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Sparkles className="text-accent" />
          <span>
            Progress and anything you type stay in your browser&apos;s local
            storage &mdash; nothing is uploaded.
          </span>
        </div>
      </div>
    </main>
  );
}
