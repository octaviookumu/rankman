import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Poll } from "shared/poll-types";

type InitialState = {
  value: PollState;
};

type PollState = {
  isLoading: boolean;
  polls?: undefined | Poll;
  accessToken: string;
};

const initialState = {
  value: {
    isLoading: false,
    polls: undefined,
  },
} as InitialState;

export const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    startLoading: (state) => {
      return {
        value: {
          isLoading: true,
          polls: state.value.polls,
          accessToken: state.value.accessToken,
        },
      };
    },
    stopLoading: (state) => {
      return {
        ...state,
        value: {
          isLoading: false,
          polls: state.value.polls,
          accessToken: state.value.accessToken,
        },
      };
    },
    initializePoll: (state, action: PayloadAction<Poll>) => {
      return {
        value: {
          isLoading: false,
          polls: action.payload,
          accessToken: state.value.accessToken,
        },
      };
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      return {
        value: {
          isLoading: false,
          polls: state.value.polls,
          accessToken: action.payload,
        },
      };
    },
  },
});

export const { startLoading, stopLoading, initializePoll, setAccessToken } =
  pollSlice.actions;
export default pollSlice.reducer;
