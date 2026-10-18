import { formatDuration } from '../utils/tracking';

export default function TrackingDashboard({ cars, trackingData, onSelectCar, onResetData, onClearData }) {
  // Kết hợp data xe với dữ liệu tracking
  const carsWithTracking = cars.map(car => {
    const track = trackingData[car.id] || { views: 0, totalTime: 0, uniqueVisitors: [] };
    const views = track.views || 0;
    const totalTime = track.totalTime || 0;
    const avgTime = views > 0 ? Math.round(totalTime / views) : 0;
    const visitors = (track.uniqueVisitors && track.uniqueVisitors.length) || 0;
    return {
      ...car,
      views,
      totalTime,
      avgTime,
      visitors,
    };
  });

  // Tìm xe xem nhiều nhất
  const sortedByViews = [...carsWithTracking].sort((a, b) => b.views - a.views);
  const mostViewedCar = sortedByViews[0] || null;

  // Tìm xe có thời gian xem lâu nhất
  const sortedByTime = [...carsWithTracking].sort((a, b) => b.totalTime - a.totalTime);
  const mostEngagedCar = sortedByTime[0] || null;

  // Tính tổng
  const totalViews = carsWithTracking.reduce((sum, c) => sum + c.views, 0);
  const totalDuration = carsWithTracking.reduce((sum, c) => sum + c.totalTime, 0);
  const maxViews = Math.max(...carsWithTracking.map(c => c.views), 1);

  return (
    <section className="section tracking-dashboard-section" id="analytics">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Realtime User Analytics</span>
          <h2 className="section-title">📊 Thống Kê Theo Dõi Người Dùng</h2>
          <p className="section-desc">
            Hệ thống tự động ghi nhận thời gian xem thực tế và xác định dòng xe nào đang nhận được nhiều sự quan tâm nhất
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="analytics-summary-grid">
          {/* Card 1: Top 1 Lượt Xem */}
          <div className="analytics-highlight-card top-viewed">
            <div className="ah-badge">🏆 TOP 1 XEM NHIỀU NHẤT</div>
            {mostViewedCar && (
              <div className="ah-content">
                <img src={mostViewedCar.image} alt={mostViewedCar.name} className="ah-car-thumb" />
                <div className="ah-details">
                  <h4 className="ah-car-name">{mostViewedCar.name}</h4>
                  <div className="ah-metric-highlight">
                    <span className="ah-number">{mostViewedCar.views}</span>
                    <span className="ah-unit">lượt truy cập xem</span>
                  </div>
                  <div className="ah-meta">
                    <span>⏱️ Tổng thời gian: <strong>{formatDuration(mostViewedCar.totalTime)}</strong></span>
                    <span>👥 {mostViewedCar.visitors} người xem</span>
                  </div>
                  <button
                    className="btn btn-primary ah-btn"
                    onClick={() => onSelectCar(mostViewedCar)}
                  >
                    Xem xe này ngay →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Top 1 Thời Gian Dừng Xem */}
          <div className="analytics-highlight-card top-time">
            <div className="ah-badge">⏱️ XEM LÂU NHẤT (DWELL TIME)</div>
            {mostEngagedCar && (
              <div className="ah-content">
                <img src={mostEngagedCar.image} alt={mostEngagedCar.name} className="ah-car-thumb" />
                <div className="ah-details">
                  <h4 className="ah-car-name">{mostEngagedCar.name}</h4>
                  <div className="ah-metric-highlight">
                    <span className="ah-number" style={{ color: '#4cc9f0' }}>{formatDuration(mostEngagedCar.totalTime)}</span>
                    <span className="ah-unit">thời gian xem</span>
                  </div>
                  <div className="ah-meta">
                    <span>👁️ Lượt xem: <strong>{mostEngagedCar.views} lượt</strong></span>
                    <span>⏱️ Trung bình: <strong>{formatDuration(mostEngagedCar.avgTime)}/lượt</strong></span>
                  </div>
                  <button
                    className="btn btn-ghost ah-btn"
                    onClick={() => onSelectCar(mostEngagedCar)}
                  >
                    Xem xe này ngay →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Thống Kê Tổng Quan */}
          <div className="analytics-highlight-card global-stats">
            <div className="ah-badge">📈 TỔNG QUAN HỆ THỐNG</div>
            <div className="global-stats-list">
              <div className="gs-item">
                <span className="gs-label">Tổng lượt xem xe:</span>
                <span className="gs-value">{totalViews.toLocaleString('vi-VN')}</span>
              </div>
              <div className="gs-item">
                <span className="gs-label">Tổng thời lượng xem:</span>
                <span className="gs-value">{formatDuration(totalDuration)}</span>
              </div>
              <div className="gs-item">
                <span className="gs-label">Số mẫu ô tô được theo dõi:</span>
                <span className="gs-value">{cars.length} mẫu xe</span>
              </div>
              <div className="gs-item">
                <span className="gs-label">Thời gian xem TB toàn sàn:</span>
                <span className="gs-value">{formatDuration(totalViews > 0 ? Math.round(totalDuration / totalViews) : 0)}</span>
              </div>
            </div>

            <div className="tracking-actions-row">
              <button className="btn-small-reset" onClick={onResetData} title="Đặt lại dữ liệu mẫu demo">
                🔄 Nạp lại data demo
              </button>
              <button className="btn-small-clear" onClick={onClearData} title="Xóa toàn bộ về 0 để test từ đầu">
                🗑️ Đặt về 0 (Test mới)
              </button>
            </div>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="analytics-table-card">
          <div className="at-header">
            <h3 className="at-title">Bảng Xếp Hạng Quan Tâm Người Dùng (Live Rankings)</h3>
            <span className="at-subtitle">Dữ liệu tự động cập nhật khi bạn click và xem thông tin ô tô</span>
          </div>

          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Hạng</th>
                  <th>Mẫu Ô Tô</th>
                  <th>Hãng</th>
                  <th>Lượt Xem</th>
                  <th>Tỉ lệ phổ biến</th>
                  <th>Tổng Thời Gian Xem</th>
                  <th>Thời Gian TB</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedByViews.map((car, idx) => {
                  const percent = Math.round((car.views / maxViews) * 100);
                  const isTop1 = idx === 0 && car.views > 0;
                  return (
                    <tr key={car.id} className={isTop1 ? 'highlight-row' : ''}>
                      <td className="rank-cell">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </td>
                      <td className="car-name-cell">
                        <div className="car-name-wrapper">
                          <img src={car.image} alt={car.name} className="table-car-img" />
                          <div>
                            <strong>{car.name}</strong>
                            <div className="table-car-sub">{car.price} triệu • {car.year}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-brand">{car.brand}</span></td>
                      <td>
                        <strong className="view-count-text">
                          {car.views}
                        </strong>
                        <span className="sub-unit"> lượt</span>
                        {isTop1 && <span className="badge badge-hot mini-badge">Top 1</span>}
                      </td>
                      <td className="progress-cell">
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="progress-percent">{percent}%</span>
                      </td>
                      <td>
                        <span className="time-badge">⏱️ {formatDuration(car.totalTime)}</span>
                      </td>
                      <td>{formatDuration(car.avgTime)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-table-action"
                          onClick={() => onSelectCar(car)}
                        >
                          👁️ Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
