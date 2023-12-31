import {
  addWsError,
  stopLoading,
  updatePoll,
} from "@/redux/features/poll-slice";
import { AppDispatch } from "@/redux/store";
import { Poll } from "../app/types/poll-types";
import { io, Socket } from "socket.io-client";

let socketIOUrl: string;

if (process.env.NODE_ENV === "production") {
  socketIOUrl = `https://${process.env.NEXT_PUBLIC_API_HOST}/${process.env.NEXT_PUBLIC_POLLS_NAMESPACE}`;
} else {
  socketIOUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/${process.env.NEXT_PUBLIC_POLLS_NAMESPACE}`;
}

let socket: Socket | undefined = undefined;
let dispatch: AppDispatch | undefined = undefined;

export const initializeSocket = (
  accessToken: string,
  reduxDispatch: AppDispatch
) => {
  if (!socket) {
    dispatch = reduxDispatch;

    socket = io(socketIOUrl, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log(`Connected with socketID: ${socket?.id}`);
    });

    socket.on("connect_error", () => {
      console.log("Failed to connect to socket");

      if (dispatch) {
        dispatch(
          addWsError({
            type: "Connection Error",
            message: "Failed to connect to the poll",
          })
        );
        // dispatch(stopLoading());
      }
    });

    socket.on("exception", (exception) => {
      console.log("WS Exception", exception);
      if (dispatch) dispatch(addWsError(exception));
    });

    socket.on("poll_updated", (poll: Poll) => {
      if (dispatch) dispatch(updatePoll(poll));
    });
  }

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined;
    dispatch = undefined;
  }
};
