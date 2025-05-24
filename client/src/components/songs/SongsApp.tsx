import {
  getAllSongs,
  getUploadUrl,
  uploadFileToSignedUrl,
  addSong,
  deleteSong,
} from "@/api/songService";
import type { Song } from "@/types";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import SongGrid from "./SongGrid";
import SongUploader from "./SongUploader";
import { useState } from "react";

interface DeleteSongResponse {
  status: string;
  message: string;
}

export default function SongsApp() {
  const queryClient = useQueryClient();

  const [deletingSongIds, setDeletingSongIds] = useState<Set<string>>(
    new Set()
  );

  const {
    data: songs = [],
    isLoading,
    error,
  } = useQuery<Song[], Error>({
    queryKey: ["songs"],
    queryFn: getAllSongs,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const addSongMutation = useMutation<Song, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const file = formData.get("image") as File;
      if (!file) throw new Error("Image missing");

      const name = formData.get("name") as string;
      const artist = formData.get("artist") as string;

      // get upload URL and public URL for the image
      const { uploadUrl, publicUrl } = await getUploadUrl(file.type);

      // upload the image to the signed URL
      await uploadFileToSignedUrl(uploadUrl, file);

      // add the song with the image URL
      return await addSong({ name, artist, imageUrl: publicUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  const deleteSongMutation = useMutation<DeleteSongResponse, Error, string>({
    mutationFn: deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  const handleAddSong = async (formData: FormData) => {
    await addSongMutation.mutateAsync(formData);
    return true;
  };

  const handleDeleteSong = async (id: string) => {
    setDeletingSongIds((prev) => new Set(prev).add(id)); // marca como borrando
    try {
      await deleteSongMutation.mutateAsync(id);
    } catch (error) {
      alert("Failed to delete song");
      console.error(error);
    } finally {
      setDeletingSongIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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
                deletingSongIds={deletingSongIds}
                songs={songs}
                onDeleteSong={handleDeleteSong}
                isLoading={isLoading || deleteSongMutation.isPending}
              />

              {/* Error Message */}
              {error && (
                <div className="mt-8 p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg text-red-200">
                  <p>{error.message}</p>
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
