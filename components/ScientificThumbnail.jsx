export function ScientificThumbnail({ tone = "from-cyan-50 to-blue-100", compact = false, src = "", alt = "Scientific article thumbnail" }) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-md bg-slate-100 ${compact ? "h-36" : "h-64"}`}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/18 to-transparent" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-md bg-gradient-to-br ${tone} ${compact ? "h-36" : "h-64"}`}>
      <div className="absolute inset-0 scientific-grid opacity-80" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 260" aria-hidden="true">
        <path d="M10 190 C80 120, 110 230, 170 150 S280 86, 404 132" fill="none" stroke="#1E3A5F" strokeWidth="2.5" opacity="0.75" />
        <path d="M24 220 C104 144, 134 236, 196 172 S302 122, 396 168" fill="none" stroke="#00B4D8" strokeWidth="2" opacity="0.8" />
        <g fill="#00B4D8" opacity="0.88">
          <circle cx="82" cy="137" r="5" />
          <circle cx="171" cy="150" r="5" />
          <circle cx="255" cy="109" r="5" />
          <circle cx="340" cy="128" r="5" />
        </g>
        <g stroke="#1E3A5F" strokeWidth="1.2" opacity="0.35">
          <path d="M56 44 L152 72 L102 146 Z" />
          <path d="M152 72 L244 48 L206 142 Z" />
          <path d="M244 48 L344 82 L286 146 Z" />
          <path d="M102 146 L206 142 L168 224 Z" />
          <path d="M206 142 L286 146 L248 224 Z" />
        </g>
      </svg>
    </div>
  );
}
