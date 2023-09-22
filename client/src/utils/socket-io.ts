import { PollState } from "@/redux/features/poll-slice";
import { AppDispatch } from "@/redux/store";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { initializeSocket, disconnectSocket } from "./socketManager";

export const socketIOUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/${process.env.NEXT_PUBLIC_POLLS_NAMESPACE}`;

export const useSocketWithHandlers = (pollState: PollState) => {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | undefined>(undefined);

  useEffect(() => {
    if (pollState.accessToken) {
      socketRef.current = initializeSocket(pollState.accessToken, dispatch);
    } else {
      disconnectSocket();
      return;
    }

    return () => {
      socketRef.current = undefined;
      disconnectSocket();
    };
  }, [dispatch, pollState.accessToken]);

  return socketRef.current;
};
