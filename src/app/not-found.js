"use client";

import useBackgroundEffect from "@/common/hooks/use-background-effect.hook";
import Link from "next/link";

export default function NotFound() {
  const { position } = useBackgroundEffect();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-64 h-64 rounded-full bg-yellow-700 blur-xl opacity-60"
          style={{
            left: `calc(10% + ${position.x}px)`,
            top: `calc(30% + ${position.y}px)`,
            transition: "all 0.3s ease",
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full bg-yellow-700 blur-xl opacity-50"
          style={{
            right: `calc(15% + ${position.x * -1}px)`,
            bottom: `calc(20% + ${position.y * -1}px)`,
            transition: "all 0.5s ease",
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full bg-yellow-700 blur-xl opacity-40"
          style={{
            left: `calc(50% + ${position.y}px)`,
            top: `calc(15% + ${position.x}px)`,
            transition: "all 0.4s ease",
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl text-center">
        {/* 404 Error Title */}
        <h1 className="text-9xl font-bold text-yellow-600 mb-2">404</h1>

        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="h-1 w-16 bg-yellow-400 rounded-full mx-2" />
          <div className="h-1 w-24 bg-yellow-600 rounded-full mx-2" />
          <div className="h-1 w-16 bg-yellow-400 rounded-full mx-2" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>

        <p className="text-lg text-gray-600 mb-8">
          {"Oops! The page you're looking for seems to have wandered off into the digital unknown."}
        </p>

        {/* Return home button with hover effect */}
        <Link
          href="/"
          className="inline-block px-8 py-4 text-lg font-medium text-white bg-yellow-600 rounded-lg shadow-lg transition-all duration-300 hover:bg-yellow-700 hover:shadow-xl hover:-translate-y-1"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
