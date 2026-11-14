const buildPages = (page, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const keep = [...new Set([1, total, page - 1, page, page + 1])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const items = []
  keep.forEach((n, i) => {
    if (i > 0 && n - keep[i - 1] > 1) items.push(`gap-${n}`)
    items.push(n)
  })
  return items
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className="pagination" aria-label="Navigasi halaman">
      <button className="page-btn page-nav" onClick={() => onChange(page - 1)} disabled={page === 1}>Prev</button>
      {buildPages(page, totalPages).map((item) => typeof item === 'number'
        ? <button key={item} className={`page-btn ${item === page ? 'active' : ''}`} onClick={() => onChange(item)} aria-current={item === page ? 'page' : undefined}>{item}</button>
        : <span key={item} className="page-gap">…</span>)}
      <button className="page-btn page-nav" onClick={() => onChange(page + 1)} disabled={page === totalPages}>Next</button>
    </nav>
  )
}