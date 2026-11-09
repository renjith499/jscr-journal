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
    return { title: "Article not found", robots: { index: false, follow: false } };
  }

  const canonical = `https://www.jscr.in/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.abstract,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description: article.abstract,
      publishedTime: article.date,
      modifiedTime: article.lastUpdated || article.date,
      authors: article.authors,
      tags: article.keywords,
      images: [{ url: article.thumbnail || "/opengraph-image", alt: article.title }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.abstract, images: [article.thumbnail || "/twitter-image"] },
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
