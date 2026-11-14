export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-brand">resep<span>ku</span></span>
        <p>Simpan resep favorit, temukan inspirasi, dan masak dengan lebih mudah.</p>
        <small>© {new Date().getFullYear()} Resepku</small>
      </div>
    </footer>
  )
}
