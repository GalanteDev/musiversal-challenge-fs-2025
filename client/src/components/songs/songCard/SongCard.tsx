"use client";

import { useState, useRef, useEffect } from "react";
import useIsTouchDevice from "./useIsTouchDevice";
import SongCardImage from "./SongCardImage";
import SongCardContent from "./SongCardContent";
import ConfirmModal from "../../ui/ConfirmModal";
import type { Song } from "@/types";

interface SongCardProps {
  song: Song;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
  onEditClick: (song: Song) => void;
}

export default function SongCard(props: SongCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const isTouchDevice = useIsTouchDevice();
  const showHoverEffects = isTouchDevice || isHovering;

  useEffect(() => {
    if (!props.isDeleting) {
      setShowDeleteModal(false);
    }
  }, [props.isDeleting]);

  const handleDelete = async () => {
    try {
      await props.onDelete(props.song.id);
      // No cerrar modal aquí para que spinner sea visible mientras isDeleting sea true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Opcional: manejo de error aquí
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        className="group relative rounded-lg overflow-hidden border border-[#333333] aspect-[16/9] transition-all duration-700 ease-out"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          boxShadow: showHoverEffects
            ? "0 8px 30px rgba(0, 0, 0, 0.3)"
            : "0 4px 10px rgba(0, 0, 0, 0.1)",
          transform: showHoverEffects ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        <SongCardImage
          name={props.song.name}
          artist={props.song.artist}
          imageUrl={props.song.imageUrl}
          showHoverEffects={showHoverEffects}
        />
        <SongCardContent
          name={props.song.name}
          artist={props.song.artist}
          showHoverEffects={showHoverEffects}
          isDeleting={props.isDeleting}
          onDeleteClick={() => setShowDeleteModal(true)}
          onEditClick={() => props.onEditClick(props.song)}
        />
      </div>

      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Song"
          message={`Are you sure you want to delete "${props.song.name}" by ${props.song.artist}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={props.isDeleting}
        />
      )}
    </>
  );
}
