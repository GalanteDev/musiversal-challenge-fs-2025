import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Upload, Music, User } from "lucide-react";
import type { Song } from "../../types";
import { createSong, updateSong } from "../../services/api";

interface SongFormProps {
  onSuccess: () => void;
  editingSong: Song | null;
}

export function SongForm({ onSuccess, editingSong }: SongFormProps) {
  const [name, setName] = useState(editingSong?.name || "");
  const [artist, setArtist] = useState(editingSong?.artist || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    editingSong?.imageUrl
      ? `${import.meta.env.VITE_API_URL || ""}${editingSong.imageUrl}`
      : null
  );
  const [nameError, setNameError] = useState<string | null>(null);
  const [artistError, setArtistError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create song mutation
  const createMutation = useMutation({
    mutationFn: createSong,
    onSuccess: () => {
      toast.success("Song created successfully");
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to create song");
    },
  });

  // Update song mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateSong(id, data),
    onSuccess: () => {
      toast.success("Song updated successfully");
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to update song");
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Song name is required");
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!artist.trim()) {
      setArtistError("Artist name is required");
      isValid = false;
    } else {
      setArtistError(null);
    }

    if (!editingSong && !imageFile) {
      setImageError("Album cover is required");
      isValid = false;
    } else {
      setImageError(null);
    }

    return isValid;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageError("File must be an image");
      return;
    }

    setImageFile(file);
    setImageError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("artist", artist);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (editingSong) {
      updateMutation.mutate({ id: editingSong.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(createMutation.error || updateMutation.error) && (
        <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-400">
          Failed to save song. Please try again.
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-200">
          Song Name
        </Label>
        <div className="relative">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={nameError ? "border-red-500" : ""}
            placeholder="Enter song name"
            icon={<Music className="h-4 w-4 text-gray-400" />}
          />
        </div>
        {nameError && <p className="text-xs text-red-400">{nameError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="artist" className="text-sm font-medium text-gray-200">
          Artist
        </Label>
        <div className="relative">
          <Input
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className={artistError ? "border-red-500" : ""}
            placeholder="Enter artist name"
            icon={<User className="h-4 w-4 text-gray-400" />}
          />
        </div>
        {artistError && <p className="text-xs text-red-400">{artistError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className="text-sm font-medium text-gray-200">
          Album Cover
        </Label>
        <div
          className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed ${
            imageError
              ? "border-red-500 bg-red-900/10"
              : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
          } p-4 transition-colors`}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <div className="relative h-32 w-32 overflow-hidden rounded-md">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Album cover preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-400">
                Click to upload album cover
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 2MB
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        {imageError && <p className="text-xs text-red-400">{imageError}</p>}
      </div>

      <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
            {editingSong ? "Updating..." : "Creating..."}
          </>
        ) : editingSong ? (
          "Update Song"
        ) : (
          "Add Song"
        )}
      </Button>
    </form>
  );
}
