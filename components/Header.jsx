"use client";

import { BookOpen, Menu, Moon, Search, Sun, X } from "lucide-react";
import Link from "next/link";

export function Header({ darkMode, setDarkMode, open, setOpen }) {
  const items = [
    ["Home", "/"],
    ["Articles", "/#articles"],
    ["Journals", "/#journals"],
    ["Categories", "/#categories"],
    ["Submit Paper", "/submit-paper"],
    ["About", "/#about"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/90">
      <div className="fixed left-0 top-0 h-1 bg-accent" style={{ width: "var(--scroll-progress, 0%)" }} />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-card ring-4 ring-cyan-100 dark:ring-cyan-950">
            <BookOpen size={23} />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-normal text-primary dark:text-white">JSCR</div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Journal of Scientific Computing & Research</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {items.map(([item, href]) => (
            <Link key={item} href={href} className="text-sm font-semibold text-slate-600 transition hover:text-accent dark:text-slate-300">
              {item}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="/#articles" className="rounded-md p-2.5 text-primary transition hover:bg-slate-100 hover:text-accent dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Search">
            <Search size={20} />
          </a>
          <button onClick={() => setDarkMode(!darkMode)} className="rounded-md p-2.5 text-primary transition hover:bg-slate-100 hover:text-accent dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Toggle theme">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link href="/submit-paper" className="rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-accent">
            Submit Manuscript
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-md p-2 text-primary dark:text-white lg:hidden" aria-label="Open menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-950 lg:hidden">
          <div className="grid gap-3">
            {items.map(([item, href]) => (
              <Link key={item} href={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                {item}
              </Link>
            ))}
            <button onClick={() => setDarkMode(!darkMode)} className="flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-700">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />} Theme
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
