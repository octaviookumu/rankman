"use client";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import RankedCheckBox from "@/components/ui/RankedCheckBox";
import { RootState } from "@/redux/store";
import { useSocketWithHandlers } from "@/utils/socket-io";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Voting = () => {
  const state = useSelector((state: RootState) => state.pollReducer.value);
  const [rankings, setRankings] = useState<string[]>([]);
  const [confirmVotes, setConfirmVotes] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { submitRankings, cancelPoll } = useSocketWithHandlers(state);

  const toggleNomination = (id: string) => {
    // check if rankings has that id already
    const position = rankings.findIndex((ranking) => ranking === id);

    // get their remaining votes
    const hasVotesRemaining =
      (state.poll?.votesPerVoter || 0) - rankings.length > 0;

    // if not found and they have remaining votes
    if (position < 0 && hasVotesRemaining) {
      setRankings([...rankings, id]);
    } else if (position > 0) {
      // if found and with remaining votes - remove the ranking
      setRankings([
        ...rankings.slice(0, position),
        ...rankings.slice(position + 1, rankings.length),
      ]);
    }
  };

  const getRank = (id: string): undefined | number => {
    const position = rankings.findIndex((ranking) => ranking === id);
    return position < 0 ? undefined : position + 1;
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100svh]">
      <h1 className="text-center my-12">Voting</h1>
      <div className="w-full">
        {state.poll && (
          <>
            <div className="text-center text-xl font-semibold mb-6">
              Select Your Top {state.poll.votesPerVoter} Choices
            </div>
            <div className="text-center text-lg font-semibold mb-6 text-indigo-700">
              {state.poll.votesPerVoter - rankings.length} votes remaining
            </div>
          </>
        )}
      </div>
      <div className="px-2">
        {Object.entries(state.poll?.nominations || {}).map(
          ([id, nomination]) => (
            <RankedCheckBox
              key={id}
              value={nomination.text}
              rank={getRank(id)}
              onSelect={() => toggleNomination(id)}
            />
          )
        )}
      </div>
      <div className="mx-auto flex flex-col items-center">
        <button
          disabled={rankings.length < (state.poll?.votesPerVoter ?? 100)}
          className="box btn-purple my-2 w-36"
          onClick={() => setConfirmVotes(true)}
        >
          Submit Votes
        </button>
        <ConfirmationDialog
          message="You cannot change your vote after submitting"
          showDialog={confirmVotes}
          onCancel={() => setConfirmVotes(false)}
          onConfirm={() => submitRankings(rankings)}
        />
        {state.isAdmin && (
          <>
            <button
              className="box btn-orange my-2 w-36"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel Poll
            </button>
            <ConfirmationDialog
              message="This will cancel the poll and remove all users"
              showDialog={confirmCancel}
              onCancel={() => setConfirmCancel(false)}
              onConfirm={() => cancelPoll()}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Voting;
