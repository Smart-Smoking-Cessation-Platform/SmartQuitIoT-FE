import instance from "@/config/axiosConfig";

export const getAllMission = async (page, size) => {
  return instance.get(`/missions?page=${page}&size=${size}`);
};
