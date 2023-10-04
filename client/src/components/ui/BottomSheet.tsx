import React, { ReactNode } from "react";
import { MdCancel } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./BottomSheet.module.css";

export type BottomSheetProps = {
  isOpen: boolean;
  onClose?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
  children?: ReactNode;
};

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen = false,
  onClose,
  children,
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      top: "100%",
    },
    visible: {
      opacity: 1,
      top: "16px",
      transition: {
        top: {
          duration: 0.3,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute left-0 right-0 max-w-screen-sm bg-gray-50 bottom-0 z-10 overflow-y-hidden top-16 flex flex-col mx-auto"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants}
        >
          <div className="sticky top-0 flex justify-end flex-grow-0">
            <MdCancel
              className="mr-2 mt-2 fill-current text-orange-700 cursor-pointer hover:opacity-80"
              onClick={onClose}
              size={36}
            />
          </div>
          <div className="relative overflow-y-hidden bg-gray-50 flex-grow">
            <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-auto">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
