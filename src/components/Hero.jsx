import { IconArrowRight, IconPhone, IconShield, IconActivity, IconCheck, IconStar } from './Icons';

export default function Hero({ onExplore }) {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg-glow" />
      <div className="hero-grid-pattern" />

      <div className="hero-content">
        {/* Left Column: Editorial Headline & Value Prop */}
        <div className="hero-left">
          <div className="hero-pill-badge">
            <span className="live-status-dot" />
            <span className="badge-text">AUTOVIET PERFORMANCE & INTELLIGENCE</span>
          </div>

          <h1 className="hero-title">
            Trải nghiệm lái <span className="highlight-text">đỉnh cao</span> & minh bạch tuyệt đối
          </h1>

          <p className="hero-desc">
            Sàn giao dịch ô tô thế hệ mới tích hợp công nghệ phân tích hành vi người dùng (User Tracking Telemetry) theo thời gian thực. Hàng trăm mẫu xe cao cấp đã qua 200 tiêu chuẩn kiểm định nghiêm ngặt.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={onExplore}>
              <span>Khám phá bộ sưu tập</span>
              <IconArrowRight size={16} />
            </button>
            <a href="tel:18001234" className="btn btn-secondary btn-lg">
              <IconPhone size={16} />
              <span>Tư vấn kỹ thuật 24/7</span>
            </a>
          </div>

          {/* Precision Metric Strip */}
          <div className="hero-stats-strip">
            <div className="stat-node">
              <div className="stat-num">500<span className="stat-plus">+</span></div>
              <div className="stat-caption">Mẫu xe tuyển chọn</div>
            </div>
            <div className="stat-separator" />
            <div className="stat-node">
              <div className="stat-num">100<span className="stat-unit">%</span></div>
              <div className="stat-caption">Kiểm định chính hãng</div>
            </div>
            <div className="stat-separator" />
            <div className="stat-node">
              <div className="stat-num">15.8K</div>
              <div className="stat-caption">Giao dịch thành công</div>
            </div>
            <div className="stat-separator" />
            <div className="stat-node">
              <div className="stat-num rating-num">
                <span>4.95</span>
                <IconStar size={14} className="star-gold" />
              </div>
              <div className="stat-caption">Độ hài lòng</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Vehicle Showcase */}
        <div className="hero-right">
          <div className="hero-stage">
            <div className="hero-car-halo" />
            <img
              src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=85&auto=format&fit=crop"
              alt="Toyota Camry 2024 Showcase"
              className="hero-car-image"
              loading="eager"
            />

            {/* Technical HUD Floating Telemetry Overlays */}
            <div className="hud-card hud-top-right">
              <div className="hud-header">
                <IconActivity size={14} className="hud-icon-cyan" />
                <span className="hud-label">LIVE INTEREST RANK</span>
              </div>
              <div className="hud-value">Top 1 Được Quan Tâm</div>
              <div className="hud-caption">Dwell time cao nhất hôm nay</div>
            </div>

            <div className="hud-card hud-bottom-left">
              <div className="hud-header">
                <IconShield size={14} className="hud-icon-red" />
                <span className="hud-label">CHỨNG CHỈ KIỂM ĐỊNH</span>
              </div>
              <div className="hud-value">200 / 200 Tiêu Chuẩn</div>
              <div className="hud-status">
                <IconCheck size={12} />
                <span>Bảo hành động cơ 3 năm</span>
              </div>
            </div>

            <div className="hero-car-specs-ribbon">
              <div className="ribbon-title">Toyota Camry 2024 • Dynamic Force 2.5L</div>
              <div className="ribbon-price">1.850.000.000 ₫</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
