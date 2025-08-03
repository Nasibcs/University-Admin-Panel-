export type Faculty = {
    id: string
    name: string
    dean: string
    establishedYear: string
    description: string
    logo: string
  }

export type Teacher = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  degree: string;
  research: string;
  address: string;
  age: string;
  avatarUrl?: string;
  departmentName: string;
  departmentId: string;
};
  
export type Department = {
  id: string;
  name: string;
  establishedYear: string;
  dean: string;
  semesters: string;
  description: string;
  facultyId: string;
};