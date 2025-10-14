import instance from "@/config/axiosConfig";

export const getAllCoaches = async () => {
  return instance.get("/coaches");
};

export const assignSchedules = async (body) => {
  return instance.post("/admin/schedules/assign", body);
};
