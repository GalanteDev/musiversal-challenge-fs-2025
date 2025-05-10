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

  // Track if fields have been touched/interacted with
  const [touched, setTouched] = useState({
    name: false,
    artist: false,
    image: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Validate name field
  const validateName = (value: string) => {
    if (!value.trim()) {
      return "Song name is required";
    } else if (value.length > 100) {
      return "Song name must be less than 100 characters";
    }
    return undefined;
  };

  // Validate artist field
  const validateArtist = (value: string) => {
    if (!value.trim()) {
      return "Artist name is required";
    } else if (value.length > 100) {
      return "Artist name must be less than 100 characters";
    }
    return undefined;
  };

  // Validate image field
  const validateImage = (file: File | null) => {
    if (!file) {
      return "Cover image is required";
    }
    return undefined;
  };

  // Real-time validation whenever inputs change
  useEffect(() => {
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateName(name) }));
    }

    if (touched.artist) {
      setErrors((prev) => ({ ...prev, artist: validateArtist(artist) }));
    }

    if (touched.image) {
      setErrors((prev) => ({ ...prev, image: validateImage(imageFile) }));
    }
  }, [name, artist, imageFile, touched]);

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
      setTouched((prev) => ({ ...prev, image: true }));

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          setImageFile(file);

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
    setTouched((prev) => ({ ...prev, image: true }));
    const file = e.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        setImageFile(file);

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
    // Mark all fields as touched
    setTouched({
      name: true,
      artist: true,
      image: true,
    });

    // Validate all fields
    const nameError = validateName(name);
    const artistError = validateArtist(artist);
    const imageError = validateImage(imageFile);

    // Update errors state
    setErrors({
      name: nameError,
      artist: artistError,
      image: imageError,
    });

    // Form is valid if there are no errors
    return !nameError && !artistError && !imageError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector(".error-field");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
        setTouched({ name: false, artist: false, image: false });
        setErrors({});
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error: unknown) {
      console.error("Error in SongUploader:", error);

      if (error instanceof Error) {
        const apiError = error as ApiError;

        // Handle backend errors
        if (
          apiError.response?.data?.errors &&
          apiError.response.data.errors.length > 0
        ) {
          setErrors({ general: apiError.response.data.errors });
        } else {
          // General error message
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

  // Accessibility helper for screen readers
  const getAriaDescribedBy = (fieldName: string) => {
    return errors[fieldName as keyof typeof errors]
      ? `${fieldName}-error`
      : undefined;
  };

  // Common input class with conditional error styling
  const getInputClass = (fieldName: keyof typeof errors) => {
    const baseClass =
      "w-full bg-[#252525] text-white placeholder-gray-500 rounded-md px-4 py-2.5 focus:outline-none transition-colors duration-300";
    const errorClass = errors[fieldName]
      ? "border border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border border-[#333333] focus:border-[#FFCC00] focus:ring-[#FFCC00]";

    return `${baseClass} ${errorClass} ${
      errors[fieldName] ? "error-field" : ""
    }`;
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >
      {/* General errors */}
      {errors.general && errors.general.length > 0 && (
        <div
          role="alert"
          className="bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-3 mb-4"
        >
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
          Song Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
          className={getInputClass("name")}
          placeholder="Enter song name"
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          aria-describedby={getAriaDescribedBy("name")}
          style={{ backgroundColor: "#252525" }}
          required
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-red-500 text-xs" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Artist input */}
      <div>
        <label
          htmlFor="artist"
          className="block text-sm font-medium mb-1.5 text-gray-300"
        >
          Artist <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, artist: true }))}
          className={getInputClass("artist")}
          placeholder="Enter artist name"
          disabled={isSubmitting}
          aria-invalid={!!errors.artist}
          aria-describedby={getAriaDescribedBy("artist")}
          style={{ backgroundColor: "#252525" }}
          required
        />
        {errors.artist && (
          <p
            id="artist-error"
            className="mt-1 text-red-500 text-xs"
            role="alert"
          >
            {errors.artist}
          </p>
        )}
      </div>

      {/* Image upload with drag and drop */}
      <div>
        <label
          htmlFor="image-upload"
          className="block text-sm font-medium mb-1.5 text-gray-300"
        >
          Cover Image <span className="text-red-500">*</span>
        </label>

        <div
          ref={dropAreaRef}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-all duration-300 cursor-pointer ${
            errors.image
              ? "border-red-500 bg-red-900/5"
              : isDragging
              ? "border-[#FFCC00] bg-[#FFCC00]/5"
              : "border-[#333333] hover:border-[#444444]"
          }`}
          aria-invalid={!!errors.image}
          aria-describedby={getAriaDescribedBy("image")}
        >
          <div className="space-y-2 text-center">
            {imagePreview ? (
              <div className="relative mx-auto w-32 h-32 mb-2">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the file input click
                    setImageFile(null);
                    setImagePreview(null);
                    setTouched((prev) => ({ ...prev, image: true }));
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-[#1f1f1f] border border-[#333333] rounded-full p-1 text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Remove image"
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
              <span className="relative cursor-pointer bg-[#252525] rounded-md font-medium text-[#FFCC00] hover:text-[#FFD700] focus-within:outline-none transition-colors duration-200 px-2">
                Upload a file
              </span>
              <input
                id="image-upload"
                name="image-upload"
                type="file"
                ref={fileInputRef}
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                required
              />
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
          <p
            id="image-error"
            className="mt-1 text-red-500 text-xs"
            role="alert"
          >
            {errors.image}
          </p>
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
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            Adding Song
            <svg
              className="ml-2 w-4 h-4 animate-spin text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
          </>
        ) : (
          "Add Song"
        )}
      </button>
    </form>
  );
}
