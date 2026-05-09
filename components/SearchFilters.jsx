import { Filter, Search } from "lucide-react";

const categories = ["FEA", "CFD", "Composite Materials", "Robotics", "Renewable Energy", "Mathematics", "AI in Engineering"];

export function SearchFilters() {
  return (
    <section id="articles" className="border-y border-slate-200 bg-white py-10 dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input className="h-14 w-full rounded-md border border-slate-200 bg-paper pl-12 pr-4 text-base font-medium outline-none transition focus:border-accent focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-cyan-950" placeholder="Search articles, authors, DOI, journal, or keywords" />
          </div>
          <button className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-bold text-white transition hover:bg-accent">
            <Filter size={18} /> Advanced Search
          </button>
        </div>

        <div id="categories" className="mt-6 flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <button key={category} className="rounded-md border border-cyan-200 bg-cyan-50 px-3.5 py-2 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:border-accent hover:bg-white hover:text-accent dark:border-cyan-900 dark:bg-slate-950 dark:text-cyan-100">
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {["Year", "Author", "Journal", "Open Access", "Peer Reviewed"].map((filter) => (
            <label key={filter} className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {filter}
              <select className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-500 outline-none focus:border-accent dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                <option>Any {filter}</option>
                <option>Selected</option>
              </select>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
