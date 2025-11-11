import instance from "@/config/axiosConfig";

export const getAdminProfile = async () => {
  return instance.get(`/accounts/p`);
};

export const addCoach = async (coach) => {
  return instance.post("/accounts/coach/create", coach);
};

export const getMemberStatistics = async () => {
  return instance.get("/accounts/statistics");
};
