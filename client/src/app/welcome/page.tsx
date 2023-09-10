"use client";
import Link from "next/link";

const Welcome = () => {
  return (
    <div className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto">
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-center my-12">Welcome to Rankr</h1>
        <div className="my-12 flex flex-col justify-center">
          <Link href="/create">
            <button className="box btn-orange my-2">Create New Poll</button>
          </Link>

          <Link href="/join">
            <button className="box btn-purple my-2">Join Existing Poll</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Welcome;
