"use client";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import ResultCard from "@/components/ui/ResultCard";
import { RootState } from "@/redux/store";
import { useSocketWithHandlers } from "@/utils/socket-io";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Results = () => {
  const router = useRouter();
  const state = useSelector((state: RootState) => state.pollReducer.value);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLeavePollOpen, setIsLeavePollOpen] = useState(false);
  const { socketWithHandlers, closePoll, resetPoll } =
    useSocketWithHandlers(state);

  //   const startOver = () => {
  //     socketWithHandlers?.disconnect();
  //     localStorage.removeItem("accessToken");
  //     router.push("/");
  //   };

  const handleClosePoll = () => {
    setIsConfirmationOpen(false);
    closePoll();
  };

  return (
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
          <div className="w-full">
            <h1 className="text-center my-12">Results</h1>
            {state.poll?.results.length ? (
              <ResultCard results={state.poll.results} />
            ) : (
              <p className="text-center text-xl">
                <span className="text-orange-600">
                  {Object.keys(state.poll?.rankings || {}).length}
                </span>{" "}
                of{" "}
                <span className="text-purple-600">
                  {Object.keys(state.poll?.participants || {}).length}
                </span>{" "}
                participants have voted
              </p>
            )}
          </div>
          <div className="flex flex-col justify-center">
            {state.isAdmin && !state.poll?.results.length && (
              <>
                <button
                  className="box btn-orange my-2"
                  onClick={() => setIsConfirmationOpen(true)}
                >
                  Finish Poll
                </button>
              </>
            )}
            {!state.isAdmin && !state.poll?.results.length && (
              <div className="my-2 italic">
                Waiting for Admin{" "}
                <span className="font-semibold">
                  ({state.poll?.participants[state.poll.adminID]})
                </span>{" "}
                to finalise the poll
              </div>
            )}
            {state.poll?.results.length && (
              <button
                className="box btn-purple my-2"
                onClick={() => setIsLeavePollOpen(true)}
              >
                Leave Poll
              </button>
            )}
          </div>
          {state.isAdmin && (
            <ConfirmationDialog
              message="Are you sure you want to close the poll and calculate the results?"
              showDialog={isConfirmationOpen}
              onCancel={() => setIsConfirmationOpen(false)}
              onConfirm={handleClosePoll}
            />
          )}
          {isLeavePollOpen && (
            <ConfirmationDialog
              message="You will lose your results. Is that Alright?"
              showDialog={isLeavePollOpen}
              onCancel={() => setIsLeavePollOpen(false)}
              onConfirm={resetPoll}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Results;
