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

export const colorizeText = (text: string): JSX.Element[] =>
  text.split("").map((val, index) => {
    console.log('val.charCodeAt(0)', val.charCodeAt(0))
    return val.charCodeAt(0) >= 48 && val.charCodeAt(0) <= 57 ? (
      <span key={index} className="text-orange-600">
        {val}
      </span>
    ) : (
      <span key={index} className="text-indigo-600">
        {val}
      </span>
    );
  });
