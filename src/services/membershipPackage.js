import instance from "@/config/axiosConfig";

export const getAllMembershipPackages = async () => {
  return instance.get(`/membership-packages`);
};

export const getMembershipPackagesStatistics = async () => {
  return instance.get(`/membership-packages/statistics`);
};

export const getPaymentStatistics = async () => {
  return instance.get(`/payment/statistics`);
};
