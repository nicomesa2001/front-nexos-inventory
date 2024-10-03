export interface User {
  id: number;
  name: string;
  age: number;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  quantity: number;
  dateOfEntry: Date | string;
  user: User;
}
