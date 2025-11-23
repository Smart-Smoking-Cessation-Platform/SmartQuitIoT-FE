import instance from "@/config/axiosConfig";

export const getAllMembershipPackages = async () => {
  return instance.get(`/membership-packages`);
};

export const getMembershipPackagesStatistics = async () => {
  return instance.get(`/membership-packages/statistics`);
};

export const getPaymentStatistics = async () => {
  return instance.get(`/payments/statistics`);
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

export const getMembershipPackagesDetail = async (id) => {
  return instance.get(`/membership-packages/detail/${id}`);
};

export const updateMembershipPackage = async (id, newPrice) => {
  return instance.put(`/membership-packages/update`, {
    membershipPackageId: id,
    price: newPrice,
  });
};
