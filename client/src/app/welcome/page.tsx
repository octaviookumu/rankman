"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/Loader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import {
  initializeToken,
  setAccessToken,
  startLoading,
  stopLoading,
  updatePoll,
} from "@/redux/features/poll-slice";
import { Poll } from "shared/poll-types";
import { io, Socket } from "socket.io-client";
import { getTokenPayload } from "@/utils/util";
import { useRouter } from "next/navigation";

const socketIOUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/${process.env.NEXT_PUBLIC_POLLS_NAMESPACE}`;

const Welcome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => {
    return state.pollReducer.value;
  });
  const isLoading = useSelector((state: RootState) => {
    console.log("isloading changed", state.pollReducer.value.isLoading);
    return state.pollReducer.value.isLoading;
  });
  const router = useRouter();

  useEffect(() => {
    console.log("Page useEffect - check token");
    dispatch(startLoading());
    console.log("start loading", state);

    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken", accessToken);

    // if there's no accessToken show the default Welcome page
    if (!accessToken) {
      dispatch(stopLoading());
      console.log("stop loading", state);
      return;
    }

    const { exp: tokenExp } = getTokenPayload(accessToken);
    const currentTimeInSeconds = Date.now() / 1000;

    // if token is within 10 seconds, prevent one from  connecting (poll will almost be over)
    // since token duration and poll duration are approximately at the same time
    if (tokenExp < currentTimeInSeconds - 10) {
      localStorage.removeItem("accessToken");
      dispatch(stopLoading());
      console.log("stop loading", state);
      return;
    }

    // reconnect to poll
    dispatch(setAccessToken(accessToken)); // needed for socket connection

    // dispatch(initialize)
    // if (state.socket) return;

    const socket = io(socketIOUrl, {
      auth: {
        token: state.accessToken,
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

    socket.on("poll_updated", (poll: Poll) => {
      dispatch(updatePoll(poll));
    });

    dispatch(initializeToken());

    if (state.me?.id && !state.poll?.hasStarted) {
      router.push("/waiting-room");
    }

    return () => {
      socket.disconnect();
    };

    return () => {};
  }, [isLoading, state.accessToken, state.me?.id, state.poll?.hasStarted]);

  return (
    <>
      <Loader isLoading={isLoading} color="orange" width={120}></Loader>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ y: -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{
            type: "spring",
            delay: 0.2,
          }}
        >
          <div className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto">
            <div className="flex flex-col justify-center items-center h-full">
              <h1 className="text-center my-12">Welcome to Rankman</h1>
              <div className="my-12 flex flex-col justify-center items-center">
                <Link href="/create">
                  <button className="box btn-orange my-2">
                    Create New Poll
                  </button>
                </Link>

                <Link href="/join">
                  <button className="box btn-purple my-2">
                    Join Existing Poll
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
export default Welcome;
