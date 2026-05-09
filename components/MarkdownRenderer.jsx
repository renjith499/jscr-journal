import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import GithubSlugger from "github-slugger";
import { githubRawUrl, getGithubConfig } from "@/lib/github/config";

function createHeadingRenderer(level) {
  return function Heading({ children }) {
    const text = children?.flat?.().join?.("") || String(children || "");
    const slugger = new GithubSlugger();
    const id = slugger.slug(text);
    const Tag = `h${level}`;
    return <Tag id={id}>{children}</Tag>;
  };
}

function resolveImage(src) {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  if (src.startsWith("/images/")) return src;
  const config = getGithubConfig();
  return githubRawUrl(src, config);
}

export function MarkdownRenderer({ content }) {
  return (
    <div className="article-body font-serif text-[1.02rem]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          h1: createHeadingRenderer(1),
          h2: createHeadingRenderer(2),
          h3: createHeadingRenderer(3),
          img: ({ src, alt }) => <img src={resolveImage(src)} alt={alt || "Article figure"} />,
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noreferrer" : undefined}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
