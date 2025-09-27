
export interface MembershipPackage {
  id?: number;
  name: string;
  duration: string;
  price: number;
  description: string;
  status: "Active" | "Inactive";
}