import { formatDuration } from '../utils/tracking';
import {
  IconActivity,
  IconEye,
  IconClock,
  IconArrowRight,
  IconRefresh,
  IconTrash,
  IconSparkles,
  IconCar,
} from './Icons';

export default function TrackingDashboard({ cars, trackingData, onSelectCar, onResetData, onClearData }) {
  // Combine car data with telemetry tracking records
  const carsWithTracking = cars.map((car) => {
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

  // Top by views
  const sortedByViews = [...carsWithTracking].sort((a, b) => b.views - a.views);
  const mostViewedCar = sortedByViews[0] || null;

  // Top by total dwell time
  const sortedByTime = [...carsWithTracking].sort((a, b) => b.totalTime - a.totalTime);
  const mostEngagedCar = sortedByTime[0] || null;

  // Fleet Totals
  const totalViews = carsWithTracking.reduce((sum, c) => sum + c.views, 0);
  const totalDuration = carsWithTracking.reduce((sum, c) => sum + c.totalTime, 0);
  const maxViews = Math.max(...carsWithTracking.map((c) => c.views), 1);
  const avgFleetDwell = totalViews > 0 ? Math.round(totalDuration / totalViews) : 0;

  return (
    <section className="section telemetry-section" id="analytics">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <div className="section-kicker">
              <span className="live-status-dot" />
              <span>REAL-TIME USER TRACKING ENGINE</span>
            </div>
            <h2 className="section-title">Trung Tâm Phân Tích Hành Vi Người Dùng</h2>
            <p className="section-desc">
              Hệ thống tự động đo lường số lượt truy cập (Pageviews) và thời gian tương tác thực tế (Dwell Time) trên từng mẫu xe nhằm nhận diện xu hướng thị hiếu khách hàng.
            </p>
          </div>

          {/* Quick controls */}
          <div className="telemetry-controls-group">
            <button
              type="button"
              className="btn btn-control"
              onClick={onResetData}
              title="Đặt lại bộ số liệu mẫu demo"
            >
              <IconRefresh size={14} />
              <span>Nạp lại Data mẫu</span>
            </button>
            <button
              type="button"
              className="btn btn-control-danger"
              onClick={onClearData}
              title="Xóa trắng toàn bộ số liệu về 0 để thử nghiệm từ đầu"
            >
              <IconTrash size={14} />
              <span>Đặt về 0 để Test</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div className="telemetry-kpi-grid">
          {/* Card 1: Top 1 Lượt Xem */}
          <div className="telemetry-kpi-card kpi-card-views">
            <div className="kpi-header">
              <span className="kpi-tag-cyan">TOP 1 VIEW COUNT</span>
              <IconEye size={18} className="kpi-icon-cyan" />
            </div>

            {mostViewedCar && (
              <div className="kpi-vehicle-showcase">
                <img
                  src={mostViewedCar.image}
                  alt={mostViewedCar.name}
                  className="kpi-thumb"
                />
                <div className="kpi-vehicle-info">
                  <h4 className="kpi-vehicle-title">{mostViewedCar.name}</h4>
                  <div className="kpi-main-metric">
                    <span className="kpi-metric-number">{mostViewedCar.views}</span>
                    <span className="kpi-metric-unit">lượt xem</span>
                  </div>
                  <div className="kpi-meta-line">
                    <span>Tổng thời lượng: <strong>{formatDuration(mostViewedCar.totalTime)}</strong></span>
                  </div>
                  <button
                    type="button"
                    className="btn-kpi-action"
                    onClick={() => onSelectCar(mostViewedCar)}
                  >
                    <span>Xem xe này</span>
                    <IconArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Top 1 Dwell Time */}
          <div className="telemetry-kpi-card kpi-card-dwell">
            <div className="kpi-header">
              <span className="kpi-tag-amber">TOP 1 ENGAGEMENT (DWELL TIME)</span>
              <IconClock size={18} className="kpi-icon-amber" />
            </div>

            {mostEngagedCar && (
              <div className="kpi-vehicle-showcase">
                <img
                  src={mostEngagedCar.image}
                  alt={mostEngagedCar.name}
                  className="kpi-thumb"
                />
                <div className="kpi-vehicle-info">
                  <h4 className="kpi-vehicle-title">{mostEngagedCar.name}</h4>
                  <div className="kpi-main-metric">
                    <span className="kpi-metric-number text-amber">{formatDuration(mostEngagedCar.totalTime)}</span>
                    <span className="kpi-metric-unit">thời gian dừng xem</span>
                  </div>
                  <div className="kpi-meta-line">
                    <span>Trung bình: <strong>{formatDuration(mostEngagedCar.avgTime)}/lượt</strong></span>
                  </div>
                  <button
                    type="button"
                    className="btn-kpi-action"
                    onClick={() => onSelectCar(mostEngagedCar)}
                  >
                    <span>Xem xe này</span>
                    <IconArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Fleet Overview Stats */}
          <div className="telemetry-kpi-card kpi-card-summary">
            <div className="kpi-header">
              <span className="kpi-tag-slate">TỔNG HỢP HỆ THỐNG</span>
              <IconActivity size={18} className="kpi-icon-slate" />
            </div>

            <div className="kpi-stat-stack">
              <div className="stat-row">
                <span className="stat-label">Tổng lượt xem ô tô</span>
                <span className="stat-val font-tabular">{totalViews.toLocaleString('vi-VN')} lượt</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Tổng thời gian dừng xem</span>
                <span className="stat-val font-tabular text-amber">{formatDuration(totalDuration)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Mẫu xe trong hệ thống</span>
                <span className="stat-val font-tabular">{cars.length} mẫu</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Thời gian xem TB / lượt</span>
                <span className="stat-val font-tabular">{formatDuration(avgFleetDwell)}</span>
              </div>
            </div>

            <div className="kpi-status-footer">
              <span className="live-status-dot" />
              <span className="status-note">Cập nhật tự động sau mỗi phiên duyệt web</span>
            </div>
          </div>
        </div>

        {/* Live Ranking Table */}
        <div className="telemetry-table-wrapper">
          <div className="table-header-strip">
            <div>
              <h3 className="table-heading">Bảng Xếp Hạng Quan Tâm Người Dùng (Live Telemetry Ranking)</h3>
              <p className="table-subheading">Xếp hạng theo tổng lượt xem và thời lượng dừng lại của khách hàng</p>
            </div>
            <div className="table-meta-badge">
              <IconSparkles size={13} />
              <span>DỮ LIỆU TỰ ĐỘNG LƯU TRỮ</span>
            </div>
          </div>

          <div className="table-scroll-container">
            <table className="telemetry-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Thứ hạng</th>
                  <th>Mẫu Ô Tô</th>
                  <th>Hãng sản xuất</th>
                  <th>Lượt xem</th>
                  <th>Mức độ phổ biến</th>
                  <th>Tổng thời lượng xem</th>
                  <th>TB / lượt</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedByViews.map((car, idx) => {
                  const percent = Math.round((car.views / maxViews) * 100);
                  const isTop1 = idx === 0 && car.views > 0;
                  return (
                    <tr key={car.id} className={isTop1 ? 'row-leader' : ''}>
                      <td className="cell-rank">
                        <span className={`rank-badge rank-${idx + 1}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </td>
                      <td className="cell-car-profile">
                        <div className="table-car-media">
                          <img src={car.image} alt={car.name} className="table-car-thumb" />
                          <div className="table-car-details">
                            <span className="table-car-name">{car.name}</span>
                            <span className="table-car-meta">
                              {car.price.toLocaleString('vi-VN')} triệu • {car.year} • {car.fuel}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="brand-pill">{car.brand}</span>
                      </td>
                      <td>
                        <div className="cell-views-block">
                          <span className="views-primary font-tabular">{car.views}</span>
                          <span className="views-sub">lượt</span>
                        </div>
                      </td>
                      <td className="cell-progress">
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="progress-number font-tabular">{percent}%</span>
                      </td>
                      <td>
                        <span className="dwell-pill font-tabular">
                          <IconClock size={12} />
                          <span>{formatDuration(car.totalTime)}</span>
                        </span>
                      </td>
                      <td className="cell-avg font-tabular">
                        {formatDuration(car.avgTime)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-table-inspect"
                          onClick={() => onSelectCar(car)}
                        >
                          <span>Xem chi tiết</span>
                          <IconArrowRight size={13} />
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
