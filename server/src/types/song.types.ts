export type Song = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
};

export interface ProtectedSong {
  name: string;
  artist: string;
  file: string;
}
