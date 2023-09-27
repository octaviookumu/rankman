import { WsErrorUnique } from "@/redux/features/poll-slice";
import React from "react";
import Toast from "./Toast";

type AllToastsProps = {
  wsErrors: WsErrorUnique[];
};

const AllToasts: React.FC<AllToastsProps> = ({ wsErrors }) => {
  console.log("wsErrors", wsErrors);
  return (
    <>
      {wsErrors.length > 0 &&
        wsErrors.map((error) => (
          <Toast
            key={error.id}
            type="error"
            title={error.type}
            message={error.message}
            show={true}
            errorId={error.id}
            autoCloseDuration={5000}
          ></Toast>
        ))}
    </>
  );
};

export default AllToasts;
