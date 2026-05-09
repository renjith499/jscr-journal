import { ArticleGrid } from "@/components/ArticleGrid";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { HeroSection } from "@/components/HeroSection";
import { SearchFilters } from "@/components/SearchFilters";
import { getArticles } from "@/lib/github/articles";
import { fallbackArticles } from "@/lib/sample-data";

export const revalidate = 300;

export default async function HomePage() {
  const result = await getArticles();
  const articles = result.ok && result.articles.length ? result.articles : fallbackArticles;
  const featured = articles[0];

  return (
    <>
      <HeroSection />
      <SearchFilters />
      {!result.ok && (
        <section className="bg-white px-5 py-4 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
            GitHub articles are not configured or could not be loaded. Showing bundled sample articles. Configure `.env.local` with your repository details.
          </div>
        </section>
      )}
      <FeaturedArticle article={featured} />
      <ArticleGrid articles={articles} />
    </>
  );
}
