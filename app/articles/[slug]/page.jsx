import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/ArticleDetail";
import { getArticleBySlug, getArticles } from "@/lib/github/articles";
import { fallbackArticles } from "@/lib/sample-data";

export const revalidate = 300;

export async function generateStaticParams() {
  const result = await getArticles();
  const articles = result.ok ? result.articles : fallbackArticles;
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);
  const article = result.ok ? result.article : fallbackArticles.find((item) => item.slug === slug);

  if (!article) {
    return { title: "Article not found | JSCR" };
  }

  return {
    title: `${article.title} | JSCR`,
    description: article.abstract,
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);
  const article = result.ok ? result.article : fallbackArticles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetail article={article} sourceStatus={result.ok ? "github" : "sample"} />;
}
