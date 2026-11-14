import { useState, useEffect, useCallback } from 'react'
import { loadRecipes, saveRecipe, removeRecipe, pendingCount } from './services/recipes'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import Favorites from './pages/Favorites'
import RecipeDetail from './pages/RecipeDetail'
import Profile from './pages/Profile'

export default function App() {
  const [page, setPage] = useState('Beranda')
  const [category, setCategory] = useState('Semua')
  const [recipes, setRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [offline, setOffline] = useState(!navigator.onLine)
  const [pending, setPending] = useState(pendingCount())
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    const result = await loadRecipes()
    setRecipes(result.recipes)
    setOffline(result.offline)
    setPending(pendingCount())
    setReady(true)
  }, [])

  useEffect(() => {
    refresh()
    const handleOnline = () => refresh()
    const handleOffline = () => setOffline(true)
    const handleNavigate = (event) => navigate(event.detail)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('resepku:navigate', handleNavigate)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('resepku:navigate', handleNavigate)
    }
  }, [refresh])

  const handleSave = async (recipe) => {
    setRecipes(await saveRecipe(recipe))
    setPending(pendingCount())
    if (selectedRecipe?.id === recipe.id) setSelectedRecipe((current) => ({ ...current, ...recipe }))
  }
  const handleDelete = async (id) => {
    setRecipes(await removeRecipe(id))
    setPending(pendingCount())
    if (selectedRecipe?.id === id) { setSelectedRecipe(null); setPage('Resep') }
  }
  const navigate = (nextPage, nextCategory, openForm = false) => {
    setPage(nextPage)
    setSelectedRecipe(null)
    if (nextCategory) setCategory(nextCategory)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (openForm) setTimeout(() => window.dispatchEvent(new Event('resepku:open-form')), 0)
  }
  const showDetail = (recipe) => { setSelectedRecipe(recipe); setPage('Detail'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleFavorite = (recipe) => handleSave({ ...recipe, favorite: !recipe.favorite })

  return (
    <div className="app-shell">
      <Header page={page} onNavigate={navigate} />
      <main className="page-content">
        {(offline || pending > 0) && <div className="status-banner" role="status"><span>{offline ? '◌' : '↻'}</span>{offline ? 'Offline — resep tersimpan di perangkat.' : `${pending} perubahan menunggu sinkronisasi.`}</div>}
        {!ready ? <div className="loading-state">Menyiapkan dapurmu...</div> : <>
          {page === 'Beranda' && <Home recipes={recipes} goTo={navigate} onDetail={showDetail} />}
          {page === 'Resep' && <Recipes recipes={recipes} category={category} setCategory={setCategory} onSave={handleSave} onDelete={handleDelete} onDetail={showDetail} />}
          {page === 'Favorit' && <Favorites recipes={recipes} onDetail={showDetail} onToggleFavorite={toggleFavorite} />}
          {page === 'Detail' && <RecipeDetail recipe={recipes.find((item) => item.id === selectedRecipe?.id) || selectedRecipe} onBack={() => navigate('Resep')} onToggleFavorite={toggleFavorite} onEdit={(recipe) => { setPage('Resep'); setSelectedRecipe(null); setTimeout(() => window.dispatchEvent(new CustomEvent('resepku:edit-recipe', { detail: recipe })), 0) }} onDelete={(recipe) => { if (window.confirm(`Hapus resep “${recipe.title}”?`)) handleDelete(recipe.id) }} />}
          {page === 'Profil' && <Profile />}
        </>}
      </main>
      <Footer />
    </div>
  )
}
