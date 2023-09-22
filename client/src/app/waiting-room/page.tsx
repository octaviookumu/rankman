"use client";
import { AppDispatch, RootState } from "@/redux/store";
import { useSocketWithHandlers } from "@/utils/socket-io";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const WaitingRoom = () => {
  const state = useSelector((state: RootState) => {
    return state.pollReducer.value;
  });
  const dispatch = useDispatch<AppDispatch>();
  const socketWithHandlers = useSocketWithHandlers(state);

  useEffect(() => {
    if (socketWithHandlers) socketWithHandlers.connect();

    // Clean up the socket connection when the component unmounts
    return () => {
      if (socketWithHandlers) socketWithHandlers.disconnect();
    };
  }, [dispatch, socketWithHandlers]);

  return <div>WaitingRoom</div>;
};

export default WaitingRoom;
