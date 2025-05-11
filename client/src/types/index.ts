export interface Song {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
}

export interface UpdateSongPayload {
  name: string;
  artist: string;
}
export interface ApiError extends Error {
  response?: {
    data?: {
      status?: string;
      errors?: string[];
    };
  };
}
