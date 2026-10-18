import { useState, useEffect } from 'react';

export default function Navbar({ onScrollTo }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <div className="logo" onClick={() => onScrollTo?.('hero')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">🚗</div>
          <span className="logo-text">AutoViet</span>
        </div>

        {/* Nav links */}
        <ul className="nav-links">
          <li><a href="#hero" onClick={(e) => { e.preventDefault(); onScrollTo?.('hero'); }}>Trang chủ</a></li>
          <li><a href="#cars" onClick={(e) => { e.preventDefault(); onScrollTo?.('cars'); }}>Ô tô</a></li>
          <li><a href="#analytics" onClick={(e) => { e.preventDefault(); onScrollTo?.('analytics'); }} style={{ color: '#ff6b6b', fontWeight: 600 }}>📊 Thống kê Tracking</a></li>
          <li><a href="#features" onClick={(e) => { e.preventDefault(); onScrollTo?.('features'); }}>Dịch vụ</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); onScrollTo?.('contact'); }}>Liên hệ</a></li>
        </ul>

        {/* Nav actions */}
        <div className="nav-actions">
          <button
            className="btn btn-ghost"
            onClick={() => onScrollTo?.('analytics')}
            title="Xem phân tích người dùng xem xe"
          >
            📊 Analytics
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onScrollTo?.('cars')}
          >
            🔍 Xem danh sách xe
          </button>
        </div>
      </div>
    </nav>
  );
}
