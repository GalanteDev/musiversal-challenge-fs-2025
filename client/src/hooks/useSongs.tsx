import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSongs,
  addSong,
  deleteSong,
  editSong as apiEditSong, // <-- importa la función de edición de tu API
  getUploadUrl,
  uploadFileToSignedUrl,
} from "@/api/songService";
import type { Song } from "@/types";

export function useSongs() {
  const queryClient = useQueryClient();

  // Fetch all songs
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

  // Mutation to add a song
  const addSongMutation = useMutation<Song, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const file = formData.get("image") as File;
      if (!file) throw new Error("Image missing");

      const name = formData.get("name") as string;
      const artist = formData.get("artist") as string;

      const { uploadUrl, publicUrl } = await getUploadUrl(file.type);
      await uploadFileToSignedUrl(uploadUrl, file);

      return await addSong({ name, artist, imageUrl: publicUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  // Mutation to edit a song
  const editSongMutation = useMutation<
    Song,
    Error,
    { id: string; formData: FormData }
  >({
    mutationFn: async ({ id, formData }) => {
      const file = formData.get("image") as File | null;
      const name = formData.get("name") as string;
      const artist = formData.get("artist") as string;

      let imageUrl: string | undefined;

      if (file) {
        const { uploadUrl, publicUrl } = await getUploadUrl(file.type);
        await uploadFileToSignedUrl(uploadUrl, file);
        imageUrl = publicUrl;
      }

      // apiEditSong debe aceptar la info para actualizar (incluye imageUrl si cambia)
      return await apiEditSong(id, { name, artist, imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  // Mutation to delete a song
  const deleteSongMutation = useMutation({
    mutationFn: deleteSong,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["songs"] });

      const previousSongs = queryClient.getQueryData<Song[]>(["songs"]);

      queryClient.setQueryData<Song[]>(["songs"], (old) =>
        old ? old.filter((song) => song.id !== id) : []
      );

      return { previousSongs };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (_err, _id, context: any) => {
      if (context?.previousSongs) {
        queryClient.setQueryData(["songs"], context.previousSongs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  // Wrappers
  const addSongAsync = async (formData: FormData) => {
    await addSongMutation.mutateAsync(formData);
  };

  const editSongAsync = async (id: string, formData: FormData) => {
    await editSongMutation.mutateAsync({ id, formData });
  };

  const deleteSongAsync = async (id: string) => {
    await deleteSongMutation.mutateAsync(id);
  };

  return {
    songs,
    isLoading,
    error,
    addSong: addSongAsync,
    addSongStatus: addSongMutation.status,
    editSong: editSongAsync,
    editSongStatus: editSongMutation.status,
    deleteSong: deleteSongAsync,
    deleteSongStatus: deleteSongMutation.status,
  };
}
