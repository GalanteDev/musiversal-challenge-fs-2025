"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";

interface ApiError extends Error {
  response?: {
    data?: {
      status?: string;
      errors?: string[];
    };
  };
}

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
  const [errors, setErrors] = useState<{
    name?: string;
    artist?: string;
    image?: string;
    general?: string[];
  }>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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
        if (file.type.startsWith("image/")) {
          setImageFile(file);
          setErrors((prev) => ({ ...prev, image: undefined }));

          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setErrors((prev) => ({
            ...prev,
            image: "Please upload an image file (PNG, JPG, GIF)",
          }));
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
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        setErrors((prev) => ({ ...prev, image: undefined }));

        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload an image file (PNG, JPG, GIF)",
        }));
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Song name is required";
    } else if (name.length > 100) {
      newErrors.name = "Song name must be less than 100 characters";
    }

    if (!artist.trim()) {
      newErrors.artist = "Artist name is required";
    } else if (artist.length > 100) {
      newErrors.artist = "Artist name must be less than 100 characters";
    }

    if (!imageFile) {
      newErrors.image = "Cover image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("artist", artist);
    formData.append("image", imageFile!);

    try {
      const success = await onAddSong(formData);
      if (success) {
        // Reset form
        setName("");
        setArtist("");
        setImageFile(null);
        setImagePreview(null);
        setAttemptedSubmit(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error: unknown) {
      console.error("Error in SongUploader:", error);

      if (error instanceof Error) {
        const apiError = error as ApiError;

        // Mostrar errores del backend si están disponibles
        if (
          apiError.response?.data?.errors &&
          apiError.response.data.errors.length > 0
        ) {
          setErrors({ general: apiError.response.data.errors });
          console.log("Setting API errors:", apiError.response.data.errors);
        } else {
          // Si no hay errores específicos del backend, mostrar el mensaje de error general
          setErrors({
            general: [
              apiError.message || "Failed to upload song. Please try again.",
            ],
          });
        }
      } else {
        setErrors({ general: ["Failed to upload song. Please try again."] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clase común para los inputs para evitar duplicación
  const inputClass = `w-full bg-[#252525] text-white placeholder-gray-500 rounded-md px-4 py-2.5 focus:outline-none transition-colors duration-300`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General errors - Mejorado para asegurar que los errores se muestren */}
      {errors.general && errors.general.length > 0 && (
        <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-3 mb-4">
          {errors.general.map((error, index) => (
            <p key={index} className="text-red-200 text-sm font-medium">
              {error}
            </p>
          ))}
        </div>
      )}

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
          onChange={(e) => {
            setName(e.target.value);
            if (attemptedSubmit || errors.name) {
              if (!e.target.value.trim()) {
                setErrors((prev) => ({
                  ...prev,
                  name: "Song name is required",
                }));
              } else if (e.target.value.length > 100) {
                setErrors((prev) => ({
                  ...prev,
                  name: "Song name must be less than 100 characters",
                }));
              } else {
                setErrors((prev) => ({ ...prev, name: undefined }));
              }
            }
          }}
          className={`${inputClass} ${
            errors.name
              ? "border border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border border-[#333333] focus:border-[#FFCC00] focus:ring-[#FFCC00]"
          }`}
          placeholder="Enter song name"
          disabled={isSubmitting}
          style={{ backgroundColor: "#252525" }}
        />
        {errors.name && (
          <p className="mt-1 text-red-500 text-xs">{errors.name}</p>
        )}
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
          onChange={(e) => {
            setArtist(e.target.value);
            if (attemptedSubmit || errors.artist) {
              if (!e.target.value.trim()) {
                setErrors((prev) => ({
                  ...prev,
                  artist: "Artist name is required",
                }));
              } else if (e.target.value.length > 100) {
                setErrors((prev) => ({
                  ...prev,
                  artist: "Artist name must be less than 100 characters",
                }));
              } else {
                setErrors((prev) => ({ ...prev, artist: undefined }));
              }
            }
          }}
          className={`${inputClass} ${
            errors.artist
              ? "border border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border border-[#333333] focus:border-[#FFCC00] focus:ring-[#FFCC00]"
          }`}
          placeholder="Enter artist name"
          disabled={isSubmitting}
          style={{ backgroundColor: "#252525" }}
        />
        {errors.artist && (
          <p className="mt-1 text-red-500 text-xs">{errors.artist}</p>
        )}
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
            errors.image
              ? "border-red-500 bg-red-900/5"
              : isDragging
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
                    if (attemptedSubmit) {
                      setErrors((prev) => ({
                        ...prev,
                        image: "Cover image is required",
                      }));
                    }
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
                  errors.image
                    ? "text-red-500"
                    : isDragging
                    ? "text-[#FFCC00]"
                    : "text-gray-500"
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
                errors.image
                  ? "text-red-500"
                  : isDragging
                  ? "text-[#FFCC00]"
                  : "text-gray-500"
              }`}
            >
              {isDragging ? "Drop your image here" : "PNG, JPG, GIF up to 2MB"}
            </p>
          </div>
        </div>
        {errors.image && (
          <p className="mt-1 text-red-500 text-xs">{errors.image}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-4 transition-all duration-300 ${
          isSubmitting
            ? "bg-[#333333] text-gray-400 cursor-not-allowed"
            : "bg-[#FFCC00] text-black hover:bg-[#FFD700] active:scale-[0.98]"
        }`}
      >
        {isSubmitting ? (
          <>
            Adding Song
            {isSubmitting && (
              <svg
                className="ml-2 w-4 h-4 animate-spin text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
          </>
        ) : (
          "Add Song"
        )}
      </button>
    </form>
  );
}
