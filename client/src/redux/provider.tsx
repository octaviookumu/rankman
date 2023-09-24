"use client";
import Toast from "@/components/ui/Toast";
import { Provider } from "react-redux";
import { store } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // const { wsErrors = [] } = store.getState().pollReducer.value;

  return (
    <Provider store={store}>
      {/* {wsErrors &&
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
        ))} */}
      {children}
    </Provider>
  );
}
