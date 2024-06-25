import {create} from 'zustand';

interface UserStoreState {
  selectedUser: User_with_interests_location_reason | null;
  setSelectedUser: (user: User_with_interests_location_reason) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
