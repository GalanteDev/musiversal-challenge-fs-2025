"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";

interface SongUploaderProps {
  onAddSong: (formData: FormData) => Promise<boolean>;
}

export default function SongUploader({ onAddSong }: SongUploaderProps) {
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Set up drag and drop event listeners
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Only set isDragging to false if we're leaving the drop area (not entering a child element)
      if (e.currentTarget === e.target) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        // Check if the file is an image
        if (file.type.startsWith("image/")) {
          setImageFile(file);
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          alert("Please upload an image file (PNG, JPG, GIF)");
        }
      }
    };

    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("dragenter", handleDragEnter);
    dropArea.addEventListener("dragleave", handleDragLeave);
    dropArea.addEventListener("drop", handleDrop);

    return () => {
      dropArea.removeEventListener("dragover", handleDragOver);
      dropArea.removeEventListener("dragenter", handleDragEnter);
      dropArea.removeEventListener("dragleave", handleDragLeave);
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !artist || !imageFile) {
      alert("Please fill in all fields and upload an image");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("artist", artist);
    formData.append("image", imageFile);

    try {
      const success = await onAddSong(formData);
      if (success) {
        // Reset form after successful upload
        setName("");
        setArtist("");
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error("Failed to add song");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Failed to upload song. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Song name input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-1.5 text-gray-300"
        >
          Song Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#252525] border border-[#333333] rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors duration-300"
          placeholder="Enter song name"
          disabled={isSubmitting}
        />
      </div>

      {/* Artist input */}
      <div>
        <label
          htmlFor="artist"
          className="block text-sm font-medium mb-1.5 text-gray-300"
        >
          Artist
        </label>
        <input
          type="text"
          id="artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="w-full bg-[#252525] border border-[#333333] rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors duration-300"
          placeholder="Enter artist name"
          disabled={isSubmitting}
        />
      </div>

      {/* Image upload with drag and drop */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium mb-1.5 text-gray-300"
        >
          Cover Image
        </label>

        <div
          ref={dropAreaRef}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-all duration-300 ${
            isDragging
              ? "border-[#FFCC00] bg-[#FFCC00]/5"
              : "border-[#333333] hover:border-[#444444]"
          }`}
        >
          <div className="space-y-2 text-center">
            {imagePreview ? (
              <div className="relative mx-auto w-32 h-32 mb-2">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-[#1f1f1f] border border-[#333333] rounded-full p-1 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            ) : (
              <svg
                className={`mx-auto h-12 w-12 transition-colors duration-300 ${
                  isDragging ? "text-[#FFCC00]" : "text-gray-500"
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            <div className="flex justify-center text-sm text-gray-500">
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer bg-[#252525] rounded-md font-medium text-[#FFCC00] hover:text-[#FFD700] focus-within:outline-none transition-colors duration-200"
              >
                <span className="px-2">Upload a file</span>
                <input
                  id="image-upload"
                  name="image-upload"
                  type="file"
                  ref={fileInputRef}
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p
              className={`text-xs transition-colors duration-300 ${
                isDragging ? "text-[#FFCC00]" : "text-gray-500"
              }`}
            >
              {isDragging ? "Drop your image here" : "PNG, JPG, GIF up to 5MB"}
            </p>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2.5 px-4 rounded-md font-medium transition-all duration-300 ${
          isSubmitting
            ? "bg-[#333333] text-gray-400 cursor-not-allowed"
            : "bg-[#FFCC00] text-black hover:bg-[#FFD700] active:scale-[0.98]"
        }`}
      >
        {isSubmitting ? "Adding Song..." : "Add Song"}
      </button>
    </form>
  );
}
