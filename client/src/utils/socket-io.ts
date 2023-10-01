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

  const nominate = (text: string): void => {
    socketRef.current?.emit("nominate", { text });
  };

  const removeNomination = (id: string): void => {
    socketRef.current?.emit("remove_nomination", { id });
  };

  const removeParticipant = (id: string): void => {
    socketRef.current?.emit("remove_participant", { id });
  };

  const startVote = () => {
    socketRef.current?.emit("start_vote");
  };

  const submitRankings = (rankings: string[]) => {
    socketRef.current?.emit("submit_rankings", { rankings });
  };

  const cancelPoll = () => {
    socketRef.current?.emit("cancel_poll");
  };

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

  return {
    socketWithHandlers: socketRef.current,
    nominate,
    removeNomination,
    removeParticipant,
    startVote,
    submitRankings,
    cancelPoll,
  };
};
