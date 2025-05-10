"use client";

import { useRef, useEffect } from "react";
import SongCard from "./SongCard";

interface Song {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
}

interface SongGridProps {
  songs: Song[];
  onDeleteSong: (id: string) => void;
  isLoading?: boolean;
}

export default function SongGrid({
  songs,
  onDeleteSong,
  isLoading = false,
}: SongGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Add staggered reveal effect to grid items
  useEffect(() => {
    if (gridRef.current && !isLoading) {
      const cards = gridRef.current.querySelectorAll(".card-reveal");
      cards.forEach((card, index) => {
        // Add a small delay for each card to create a staggered effect
        const delay = index * 100;
        (card as HTMLElement).style.transitionDelay = `${delay}ms`;
      });
    }
  }, [isLoading, songs.length]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-[#1f1f1f] rounded-lg overflow-hidden border border-[#333333] animate-pulse aspect-[16/9]"
          >
            <div className="w-full h-full bg-[#252525]"></div>
          </div>
        ))}
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-[#1f1f1f] rounded-lg border border-[#333333]">
        <svg
          className="w-16 h-16 mx-auto text-[#555555] mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="text-xl text-white font-medium mb-2">No songs found</h3>
        <p className="text-[#a0a0a0] max-w-md mx-auto">
          Your music library is empty. Add your first song to get started.
        </p>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          id={song.id}
          name={song.name}
          artist={song.artist}
          imageUrl={song.imageUrl}
          onDelete={onDeleteSong}
        />
      ))}
    </div>
  );
}
