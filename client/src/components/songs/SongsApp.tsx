import { useState } from "react";
import { toast } from "react-toastify";
import { useSongs } from "@/hooks/useSongs";
import SongGrid from "./SongGrid";
import SongUploader from "./SongUploader";
import type { Song } from "@/types";

export default function SongsApp() {
  const {
    songs,
    isLoading,
    error,
    addSong,
    deleteSong,
    deleteSongStatus,
    addSongStatus,
    editSong,
    editSongStatus,
  } = useSongs();

  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const handleAddOrEditSong = async (formData: FormData) => {
    if (editingSong) {
      try {
        await editSong(editingSong.id, formData);
        toast.success("Song updated successfully!");
        setEditingSong(null);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error?.message || "Failed to update song.");
        return false;
      }
    } else {
      try {
        await addSong(formData);
        toast.success("Song added successfully!");
        return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error?.message || "Failed to add song.");
        return false;
      }
    }
  };

  const handleDeleteSong = async (id: string) => {
    try {
      await deleteSong(id);
      setEditingSong(null);
      toast.success("Song deleted successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete song.");
      console.error(error);
    }
  };

  const startEditingSong = (song: Song) => {
    setEditingSong(song);
  };

  const stopEditingSong = () => {
    setEditingSong(null);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Content Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Your Music Library
            </h1>
            <p className="text-gray-400">
              {isLoading
                ? "Loading songs..."
                : `${songs.length} songs in your collection`}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 order-2 lg:order-1">
              <SongGrid
                songs={songs}
                onDeleteSong={handleDeleteSong}
                onEditClick={startEditingSong} // PASA ESTA FUNCION
                isLoading={isLoading || deleteSongStatus === "pending"}
              />
              {error && (
                <div className="mt-8 p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg text-red-200">
                  <p>{error.message}</p>
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/3 order-1 lg:order-2">
              <div className="bg-[#1f1f1f] rounded-lg p-6 border border-[#333333] sticky top-8">
                <h2 className="text-xl font-medium mb-6">
                  {editingSong ? "Edit Song" : "Add New Song"}
                </h2>
                <SongUploader
                  onAddSong={handleAddOrEditSong}
                  isSubmitting={
                    addSongStatus === "pending" || editSongStatus === "pending"
                  }
                  initialValues={
                    editingSong
                      ? {
                          name: editingSong.name,
                          artist: editingSong.artist,
                          imageUrl: editingSong.imageUrl,
                        }
                      : undefined
                  }
                />
                {editingSong && (
                  <button
                    onClick={stopEditingSong}
                    className="mt-4 text-sm text-[#FFCC00] hover:text-[#FFD700]"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
