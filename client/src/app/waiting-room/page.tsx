"use client";
import {
  initializeToken,
  stopLoading,
  updatePoll,
} from "@/redux/features/poll-slice";
import { selectAccessToken } from "@/redux/selectors";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

const socketIOUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/${process.env.NEXT_PUBLIC_POLLS_NAMESPACE}`;

const WaitingRoom = () => {
  const state = useSelector((state: RootState) => {
    return state.pollReducer.value;
  });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (state.socket) return;

    // Create the socket connection here
    const socket = io(socketIOUrl, {
      auth: {
        token: state.accessToken, // Replace with your actual access token
      },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log(
        `Connected with socketID: ${socket.id}. userID: ${state.me?.id} will join room ${state.poll?.id}`
      );
      dispatch(stopLoading());
    });

    socket.on("connect_error", () => {
      console.log("Failed to connect to socket");
      dispatch(stopLoading());
    });

    socket.on("poll_updated", (poll) => {
      dispatch(updatePoll(poll));
    });

    // Dispatch action to initialize the token (if needed)
    dispatch(initializeToken());

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [dispatch, state.socket, state.accessToken, state.me?.id, state.poll?.id]);

  return <div>WaitingRoom</div>;
};

export default WaitingRoom;
