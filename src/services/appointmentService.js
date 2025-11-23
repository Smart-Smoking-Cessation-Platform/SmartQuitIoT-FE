import instance from "@/config/axiosConfig";

/**
 * Lấy danh sách appointment cho coach hiện tại (server xác định coach từ token)
 * GET /api/appointments?status=&date=&page=&size=
 * @param {Object} opts
 * @param {string} [opts.status] - PENDING|IN_PROGRESS|COMPLETED|CANCELLED
 * @param {string} [opts.date] - yyyy-MM-dd
 * @param {number} [opts.page] - default 0
 * @param {number} [opts.size] - default 10
 * @returns Promise<AxiosResponse>
 */
export const listCoachAppointments = (opts = {}) => {
  const { status, date, page = 0, size = 10 } = opts;
  return instance.get("/appointments", {
    params: { status, date, page, size },
  });
};

/**
 * Lấy chi tiết 1 appointment (server kiểm tra quyền: coach only có thể lấy appointment liên quan)
 * GET /api/appointments/{id}
 */
export const getAppointmentDetailForCoach = (appointmentId) => {
  return instance.get(`/appointments/${appointmentId}`);
};

/**
 * Coach hủy appointment (xóa row) - endpoint dành cho coach
 * DELETE /api/appointments/{appointmentId}/by-coach
 */
export const cancelAppointmentByCoach = (appointmentId) => {
  return instance.delete(`/appointments/${appointmentId}/by-coach`);
};

/**
 * Yêu cầu join token (Agora) cho appointment (coach gọi khi trong join window)
 * POST /api/appointments/{appointmentId}/join-token
 */
export const requestJoinToken = (appointmentId) => {
  return instance.post(`/appointments/${appointmentId}/join-token`);
};

/**
 * Lấy appointment trong tương lai (ví dụ: từ hôm nay trở đi — tiện cho UI "upcoming"
 * Sử dụng backend filter date bằng param `date`
 */
export const getUpcomingAppointments = ({
  fromDate = new Date().toISOString().slice(0, 10),
  page = 0,
  size = 50,
} = {}) => {
  // Note: backend treats `date` param as filter (implementation backend might vary)
  return listCoachAppointments({ date: fromDate, page, size });
};

//  PUT endpoint to mark appointment completed by coach
export const completeAppointmentByCoach = (appointmentId) => {
  return instance.put(`/appointments/${appointmentId}/complete`);
};

/**
 * Lưu snapshots cho appointment
 * POST /appointments/{appointmentId}/snapshots
 * @param {number} appointmentId
 * @param {string[]} imageUrls - Array of Cloudinary URLs
 * @returns Promise<AxiosResponse>
 */
export const saveAppointmentSnapshots = (appointmentId, imageUrls) => {
  return instance.post(`/appointments/${appointmentId}/snapshots`, {
    imageUrls: imageUrls,
  });
};

/**
 * Lấy snapshots của appointment (bằng chứng)
 * GET /appointments/{appointmentId}/snapshots
 * @param {number} appointmentId
 * @returns Promise<AxiosResponse> - Response có data là array of image URLs
 */
export const getAppointmentSnapshots = (appointmentId) => {
  return instance.get(`/appointments/${appointmentId}/snapshots`);
};

export default {
  listCoachAppointments,
  getAppointmentDetailForCoach,
  cancelAppointmentByCoach,
  requestJoinToken,
  getUpcomingAppointments,
  completeAppointmentByCoach,
  saveAppointmentSnapshots,
  getAppointmentSnapshots,
};
