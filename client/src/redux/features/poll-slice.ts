import { getTokenPayload, setLocalStorageAccessToken } from "@/utils/util";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Poll } from "shared/poll-types";

export type StateType = {
  value: PollState;
};

type Me = {
  id: undefined | string;
  name: undefined | string;
};

type WsError = {
  type: string;
  message: string;
};

export type WsErrorUnique = WsError & {
  id: string;
};

export type PollState = {
  isLoading: boolean;
  poll?: undefined | Poll;
  accessToken: string;
  wsErrors: WsErrorUnique[];
  me?: Me;
  isAdmin: boolean;
  nominationCount: number;
  participantCount: number;
  canStartVote: boolean;
  hasVoted: boolean;
  rankingsCount: number;
  isSocketConnected: boolean;
};

const initialState = {
  value: {
    isLoading: false,
    poll: undefined,
    accessToken: "",
    wsErrors: [],
    me: {
      id: undefined,
      name: undefined,
    },
    isAdmin: false,
    nominationCount: 0,
    participantCount: 0,
    canStartVote: false,
    hasVoted: false,
    rankingsCount: 0,
    isSocketConnected: false,
  },
} as StateType;

export const PollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    startLoading: (state) => {
      return {
        value: {
          ...state.value,
          isLoading: true,
          poll: state.value.poll,
          accessToken: state.value.accessToken,
        },
      };
    },
    stopLoading: (state) => {
      return {
        value: {
          ...state.value,
          isLoading: false,
          poll: state.value.poll,
          accessToken: state.value.accessToken,
        },
      };
    },
    initializePoll: (state, action: PayloadAction<Poll>) => {
      return {
        value: {
          ...state.value,
          isLoading: true,
          poll: action.payload,
          accessToken: state.value.accessToken,
        },
      };
    },
    setPollAccessToken: (state, action: PayloadAction<string>) => {
      const token = getTokenPayload(action.payload);
      const me = {
        id: token.sub,
        name: token.name,
      };
      setLocalStorageAccessToken(action.payload);

      return {
        value: {
          ...state.value,
          isLoading: true,
          poll: state.value.poll,
          accessToken: action.payload,
          me,
          isAdmin: me?.id === state.value.poll?.adminID,
        },
      };
    },
    socketConnected: (state) => {
      return {
        value: {
          ...state.value,
          isSocketConnected: true,
        },
      };
    },
    socketDisconnected: (state) => {
      return {
        value: {
          ...state.value,
          isSocketConnected: false,
        },
      };
    },
    updatePoll: (state, action: PayloadAction<Poll>) => {
      return {
        value: {
          ...state.value,
          poll: action.payload,
        },
      };
    },
    addWsError: (state, action: PayloadAction<WsError>) => {
      return {
        value: {
          ...state.value,
          wsErrors: [
            ...state.value.wsErrors,
            {
              ...action.payload,
              id: nanoid(6),
            },
          ],
        },
      };
    },
    removeWsError: (state, action: PayloadAction<string>) => {
      return {
        value: {
          ...state.value,
          wsErrors: state.value.wsErrors.filter(
            (error) => error.id !== action.payload
          ),
        },
      };
    },
  },
});

export const {
  startLoading,
  stopLoading,
  initializePoll,
  setPollAccessToken,
  updatePoll,
  socketConnected,
  socketDisconnected,
  addWsError,
  removeWsError,
} = PollSlice.actions;
export default PollSlice.reducer;
