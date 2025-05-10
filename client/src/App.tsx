"use client";

import { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SongGrid from "./components/songs/SongGrid";
import SongUploader from "./components/songs/SongUploader";
import { getAllSongs, addSong, deleteSong } from "./api/songService";

interface Song {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  isNew?: boolean;
}

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch songs from API
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const data = await getAllSongs();
        console.log("Fetched songs:", data);
        setSongs(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleDeleteSong = async (id: string) => {
    try {
      await deleteSong(id);
      setSongs(songs.filter((song) => song.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete song");
    }
  };

  const handleAddSong = async (formData: FormData) => {
    try {
      const newSong = await addSong(formData);

      // Add the isNew flag to trigger the animation
      const songWithNewFlag = {
        ...newSong,
        isNew: true,
      };

      setSongs([...songs, songWithNewFlag]);
      return true;
    } catch (err) {
      console.error(err);
      alert("Failed to add song");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Content Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Your Music Library
            </h1>
            <p className="text-gray-400">
              {songs.length} songs in your collection
            </p>
          </div>

          {/* Main Content - Responsive Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Song Grid - Takes more space on larger screens */}
            <div className="w-full lg:w-2/3 order-2 lg:order-1">
              <SongGrid
                songs={songs}
                onDeleteSong={handleDeleteSong}
                isLoading={loading}
              />

              {/* Error Message */}
              {error && (
                <div className="mt-8 p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg text-red-200">
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Upload Section - Fixed width on larger screens */}
            <div className="w-full lg:w-1/3 order-1 lg:order-2">
              <div className="bg-[#1f1f1f] rounded-lg p-6 border border-[#333333] sticky top-8">
                <h2 className="text-xl font-medium mb-6">Add New Song</h2>
                <SongUploader onAddSong={handleAddSong} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
