"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { makeRequest } from "@/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { initializePoll, startLoading, setAccessToken, stopLoading } from "@/redux/features/poll-slice";
import { Poll } from "shared/poll-types";
import Loader from "@/components/ui/Loader";

const Join = () => {
  const [pollID, setPollID] = useState("");
  const [name, setName] = useState("");
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(
    (state: RootState) => state.pollReducer.value.isLoading
  );

  const areFieldsValid = (): boolean => {
    if (pollID.length < 6 || pollID.length > 6) return false;

    if (name.length < 1 || name.length > 25) return false;

    return true;
  };

  const handleJoinPoll = async () => {
    // actions.startLoading();
    dispatch(startLoading())
    setApiError('');

    const { data, error } = await makeRequest<{
      poll: Poll;
      accessToken: string;
    }>('/polls/join', {
      method: 'POST',
      body: JSON.stringify({
        pollID,
        name,
      }),
    });

    if (error && error.statusCode === 400) {
      setApiError('Please make sure to include a poll topic!');
    } else if (error && !error.statusCode) {
      setApiError('Unknown API error');
    } else {
      // actions.initializePoll(data.poll);
      dispatch(initializePoll(data.poll))
      // actions.setPollAccessToken(data.accessToken);
      dispatch(setAccessToken(data.accessToken))
      router.push("/waiting-room");
    }

    // actions.stopLoading();
    dispatch(stopLoading())
  };

  return (
    <div className="flex flex-col w-[85%] md:w-[45%] h-[100svh] mx-auto items-center justify-center">
      <div className="mb-12 w-full">
        <div className="my-4">
          <h3 className="text-center">
            Enter Code Provided by &quot;Friend&quot;
          </h3>
          <div className="text-center w-full">
            <input
              maxLength={6}
              onChange={(e) => setPollID(e.target.value.toUpperCase())}
              className="box info w-full"
              autoCapitalize="characters"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        </div>
        <div className="my-4">
          <h3 className="text-center">Your Name</h3>
          <div className="text-center w-full">
            <input
              maxLength={25}
              onChange={(e) => setName(e.target.value)}
              className="box info w-full"
            />
          </div>
        </div>
        {apiError && (
          <p className="text-center text-red-600 font-light mt-8">{apiError}</p>
        )}
      </div>

      <Loader isLoading={isLoading} color="orange" width={120}></Loader>

      <div className="my-12 flex flex-col justify-center items-center">
        <button
          disabled={!areFieldsValid()}
          className="box btn-orange w-32 my-2"
          onClick={handleJoinPoll}
        >
          Join
        </button>
        <button
          className="box btn-purple w-32 my-2"
          onClick={() => router.push("/")}
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default Join;
