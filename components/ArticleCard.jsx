import { CalendarDays, FileDown, Quote } from "lucide-react";
import Link from "next/link";
import { ScientificThumbnail } from "./ScientificThumbnail";

export function ArticleCard({ article }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <ScientificThumbnail src={article.thumbnail} alt={article.title} compact />
      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-extrabold uppercase text-primary dark:bg-cyan-950 dark:text-cyan-100">{article.category}</span>
        <h3 className="mt-4 text-lg font-extrabold leading-snug text-primary transition group-hover:text-accent dark:text-white">{article.title}</h3>
        <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">{article.authors?.join(", ")}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><CalendarDays size={15} /> {article.date}</p>
        <p className="mt-4 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">{article.abstract}</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Link href={`/articles/${article.slug}`} className="rounded-md bg-primary px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-accent">Read Article</Link>
          <a href={article.pdfUrl || article.rawMarkdownUrl} className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-primary transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-white">
            <FileDown size={14} /> PDF
          </a>
          <Link href={`/articles/${article.slug}#citation`} className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-primary transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-white">
            <Quote size={14} /> Cite
          </Link>
        </div>
      </div>
    </article>
  );
}
