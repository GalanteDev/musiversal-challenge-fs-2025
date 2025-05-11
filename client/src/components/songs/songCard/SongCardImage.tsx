import { useState } from "react";

interface SongCardImageProps {
  name: string;
  artist: string;
  imageUrl: string;
  showHoverEffects: boolean;
}

export default function SongCardImage({
  name,
  artist,
  imageUrl,
  showHoverEffects,
}: SongCardImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const formattedImageUrl = `${import.meta.env.VITE_API_URL}${imageUrl}`;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#252525] overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#333333] border-t-[#FFCC00] rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={formattedImageUrl || "/placeholder.svg"}
        alt={`${name} by ${artist}`}
        className={`w-full h-full object-cover transition-all duration-1000 ease-out will-change-transform ${
          showHoverEffects
            ? "scale-[1.04] filter brightness-[1.05]"
            : "scale-100"
        } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImageLoaded(true)}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
          showHoverEffects ? "opacity-85" : "opacity-70"
        }`}
        style={{
          background: `linear-gradient(to top, 
            rgba(0,0,0,0.95) 0%, 
            rgba(0,0,0,0.8) 25%, 
            rgba(0,0,0,0.6) 50%, 
            rgba(0,0,0,0.4) 75%, 
            rgba(0,0,0,0.2) 90%, 
            rgba(0,0,0,0) 100%)`,
        }}
      ></div>
      {showHoverEffects && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(255, 204, 0, 0.2) 0%, rgba(0, 0, 0, 0) 70%)`,
          }}
        ></div>
      )}
    </div>
  );
}
