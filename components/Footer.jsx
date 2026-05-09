export function Footer() {
  const groups = {
    "About the platform": ["GitHub CMS", "Editorial board", "Indexing", "Open access"],
    "Article categories": ["FEA", "CFD", "Robotics", "Renewable energy"],
    "Submission guidelines": ["Markdown frontmatter", "Peer review", "Ethics", "Templates"],
    Contact: ["support@engischolar.org", "Institutional access", "Partnerships", "Help center"],
  };

  return (
    <footer id="about" className="bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {Object.entries(groups).map(([title, links]) => (
          <div key={title}>
            <h3 className="font-extrabold">{title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-blue-100">
              {links.map((link) => <li key={link}><a href="/#home" className="transition hover:text-accent">{link}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-sm text-blue-100">
        Copyright 2026 EngiScholar Research Platform. All rights reserved.
      </div>
    </footer>
  );
}
