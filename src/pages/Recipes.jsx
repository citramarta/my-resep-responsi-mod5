import { useMemo, useState, useEffect, useRef } from 'react'
import { CATEGORIES, categoryInfo } from '../data/categories'
import { compressImage } from '../utils/image'
import RecipeCover from '../components/RecipeCover'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 6
const emptyForm = { title: '', category: 'Makan Siang', minutes: 30, ingredients: '', steps: '', image: '' }

export default function Recipes({ recipes, category, setCategory, onSave, onDelete, onDetail }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [imageError, setImageError] = useState('')
  const [pageNum, setPageNum] = useState(1)
  const listRef = useRef(null)

  useEffect(() => {
    const openForm = () => { setForm(emptyForm); setEditingId(null); setImageError(''); setFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    const editForm = (event) => {
      const recipe = event.detail
      setEditingId(recipe.id)
      setImageError('')
      setForm({ title: recipe.title, category: recipe.category, minutes: recipe.minutes, ingredients: recipe.ingredients || '', steps: recipe.steps || '', image: recipe.image || '' })
      setFormOpen(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('resepku:open-form', openForm)
    window.addEventListener('resepku:edit-recipe', editForm)
    return () => { window.removeEventListener('resepku:open-form', openForm); window.removeEventListener('resepku:edit-recipe', editForm) }
  }, [])

  useEffect(() => { setPageNum(1) }, [category, query, sort])

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const visibleRecipes = useMemo(() => {
    const filtered = recipes.filter((recipe) => {
      const matchesCategory = category === 'Semua' || (category === 'Favorit' ? recipe.favorite : recipe.category === category)
      const matchesQuery = `${recipe.title} ${recipe.category} ${recipe.ingredients}`.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
    return filtered.sort((a, b) => {
      if (sort === 'az') return a.title.localeCompare(b.title)
      if (sort === 'quick') return Number(a.minutes) - Number(b.minutes)
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    })
  }, [recipes, category, query, sort])

  const totalPages = Math.max(1, Math.ceil(visibleRecipes.length / PAGE_SIZE))
  const currentPage = Math.min(pageNum, totalPages)
  const pagedRecipes = visibleRecipes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const changePage = (n) => {
    setPageNum(n)
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const closeForm = () => { setFormOpen(false); setEditingId(null); setForm(emptyForm); setImageError('') }
  const openNewForm = () => { setForm(emptyForm); setEditingId(null); setImageError(''); setFormOpen(true) }

  const pickImage = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setImageError('')
    try {
      const image = await compressImage(file)
      setForm((current) => ({ ...current, image }))
    } catch (error) { setImageError(error.message) }
  }

  const submit = async (event) => {
    event.preventDefault()
    try {
      await onSave({ ...form, title: form.title.trim(), minutes: Math.max(1, Number(form.minutes) || 1), ingredients: form.ingredients.trim(), steps: form.steps.trim(), ...(editingId ? { id: editingId } : {}) })
      closeForm()
    } catch { setImageError('Penyimpanan perangkat penuh. Coba pakai foto yang lebih kecil.') }
  }

  const editRecipe = (recipe) => {
    setEditingId(recipe.id)
    setImageError('')
    setForm({ title: recipe.title, category: recipe.category, minutes: recipe.minutes, ingredients: recipe.ingredients || '', steps: recipe.steps || '', image: recipe.image || '' })
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const deleteRecipe = (recipe) => {
    if (window.confirm(`Hapus resep “${recipe.title}”?`)) { onDelete(recipe.id) }
  }

  return (
    <section className="recipes-page">
      <div className="page-intro"><div><h1>Semua resep</h1><p>Simpan, atur, dan temukan menu yang ingin kamu masak.</p></div><button className="button button-primary" onClick={formOpen ? closeForm : openNewForm}>{formOpen ? 'Tutup' : '+ Tambah resep'}</button></div>

      <div className="catalog-toolbar">
        <label className="search-box"><span>⌕</span><input type="search" placeholder="Cari nama resep atau bahan..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label className="sort-box"><span>Urutkan</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Terbaru</option><option value="az">Nama A–Z</option><option value="quick">Waktu tercepat</option></select></label>
      </div>

      <div className="filter-row" aria-label="Filter kategori">
        {['Semua', ...CATEGORIES.map((item) => item.name)].map((item) => <button key={item} className={`filter-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}
      </div>

      {formOpen && <form className="recipe-form" onSubmit={submit}>
        <div className="form-heading"><div><span className="eyebrow">{editingId ? 'PERBARUI KOLEKSI' : 'TAMBAHKAN KOLEKSI'}</span><h2>{editingId ? 'Edit resep' : 'Resep baru'}</h2></div><button type="button" className="icon-close" onClick={closeForm} aria-label="Tutup form">×</button></div>
        <label>Nama resep<input value={form.title} onChange={updateField('title')} placeholder="Contoh: Ayam teriyaki" required maxLength={70} /></label>

        <div className="image-field">
          <span className="field-label">Foto resep <small>Opsional · otomatis dikecilkan</small></span>
          {form.image ? (
            <div className="image-preview">
              <img src={form.image} alt="Pratinjau foto resep" />
              <div className="image-preview-actions">
                <label className="button button-outline file-button">Ganti foto<input type="file" accept="image/*" onChange={pickImage} hidden /></label>
                <button type="button" className="button button-delete" onClick={() => setForm((c) => ({ ...c, image: '' }))}>Hapus foto</button>
              </div>
            </div>
          ) : (
            <label className="image-drop">
              <input type="file" accept="image/*" onChange={pickImage} hidden />
              <span className="image-drop-icon">📷</span><b>Tambah foto resep</b><small>Pilih dari galeri atau ambil dengan kamera</small>
            </label>
          )}
          {imageError && <p className="form-error" role="alert">{imageError}</p>}
        </div>

        <div className="form-columns"><label>Kategori<select value={form.category} onChange={updateField('category')}>{CATEGORIES.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label><label>Waktu memasak (menit)<input type="number" min="1" max="999" value={form.minutes} onChange={updateField('minutes')} required /></label></div>
        <label>Bahan-bahan <small>Pisahkan setiap bahan dengan baris baru.</small><textarea rows="4" value={form.ingredients} onChange={updateField('ingredients')} placeholder={'2 butir telur\n1 siung bawang putih\nGaram secukupnya'} required /></label>
        <label>Langkah memasak <small>Tulis satu langkah pada setiap baris.</small><textarea rows="4" value={form.steps} onChange={updateField('steps')} placeholder={'Siapkan semua bahan\nPanaskan wajan\nMasak hingga matang'} required /></label>
        <div className="form-actions"><button className="button button-primary" type="submit">{editingId ? 'Simpan perubahan' : 'Simpan resep'}</button><button className="button button-outline" type="button" onClick={closeForm}>Batal</button></div>
      </form>}

      <div className="results-line" ref={listRef}><span><b>{visibleRecipes.length}</b> resep ditemukan</span><span>{category === 'Semua' ? 'Semua kategori' : category}{totalPages > 1 ? ` · Halaman ${currentPage} dari ${totalPages}` : ''}</span></div>
      {visibleRecipes.length === 0 ? <div className="empty-state large-empty"><span>🥣</span><h3>Resep belum ditemukan</h3><p>Coba kata kunci atau kategori lain, atau tambahkan resep baru.</p><button className="button button-primary" onClick={openNewForm}>+ Tambah resep</button></div> :
        <>
          <div className="recipe-grid">
            {pagedRecipes.map((recipe) => {
              const info = categoryInfo(recipe.category)
              return <article className="recipe-card" key={recipe.id}>
                <button className={`recipe-visual ${info.tone}`} onClick={() => onDetail(recipe)} aria-label={`Lihat detail ${recipe.title}`}>
                  <RecipeCover src={recipe.image} fallback={<span className="recipe-visual-emoji">{info.icon}</span>} />
                  <span className="visual-time">◷ {recipe.minutes} menit</span>
                </button>
                <div className="recipe-card-content"><div className="recipe-meta"><span>{recipe.category}</span><button className={`favorite-button ${recipe.favorite ? 'is-favorite' : ''}`} onClick={() => onSave({ ...recipe, favorite: !recipe.favorite })} aria-label={recipe.favorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}>{recipe.favorite ? '★' : '☆'}</button></div>
                  <button className="recipe-title-button" onClick={() => onDetail(recipe)}><h3>{recipe.title}</h3><span>Lihat detail →</span></button><div className="card-actions"><button className="button button-outline" onClick={() => editRecipe(recipe)}>Edit</button><button className="button button-delete" onClick={() => deleteRecipe(recipe)}>Hapus</button></div>
                </div>
              </article>
            })}
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={changePage} />
        </>}
    </section>
  )
}