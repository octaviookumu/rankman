"use client";
import { useState } from "react";
import CountSelector from "../../components/ui/CountSelector";
import { Poll } from "shared/poll-types";
import { makeRequest } from ".././../api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  startLoading,
  initializePoll,
  setPollAccessToken,
  stopLoading,
} from "@/redux/features/poll-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Loader from "@/components/ui/Loader";
import { useSocketWithHandlers } from "@/utils/socket-io";

const Create = () => {
  const router = useRouter();
  const [pollTopic, setPollTopic] = useState("");
  const [maxVotes, setMaxVotes] = useState(3);
  const [name, setName] = useState("");
  const [apiError, setApiError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.pollReducer.value);
  const { socketWithHandlers } = useSocketWithHandlers(state);

  const areFieldsValid = (): boolean => {
    if (pollTopic.length < 1 || pollTopic.length > 100) return false;
    if (maxVotes < 1 || maxVotes > 5) return false;
    if (name.length < 1 || name.length > 25) return false;

    return true;
  };

  const handleCreatePoll = async () => {
    console.log("start load create");
    dispatch(startLoading());
    setApiError("");

    const { data, error } = await makeRequest<{
      poll: Poll;
      accessToken: string;
    }>("/polls", {
      method: "POST",
      body: JSON.stringify({
        topic: pollTopic,
        votesPerVoter: maxVotes,
        name,
      }),
    });

    if (error && error.statusCode === 400) {
      console.log("400 error", error);
      setApiError("Name and poll topic are both required!");
    } else if (error && error.statusCode !== 400) {
      setApiError(error.messages[0]);
    } else {
      dispatch(initializePoll(data.poll));
      dispatch(setPollAccessToken(data.accessToken));
      router.push("/waiting-room");
    }

    // dispatch(stopLoading());
  };

  const startOver = () => {
    socketWithHandlers?.disconnect();
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  return (
    <>
      {state.isLoading ? (
        <Loader color="orange" width={120}></Loader>
      ) : (
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
            <div className="flex flex-col w-[85%] md:w-[45%] h-[100svh] mx-auto items-center justify-center">
              <div className="mb-12 w-full">
                <h3 className="text-center">Enter Poll Topic</h3>
                <div className="text-center w-full">
                  <input
                    maxLength={100}
                    onChange={(e) => setPollTopic(e.target.value)}
                    className="box info w-full"
                  />
                </div>
                <h3 className="text-center mt-4 mb-2">Votes Per Participant</h3>
                <div className="w-48 mx-auto my-4">
                  <CountSelector
                    min={1}
                    max={5}
                    initial={3}
                    step={1}
                    onChange={(val) => setMaxVotes(val)}
                  />
                </div>
                <div className="mb-12">
                  <h3 className="text-center">Enter Name</h3>
                  <div className="text-center w-full">
                    <input
                      maxLength={25}
                      onChange={(e) => setName(e.target.value)}
                      className="box info w-full"
                    />
                  </div>
                </div>
                {apiError && (
                  <p className="text-center text-red-600 font-light mt-8">
                    {apiError}
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-center items-center">
                <button
                  className="box btn-orange w-32 my-2"
                  onClick={handleCreatePoll}
                  disabled={!areFieldsValid()}
                >
                  Create
                </button>
                <button
                  className="box btn-purple w-32 my-2"
                  onClick={startOver}
                >
                  Start Over
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};
export default Create;
