// TODO: Delete in future
import {
  initializeToken,
  StateType,
  updatePoll,
} from "@/redux/features/poll-slice";
import { AppDispatch, RootState } from "@/redux/store";
import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";

export const socketIOUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/${process.env.NEXT_PUBLIC_POLLS_NAMESPACE}`;

type DispatchType = ThunkDispatch<
  {
    pollReducer: StateType;
  },
  undefined,
  AnyAction
> &
  Dispatch<AnyAction>;

export const createSocketWithHandlers = (
  rootState: RootState,
  dispatch: DispatchType
): Socket | undefined => {
  const state = rootState.pollReducer.value;
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
  });

  socket.on("poll_updated", (poll) => {
    dispatch(updatePoll(poll));
  });

  // Dispatch action to initialize the token (if needed)
  dispatch(initializeToken());

  return socket;
};
