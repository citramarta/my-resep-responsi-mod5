import { useMemo, useState } from 'react'
import { CATEGORIES, categoryInfo } from '../data/categories'
import RecipeCover from '../components/RecipeCover'

export default function Home({ recipes, goTo, onDetail }) {
  const [pick, setPick] = useState(null)
  const favorites = recipes.filter((recipe) => recipe.favorite).length
  const featured = useMemo(() => [...recipes].sort((a, b) => Number(b.favorite) - Number(a.favorite)).slice(0, 3), [recipes])
  const shuffle = () => setPick(recipes[Math.floor(Math.random() * recipes.length)])

  return (
    <section className="home-page">
      <div className="hero-panel">
        <div className="hero-copy">
          <h1>Masak enak, <em>nggak perlu bingung.</em></h1>
          <p>Temukan inspirasi menu harian dan simpan resep andalanmu dalam satu tempat.</p>
          <div className="hero-actions">
            <button className="button button-light" onClick={() => goTo('Resep')}>Jelajahi resep <span>↗</span></button>
            <button className="text-button" onClick={shuffle} disabled={!recipes.length}>✳ Acak menu</button>
          </div>
          <div className="hero-stats"><span><b>{recipes.length}</b> resep tersimpan</span><i /> <span><b>{favorites}</b> resep favorit</span></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="plate"><span>🍜</span></div><span className="art-leaf leaf-one">✳</span><span className="art-leaf leaf-two">✿</span><span className="art-note">made with love</span></div>
      </div>

      {pick && <button className="random-result" onClick={() => goTo('Resep', pick.category)}><span className="result-icon">{categoryInfo(pick.category).icon}</span><span><small>MENU PILIHAN HARI INI</small><b>{pick.title}</b><small>{pick.category} · {pick.minutes} menit</small></span><strong>→</strong></button>}

      <div className="section-heading"><h2>Jelajahi kategori</h2><button className="link-button" onClick={() => goTo('Resep')}>Lihat semua resep ↗</button></div>
      <div className="category-grid">
        {CATEGORIES.map((item) => <button className={`category-tile ${item.tone}`} key={item.name} onClick={() => goTo('Resep', item.name)}><span className="category-icon">{item.icon}</span><span><b>{item.name}</b><small>{recipes.filter((r) => r.category === item.name).length} resep</small></span><i>↗</i></button>)}
      </div>

      <div className="section-heading featured-heading"><h2>Resep pilihan</h2><button className="link-button" onClick={() => goTo('Resep')}>Semua resep ↗</button></div>
      <div className="featured-grid">
        {featured.map((recipe) => {
          const info = categoryInfo(recipe.category)
          return <button className="featured-card" key={recipe.id} onClick={() => onDetail(recipe)}>
            <div className={`food-art ${info.tone}`}>
              <RecipeCover src={recipe.image} alt={recipe.title} fallback={<span>{info.icon}</span>} />
              <small>{recipe.minutes} MENIT</small>
            </div>
            <div className="featured-info"><small>{recipe.category}</small><b>{recipe.title}</b><span>{recipe.favorite ? '★ Favorit' : 'Resep rumahan'} <i>→</i></span></div>
          </button>
        })}
        {!featured.length && <p className="empty-state">Belum ada resep. Yuk, tambahkan resep pertamamu!</p>}
      </div>
    </section>
  )
}