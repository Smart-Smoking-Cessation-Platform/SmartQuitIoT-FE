import { Mission } from "./mission";

export interface ExtendedMission extends Mission {
  category: string;
  startDate: string;
  endDate: string;
  completionRate: number;
}