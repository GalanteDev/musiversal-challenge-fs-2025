import { FaTrash } from "react-icons/fa";
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
        <p
          className={`text-sm sm:text-base transition-all duration-700 ease-out ${
            showHoverEffects ? "text-gray-200" : "text-gray-400"
          }`}
          style={{ letterSpacing: "0.01em" }}
        >
          {artist}
        </p>
      </div>
      <div
        className={`flex justify-between items-center transition-all duration-700 ease-out ${
          showHoverEffects
            ? "opacity-100 transform translate-y-0"
            : "opacity-70 transform translate-y-2"
        }`}
      >
        <div className="flex items-center text-gray-300 text-xs sm:text-sm bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
          <div className="mr-1 sm:mr-1.5 text-[#FFCC00]">{randomDuration}</div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDeleteClick();
            }}
            disabled={isDeleting}
            aria-busy={isDeleting}
            title={isDeleting ? "Deleting..." : `Delete ${name}`}
            className={`text-white hover:text-red-400 p-1 sm:p-2.5 rounded-full hover:bg-white/10 transition-all duration-700 ease-out ${
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
            {isDeleting ? <Spinner /> : <FaTrash size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
