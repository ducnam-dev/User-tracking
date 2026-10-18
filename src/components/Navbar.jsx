import { useState, useEffect } from 'react';
import { IconCar, IconActivity, IconArrowRight } from './Icons';

export default function Navbar({ onScrollTo }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="logo" onClick={() => onScrollTo?.('hero')} role="button" tabIndex={0}>
          <div className="logo-symbol">
            <IconCar size={20} className="logo-icon-svg" />
          </div>
          <div className="logo-content">
            <span className="logo-title">AUTO<span className="accent-text">VIET</span></span>
            <span className="logo-badge">EXCELLENCE</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#hero" className="nav-link" onClick={(e) => { e.preventDefault(); onScrollTo?.('hero'); }}>
            Trang chủ
          </a>
          <a href="#cars" className="nav-link" onClick={(e) => { e.preventDefault(); onScrollTo?.('cars'); }}>
            Bộ sưu tập
          </a>
          <a href="#analytics" className="nav-link nav-link-telemetry" onClick={(e) => { e.preventDefault(); onScrollTo?.('analytics'); }}>
            <span className="live-status-dot" aria-hidden="true" />
            Live Telemetry
          </a>
          <a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); onScrollTo?.('features'); }}>
            Đặc quyền
          </a>
          <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); onScrollTo?.('contact'); }}>
            Liên hệ
          </a>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          <button
            className="btn btn-telemetry"
            onClick={() => onScrollTo?.('analytics')}
            title="Mở bảng phân tích hành vi người dùng"
          >
            <IconActivity size={15} />
            <span>Phân tích User Tracking</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onScrollTo?.('cars')}
          >
            <span>Khám phá xe</span>
            <IconArrowRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
