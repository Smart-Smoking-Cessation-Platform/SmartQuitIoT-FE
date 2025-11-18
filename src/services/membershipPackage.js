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

export const getAllMembershipSubscriptions = async (
  page,
  size,
  sortBy,
  sortDir,
  orderCode,
  status
) => {
  return instance.get(
    `/membership-subscriptions/all?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&orderCode=${orderCode}&status=${status}`
  );
};
