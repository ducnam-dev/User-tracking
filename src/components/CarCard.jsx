import { formatDuration } from '../utils/tracking';

export default function CarCard({ car, onViewDetail, animDelay = 0, trackingInfo, isMostViewed }) {
  const statusMap = {
    hot: { label: '🔥 HOT', cls: 'badge-hot' },
    new: { label: '✨ MỚI', cls: 'badge-new' },
    normal: null,
  };

  const typeMap = {
    'Mới': 'badge-new',
    'Cũ': 'badge-used',
  };

  const statusBadge = statusMap[car.status];
  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' triệu';

  const views = trackingInfo ? (trackingInfo.views || 0) : 0;
  const totalTime = trackingInfo ? (trackingInfo.totalTime || 0) : 0;

  return (
    <article
      className={`car-card ${isMostViewed ? 'most-viewed-card' : ''}`}
      style={{ animationDelay: `${animDelay}ms` }}
      onClick={() => onViewDetail(car)}
    >
      {/* Top 1 Badge */}
      {isMostViewed && views > 0 && (
        <div className="card-top-tag">
          <span>🏆 Xem nhiều nhất ({views} lượt)</span>
        </div>
      )}

      {/* Image */}
      <div className="car-card-image-wrapper">
        <img
          src={car.image}
          alt={car.name}
          className="car-card-image"
          loading="lazy"
        />
        <div className="car-card-overlay" />

        {/* Hover actions */}
        <div className="card-actions">
          <button
            className="action-btn"
            title="Yêu thích"
            onClick={(e) => { e.stopPropagation(); }}
          >
            🤍
          </button>
          <button
            className="action-btn"
            title="So sánh"
            onClick={(e) => { e.stopPropagation(); }}
          >
            ⚖️
          </button>
          <button
            className="action-btn"
            title="Chia sẻ"
            onClick={(e) => { e.stopPropagation(); }}
          >
            🔗
          </button>
        </div>

        {/* Badges */}
        <div className="card-badge-wrapper">
          <span className={`badge ${typeMap[car.type]}`}>{car.type}</span>
          {statusBadge && (
            <span className={`badge ${statusBadge.cls}`}>{statusBadge.label}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="car-card-body">
        {/* User Tracking Stats Row */}
        <div className="car-tracking-stats">
          <span className="tracking-item views" title="Tổng số lượt xem">
            👁️ <strong>{views}</strong> lượt xem
          </span>
          <span className="tracking-item time" title="Tổng thời gian người dùng xem xe này">
            ⏱️ <strong>{formatDuration(totalTime)}</strong>
          </span>
        </div>

        <div className="car-brand-row">
          <span className="car-brand">{car.brand}</span>
          <span className="car-rating">
            ⭐ {car.rating} <span style={{ color: 'var(--text-muted)', marginLeft: 2 }}>({car.reviews})</span>
          </span>
        </div>

        <h3 className="car-name">{car.name}</h3>
        <p className="car-year">
          {car.year} • {car.color} • {car.mileage}
        </p>

        {/* Specs */}
        <div className="car-specs">
          <div className="spec-item">
            <span className="spec-icon">⛽</span>
            <span className="spec-label">Nhiên liệu</span>
            <span className="spec-value">{car.fuel}</span>
          </div>
          <div className="spec-item">
            <span className="spec-icon">⚙️</span>
            <span className="spec-label">Hộp số</span>
            <span className="spec-value">{car.transmission}</span>
          </div>
          <div className="spec-item">
            <span className="spec-icon">💺</span>
            <span className="spec-label">Chỗ ngồi</span>
            <span className="spec-value">{car.seats} chỗ</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="car-price-row">
          <div className="car-price">
            <span className="price-label">Giá bán</span>
            <div>
              <span className="price-value">{formatPrice(car.price)}</span>
            </div>
          </div>
          <button
            className="btn-detail"
            onClick={(e) => { e.stopPropagation(); onViewDetail(car); }}
          >
            Xem chi tiết →
          </button>
        </div>
      </div>
    </article>
  );
}
