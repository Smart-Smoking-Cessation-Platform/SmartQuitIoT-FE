// src/services/achievementService.js
import instance from "@/config/axiosConfig";

export const getAllAchievements = async (page, size, search) => {
  return instance.get(
    `/achievement/all?page=${page}&size=${size}&search=${search}`
  );
};
