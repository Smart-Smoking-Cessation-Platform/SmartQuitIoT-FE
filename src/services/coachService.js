import instance from "@/config/axiosConfig";

export const getAllPagedCoaches = async (page, size, search, sortBy) => {
  return instance.get(
    `/coaches/all?page=${page}&size=${size}&searchString=${search}&sortBy=${sortBy}`
  );
};
