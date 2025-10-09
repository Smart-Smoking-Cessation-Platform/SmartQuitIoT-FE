import instance from "@/config/axiosConfig";

export const getAdminProfile = async () => {
  return instance.get(`/accounts/p`);
};
