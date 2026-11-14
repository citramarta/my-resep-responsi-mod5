const NAV_ITEMS = ['Beranda', 'Resep', 'Favorit', 'Profil']

export default function Header({ page, onNavigate }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => onNavigate('Beranda')} aria-label="Resepku beranda">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <circle cx="12" cy="5.5" r="4" />
              <circle cx="18.2" cy="10" r="4" />
              <circle cx="15.8" cy="17.3" r="4" />
              <circle cx="8.2" cy="17.3" r="4" />
              <circle cx="5.8" cy="10" r="4" />
              <circle cx="12" cy="12" r="2.6" fill="#fff" />
            </svg>
          </span>
          <span>resep<span className="brand-accent">ku</span></span>
        </button>
        <nav className="main-nav" aria-label="Navigasi utama">
          {NAV_ITEMS.map((label) => <button key={label} className={page === label || (page === 'Detail' && label === 'Resep') ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate(label)}>{label}</button>)}
        </nav>
        <button className="header-cta" onClick={() => onNavigate('Resep', null, true)}>+ Tambah resep</button>
      </div>
    </header>
  )
}