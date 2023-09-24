"use client";
import AllToasts from "@/components/ui/AllToasts";
import Loader from "@/components/ui/Loader";
import { stopLoading } from "@/redux/features/poll-slice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const WaitingRoom = () => {
  const state = useSelector((state: RootState) => {
    return state.pollReducer.value;
  });
  const isLoading = useSelector(
    (state: RootState) => state.pollReducer.value.isLoading
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(stopLoading());
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} color="orange" width={120}></Loader>
      ) : (
        <>
          {state.wsErrors.length > 0 && (
            <AllToasts wsErrors={state.wsErrors}></AllToasts>
          )}
          <div className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto">
            <div className="flex flex-col justify-center items-center h-full">
              <h1 className="text-center my-12">Waiting Room</h1>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WaitingRoom;
