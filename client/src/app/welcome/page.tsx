"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/Loader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import {
  removeWsError,
  setPollAccessToken,
  startLoading,
  stopLoading,
} from "@/redux/features/poll-slice";
import { getTokenPayload } from "@/utils/util";
import { useRouter } from "next/navigation";
import { useSocketWithHandlers } from "@/utils/socket-io";
import AllToasts from "@/components/ui/AllToasts";

const Welcome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const state = useSelector((state: RootState) => {
    console.log("state", state.pollReducer.value);
    return state.pollReducer.value;
  });
  const { socketWithHandlers } = useSocketWithHandlers(state);

  useEffect(() => {
    console.log("Page useEffect - check token");
    dispatch(startLoading());
    console.log("start loading");

    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken", accessToken);

    // if there's no accessToken show the default Welcome page
    if (!accessToken) {
      dispatch(stopLoading());
      console.log("stop loading");
      return;
    }

    const { exp: tokenExp } = getTokenPayload(accessToken);
    const currentTimeInSeconds = Date.now() / 1000;

    // if token is within 10 seconds, prevent one from  connecting (poll will almost be over)
    // since token duration and poll duration are approximately at the same time
    if (tokenExp < currentTimeInSeconds - 10) {
      localStorage.removeItem("accessToken");
      dispatch(stopLoading());
      console.log("stop loading - expiry");
      return;
    }

    // reconnect to poll
    dispatch(setPollAccessToken(accessToken)); // needed for socket connection

    if (socketWithHandlers) socketWithHandlers.connect();

    if (state.me?.id && state.poll && !state.poll?.hasStarted) {
      router.push("/waiting-room");
    }

    dispatch(stopLoading());
    return () => {
      if (socketWithHandlers) {
        socketWithHandlers.disconnect();
      }
    };
  }, []);

  return (
    <>
      {state.isLoading ? (
        <Loader color="orange" width={120}></Loader>
      ) : (
        <>
          {state.wsErrors.length > 0 && (
            <AllToasts wsErrors={state.wsErrors}></AllToasts>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: "spring",
                delay: 0.2,
              }}
            >
              <div className="flex flex-col justify-center items-center h-[100svh]">
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
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </>
  );
};
export default Welcome;
