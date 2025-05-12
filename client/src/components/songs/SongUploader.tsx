"use client";

import { useRef, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Spinner from "../ui/Spinner";

interface SongUploaderProps {
  onAddSong: (formData: FormData) => Promise<boolean>;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const songSchema = z.object({
  name: z.string().min(1, "Song name is required").max(100),
  artist: z.string().min(1, "Artist name is required").max(100),
  image: z
    .any()
    .refine((files) => files?.length === 1, "Cover image is required")
    .refine((files) => files?.[0]?.size <= MAX_IMAGE_SIZE, {
      message: "Image is too large. Max size is 2MB.",
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "Invalid image type. Only JPG, PNG, and WebP are allowed.",
    }),
});

type SongFormSchema = z.infer<typeof songSchema>;

export default function SongUploader({ onAddSong }: SongUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const methods = useForm<SongFormSchema>({
    resolver: zodResolver(songSchema),
    defaultValues: { name: "", artist: "", image: undefined },
  });

  const {
    handleSubmit,
    register,
    setError,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = methods;

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setValue("image", undefined);
    clearErrors("image");
  };

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
      if (e.currentTarget === e.target) setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => setImagePreview(reader.result as string);
          reader.readAsDataURL(file);
          setValue("image", [file]);
          clearErrors("image");
        } else {
          setError("image", { message: "Please upload a valid image file." });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, clearErrors]);

  const onSubmit = async (data: SongFormSchema) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("artist", data.artist);
    formData.append("image", data.image[0]);

    try {
      const success = await onAddSong(formData);
      if (success) {
        reset();
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.errors?.join(" ") ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to upload song. Please try again.";

      setError("root", { message: backendMessage });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {typeof errors.root?.message === "string" && (
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-3 text-red-200 text-sm font-medium">
            {errors.root.message}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1.5 text-gray-300"
          >
            Song Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            className={`w-full bg-[#252525] text-white placeholder-gray-500 rounded-md px-4 py-2.5 focus:outline-none transition-colors duration-300 ${
              errors.name
                ? "border border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border border-[#333333] focus:border-[#FFCC00] focus:ring-[#FFCC00]"
            }`}
            placeholder="Enter song name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-red-500 text-xs" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="artist"
            className="block text-sm font-medium mb-1.5 text-gray-300"
          >
            Artist <span className="text-red-500">*</span>
          </label>
          <input
            {...register("artist")}
            type="text"
            className={`w-full bg-[#252525] text-white placeholder-gray-500 rounded-md px-4 py-2.5 focus:outline-none transition-colors duration-300 ${
              errors.artist
                ? "border border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border border-[#333333] focus:border-[#FFCC00] focus:ring-[#FFCC00]"
            }`}
            placeholder="Enter artist name"
            disabled={isSubmitting}
          />
          {errors.artist && (
            <p className="mt-1 text-red-500 text-xs" role="alert">
              {errors.artist.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="image"
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
          >
            <div className="space-y-2 text-center">
              {imagePreview ? (
                <div className="relative mx-auto w-32 h-32 mb-2">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
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
                  id="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () =>
                        setImagePreview(reader.result as string);
                      reader.readAsDataURL(file);
                      setValue("image", [file]);
                      clearErrors("image");
                    }
                  }}
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
                {isDragging
                  ? "Drop your image here"
                  : "PNG, JPG, JPEG up to 2MB"}
              </p>
            </div>
          </div>
          {errors.image && (
            <p className="mt-1 text-red-500 text-xs" role="alert">
              {errors.image.message as string}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-4 transition-all duration-300 ${
            isSubmitting
              ? "bg-[#333333] text-gray-400 cursor-not-allowed"
              : "bg-[#FFCC00] text-black hover:bg-[#FFD700] active:scale-[0.98]"
          }`}
        >
          {isSubmitting ? "Adding Song..." : "Add Song"}
          {isSubmitting && <Spinner size={20} />}
        </button>
      </form>
    </FormProvider>
  );
}
