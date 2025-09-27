export interface Mission {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Active" | "Inactive";
  rewardPoints: number;
}