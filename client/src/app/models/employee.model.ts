export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  departmentId: number;
  department?: Department;
  hireDate: string;
  salary: number;
  isActive: boolean;
  fullName?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface PagedResult<T> {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
}
