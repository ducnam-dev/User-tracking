import { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CarCard from './components/CarCard';
import CarModal from './components/CarModal';
import TrackingDashboard from './components/TrackingDashboard';
import { carsData, brands, features, testimonials } from './data/carsData';
import {
  getTrackingData,
  recordCarView,
  recordCarTimeSpent,
  resetTrackingData,
  clearAllTrackingData,
  formatDuration,
} from './utils/tracking';

export default function App() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [fuelFilter, setFuelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCar, setSelectedCar] = useState(null);
  const [toast, setToast] = useState(null);

  // State theo dõi hành vi người dùng (User Tracking Analytics)
  const [trackingData, setTrackingData] = useState(() => getTrackingData());

  const carsRef = useRef(null);
  const analyticsRef = useRef(null);

  const scrollTo = (section) => {
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'cars') {
      carsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'analytics') {
      analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'features') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Xử lý khi người dùng click vào xem chi tiết một xe
  const handleViewDetail = (car) => {
    // 1. Tăng số lượt xem cho xe đó
    const updated = recordCarView(car.id);
    setTrackingData({ ...updated });
    setSelectedCar(car);
  };

  // Xử lý khi đóng modal hoặc rời khỏi xem xe -> cộng dồn thời gian xem
  const handleRecordTimeSpent = (carId, seconds) => {
    if (seconds > 0) {
      const updated = recordCarTimeSpent(carId, seconds);
      setTrackingData({ ...updated });
      const car = carsData.find(c => c.id === carId);
      showToast(`⏱️ Đã ghi nhận bạn vừa xem ${car ? car.name : 'ô tô'} trong ${formatDuration(seconds)}`);
    }
  };

  // Nạp lại data demo mẫu
  const handleResetData = () => {
    const fresh = resetTrackingData();
    setTrackingData({ ...fresh });
    showToast('🔄 Đã nạp lại dữ liệu thống kê mẫu!');
  };

  // Xóa trắng toàn bộ về 0 để test từ đầu
  const handleClearData = () => {
    const empty = clearAllTrackingData();
    setTrackingData({ ...empty });
    showToast('🗑️ Đã đặt tất cả lượt xem & thời gian về 0 để bạn kiểm tra từ đầu!');
  };

  // Tìm ID xe có số lượt xem cao nhất hiện tại
  const mostViewedCarId = useMemo(() => {
    let maxId = null;
    let maxViews = -1;
    carsData.forEach(car => {
      const v = (trackingData[car.id]?.views) || 0;
      if (v > maxViews && v > 0) {
        maxViews = v;
        maxId = car.id;
      }
    });
    return maxId;
  }, [trackingData]);

  // Danh sách xe sau khi lọc và sắp xếp
  const filteredCars = useMemo(() => {
    let result = [...carsData];

    // Lọc theo hãng xe
    if (selectedBrand !== 'all') {
      result = result.filter(c => c.brand === selectedBrand);
    }

    // Lọc theo loại nhiên liệu
    if (fuelFilter !== 'all') {
      result = result.filter(c => c.fuel === fuelFilter);
    }

    // Lọc theo tình trạng xe mới/cũ
    if (typeFilter !== 'all') {
      result = result.filter(c => c.type === typeFilter);
    }

    // Tìm kiếm theo từ khóa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    // Sắp xếp
    switch (sortBy) {
      case 'views-desc':
        // Sắp xếp theo xe được xem nhiều nhất
        result.sort((a, b) => {
          const vA = trackingData[a.id]?.views || 0;
          const vB = trackingData[b.id]?.views || 0;
          return vB - vA;
        });
        break;
      case 'time-desc':
        // Sắp xếp theo tổng thời gian người dùng xem lâu nhất
        result.sort((a, b) => {
          const tA = trackingData[a.id]?.totalTime || 0;
          const tB = trackingData[b.id]?.totalTime || 0;
          return tB - tA;
        });
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Mặc định ưu tiên xe hot & mới
        result.sort((a, b) => {
          const order = { hot: 0, new: 1, normal: 2 };
          return (order[a.status] ?? 2) - (order[b.status] ?? 2);
        });
    }

    return result;
  }, [selectedBrand, fuelFilter, typeFilter, searchQuery, sortBy, trackingData]);

  return (
    <>
      {/* Navigation */}
      <Navbar onScrollTo={scrollTo} />

      {/* Hero Banner */}
      <Hero onExplore={() => scrollTo('cars')} />

      {/* Search & Filter Section */}
      <section className="search-section">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              id="search-input"
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo tên xe, hãng xe, đời xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            id="fuel-filter"
            className="search-select"
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
          >
            <option value="all">⛽ Tất cả nhiên liệu</option>
            <option value="Xăng">Xăng</option>
            <option value="Dầu">Dầu (Diesel)</option>
            <option value="Điện">Điện</option>
          </select>
          <select
            id="type-filter"
            className="search-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">🚗 Tất cả loại xe</option>
            <option value="Mới">Xe mới 100%</option>
            <option value="Cũ">Xe đã qua sử dụng</option>
          </select>
          <button
            id="search-btn"
            className="btn-search"
            onClick={() => scrollTo('cars')}
          >
            🔍 Tìm kiếm
          </button>
        </div>
      </section>

      {/* Cars Section */}
      <section className="section" ref={carsRef} id="cars">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Bộ Sưu Tập Xe</span>
            <h2 className="section-title">Danh Sách Ô Tô Cần Bán</h2>
            <p className="section-desc">
              Khám phá các mẫu xe ô tô chất lượng cao. Mỗi lượt xem và thời gian xem của bạn đều được ghi nhận trực tiếp.
            </p>
          </div>

          {/* Quick tracker banner */}
          <div className="live-tracking-pill" onClick={() => scrollTo('analytics')}>
            <span className="pulsing-radar"></span>
            <span>Hệ thống User Tracking đang hoạt động: Click vào xe bất kỳ để xem thời gian đếm & lượt truy cập tăng realtime!</span>
            <span className="pill-action">Xem báo cáo →</span>
          </div>

          {/* Brand Tabs */}
          <div className="brand-tabs">
            {brands.map((brand) => (
              <button
                key={brand.id}
                className={`brand-tab ${selectedBrand === brand.id ? 'active' : ''}`}
                onClick={() => setSelectedBrand(brand.id)}
              >
                <span className="brand-icon">{brand.icon}</span>
                {brand.name}
              </button>
            ))}
          </div>

          {/* Filter & Sort Bar */}
          <div className="filter-bar">
            <p className="results-count">
              Hiển thị <strong>{filteredCars.length}</strong> / {carsData.length} mẫu xe
            </p>
            <div className="sort-group">
              <label htmlFor="sort-select" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Sắp xếp theo:
              </label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">⭐ Mặc định: Nổi bật</option>
                <option value="views-desc">👀 Xem nhiều nhất (User Tracking)</option>
                <option value="time-desc">⏱️ Thời gian xem lâu nhất</option>
                <option value="price-asc">💵 Giá: Thấp đến Cao</option>
                <option value="price-desc">💎 Giá: Cao đến Thấp</option>
                <option value="year-desc">📅 Năm sản xuất mới nhất</option>
                <option value="rating">🌟 Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Cars Grid */}
          {filteredCars.length > 0 ? (
            <div className="cars-grid">
              {filteredCars.map((car, index) => (
                <CarCard
                  key={car.id}
                  car={car}
                  animDelay={index * 60}
                  trackingInfo={trackingData[car.id]}
                  isMostViewed={car.id === mostViewedCarId}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Không tìm thấy xe nào phù hợp
              </h3>
              <p>Thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBrand('all');
                  setFuelFilter('all');
                  setTypeFilter('all');
                  setSortBy('default');
                }}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Analytics & User Tracking Dashboard Section */}
      <div ref={analyticsRef}>
        <TrackingDashboard
          cars={carsData}
          trackingData={trackingData}
          onSelectCar={handleViewDetail}
          onResetData={handleResetData}
          onClearData={handleClearData}
        />
      </div>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Vì Sao Chọn AutoViet</span>
            <h2 className="section-title">Dịch Vụ Đẳng Cấp & Uy Tín</h2>
            <p className="section-desc">
              Chúng tôi cam kết mang đến trải nghiệm mua xe minh bạch, tin cậy tuyệt đối
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Ý Kiến Khách Hàng</span>
            <h2 className="section-title">Khách Hàng Nói Gì Về AutoViet</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.id}>
                <div className="testimonial-stars">{t.stars}</div>
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.avatar}</div>
                  <div>
                    <div className="author-name">{t.author}</div>
                    <div className="author-info">{t.info}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="contact">
        <div className="cta-bg" />
        <div className="cta-content container">
          <h2 className="cta-title">
            Sẵn sàng sở hữu <span style={{ color: 'var(--primary-light)' }}>chiếc xe mơ ước?</span>
          </h2>
          <p className="cta-desc">
            Đội ngũ tư vấn viên của AutoViet luôn sẵn sàng hỗ trợ bạn 24/7. Hỗ trợ vay vốn và lái thử tại nhà miễn phí.
          </p>
          <div className="cta-buttons">
            <button
              className="btn btn-primary"
              style={{ padding: '16px 40px', fontSize: '16px' }}
              onClick={() => showToast('📞 Cảm ơn bạn! Chuyên viên sẽ gọi cho bạn trong ít phút.')}
            >
              📞 Gọi ngay: 1800 1234
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '16px 40px', fontSize: '16px' }}
              onClick={() => showToast('✉️ Tin nhắn của bạn đã được tiếp nhận!')}
            >
              ✉️ Để lại thông tin liên hệ
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" style={{ marginBottom: 0 }}>
                <div className="logo-icon">🚗</div>
                <span className="logo-text">AutoViet</span>
              </div>
              <p>Sàn giao dịch ô tô uy tín hàng đầu Việt Nam. Tích hợp công nghệ User Tracking thông minh giúp theo dõi xu hướng mua sắm của người dùng.</p>
              <div className="footer-social">
                <button className="social-btn" title="Facebook">📘</button>
                <button className="social-btn" title="Instagram">📷</button>
                <button className="social-btn" title="YouTube">▶️</button>
                <button className="social-btn" title="Zalo">💬</button>
              </div>
            </div>

            <div className="footer-col">
              <h4>Mua xe</h4>
              <ul className="footer-links">
                <li><a href="#cars" onClick={(e) => { e.preventDefault(); scrollTo('cars'); }}>Xe mới 100%</a></li>
                <li><a href="#cars" onClick={(e) => { e.preventDefault(); scrollTo('cars'); }}>Xe lướt đã qua sử dụng</a></li>
                <li><a href="#analytics" onClick={(e) => { e.preventDefault(); scrollTo('analytics'); }}>Xe xem nhiều nhất</a></li>
                <li><a href="#">Dự toán chi phí lăn bánh</a></li>
                <li><a href="#">Đặt lịch lái thử tận nơi</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Dịch vụ</h4>
              <ul className="footer-links">
                <li><a href="#">Gói vay ngân hàng ưu đãi</a></li>
                <li><a href="#">Bảo hiểm thân vỏ toàn diện</a></li>
                <li><a href="#">Hỗ trợ sang tên đổi chủ</a></li>
                <li><a href="#">Phụ tùng phụ kiện chính hãng</a></li>
                <li><a href="#">Xưởng dịch vụ đạt chuẩn</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Thông tin liên hệ</h4>
              <ul className="footer-links">
                <li><a href="#">📍 123 Nguyễn Huệ, Quận 1, TP.HCM</a></li>
                <li><a href="#">📞 Tổng đài miễn cước: 1800 1234</a></li>
                <li><a href="#">✉️ cskh@autoviet.vn</a></li>
                <li><a href="#">🕐 Giờ mở cửa: 08:00 - 21:00 hàng ngày</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 <span>AutoViet</span>. Tất cả quyền được bảo lưu.</p>
            <p>Hệ thống có tích hợp <span>Realtime User Tracking Analytics</span></p>
          </div>
        </div>
      </footer>

      {/* Car Detail Modal có tích hợp Live Dwell-Time Tracking */}
      {selectedCar && (
        <CarModal
          car={selectedCar}
          trackingInfo={trackingData[selectedCar.id]}
          onRecordTime={handleRecordTimeSpent}
          onClose={() => setSelectedCar(null)}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div className="toast">
          <span className="toast-icon">ℹ️</span>
          <span className="toast-text">{toast}</span>
        </div>
      )}
    </>
  );
}
