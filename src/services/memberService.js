import instance from "@/config/axiosConfig";

export const getAllMembers = async (page, size, search) => {
  return instance.get(
    `/members/manage?page=${page}&size=${size}&search=${search}`
  );
};

export const getMemberById = async (id) => {
  return instance.get(`/members/${id}`);
};

export const getMembersForCoach = (params = {}) => {
  return instance.get("/members/summary", { params });
};

export default {
  getMembersForCoach,
  getMemberById,
};
