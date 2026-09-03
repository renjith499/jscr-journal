import { Brain, Calculator, ExternalLink, Footprints } from "lucide-react";

export const metadata = {
  title: "Mahi's Vault | JSCR",
  description:
    "A cinematic maths-and-computer-history platformer for young learners. Solve arithmetic gates, time temple traps, and collect Data Cores that teach the evolution and generations of computers.",
};

export default function MahisVaultPage() {
  return (
    <main className="bg-paper dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Learning &amp; Outreach</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-primary dark:text-white sm:text-5xl">
              Mahi&apos;s Vault
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              An original HTML5 platformer built for young learners. Guide Mahi through ten temple
              routes: run, jump and climb past spike traps, slamming blades and erupting volcanoes;
              answer addition, subtraction, multiplication, division and mixed-operation gates; and
              touch the glowing Data Cores to learn how computers evolved &mdash; from the abacus and
              Napier&apos;s Bones to ENIAC, UNIVAC and the generations of modern machines. Progress,
              a quick-save (Ctrl+S) and the facts you learn are stored only in your browser.
            </p>
            <a
              href="/games/mahis-vault/index.html"
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-accent"
            >
              Open full screen <ExternalLink size={16} />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:pt-8">
            {[
              ["Platforming", "Run, jump, climb ladders and time traps across ten temple routes.", Footprints],
              ["Mental maths", "Warm-up, growing and challenge gates for every operation, capped by grade level.", Calculator],
              ["Computer history", "Data Cores quiz the “Evolution of Computers” chapter as you explore.", Brain],
            ].map(([title, text, Icon]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100">
                  <Icon size={22} />
                </div>
                <h2 className="text-base font-extrabold text-primary dark:text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
            <iframe
              src="/games/mahis-vault/index.html"
              title="Mahi's Vault — an educational platformer"
              className="block h-[85vh] min-h-[560px] w-full border-0"
              allow="fullscreen; gamepad"
              loading="lazy"
            />
          </div>
          <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            Keyboard: arrows / WASD to move, Space to jump, hold Up on stairs and ladders. Best played full screen.
          </p>
        </div>
      </section>
    </main>
  );
}
