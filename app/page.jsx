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
      <FeaturedArticle article={featured} />
      <ArticleGrid articles={articles} />
    </>
  );
}
