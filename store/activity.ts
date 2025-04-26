import { create } from 'zustand';

interface NotificationState {
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  increment: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notificationCount: 5,
  setNotificationCount: (count) => set({ notificationCount: count }),
  increment: () => set((state) => ({ notificationCount: state.notificationCount + 1 })),
  reset: () => set({ notificationCount: 0 }),
}));
