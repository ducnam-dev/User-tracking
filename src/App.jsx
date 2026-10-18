import { useState, useMemo, useRef } from 'react';
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
import {
  IconSearch,
  IconStar,
  IconShield,
  IconRefresh,
  IconActivity,
  IconPhone,
  IconArrowRight,
  IconCheck,
} from './components/Icons';

export default function App() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [fuelFilter, setFuelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCar, setSelectedCar] = useState(null);
  const [toast, setToast] = useState(null);

  // User Tracking Analytics state
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

  // When user inspects a car
  const handleViewDetail = (car) => {
    const updated = recordCarView(car.id);
    setTrackingData({ ...updated });
    setSelectedCar(car);
  };

  // When user closes modal -> accumulate dwell time
  const handleRecordTimeSpent = (carId, seconds) => {
    if (seconds > 0) {
      const updated = recordCarTimeSpent(carId, seconds);
      setTrackingData({ ...updated });
      const car = carsData.find((c) => c.id === carId);
      showToast(`Đã ghi nhận bạn vừa xem ${car ? car.name : 'ô tô'} trong ${formatDuration(seconds)}`);
    }
  };

  const handleResetData = () => {
    const fresh = resetTrackingData();
    setTrackingData({ ...fresh });
    showToast('Đã nạp lại dữ liệu thống kê mẫu chuẩn!');
  };

  const handleClearData = () => {
    const empty = clearAllTrackingData();
    setTrackingData({ ...empty });
    showToast('Đã đặt toàn bộ dữ liệu User Tracking về 0 để kiểm tra từ đầu!');
  };

  // Leader car with max views
  const mostViewedCarId = useMemo(() => {
    let maxId = null;
    let maxViews = -1;
    carsData.forEach((car) => {
      const v = trackingData[car.id]?.views || 0;
      if (v > maxViews && v > 0) {
        maxViews = v;
        maxId = car.id;
      }
    });
    return maxId;
  }, [trackingData]);

  // Filtered & sorted cars
  const filteredCars = useMemo(() => {
    let result = [...carsData];

    if (selectedBrand !== 'all') {
      result = result.filter((c) => c.brand === selectedBrand);
    }
    if (fuelFilter !== 'all') {
      result = result.filter((c) => c.fuel === fuelFilter);
    }
    if (typeFilter !== 'all') {
      result = result.filter((c) => c.type === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'views-desc':
        result.sort((a, b) => (trackingData[b.id]?.views || 0) - (trackingData[a.id]?.views || 0));
        break;
      case 'time-desc':
        result.sort((a, b) => (trackingData[b.id]?.totalTime || 0) - (trackingData[a.id]?.totalTime || 0));
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
        result.sort((a, b) => {
          const order = { hot: 0, new: 1, normal: 2 };
          return (order[a.status] ?? 2) - (order[b.status] ?? 2);
        });
    }

    return result;
  }, [selectedBrand, fuelFilter, typeFilter, searchQuery, sortBy, trackingData]);

  return (
    <div className="site-canvas">
      {/* Toast Alert HUD */}
      {toast && (
        <div className="telemetry-toast-hud" role="alert">
          <span className="live-status-dot" />
          <span className="toast-message">{toast}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar onScrollTo={scrollTo} />

      {/* Hero Section */}
      <Hero onExplore={() => scrollTo('cars')} />

      {/* Search & Precision Filter Console */}
      <section className="search-console-section">
        <div className="container">
          <div className="search-console-card">
            <div className="search-field">
              <IconSearch size={18} className="field-icon" />
              <input
                id="search-input"
                type="text"
                className="console-input"
                placeholder="Tìm kiếm mẫu xe, thương hiệu, công nghệ hoặc đời xe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="select-fields-row">
              <select
                id="fuel-filter"
                className="console-select"
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
              >
                <option value="all">Tất cả động cơ</option>
                <option value="Xăng">Động cơ Xăng</option>
                <option value="Dầu">Động cơ Diesel</option>
                <option value="Điện">Động cơ Điện 100%</option>
              </select>

              <select
                id="type-filter"
                className="console-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tất cả tình trạng</option>
                <option value="Mới">Xe mới 100%</option>
                <option value="Cũ">Xe đã qua kiểm định</option>
              </select>

              <button
                type="button"
                className="btn btn-primary btn-console-submit"
                onClick={() => scrollTo('cars')}
              >
                <span>Lọc danh sách</span>
                <IconArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Catalog Section */}
      <section className="section catalog-section" ref={carsRef} id="cars">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-kicker">
                <span className="live-status-dot" />
                <span>BỘ SƯU TẬP XE HIỆN DIỆN</span>
              </div>
              <h2 className="section-title">Danh Sách Ô Tô Tuyển Chọn</h2>
              <p className="section-desc">
                Mỗi thao tác chọn xem xe và thời gian dừng lại (Dwell Time) đều được hệ thống telemetry phân tích theo thời gian thực.
              </p>
            </div>

            {/* Quick Live Tracking Banner */}
            <div
              className="telemetry-beacon-strip"
              onClick={() => scrollTo('analytics')}
              role="button"
              tabIndex={0}
            >
              <div className="beacon-radar">
                <span className="beacon-core" />
                <span className="beacon-ring" />
              </div>
              <div className="beacon-text">
                <span className="beacon-title">TELEMETRY RUNNING</span>
                <span className="beacon-desc">Click vào xe bất kỳ để xem thời gian đếm & lượt truy cập tăng realtime</span>
              </div>
              <IconArrowRight size={14} className="beacon-arrow" />
            </div>
          </div>

          {/* Brand Filter Pills */}
          <div className="brand-pills-scroll">
            {brands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                className={`brand-pill-btn ${selectedBrand === brand.id ? 'is-active' : ''}`}
                onClick={() => setSelectedBrand(brand.id)}
              >
                <span>{brand.name}</span>
              </button>
            ))}
          </div>

          {/* Sorting & Results Bar */}
          <div className="catalog-toolbar">
            <div className="results-indicator font-tabular">
              Hiển thị <strong>{filteredCars.length}</strong> / {carsData.length} mẫu xe sẵn có
            </div>

            <div className="sort-control">
              <label htmlFor="sort-select" className="sort-label">Sắp xếp theo:</label>
              <select
                id="sort-select"
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Mặc định: Tiêu biểu</option>
                <option value="views-desc">Lượt xem nhiều nhất (User Tracking)</option>
                <option value="time-desc">Thời gian dừng xem lâu nhất (Dwell Time)</option>
                <option value="price-asc">Giá bán: Thấp đến Cao</option>
                <option value="price-desc">Giá bán: Cao đến Thấp</option>
                <option value="year-desc">Đời xe: Mới nhất</option>
                <option value="rating">Đánh giá người dùng cao nhất</option>
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
                  animDelay={index * 40}
                  trackingInfo={trackingData[car.id]}
                  isMostViewed={car.id === mostViewedCarId}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-card">
              <div className="empty-icon-box">
                <IconSearch size={32} />
              </div>
              <h3 className="empty-title">Không tìm thấy mẫu xe tương thích</h3>
              <p className="empty-desc">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc mở rộng các tiêu chí bộ lọc động cơ, tình trạng xe.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBrand('all');
                  setFuelFilter('all');
                  setTypeFilter('all');
                  setSortBy('default');
                }}
              >
                <IconRefresh size={14} />
                <span>Đặt lại tất cả bộ lọc</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Analytics & User Tracking Telemetry Section */}
      <div ref={analyticsRef}>
        <TrackingDashboard
          cars={carsData}
          trackingData={trackingData}
          onSelectCar={handleViewDetail}
          onResetData={handleResetData}
          onClearData={handleClearData}
        />
      </div>

      {/* Features & Exclusive Services */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-header-center">
            <div className="section-kicker">
              <span>TIÊU CHUẨN AUTOVIET PRESTIGE</span>
            </div>
            <h2 className="section-title">Đặc Quyền Khách Hàng Cao Cấp</h2>
            <p className="section-desc">
              Cam kết mang đến trải nghiệm sở hữu xe minh bạch, tin cậy tuyệt đối và chế độ hậu mãi chu đáo nhất.
            </p>
          </div>

          <div className="features-editorial-grid">
            {features.map((f, i) => (
              <div className="feature-node" key={i}>
                <div className="feature-icon-wrapper">
                  {f.iconType === 'shield' && <IconShield size={24} />}
                  {f.iconType === 'wallet' && <IconActivity size={24} />}
                  {f.iconType === 'refresh' && <IconRefresh size={24} />}
                  {f.iconType === 'truck' && <IconCheck size={24} />}
                </div>
                <h3 className="feature-node-title">{f.title}</h3>
                <p className="feature-node-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header-center">
            <div className="section-kicker">
              <span>TRẢI NGHIỆM THỰC TẾ</span>
            </div>
            <h2 className="section-title">Khách Hàng Nói Về AutoViet</h2>
          </div>

          <div className="testimonials-editorial-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.id}>
                <div className="testimonial-stars-row">
                  {[...Array(5)].map((_, idx) => (
                    <IconStar key={idx} size={14} className="star-gold" />
                  ))}
                </div>
                <blockquote className="testimonial-quote">
                  "{t.text}"
                </blockquote>
                <div className="testimonial-profile">
                  <div className="profile-initial">{t.avatar}</div>
                  <div className="profile-meta">
                    <div className="profile-name">{t.author}</div>
                    <div className="profile-info">{t.info}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Action / Hotline CTA */}
      <section className="cta-banner-section" id="contact">
        <div className="cta-backdrop-glow" />
        <div className="container">
          <div className="cta-editorial-box">
            <div className="cta-left">
              <span className="cta-eyebrow">KHỞI ĐẦU HÀNH TRÌNH MỚI</span>
              <h2 className="cta-heading">Sẵn sàng trải nghiệm mẫu xe mơ ước của bạn?</h2>
              <p className="cta-sub">
                Đội ngũ cố vấn kỹ thuật và tài chính của AutoViet sẵn sàng đồng hành cùng bạn 24/7.
              </p>
            </div>
            <div className="cta-right">
              <a href="tel:18001234" className="btn btn-primary btn-xl">
                <IconPhone size={18} />
                <span>Hotline: 1800 1234</span>
              </a>
              <button
                type="button"
                className="btn btn-secondary btn-xl"
                onClick={() => {
                  scrollTo('cars');
                  showToast('Hãy chọn bất kỳ mẫu xe nào để đăng ký lái thử trực tiếp!');
                }}
              >
                <span>Xem danh sách xe</span>
                <IconArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-content-row">
          <div className="footer-brand">
            <div className="footer-logo">
              AUTO<span className="accent-text">VIET</span>
            </div>
            <p className="footer-tagline">
              Hệ thống sàn giao dịch ô tô & nền tảng phân tích hành vi người dùng (User Tracking) hàng đầu Việt Nam.
            </p>
          </div>
          <div className="footer-copyright">
            © 2026 AutoViet Platform. Designed with Impeccable & Taste-Skill Standards.
          </div>
        </div>
      </footer>

      {/* Interactive Detail Modal with Realtime Chronometer */}
      {selectedCar && (
        <CarModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          trackingInfo={trackingData[selectedCar.id]}
          onRecordTime={handleRecordTimeSpent}
        />
      )}
    </div>
  );
}
