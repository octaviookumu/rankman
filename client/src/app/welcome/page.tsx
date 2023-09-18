"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Welcome = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: -300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{
          type: "spring",
          delay: 0.2
        }}
      >
        <div className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto">
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-center my-12">Welcome to Rankr</h1>
            <div className="my-12 flex flex-col justify-center">
              <Link href="/create">
                <button className="box btn-orange my-2">Create New Poll</button>
              </Link>

              <Link href="/join">
                <button className="box btn-purple my-2">
                  Join Existing Poll
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default Welcome;
