export const CATEGORIES = [
  { name: 'Sarapan', icon: '🍳', tone: 'peach' },
  { name: 'Makan Siang', icon: '🍛', tone: 'green' },
  { name: 'Makan Malam', icon: '🍲', tone: 'lavender' },
  { name: 'Camilan', icon: '🥐', tone: 'yellow' },
  { name: 'Minuman', icon: '🥤', tone: 'blue' },
]

export const categoryInfo = (name) => CATEGORIES.find((item) => item.name === name) || {
  name: name || 'Lainnya', icon: '🍽️', tone: 'green',
}
