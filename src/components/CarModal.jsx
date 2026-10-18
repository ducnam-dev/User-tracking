import { useEffect, useState, useRef } from 'react';
import { formatDuration } from '../utils/tracking';

export default function CarModal({ car, onClose, trackingInfo, onRecordTime }) {
  const [secondsViewed, setSecondsViewed] = useState(0);
  const secondsRef = useRef(0);

  // Cập nhật ref để lấy giá trị mới nhất khi unmount
  useEffect(() => {
    secondsRef.current = secondsViewed;
  }, [secondsViewed]);

  // Bộ đếm thời gian xem xe realtime
  useEffect(() => {
    if (!car) return;
    setSecondsViewed(0);
    secondsRef.current = 0;

    const timer = setInterval(() => {
      setSecondsViewed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      // Ghi nhận thời gian người này đã xem xe khi đóng popup
      if (secondsRef.current > 0 && onRecordTime) {
        onRecordTime(car.id, secondsRef.current);
      }
    };
  }, [car?.id]);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!car) return null;

  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' triệu';
  const totalViews = trackingInfo ? (trackingInfo.views || 0) : 0;
  const totalTime = trackingInfo ? (trackingInfo.totalTime || 0) : 0;

  // Format giây xem thành mm:ss
  const formatLiveTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        {/* Header / Image */}
        <div className="modal-header">
          <img
            src={car.image}
            alt={car.name}
            className="modal-car-image"
          />
          <button className="modal-close" onClick={onClose} title="Đóng">
            ✕
          </button>

          {/* Floating Live Tracking Banner on Image */}
          <div className="modal-live-tracker">
            <span className="live-pulse" />
            <span>Đang tính thời gian xem: </span>
            <strong className="live-timer">{formatLiveTimer(secondsViewed)}</strong>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Tracking Stats Bar */}
          <div className="modal-tracking-bar">
            <div className="mt-item">
              <span className="mt-icon">👁️</span>
              <div>
                <span className="mt-label">Lượt xem xe:</span>
                <span className="mt-val">{totalViews} lượt</span>
              </div>
            </div>
            <div className="mt-item">
              <span className="mt-icon">⏱️</span>
              <div>
                <span className="mt-label">Tổng thời gian xem:</span>
                <span className="mt-val">{formatDuration(totalTime + secondsViewed)}</span>
              </div>
            </div>
            <div className="mt-item">
              <span className="mt-icon">⏳</span>
              <div>
                <span className="mt-label">Phiên xem này:</span>
                <span className="mt-val live-badge">{secondsViewed}s</span>
              </div>
            </div>
          </div>

          <p className="modal-brand">{car.brand}</p>
          <h2 className="modal-title">{car.name}</h2>
          <p className="modal-year">
            Năm sản xuất: {car.year} &nbsp;|&nbsp; Màu sắc: {car.color} &nbsp;|&nbsp; Số km: {car.mileage}
          </p>

          {/* Specs Grid */}
          <div className="modal-specs-grid">
            <div className="modal-spec-item">
              <div className="modal-spec-icon">⛽</div>
              <div className="modal-spec-label">Nhiên liệu</div>
              <div className="modal-spec-value">{car.fuel}</div>
            </div>
            <div className="modal-spec-item">
              <div className="modal-spec-icon">⚙️</div>
              <div className="modal-spec-label">Hộp số</div>
              <div className="modal-spec-value">{car.transmission}</div>
            </div>
            <div className="modal-spec-item">
              <div className="modal-spec-icon">🔧</div>
              <div className="modal-spec-label">Động cơ</div>
              <div className="modal-spec-value">{car.engine}</div>
            </div>
            <div className="modal-spec-item">
              <div className="modal-spec-icon">💺</div>
              <div className="modal-spec-label">Chỗ ngồi</div>
              <div className="modal-spec-value">{car.seats} chỗ</div>
            </div>
            <div className="modal-spec-item">
              <div className="modal-spec-icon">⭐</div>
              <div className="modal-spec-label">Đánh giá</div>
              <div className="modal-spec-value">{car.rating}/5 ({car.reviews})</div>
            </div>
            <div className="modal-spec-item">
              <div className="modal-spec-icon">📋</div>
              <div className="modal-spec-label">Tình trạng</div>
              <div className="modal-spec-value">{car.type}</div>
            </div>
          </div>

          {/* Description */}
          <p className="modal-desc">{car.description}</p>

          {/* Price + CTA */}
          <div className="modal-price-row">
            <div>
              <p className="modal-price-label">Giá bán niêm yết</p>
              <p className="modal-price-value">{formatPrice(car.price)}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-contact">
                📞 Liên hệ báo giá
              </button>
              <button
                className="btn btn-ghost"
                style={{ borderRadius: 'var(--radius-sm)', padding: '12px 20px' }}
              >
                📅 Đặt lịch lái thử
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
