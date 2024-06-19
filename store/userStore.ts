import {create} from 'zustand';

interface UserState {
  selectedUser: User_with_interests_location_reason | null;
  setSelectedUser: (user: User_with_interests_location_reason | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
