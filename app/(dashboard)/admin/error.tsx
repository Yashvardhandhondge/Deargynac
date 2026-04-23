"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span className="text-2xl">&#9888;</span>
      </div>
      <h2 className="text-xl font-bold text-[#1A0A12] font-serif">Something went wrong</h2>
      <p className="text-gray-500 text-sm mt-2 max-w-md">{error.message || "An unexpected error occurred."}</p>
      <div className="flex gap-3 mt-6">
        <button onClick={reset} className="bg-[#C2185B] text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-[#880E4F] transition-colors">Try Again</button>
        <Link href="/" className="border border-gray-300 rounded-full px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Back to Home</Link>
      </div>
    </div>
  );
}
