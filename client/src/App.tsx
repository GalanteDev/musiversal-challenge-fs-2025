import { useEffect, useState } from "react";

type Song = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
};

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/songs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch songs");
        return res.json();
      })
      .then((data) => setSongs(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎵 Song Library</h1>
      {songs.length === 0 ? (
        <p>No songs available</p>
      ) : (
        <ul>
          {songs.map((song) => (
            <li key={song.id}>
              <strong>{song.name}</strong> by {song.artist}
              <br />
              <img
                src={`http://localhost:4000${song.imageUrl}`}
                alt={song.name}
                width="150"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
