import { create } from 'zustand';

interface AppState {
  products: any[];
  users: any[];
  setProducts: (products: any[]) => void;
  setUsers: (users: any[]) => void;
}

export const useStore = create<AppState>((set) => ({
  products: [],
  users: [],
  setProducts: (products) => set({ products }),
  setUsers: (users) => set({ users }),
}));
