import { createSelector } from "@reduxjs/toolkit";
import { RootState } from './store';

// Select the poll slice from your Redux state
const selectPollState = (state: RootState) => state.pollReducer;

export const selectAccessToken = createSelector(
  [selectPollState],
  (poll) => poll.value.accessToken
);