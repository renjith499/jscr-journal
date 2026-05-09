import { ArticleCard } from "./ArticleCard";

export function ArticleGrid({ articles }) {
  return (
    <section className="bg-white py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </div>
    </section>
  );
}
