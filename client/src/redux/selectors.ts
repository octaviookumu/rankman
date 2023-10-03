import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Select the poll slice from your Redux state
const selectPollState = (state: RootState) => state.pollReducer;

export const selectHasVoted = createSelector([selectPollState], (state) => {
  const rankings = state.value.poll?.rankings ?? {};
  const userID = state.value.me?.id || "";
  return rankings[userID] !== undefined ? true : false;
});
