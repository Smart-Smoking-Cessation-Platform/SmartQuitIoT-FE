export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  status: "Active" | "Inactive";
}