import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  title: string;
  body: string;
  receivedAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{ title: string; body: string }>
    ) => {
      state.notifications.unshift({
        ...action.payload,
        receivedAt: new Date().toISOString(),
      });
      state.unreadCount += 1;
    },
    markNotificationsAsRead: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markNotificationsAsRead } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
