"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-md flex-col items-center rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-red-600">发生错误</h1>
        <p className="mt-4 text-gray-700">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          重试
        </button>
      </div>
    </div>
  );
}
