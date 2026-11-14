import { categoryInfo } from '../data/categories'
import RecipeCover from '../components/RecipeCover'

const lines = (value) => (value || '').split('\n').map((line) => line.trim()).filter(Boolean)

export default function RecipeDetail({ recipe, onBack, onToggleFavorite, onEdit, onDelete }) {
  if (!recipe) return <section className="detail-page"><button className="text-button" onClick={onBack}>← Kembali</button><div className="empty-state large-empty"><h3>Resep tidak ditemukan</h3></div></section>
  const info = categoryInfo(recipe.category)
  return <section className="detail-page">
    <button className="back-link" onClick={onBack}>← Kembali ke resep</button>
    <div className="detail-hero">
      <div className={`detail-art ${info.tone}`}>
        <RecipeCover src={recipe.image} alt={recipe.title} fallback={<span>{info.icon}</span>} />
        <small>{recipe.minutes} menit</small>
      </div>
      <div className="detail-heading"><span className="eyebrow">{recipe.category}</span><h1>{recipe.title}</h1><p>{recipe.minutes} menit untuk disiapkan</p>
        <div className="detail-actions"><button className={`button ${recipe.favorite ? 'button-pink' : 'button-outline'}`} onClick={() => onToggleFavorite(recipe)}>{recipe.favorite ? '★ Favorit' : '☆ Tambah favorit'}</button><button className="button button-outline" onClick={() => onEdit(recipe)}>Edit resep</button><button className="button button-delete" onClick={() => onDelete(recipe)}>Hapus</button></div>
      </div>
    </div>
    <div className="detail-columns"><section className="detail-panel"><h2>Bahan-bahan</h2><ul>{lines(recipe.ingredients).map((item, i) => <li key={i}>{item}</li>)}</ul></section><section className="detail-panel"><h2>Cara membuat</h2><ol>{lines(recipe.steps).map((item, i) => <li key={i}>{item}</li>)}</ol></section></div>
  </section>
}