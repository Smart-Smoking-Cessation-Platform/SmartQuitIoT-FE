import instance from "@/config/axiosConfig";

export const getAllSlots = async (page, size) => {
  return instance.get(`/slots?page=${page}&size=${size}`);
};
