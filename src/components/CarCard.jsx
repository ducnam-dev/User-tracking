import { formatDuration } from '../utils/tracking';
import {
  IconEye,
  IconClock,
  IconFuel,
  IconGauge,
  IconSeat,
  IconStar,
  IconHeart,
  IconShare,
  IconArrowRight,
  IconSparkles,
} from './Icons';

export default function CarCard({ car, onViewDetail, animDelay = 0, trackingInfo, isMostViewed }) {
  const formatPrice = (price) => {
    // Format dạng 1.850 triệu -> 1,85 tỷ hoặc 1.850 Triệu VNĐ
    if (price >= 1000) {
      const ty = (price / 1000).toFixed(2).replace(/\.00$/, '');
      return `${ty} Tỷ VNĐ`;
    }
    return `${price} Triệu VNĐ`;
  };

  const views = trackingInfo?.views || 0;
  const totalTime = trackingInfo?.totalTime || 0;

  return (
    <article
      className={`car-card ${isMostViewed && views > 0 ? 'is-leader' : ''}`}
      style={{ animationDelay: `${animDelay}ms` }}
      onClick={() => onViewDetail(car)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetail(car);
        }
      }}
    >
      {/* Top Engagement Leader Ribbon */}
      {isMostViewed && views > 0 && (
        <div className="card-leader-ribbon">
          <span className="live-status-dot" />
          <span>TOP 1 XEM NHIỀU NHẤT ({views} LƯỢT)</span>
        </div>
      )}

      {/* Visual / Image Section */}
      <div className="car-card-visual">
        <img
          src={car.image}
          alt={car.name}
          className="car-card-img"
          loading="lazy"
        />
        <div className="car-card-gradient-overlay" />

        {/* Status badges */}
        <div className="card-top-badges">
          <span className={`tag-badge ${car.type === 'Mới' ? 'tag-new' : 'tag-certified'}`}>
            {car.type === 'Mới' ? 'MỚI 100%' : 'ĐÃ KIỂM ĐỊNH'}
          </span>
          {car.status === 'hot' && (
            <span className="tag-badge tag-hot">
              <IconSparkles size={11} />
              <span>NỔI BẬT</span>
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="card-hover-actions">
          <button
            type="button"
            className="card-action-btn"
            title="Lưu yêu thích"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <IconHeart size={15} />
          </button>
          <button
            type="button"
            className="card-action-btn"
            title="Chia sẻ liên kết"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard?.writeText(window.location.href);
            }}
          >
            <IconShare size={15} />
          </button>
        </div>
      </div>

      {/* Card Content & Telemetry */}
      <div className="car-card-content">
        {/* Live User Tracking Telemetry Bar */}
        <div className="card-telemetry-strip" title="Dữ liệu User Tracking thực tế">
          <div className="telemetry-chip views-chip">
            <IconEye size={13} className="telemetry-icon" />
            <span className="telemetry-num">{views}</span>
            <span className="telemetry-label">lượt xem</span>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-chip time-chip">
            <IconClock size={13} className="telemetry-icon" />
            <span className="telemetry-num">{formatDuration(totalTime)}</span>
            <span className="telemetry-label">dừng xem</span>
          </div>
        </div>

        {/* Brand & Rating Header */}
        <div className="car-identity-row">
          <span className="car-brand-name">{car.brand}</span>
          <div className="car-rating-node">
            <IconStar size={13} className="star-gold" />
            <span className="rating-score">{car.rating}</span>
            <span className="rating-count">({car.reviews})</span>
          </div>
        </div>

        <h3 className="car-title">{car.name}</h3>

        <div className="car-meta-subtitle">
          <span>Năm {car.year}</span>
          <span className="dot-divider">•</span>
          <span>{car.color}</span>
          <span className="dot-divider">•</span>
          <span>{car.mileage}</span>
        </div>

        {/* Technical Specification Chips */}
        <div className="car-spec-grid">
          <div className="spec-tile" title="Loại nhiên liệu">
            <IconFuel size={14} className="spec-tile-icon" />
            <span className="spec-tile-text">{car.fuel}</span>
          </div>
          <div className="spec-tile" title="Hộp số truyền động">
            <IconGauge size={14} className="spec-tile-icon" />
            <span className="spec-tile-text">{car.transmission}</span>
          </div>
          <div className="spec-tile" title="Số lượng ghế">
            <IconSeat size={14} className="spec-tile-icon" />
            <span className="spec-tile-text">{car.seats} chỗ</span>
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="car-bottom-row">
          <div className="car-price-block">
            <span className="price-lead">Giá niêm yết</span>
            <div className="price-main">{formatPrice(car.price)}</div>
          </div>
          <button
            type="button"
            className="btn-inspect"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(car);
            }}
          >
            <span>Chi tiết</span>
            <IconArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
