"use client";

import { useEffect, useState } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteShell({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="min-h-screen bg-paper font-sans text-ink dark:bg-slate-950 dark:text-slate-100">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} open={open} setOpen={setOpen} />
      {children}
      <Footer />
    </div>
  );
}
