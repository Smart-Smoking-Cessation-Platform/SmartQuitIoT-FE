export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  joinDate: string;
  position: string;
  address: string;
  dateOfBirth: string;
  salary: number;
  experience: string;
  quitStatus: 'Not Started' | 'Quitting' | 'Quit';
  cigarettesPerDay: number;
}
