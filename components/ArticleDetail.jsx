import { CalendarDays, Download, Share2, UserRound } from "lucide-react";
import { CitationBox } from "./CitationBox";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ScientificThumbnail } from "./ScientificThumbnail";
import { TableOfContents } from "./TableOfContents";

function formatDate(value) {
  if (!value) return "Not specified";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

export function ArticleDetail({ article, sourceStatus }) {
  const metricsSeed = Math.max(article.title.length, 10);

  return (
    <main className="bg-paper py-12 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900 lg:p-9">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-md bg-cyan-50 px-3 py-1.5 text-xs font-extrabold uppercase text-primary dark:bg-cyan-950 dark:text-cyan-100">{article.category}</span>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-primary dark:text-white lg:text-5xl">{article.title}</h1>
          <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <p className="flex items-center gap-2"><UserRound size={17} className="text-accent" /> {article.authors?.join(", ")}</p>
            <p>DOI: {article.doi || "Not assigned"}</p>
            <p className="flex items-center gap-2"><CalendarDays size={17} className="text-accent" /> Published: {formatDate(article.date)}</p>
            <p>Last updated: {formatDate(article.lastUpdated)}</p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {article.pdfUrl && (
              <a href={article.pdfUrl} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent"><Download size={17} /> Download PDF</a>
            )}
            <a href="#citation" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm font-bold text-primary transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-white">Cite</a>
            <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm font-bold text-primary transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-white"><Share2 size={17} /> Share</button>
          </div>

          <div className="mt-8 rounded-md border-l-4 border-accent bg-cyan-50 p-5 dark:bg-slate-950">
            <h2 className="font-extrabold text-primary dark:text-white">Abstract</h2>
            <p className="mt-3 leading-8 text-slate-700 dark:text-slate-300">{article.abstract}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {article.keywords?.map((keyword) => (
              <span key={keyword} className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{keyword}</span>
            ))}
          </div>

          <figure className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
            <ScientificThumbnail src={article.thumbnail} alt={article.title} />
            <figcaption className="border-t border-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Featured figure or article thumbnail.
            </figcaption>
          </figure>

          <div className="mt-8">
            <MarkdownRenderer content={article.content} />
          </div>

          <CitationBox article={article} />
        </article>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-extrabold text-primary dark:text-white">Article Metrics</h3>
            <div className="mt-5 grid gap-3">
              {[["Views", metricsSeed * 421], ["Downloads", metricsSeed * 87], ["Citations", Math.floor(metricsSeed * 2.4)], ["Repository SHA", article.commitSha?.slice(0, 7) || "sample"]].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{label}</span>
                  <span className="font-extrabold text-primary dark:text-white">{value}</span>
                </div>
              ))}
            </div>
            <h4 className="mt-7 font-extrabold text-primary dark:text-white">Author Profiles</h4>
            <div className="mt-4 space-y-2">
              {article.authors?.map((author) => (
                <div key={author} className="rounded-md border border-slate-200 p-3 text-sm font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  {author}
                </div>
              ))}
            </div>
          </div>
          <TableOfContents headings={article.headings} />
        </aside>
      </div>
    </main>
  );
}
