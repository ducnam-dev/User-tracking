// Quản lý theo dõi người dùng (User Tracking Analytics)
const STORAGE_KEY = 'autoviet_car_tracking_v1';
const USER_KEY = 'autoviet_visitor_id';

// Lấy hoặc khởi tạo ID người dùng ngẫu nhiên
export function getVisitorId() {
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(USER_KEY, id);
  }
  return id;
}

// Khởi tạo dữ liệu tracking mặc định với các số liệu tự nhiên ban đầu
const initialTrackingData = {
  1: { views: 42, totalTime: 380, uniqueVisitors: ['u1', 'u2', 'u3'] }, // Toyota Camry
  2: { views: 68, totalTime: 620, uniqueVisitors: ['u1', 'u4', 'u5', 'u6'] }, // Mercedes C200 AMG (Top 1)
  3: { views: 25, totalTime: 210, uniqueVisitors: ['u2', 'u7'] }, // Honda CR-V
  4: { views: 54, totalTime: 510, uniqueVisitors: ['u3', 'u8', 'u9'] }, // BMW X5
  5: { views: 61, totalTime: 590, uniqueVisitors: ['u1', 'u5', 'u10'] }, // VinFast VF 8
  6: { views: 18, totalTime: 140, uniqueVisitors: ['u4'] }, // Hyundai Tucson
  7: { views: 36, totalTime: 340, uniqueVisitors: ['u6', 'u7'] }, // Audi Q7
  8: { views: 29, totalTime: 260, uniqueVisitors: ['u8'] }, // Mazda CX-5
  9: { views: 22, totalTime: 195, uniqueVisitors: ['u9'] }, // Ford Ranger
};

// Đọc toàn bộ dữ liệu tracking
export function getTrackingData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTrackingData));
      return { ...initialTrackingData };
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Lỗi đọc tracking data:', err);
    return { ...initialTrackingData };
  }
}

// Lưu dữ liệu tracking
function saveTrackingData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Lỗi ghi tracking data:', err);
  }
}

// Ghi nhận lượt xem ô tô
export function recordCarView(carId) {
  const data = getTrackingData();
  const visitorId = getVisitorId();

  if (!data[carId]) {
    data[carId] = { views: 0, totalTime: 0, uniqueVisitors: [] };
  }

  data[carId].views = (data[carId].views || 0) + 1;

  if (!Array.isArray(data[carId].uniqueVisitors)) {
    data[carId].uniqueVisitors = [];
  }
  if (!data[carId].uniqueVisitors.includes(visitorId)) {
    data[carId].uniqueVisitors.push(visitorId);
  }

  saveTrackingData(data);
  return data;
}

// Ghi nhận thời gian xem ô tô (tính bằng giây)
export function recordCarTimeSpent(carId, seconds) {
  if (seconds <= 0) return getTrackingData();

  const data = getTrackingData();
  if (!data[carId]) {
    data[carId] = { views: 1, totalTime: 0, uniqueVisitors: [getVisitorId()] };
  }

  data[carId].totalTime = (data[carId].totalTime || 0) + Math.round(seconds);
  saveTrackingData(data);
  return data;
}

// Đặt lại dữ liệu về ban đầu (cho việc kiểm tra/demo)
export function resetTrackingData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTrackingData));
  return { ...initialTrackingData };
}

// Xóa trắng toàn bộ về 0
export function clearAllTrackingData() {
  const emptyData = {};
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyData));
  return emptyData;
}

// Định dạng thời gian hiển thị (ví dụ: 1m 25s hoặc 45s)
export function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds < 1) return '0s';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}
