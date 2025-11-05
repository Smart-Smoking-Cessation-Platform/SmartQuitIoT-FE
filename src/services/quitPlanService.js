import instance from "@/config/axiosConfig";

export const getQuitPlanByMemberId = async (memberId) => {
  return instance.get(`/quit-plan/${memberId}`);
};
