import Spinner from "@/components/ui/Spinner";
import { useMemo } from "react";

interface SongCardContentProps {
  name: string;
  artist: string;
  showHoverEffects: boolean;
  isDeleting: boolean;
  onDeleteClick: () => void;
}

export default function SongCardContent({
  name,
  artist,
  showHoverEffects,
  isDeleting,
  onDeleteClick,
}: SongCardContentProps) {
  const randomYear = useMemo(() => Math.floor(Math.random() * 26) + 1990, []);
  const randomDuration = useMemo(() => {
    const seconds = Math.floor(Math.random() * (300 - 120 + 1)) + 120;
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(
      2,
      "0"
    )}`;
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 z-10">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <span className="px-2 py-0.5 bg-white/10 text-white/80 text-xs font-medium rounded-full backdrop-blur-sm">
          {randomYear}
        </span>
      </div>
      <div
        className={`w-12 h-0.5 bg-[#FFCC00] mb-2 sm:mb-3 transition-all duration-700 ease-out ${
          showHoverEffects ? "w-20 opacity-100" : "opacity-60"
        }`}
      ></div>
      <div className="mb-3 sm:mb-4">
        <h3
          className={`font-semibold text-xl sm:text-2xl mb-1 sm:mb-1.5 line-clamp-1 transition-all duration-700 ease-out ${
            showHoverEffects ? "text-[#FFCC00]" : "text-white"
          }`}
          style={{
            textShadow: showHoverEffects ? "0 2px 4px rgba(0,0,0,0.5)" : "none",
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </h3>
        <div className="flex items-center">
          <div
            className={`w-4 h-4 mr-1.5 transition-all duration-700 ease-out ${
              showHoverEffects ? "opacity-100" : "opacity-70"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-full h-full ${
                showHoverEffects ? "text-[#FFCC00]" : "text-white"
              }`}
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <p
            className={`text-sm sm:text-base transition-all duration-700 ease-out ${
              showHoverEffects ? "text-gray-200" : "text-gray-400"
            }`}
            style={{ letterSpacing: "0.01em" }}
          >
            {artist}
          </p>
        </div>
      </div>
      <div
        className={`flex justify-between items-center transition-all duration-700 ease-out ${
          showHoverEffects
            ? "opacity-100 transform translate-y-0"
            : "opacity-70 transform translate-y-2"
        }`}
      >
        <div className="flex items-center text-gray-300 text-xs sm:text-sm bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-[#FFCC00]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
          {randomDuration}
        </div>
        <div className="flex space-x-2 sm:space-x-3">
          <button
            className={`bg-[#FFCC00] text-black rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-700 ease-out hover:bg-[#FFD700] ${
              showHoverEffects ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            style={{
              boxShadow: "0 4px 12px rgba(255,204,0,0.3)",
              transform: showHoverEffects
                ? "translateY(0) scale(1)"
                : "translateY(10px) scale(0.9)",
              transitionDelay: "100ms",
            }}
            aria-label={`Play ${name}`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button
            className={`text-white hover:text-[#FFCC00] p-1 sm:p-2.5 rounded-full hover:bg-white/10 transition-all duration-700 ease-out ${
              showHoverEffects ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            style={{
              transform: showHoverEffects
                ? "translateY(0) scale(1)"
                : "translateY(10px) scale(0.9)",
              transitionDelay: "150ms",
            }}
            aria-label={`Share ${name}`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDeleteClick();
            }}
            disabled={isDeleting}
            className={`text-white  hover:text-red-400 p-1 sm:p-2.5 rounded-full hover:bg-white/10 transition-all duration-700 ease-out ${
              showHoverEffects ? "opacity-100 scale-100" : "opacity-0 scale-90"
            } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{
              transform: showHoverEffects
                ? "translateY(0) scale(1)"
                : "translateY(10px) scale(0.9)",
              transitionDelay: "200ms",
            }}
            aria-label={`Delete ${name}`}
          >
            {isDeleting ? (
              <Spinner />
            ) : (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
