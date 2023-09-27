"use client";
import { removeWsError, startLoading } from "@/redux/features/poll-slice";
import { AppDispatch } from "@/redux/store";
import React, { useEffect } from "react";
import { useState } from "react";
import { MdCancel } from "react-icons/md";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
// import { CSSTransition } from 'react-transition-group';

// import styles from './Toast.module.css';

type ToastProps = {
  type?: "standard" | "error";
  title?: string;
  message: string;
  show: boolean;
  autoCloseDuration?: number;
  errorId: string;
  onClose?: () => void;
};

const ToastStyles = {
  standard: "bg-gray-100 bg-opacity-50",
  error: "bg-red-600 text-white",
};

const Toast: React.FC<ToastProps> = ({
  type = "standard",
  title,
  message,
  show,
  onClose,
  errorId,
  autoCloseDuration,
}) => {
  const outerStyles = ToastStyles[type];
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // console.log('onClose', onClose)

  const handleCloseSnackBar = () => {
    console.log("close bar");
    setShowToast(false);
    dispatch(removeWsError(errorId));
    console.log("showToast", showToast);
  };

  useEffect(() => {
    console.log("snackbar useEffect", title, message, show);
    if (show) {
      setShowToast(true);
    }

    const autoTimer =
      autoCloseDuration &&
      setTimeout(() => handleCloseSnackBar(), autoCloseDuration);

    return () => {
      autoTimer && clearTimeout(autoTimer);
    };
  }, [show, message, title]);

  return (
    <motion.div
      initial={{ y: -300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{
        type: "spring",
        delay: 0.2,
      }}
    >
      <div
        className={`absolute shadow-md py-2 mb-1 z-50 rounded-b-md text-center w-full md:w-[40%] top-1 left-0 right-0 mx-auto bg-opacity-100 ${outerStyles}`}
      >
        <div className="absolute top-0 right-0">
          <MdCancel
            className="fill-current mr-1 mt-1 cursor-pointer hover:opacity-80"
            onClick={() => handleCloseSnackBar()}
            size={24}
          />
        </div>
        <div className="mt-4 mx-8 mb-2">
          {title && <h3 className="font-semibold">{title}</h3>}
          <div className="text-sm font-light italic">{message}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Toast;
