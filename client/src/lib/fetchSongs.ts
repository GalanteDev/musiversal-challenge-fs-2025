import { getAllSongs } from "@/api/songService";
import type { Song } from "@/types";

export const fetchSongs = async (
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    setLoading(true);
    const data = await getAllSongs();
    setSongs(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An unknown error occurred");
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching songs:", err);
    }
  } finally {
    setLoading(false);
  }
};
