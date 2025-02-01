"use client";

export default function WorkInProgress() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        {/* Animated Text */}
        <h1 className="text-4xl md:text-6xl font-bold animate-pulse">
          Work in Progress 🚧
        </h1>
        {/* Subtitle */}
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Everything here is subject to change, check back soon.
        </p>
        {/* Animated Loader */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
