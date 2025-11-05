import instance from "@/config/axiosConfig";

export const getMemberMetrics = async (memberId) => {
  return instance.get(`/metrics/health-data/${memberId}`);
};
