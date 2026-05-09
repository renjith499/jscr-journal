import { ArticleCard } from "./ArticleCard";

export function ArticleGrid({ articles }) {
  return (
    <section className="bg-white py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-accent">Repository Articles</p>
            <h2 className="mt-2 text-3xl font-extrabold text-primary dark:text-white">Automatically generated from GitHub Markdown</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </div>
    </section>
  );
}
