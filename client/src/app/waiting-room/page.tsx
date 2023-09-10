"use client";
import { selectAccessToken } from "@/redux/selectors";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const WaitingRoom = () => {
  const accessToken = useSelector(selectAccessToken);
  const myState = useSelector(
    (state: RootState) => {
      console.log('state', state.pollReducer.value)
      return state.pollReducer.value
    }
  );

  return <div>WaitingRoom</div>;
};

export default WaitingRoom;
