import { useState } from 'react'
import { PROFILE } from '../data/profile'
import { compressImage } from '../utils/image'

const PHOTO_KEY = 'resepku_profile_photo'
const loadPhoto = () => { try { return localStorage.getItem(PHOTO_KEY) || '' } catch { return '' } }

export default function Profile() {
  const [photo, setPhoto] = useState(loadPhoto)
  const [error, setError] = useState('')

  const pickPhoto = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError('')
    try {
      const image = await compressImage(file, 480, 0.82)
      localStorage.setItem(PHOTO_KEY, image)
      setPhoto(image)
    } catch (err) { setError(err.message || 'Gagal menyimpan foto.') }
  }
  const removePhoto = () => {
    try { localStorage.removeItem(PHOTO_KEY) } catch { /* abaikan */ }
    setPhoto('')
    setError('')
  }

  const rows = [
    { label: 'Nama lengkap', value: PROFILE.nama },
    { label: 'Nomor induk mahasiswa', value: PROFILE.nim },
    { label: 'Kelompok', value: PROFILE.kelompok },
    { label: 'Program studi', value: 'Teknik Komputer' },
    { label: 'Universitas', value: 'Universitas Diponegoro' },
  ]

  return <section className="profile-page">
    <div className="pf-card">
      <div className="pf-top">
        <div className="pf-avatar">{photo ? <img src={photo} alt={`Foto profil ${PROFILE.nama}`} /> : PROFILE.nama.trim().charAt(0).toUpperCase()}</div>
        <span className="eyebrow">MAHASISWA</span>
        <h1>{PROFILE.nama}</h1>
        <p>Pengembang aplikasi Resepku</p>
        <div className="pf-photo-actions">
          <label className="button button-outline pf-file">{photo ? 'Ganti foto' : 'Unggah foto'}<input type="file" accept="image/*" onChange={pickPhoto} hidden /></label>
          {photo && <button type="button" className="button button-delete" onClick={removePhoto}>Hapus foto</button>}
        </div>
        {error && <p className="pf-error" role="alert">{error}</p>}
      </div>
      <ul className="pf-list">
        {rows.map((row) => <li className="pf-row" key={row.label}><span className="pf-label">{row.label}</span><b className="pf-value">{row.value}</b></li>)}
      </ul>
    </div>
    <p className="pf-note">Aplikasi Resepku dikembangkan sebagai proyek pembelajaran mata kuliah Pengembangan dan Pemrograman Web.</p>
  </section>
}