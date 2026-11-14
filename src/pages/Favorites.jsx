import { useState } from 'react'
import { categoryInfo } from '../data/categories'
import RecipeCover from '../components/RecipeCover'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 6

export default function Favorites({ recipes, onDetail, onToggleFavorite }) {
  const [pageNum, setPageNum] = useState(1)
  const favorites = recipes.filter((recipe) => recipe.favorite)
  const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE))
  const currentPage = Math.min(pageNum, totalPages)
  const paged = favorites.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const changePage = (n) => { setPageNum(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return <section className="recipes-page">
    <div className="page-intro"><div><h1>Resep favorit</h1><p>Resep yang kamu simpan.</p></div></div>
    {!favorites.length ? <div className="empty-state large-empty"><span>☆</span><h3>Belum ada resep favorit</h3><p>Tekan tanda bintang pada resep yang kamu suka.</p><button className="button button-primary" onClick={() => window.dispatchEvent(new CustomEvent('resepku:navigate', { detail: 'Resep' }))}>Jelajahi resep</button></div> :
      <>
        <div className="recipe-grid">{paged.map((recipe) => { const info = categoryInfo(recipe.category); return <article className="recipe-card" key={recipe.id}>
          <button className={`recipe-visual ${info.tone}`} onClick={() => onDetail(recipe)} aria-label={`Detail ${recipe.title}`}>
            <RecipeCover src={recipe.image} fallback={<span className="recipe-visual-emoji">{info.icon}</span>} />
            <span className="visual-time">◷ {recipe.minutes} menit</span>
          </button>
          <div className="recipe-card-content"><div className="recipe-meta"><span>{recipe.category}</span><button className="favorite-button is-favorite" onClick={() => onToggleFavorite(recipe)} aria-label="Hapus dari favorit">★</button></div><button className="recipe-title-button" onClick={() => onDetail(recipe)}><h3>{recipe.title}</h3><span>Lihat detail →</span></button></div>
        </article>})}</div>
        <Pagination page={currentPage} totalPages={totalPages} onChange={changePage} />
      </>}
  </section>
}