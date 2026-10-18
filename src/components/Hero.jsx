export default function Hero({ onExplore }) {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-content">
        {/* Left Content */}
        <div className="hero-left">
          <div className="hero-tag">
            <span className="dot"></span>
            Sàn giao dịch ô tô #1 Việt Nam
          </div>

          <h1 className="hero-title">
            Tìm <span className="highlight">Xe Mơ Ước</span>{' '}
            Của Bạn Tại Đây
          </h1>

          <p className="hero-desc">
            Hàng trăm mẫu xe ô tô mới & cũ chính hãng, giá tốt nhất thị trường.
            Hỗ trợ vay vốn, đổi xe và giao hàng tận nơi toàn quốc.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={onExplore} style={{ padding: '14px 32px', fontSize: '15px' }}>
              🚗 Khám phá ngay
            </button>
            <button className="btn btn-ghost" style={{ padding: '14px 32px', fontSize: '15px' }}>
              📞 Tư vấn miễn phí
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">500+</span>
              <span className="stat-label">Mẫu xe</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">15K+</span>
              <span className="stat-label">Khách hàng</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">10+</span>
              <span className="stat-label">Năm kinh nghiệm</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">4.9★</span>
              <span className="stat-label">Đánh giá TB</span>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Car Image */}
        <div className="hero-right">
          <div className="hero-car-container">
            <img
              src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=900&q=80"
              alt="Featured car"
              className="hero-car-image"
            />

            {/* Floating badge */}
            <div className="hero-car-badge">
              <div className="car-name">Toyota Camry 2024</div>
              <div className="car-price">1.850 triệu đồng</div>
            </div>

            {/* Floating cards */}
            <div className="floating-card floating-card-1">
              <div className="fc-icon">✅</div>
              <div className="fc-label">Kiểm định</div>
              <div className="fc-value">200 điểm</div>
            </div>

            <div className="floating-card floating-card-2">
              <div className="fc-icon">🔥</div>
              <div className="fc-label">Xe bán chạy</div>
              <div className="fc-value">#1 Tuần này</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
