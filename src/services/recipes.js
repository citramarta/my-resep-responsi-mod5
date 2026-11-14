import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const hasSupabase = Boolean(BASE_URL && KEY)
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: hasSupabase ? { apikey: KEY, Authorization: `Bearer ${KEY}` } : {},
})

const STORAGE_KEY = 'resepku_recipes_v2'
const QUEUE_KEY = 'resepku_queue_v2'
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

// Foto bawaan resep contoh (file ada di public/images/)
const demoImages = {
  'Nasi Goreng Kampung': '/images/nasi-goreng-kampung.jpg',
  'Pisang Goreng Crispy': '/images/pisang-goreng-crispy.jpg',
  'Es Teh Lemon': '/images/es-teh-lemon.jpg',
  'Oatmeal Pisang': '/images/oatmeal-pisang.jpg',
  'Sup Ayam Hangat': '/images/sup-ayam-hangat.jpg',
  'Roti Panggang Madu': '/images/roti-panggang-madu.jpg',
}
const withDefaultImage = (recipe) =>
  recipe.image == null && demoImages[recipe.title] ? { ...recipe, image: demoImages[recipe.title] } : recipe

const demoRecipes = [
  { id: '8f2f8d8a-1d5c-4b79-8d2f-000000000001', title: 'Nasi Goreng Kampung', category: 'Makan Siang', minutes: 20, ingredients: '2 piring nasi\n2 butir telur\n3 siung bawang putih\nKecap manis secukupnya', steps: 'Tumis bawang putih hingga harum\nMasukkan telur lalu orak-arik\nTambahkan nasi dan kecap, aduk rata\nSajikan selagi hangat', favorite: true, created_at: '2026-11-01T08:00:00.000Z' },
  { id: '8f2f8d8a-1d5c-4b79-8d2f-000000000002', title: 'Pisang Goreng Crispy', category: 'Camilan', minutes: 25, ingredients: '5 buah pisang kepok\n100 g tepung terigu\n2 sdm tepung beras\nAir secukupnya', steps: 'Campur tepung dan air hingga menjadi adonan\nCelupkan pisang\nGoreng hingga kuning keemasan', favorite: false, created_at: '2026-11-02T08:00:00.000Z' },
  { id: '8f2f8d8a-1d5c-4b79-8d2f-000000000003', title: 'Es Teh Lemon', category: 'Minuman', minutes: 5, ingredients: '2 kantong teh\n1 buah lemon\nGula secukupnya\nEs batu', steps: 'Seduh teh dan tambahkan gula\nDinginkan teh\nTuang ke gelas berisi es dan lemon', favorite: false, created_at: '2026-11-03T08:00:00.000Z' },
  { id: '8f2f8d8a-1d5c-4b79-8d2f-000000000004', title: 'Oatmeal Pisang', category: 'Sarapan', minutes: 10, ingredients: '5 sdm oatmeal\n1 buah pisang\n150 ml susu\nMadu secukupnya', steps: 'Masak oatmeal bersama susu\nIris pisang di atasnya\nTambahkan madu lalu sajikan', favorite: false, created_at: '2026-11-04T08:00:00.000Z' },
  { id: '8f2f8d8a-1d5c-4b79-8d2f-000000000005', title: 'Sup Ayam Hangat', category: 'Makan Malam', minutes: 35, ingredients: '200 g ayam\n1 wortel\n1 kentang\nDaun bawang dan seledri', steps: 'Rebus ayam hingga matang\nMasukkan wortel dan kentang\nBumbui lalu masak hingga empuk', favorite: false, created_at: '2026-11-05T08:00:00.000Z' },
  { id: '8f2f8d8a-1d5c-4b79-8d2f-000000000006', title: 'Roti Panggang Madu', category: 'Sarapan', minutes: 8, ingredients: '2 lembar roti tawar\n1 sdm mentega\nMadu secukupnya', steps: 'Olesi roti dengan mentega\nPanggang hingga renyah\nTuangkan madu sebelum disajikan', favorite: true, created_at: '2026-11-06T08:00:00.000Z' },
]

const getLocal = () => {
  const saved = read(STORAGE_KEY, null)
  if (saved) return saved.map(withDefaultImage)
  write(STORAGE_KEY, demoRecipes)
  return demoRecipes.map(withDefaultImage)
}

async function flushQueue() {
  if (!hasSupabase) return
  const queue = read(QUEUE_KEY, [])
  while (queue.length) {
    const op = queue[0]
    if (op.type === 'save') {
      await api.post('/rest/v1/recipes?on_conflict=id', op.recipe, {
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      })
    } else {
      await api.delete(`/rest/v1/recipes?id=eq.${encodeURIComponent(op.id)}`)
    }
    queue.shift()
    write(QUEUE_KEY, queue)
  }
}

export async function loadRecipes() {
  const localRecipes = getLocal()
  if (!hasSupabase) return { recipes: localRecipes, offline: !navigator.onLine, localOnly: true }
  try {
    await flushQueue()
    const { data } = await api.get('/rest/v1/recipes?select=*&order=created_at.desc')
    write(STORAGE_KEY, data)
    return { recipes: data.map(withDefaultImage), offline: false, localOnly: false }
  } catch {
    return { recipes: getLocal(), offline: true, localOnly: false }
  }
}

export async function saveRecipe(input) {
  const recipes = getLocal()
  const recipe = {
    ...input,
    id: input.id || crypto.randomUUID(),
    created_at: input.created_at || new Date().toISOString(),
    favorite: Boolean(input.favorite),
  }
  const index = recipes.findIndex((item) => item.id === recipe.id)
  if (index >= 0) recipes[index] = { ...recipes[index], ...recipe }
  else recipes.unshift(recipe)
  write(STORAGE_KEY, recipes)
  if (hasSupabase) {
    write(QUEUE_KEY, [...read(QUEUE_KEY, []), { type: 'save', recipe }])
    try { await flushQueue() } catch { /* antrean dikirim saat koneksi pulih */ }
  }
  return getLocal()
}

export async function removeRecipe(id) {
  write(STORAGE_KEY, getLocal().filter((item) => item.id !== id))
  if (hasSupabase) {
    write(QUEUE_KEY, [...read(QUEUE_KEY, []), { type: 'delete', id }])
    try { await flushQueue() } catch { /* antrean dikirim saat koneksi pulih */ }
  }
  return getLocal()
}

export const pendingCount = () => hasSupabase ? read(QUEUE_KEY, []).length : 0
export const isCloudConfigured = hasSupabase