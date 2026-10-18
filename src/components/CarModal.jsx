import { useEffect, useState, useRef } from 'react';
import { formatDuration } from '../utils/tracking';
import {
  IconClose,
  IconEye,
  IconClock,
  IconFuel,
  IconGauge,
  IconSeat,
  IconShield,
  IconCheck,
  IconStar,
  IconPhone,
  IconActivity,
} from './Icons';

export default function CarModal({ car, onClose, trackingInfo, onRecordTime }) {
  const [secondsViewed, setSecondsViewed] = useState(0);
  const secondsRef = useRef(0);

  useEffect(() => {
    secondsRef.current = secondsViewed;
  }, [secondsViewed]);

  // Realtime Dwell-Time Chronometer
  useEffect(() => {
    if (!car) return;
    setSecondsViewed(0);
    secondsRef.current = 0;

    const timer = setInterval(() => {
      setSecondsViewed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (secondsRef.current > 0 && onRecordTime) {
        onRecordTime(car.id, secondsRef.current);
      }
    };
  }, [car?.id]);

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

  const formatPrice = (price) => {
    if (price >= 1000) {
      const ty = (price / 1000).toFixed(2).replace(/\.00$/, '');
      return `${ty} Tỷ VNĐ (${price.toLocaleString('vi-VN')} Triệu)`;
    }
    return `${price.toLocaleString('vi-VN')} Triệu VNĐ`;
  };

  const totalViews = trackingInfo?.views || 0;
  const totalTime = trackingInfo?.totalTime || 0;

  const formatChronometer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-container">
        {/* Modal Visual Header */}
        <div className="modal-hero">
          <img
            src={car.image}
            alt={car.name}
            className="modal-hero-img"
          />
          <div className="modal-hero-overlay" />

          {/* Close button */}
          <button
            type="button"
            className="modal-close-trigger"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
          >
            <IconClose size={20} />
          </button>

          {/* Live Tracking HUD Banner */}
          <div className="modal-hud-telemetry">
            <span className="live-status-dot" />
            <span className="hud-telemetry-text">ĐANG ĐO THỜI LƯỢNG QUAN TÂM (DWELL TIME):</span>
            <span className="hud-telemetry-timer">{formatChronometer(secondsViewed)}</span>
          </div>

          <div className="modal-title-overlay">
            <span className="modal-brand-tag">{car.brand} • {car.year}</span>
            <h2 className="modal-car-heading">{car.name}</h2>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="modal-content-scroll">
          {/* Telemetry Realtime Metrics Ribbon */}
          <div className="modal-telemetry-ribbon">
            <div className="mtr-item">
              <IconEye size={16} className="mtr-icon-cyan" />
              <div className="mtr-text">
                <span className="mtr-caption">Lượt xem xe này</span>
                <span className="mtr-val">{totalViews} lượt</span>
              </div>
            </div>
            <div className="mtr-divider" />
            <div className="mtr-item">
              <IconClock size={16} className="mtr-icon-amber" />
              <div className="mtr-text">
                <span className="mtr-caption">Tổng thời lượng xem</span>
                <span className="mtr-val">{formatDuration(totalTime + secondsViewed)}</span>
              </div>
            </div>
            <div className="mtr-divider" />
            <div className="mtr-item">
              <IconActivity size={16} className="mtr-icon-green" />
              <div className="mtr-text">
                <span className="mtr-caption">Trạng thái ghi nhận</span>
                <span className="mtr-val-live">Đang ghi vết</span>
              </div>
            </div>
          </div>

          {/* Price & Rating Header */}
          <div className="modal-price-rating-row">
            <div>
              <span className="modal-label-sub">Giá chào bán chính thức</span>
              <div className="modal-price-display">{formatPrice(car.price)}</div>
            </div>
            <div className="modal-rating-badge">
              <IconStar size={16} className="star-gold" />
              <span className="m-score">{car.rating}</span>
              <span className="m-reviews">/ 5.0 ({car.reviews} đánh giá)</span>
            </div>
          </div>

          {/* Description */}
          <div className="modal-description-box">
            <h4 className="box-heading">Thông Tin Chi Tiết & Tình Trạng</h4>
            <p className="modal-desc-body">{car.description}</p>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="modal-spec-section">
            <h4 className="box-heading">Thông Số Kỹ Thuật Chính</h4>
            <div className="modal-specs-matrix">
              <div className="matrix-tile">
                <IconFuel size={16} className="matrix-icon" />
                <div>
                  <span className="matrix-title">Nhiên liệu</span>
                  <span className="matrix-value">{car.fuel}</span>
                </div>
              </div>
              <div className="matrix-tile">
                <IconGauge size={16} className="matrix-icon" />
                <div>
                  <span className="matrix-title">Hộp số</span>
                  <span className="matrix-value">{car.transmission}</span>
                </div>
              </div>
              <div className="matrix-tile">
                <IconSeat size={16} className="matrix-icon" />
                <div>
                  <span className="matrix-title">Số chỗ ngồi</span>
                  <span className="matrix-value">{car.seats} chỗ</span>
                </div>
              </div>
              <div className="matrix-tile">
                <IconShield size={16} className="matrix-icon" />
                <div>
                  <span className="matrix-title">Động cơ</span>
                  <span className="matrix-value">{car.engine}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Guarantee */}
          <div className="modal-guarantee-strip">
            <div className="guarantee-icon-wrap">
              <IconShield size={20} className="shield-icon" />
            </div>
            <div className="guarantee-info">
              <span className="guarantee-title">Tiêu chuẩn kiểm định AutoViet Certified 200 điểm</span>
              <p className="guarantee-desc">
                Cam kết không đâm đụng ngập nước, bảo hành động cơ và hộp số 12 tháng hoặc 20.000 km.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Call To Action */}
        <div className="modal-footer-cta">
          <div className="footer-timer-note">
            <IconClock size={14} />
            <span>Thời lượng phiên xem này: <strong>{formatChronometer(secondsViewed)}</strong></span>
          </div>
          <div className="footer-actions-group">
            <a href="tel:18001234" className="btn btn-secondary">
              <IconPhone size={15} />
              <span>Gọi tư vấn: 1800 1234</span>
            </a>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                alert(`Đã gửi yêu cầu đăng ký lái thử mẫu xe: ${car.name}. Chuyên viên tư vấn sẽ liên hệ bạn ngay!`);
                onClose();
              }}
            >
              <IconCheck size={15} />
              <span>Đăng ký lái thử xe này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
