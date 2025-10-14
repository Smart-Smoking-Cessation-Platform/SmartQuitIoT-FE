import instance from "@/config/axiosConfig";

/**
 * GET: Danh sách lịch trong tháng hiện tại và tương lai
 * @param {number} year - Năm muốn lấy
 * @param {number} month - Tháng muốn lấy
 */
export const getMonthlySchedules = async (year, month) => {
  return instance.get(`/admin/schedules`, {
    params: { year, month },
  });
};

/**
 * PUT: Cập nhật lịch cho 1 ngày cụ thể
 * @param {string} date - Ngày dạng "YYYY-MM-DD"
 * @param {object} body - Dữ liệu update { addCoachIds: [], removeCoachIds: [] }
 */
export const updateScheduleByDate = async (date, body) => {
  return instance.put(`/admin/schedules/${date}`, body);
};

/**
 * GET: Lấy danh sách tất cả coach đang hoạt động
 */
export const getAllCoaches = async () => {
  return instance.get(`/coaches`);
};

/**
 * POST: Gán lịch cho danh sách coach và ngày
 */
export const assignSchedules = async (body) => {
  return instance.post(`/admin/schedules/assign`, body);
};
