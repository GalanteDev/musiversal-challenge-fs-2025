"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Spinner from "../ui/Spinner";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const createSongSchema = (
  hasPreexistingImage: boolean,
  imageWasRemoved: boolean
) =>
  z.object({
    name: z.string().min(1, "Song name is required").max(100),
    artist: z.string().min(1, "Artist name is required").max(100),
    image: z
      .any()
      .refine((files) => {
        // Si hay archivo nuevo, OK
        if (files && files.length === 1) return true;
        // Si no hay archivo nuevo pero hay preexisting imagen no removida, OK
        if (hasPreexistingImage && !imageWasRemoved) return true;
        // En otro caso, inválido
        return false;
      }, "Cover image is required")
      .refine(
        (files) => {
          if (!files || files.length === 0) return true; // si no hay archivo nuevo, pasa
          return files[0].size <= MAX_IMAGE_SIZE;
        },
        { message: "Image is too large. Max size is 2MB." }
      )
      .refine(
        (files) => {
          if (!files || files.length === 0) return true; // si no hay archivo nuevo, pasa
          return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
        },
        { message: "Invalid image type. Only JPG, PNG are allowed." }
      ),
  });

type SongFormSchema = z.infer<ReturnType<typeof createSongSchema>>;

interface SongUploaderProps {
  onAddSong: (formData: FormData) => Promise<boolean>;
  isSubmitting?: boolean;
  initialValues?: {
    name: string;
    artist: string;
    imageUrl?: string;
  };
}

export default function SongUploader({
  onAddSong,
  isSubmitting = false,
  initialValues,
}: SongUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasPreexistingImage, setHasPreexistingImage] = useState(false);
  const [imageWasRemoved, setImageWasRemoved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!initialValues;
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";

  // Crear esquema dinámico con la info actual
  const songSchema = createSongSchema(hasPreexistingImage, imageWasRemoved);

  const methods = useForm<SongFormSchema>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      name: "",
      artist: "",
      image: [],
    },
  });

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    clearErrors,
    setError,
    watch,
    trigger,
    formState: { errors, isDirty },
  } = methods;

  const watchedName = watch("name");
  const watchedArtist = watch("artist");
  const watchedImage = watch("image");

  useEffect(() => {
    if (isFormSubmitting) return;

    if (initialValues) {
      reset({
        name: initialValues.name || "",
        artist: initialValues.artist || "",
        image: [],
      });

      if (initialValues.imageUrl) {
        if (
          initialValues.imageUrl.startsWith("http://") ||
          initialValues.imageUrl.startsWith("https://")
        ) {
          setImagePreview(initialValues.imageUrl);
        } else {
          setImagePreview(SUPABASE_URL + initialValues.imageUrl);
        }
        setHasPreexistingImage(true);
        setImageWasRemoved(false);
      } else {
        setImagePreview(null);
        setHasPreexistingImage(false);
        setImageWasRemoved(false);
      }
    } else {
      reset({
        name: "",
        artist: "",
        image: [],
      });
      setImagePreview(null);
      setHasPreexistingImage(false);
      setImageWasRemoved(false);
    }
    setHasChanges(false);
  }, [initialValues, reset, isFormSubmitting, SUPABASE_URL]);

  useEffect(() => {
    if (!isEditMode) {
      const hasContent =
        watchedName.trim() !== "" ||
        watchedArtist.trim() !== "" ||
        (watchedImage && watchedImage.length > 0);
      setHasChanges(hasContent);
      return;
    }
    const nameChanged = watchedName !== (initialValues?.name ?? "");
    const artistChanged = watchedArtist !== (initialValues?.artist ?? "");
    const imageChanged =
      (watchedImage && watchedImage.length > 0) || imageWasRemoved;

    setHasChanges(nameChanged || artistChanged || imageChanged);
  }, [
    watchedName,
    watchedArtist,
    watchedImage,
    imageWasRemoved,
    initialValues,
    isEditMode,
  ]);

  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setImageWasRemoved(false);
    }
  }, [watchedImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", [file], { shouldDirty: true, shouldValidate: true });
      clearErrors("image");
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("image", [], { shouldDirty: true, shouldValidate: true });
    setImagePreview(null);
    setImageWasRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => {
      trigger("image");
    }, 0);
  };

  const onSubmit = async (data: SongFormSchema) => {
    const hasNewImage = data.image && data.image.length > 0;
    const hasValidPreexistingImage = hasPreexistingImage && !imageWasRemoved;

    if (!hasNewImage && !hasValidPreexistingImage) {
      setError("image", { message: "Cover image is required" });
      return;
    }

    try {
      setIsFormSubmitting(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("artist", data.artist);

      if (hasNewImage) {
        formData.append("image", data.image[0]);
      } else if (hasValidPreexistingImage) {
        formData.append("existingImageUrl", initialValues?.imageUrl || "");
      }

      const success = await onAddSong(formData);
      if (success) {
        if (!isEditMode) {
          reset();
          setImagePreview(null);
          setHasPreexistingImage(false);
          setImageWasRemoved(false);
          setHasChanges(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setHasChanges(false);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.errors?.join(" ") ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to save song. Please try again.";
      setError("root", { message: backendMessage });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const hasValidImage =
    (watchedImage && watchedImage.length > 0) ||
    (hasPreexistingImage && !imageWasRemoved);

  const showImageError =
    errors.image ||
    (!hasValidImage && (imageWasRemoved || (!isEditMode && isDirty)));

  const isButtonEnabled =
    hasChanges && hasValidImage && !isSubmitting && !isFormSubmitting;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {typeof errors.root?.message === "string" && (
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-3 text-red-200 text-sm font-medium">
            {errors.root.message}
          </div>
        )}

        {/* Song Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-300">
            Song Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            className={`w-full bg-[#252525] text-white placeholder-gray-500 rounded-md px-4 py-2.5 focus:outline-none transition-colors duration-300 ${
              errors.name
                ? "border border-red-500 focus:border-red-500"
                : "border border-[#333333] focus:border-[#FFCC00]"
            }`}
            placeholder="Enter song name"
            disabled={isSubmitting || isFormSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-red-500 text-xs" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Artist */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-300">
            Artist <span className="text-red-500">*</span>
          </label>
          <input
            {...register("artist")}
            type="text"
            className={`w-full bg-[#252525] text-white placeholder-gray-500 rounded-md px-4 py-2.5 focus:outline-none transition-colors duration-300 ${
              errors.artist
                ? "border border-red-500 focus:border-red-500"
                : "border border-[#333333] focus:border-[#FFCC00]"
            }`}
            placeholder="Enter artist name"
            disabled={isSubmitting || isFormSubmitting}
          />
          {errors.artist && (
            <p className="mt-1 text-red-500 text-xs" role="alert">
              {errors.artist.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-300">
            Cover Image <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors duration-300 ${
              showImageError
                ? "border-red-500 bg-red-900/5"
                : "border-[#333333] hover:border-[#444444]"
            }`}
          >
            <div className="space-y-2 text-center">
              {imagePreview ? (
                <div className="relative mx-auto w-32 h-32 mb-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-full h-full object-cover rounded-md"
                    onError={() => setImagePreview(null)}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-[#1f1f1f] border border-[#333333] rounded-full p-1 text-gray-400 hover:text-amber-300 transition-colors duration-200"
                    aria-label="Remove image"
                    disabled={isSubmitting || isFormSubmitting}
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              ) : (
                <FaCloudUploadAlt
                  size={48}
                  className={`mx-auto ${
                    showImageError ? "text-red-500" : "text-gray-500"
                  }`}
                />
              )}
              <div className="flex justify-center text-sm text-gray-500">
                <span className="relative cursor-pointer bg-[#252525] rounded-md font-medium text-[#FFCC00] hover:text-[#FFD700] px-2">
                  Upload a file
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    ref={fileInputRef}
                    className="sr-only"
                    onChange={handleImageUpload}
                    disabled={isSubmitting || isFormSubmitting}
                  />
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              {showImageError && (
                <p className="mt-1 text-red-500 text-xs" role="alert">
                  {typeof errors.image?.message === "string"
                    ? errors.image.message
                    : "Cover image is required"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isButtonEnabled}
          className={`w-full py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-4 transition-all duration-300 ${
            isSubmitting || isFormSubmitting
              ? "bg-[#333333] text-gray-400 cursor-not-allowed"
              : !isButtonEnabled
              ? showImageError
                ? "bg-red-900 bg-opacity-20 border border-red-800 text-red-200 cursor-not-allowed"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-[#FFCC00] text-black hover:bg-[#FFD700]"
          }`}
        >
          {isSubmitting || isFormSubmitting
            ? "Saving..."
            : isEditMode
            ? "Save Changes"
            : "Add Song"}
          {(isSubmitting || isFormSubmitting) && <Spinner size={20} />}
        </button>
      </form>
    </FormProvider>
  );
}
