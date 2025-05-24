import axios from "axios";
import type { Song } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface UploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

export async function getUploadUrl(
  fileType: string
): Promise<UploadUrlResponse> {
  const { data } = await axiosInstance.post("/songs/upload-url", { fileType });
  return data;
}

export async function uploadFileToSignedUrl(
  uploadUrl: string,
  file: File
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });
}

export async function addSong(song: {
  name: string;
  artist: string;
  imageUrl: string;
}): Promise<Song> {
  const { data } = await axiosInstance.post("/songs", song);
  return data;
}

export async function getAllSongs(): Promise<Song[]> {
  const { data } = await axiosInstance.get("/songs");
  return data;
}

export async function deleteSong(
  id: string
): Promise<{ status: string; message: string }> {
  const { data } = await axiosInstance.delete(`/songs/${id}`);
  return data;
}
