import instance from "@/config/axiosConfig";

export const getAllMembershipPackages = async () => {
  return instance.get(`/membership-packages`);
};
