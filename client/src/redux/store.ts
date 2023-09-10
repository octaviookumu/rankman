import { configureStore } from "@reduxjs/toolkit";
import pollReducer from "./features/poll-slice";

export const store = configureStore({
  reducer: {
    pollReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
