"use client";

import { useEffect, useState } from "react";

export function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id || "");

  useEffect(() => {
    if (!headings.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -65% 0px", threshold: [0, 1] }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-accent">Contents</h3>
      <ol className="mt-4 space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-4" : ""}>
            <a href={`#${heading.id}`} className={`block rounded-md px-2 py-1.5 text-sm font-semibold transition ${activeId === heading.id ? "bg-cyan-50 text-accent dark:bg-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-950"}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
