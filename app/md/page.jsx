import { MarkdownBuilder } from "@/components/MarkdownBuilder";

export const metadata = {
  title: "Markdown Builder | JSCR",
  description: "Create upload-ready JSCR article markdown files.",
};

export default function MarkdownBuilderPage() {
  return (
    <main className="bg-paper px-5 py-12 dark:bg-slate-950 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">JSCR Editor Tool</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-primary dark:text-white sm:text-5xl">
            Markdown article generator
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Fill in the article details, copy or download the generated markdown file, then upload it to the GitHub repository under the articles folder.
          </p>
        </section>
        <MarkdownBuilder />
      </div>
    </main>
  );
}
