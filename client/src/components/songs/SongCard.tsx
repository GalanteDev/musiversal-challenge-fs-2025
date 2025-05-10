"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import ConfirmModal from "../ui/ConfirmModal";

interface SongCardProps {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  onDelete: (id: string) => void;
  isNew?: boolean;
}

export default function SongCard({
  id,
  name,
  artist,
  imageUrl,
  onDelete,
  isNew = false,
}: SongCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showNewEffect, setShowNewEffect] = useState(isNew);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle the "new" animation effect
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setShowNewEffect(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // Intersection Observer for reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("card-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
      // Ensure modal is closed
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteModal(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Mock share functionality
    alert(`Sharing "${name}" by ${artist}`);

    // If Web Share API is available, use it
    if (navigator.share) {
      navigator
        .share({
          title: name,
          text: `Check out "${name}" by ${artist}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    }
  };

  const formattedImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : imageUrl.startsWith("/")
    ? `http://localhost:4000${imageUrl}`
    : `http://localhost:4000/uploads/${imageUrl}`;

  // Generate a random year between 1990 and 2015
  const randomYear = Math.floor(Math.random() * 26) + 1990; // Random year between 1990-2015

  return (
    <>
      <div
        ref={cardRef}
        className={`group card-reveal relative rounded-lg overflow-hidden border border-[#333333] transition-all duration-700 ease-out aspect-[16/9] ${
          showNewEffect ? "animate-newCard" : ""
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          boxShadow: showNewEffect
            ? "0 0 0 2px rgba(255, 204, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.2)"
            : isHovering
            ? "0 8px 30px rgba(0, 0, 0, 0.3)"
            : "0 4px 10px rgba(0, 0, 0, 0.1)",
          transform: isHovering ? "translateY(-4px)" : "translateY(0)",
          transition:
            "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Full-size background image */}
        <div className="absolute inset-0 w-full h-full bg-[#252525] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#333333] border-t-[#FFCC00] rounded-full animate-spin"></div>
            </div>
          )}

          <img
            ref={imageRef}
            src={formattedImageUrl || "/placeholder.svg"}
            alt={`${name} by ${artist}`}
            className={`w-full h-full object-cover transition-all duration-1000 ease-out will-change-transform ${
              isHovering ? "scale-[1.04] filter brightness-[1.05]" : "scale-100"
            } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Enhanced gradient overlay for text readability */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isHovering ? "opacity-85" : "opacity-70"
            }`}
            style={{
              background: `linear-gradient(to top, 
                rgba(0,0,0,0.95) 0%, 
                rgba(0,0,0,0.8) 25%, 
                rgba(0,0,0,0.6) 50%, 
                rgba(0,0,0,0.4) 75%, 
                rgba(0,0,0,0.2) 90%, 
                rgba(0,0,0,0) 100%)`,
            }}
          ></div>

          {/* Subtle animated gradient overlay */}
          {isHovering && (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(255, 204, 0, 0.2) 0%, rgba(0, 0, 0, 0) 70%)`,
              }}
            ></div>
          )}
        </div>

        {/* Content overlay with enhanced professional design */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
          {/* Year badge - always visible */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-white/10 text-white/80 text-xs font-medium rounded-full backdrop-blur-sm">
              {randomYear}
            </span>
          </div>

          {/* Decorative line */}
          <div
            className={`w-12 h-0.5 bg-[#FFCC00] mb-3 transition-all duration-700 ease-out ${
              isHovering ? "w-20 opacity-100" : "opacity-60"
            }`}
          ></div>

          {/* Main content with improved typography */}
          <div className="mb-4">
            <h3
              className={`font-semibold text-2xl mb-1.5 line-clamp-1 transition-all duration-700 ease-out ${
                isHovering ? "text-[#FFCC00]" : "text-white"
              }`}
              style={{
                textShadow: isHovering ? "0 2px 4px rgba(0,0,0,0.5)" : "none",
                letterSpacing: "-0.01em",
              }}
            >
              {name}
            </h3>

            <div className="flex items-center">
              {/* Heavy metal hand icon */}
              <div
                className={`w-4 h-4 mr-1.5 transition-all duration-700 ease-out ${
                  isHovering ? "opacity-100" : "opacity-70"
                }`}
              >
                <img
                  src="/icons/heavy-metal-icon.png"
                  alt="Rock on"
                  className="w-full h-full object-contain"
                  style={{
                    filter: isHovering ? "brightness(1.2)" : "brightness(1)",
                  }}
                />
              </div>
              <p
                className={`text-base transition-all duration-700 ease-out ${
                  isHovering ? "text-gray-200" : "text-gray-400"
                }`}
                style={{ letterSpacing: "0.01em" }}
              >
                {artist}
              </p>
            </div>
          </div>

          {/* Bottom controls with enhanced animations */}
          <div
            className={`flex justify-between items-center transition-all duration-700 ease-out ${
              isHovering
                ? "opacity-100 transform translate-y-0"
                : "opacity-70 transform translate-y-2"
            }`}
          >
            {/* Duration with enhanced design */}
            <div className="flex items-center text-gray-300 text-sm bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              <svg
                className="w-4 h-4 mr-1.5 text-[#FFCC00]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              3:45
            </div>

            {/* Action buttons with enhanced animations */}
            <div className="flex space-x-3">
              {/* Play button */}
              <button
                className={`bg-[#FFCC00] text-black rounded-full w-10 h-10 flex items-center justify-center transition-all duration-700 ease-out hover:bg-[#FFD700] ${
                  isHovering ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
                style={{
                  boxShadow: "0 4px 12px rgba(255,204,0,0.3)",
                  transform: isHovering
                    ? "translateY(0) scale(1)"
                    : "translateY(10px) scale(0.9)",
                  transitionDelay: "100ms",
                }}
                aria-label={`Play ${name}`}
              >
                <svg
                  className="w-5 h-5 ml-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className={`text-white hover:text-[#FFCC00] p-2 rounded-full hover:bg-white/10 transition-all duration-700 ease-out ${
                  isHovering ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
                style={{
                  transform: isHovering
                    ? "translateY(0) scale(1)"
                    : "translateY(10px) scale(0.9)",
                  transitionDelay: "150ms",
                }}
                aria-label={`Share ${name}`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
              </button>

              {/* Delete button */}
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className={`text-white hover:text-red-400 p-2 rounded-full hover:bg-white/10 transition-all duration-700 ease-out ${
                  isHovering ? "opacity-100 scale-100" : "opacity-0 scale-90"
                } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{
                  transform: isHovering
                    ? "translateY(0) scale(1)"
                    : "translateY(10px) scale(0.9)",
                  transitionDelay: "200ms",
                }}
                aria-label={`Delete ${name}`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Song"
          message={`Are you sure you want to delete "${name}" by ${artist}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
        />
      )}
    </>
  );
}
