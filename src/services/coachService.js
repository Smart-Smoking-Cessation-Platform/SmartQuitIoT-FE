import instance from "@/config/axiosConfig";

export const getAllPagedCoaches = async (page, size, search, sortBy) => {
  return instance.get(
    `/coaches/all?page=${page}&size=${size}&searchString=${search}&sortBy=${sortBy}`
  );
};

export const getCoachById = async (id) => {
  return instance.get(`/coaches/${id}`);
};

export const getCoachStatistics = async () => {
  return instance.get(`/coaches/statistics`);
};
