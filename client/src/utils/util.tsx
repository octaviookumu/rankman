import { StateType } from "@/redux/features/poll-slice";

type TokenPayload = {
  iat: number;
  exp: number;
  sub: string;
  name: string;
  pollID: string;
};

export const getTokenPayload = (accessToken: string): TokenPayload => {
  return JSON.parse(window.atob(accessToken.split(".")[1]));
};

export const setLocalStorageAccessToken = (accessToken: string) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
};
