import { ChevronRight, Download, GitBranch, UserRound } from "lucide-react";
import Link from "next/link";
import { ScientificThumbnail } from "./ScientificThumbnail";

export function FeaturedArticle({ article }) {
  if (!article) return null;

  return (
    <section id="journals" className="bg-paper py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-accent">Featured Paper</p>
            <h2 className="mt-2 text-3xl font-extrabold text-primary dark:text-white">Latest GitHub-published article</h2>
          </div>
          <a href={article.versionUrl} className="hidden items-center gap-2 text-sm font-bold text-primary hover:text-accent dark:text-cyan-100 sm:inline-flex">
            <GitBranch size={17} /> View source
          </a>
        </div>
        <article className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-[0.92fr_1.08fr]">
          <ScientificThumbnail src={article.thumbnail} alt={article.title} />
          <div className="p-7 lg:p-9">
            <span className="rounded-md bg-cyan-50 px-3 py-1.5 text-xs font-extrabold uppercase text-primary dark:bg-cyan-950 dark:text-cyan-100">{article.category}</span>
            <h3 className="mt-5 text-2xl font-extrabold leading-snug text-primary dark:text-white lg:text-3xl">
              {article.title}
            </h3>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <UserRound size={17} /> {article.authors?.join(", ")}
            </p>
            <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">{article.abstract}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={`/articles/${article.slug}`} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-accent">
                Read More <ChevronRight size={18} />
              </Link>
              <a href={article.pdfUrl || article.rawMarkdownUrl} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-5 py-3 text-sm font-bold text-primary transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-white">
                Download PDF <Download size={18} />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
