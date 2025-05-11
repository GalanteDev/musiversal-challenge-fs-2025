"use client";

import { useState, useRef } from "react";
import useIsTouchDevice from "./useIsTouchDevice";
import SongCardImage from "./SongCardImage";
import SongCardContent from "./SongCardContent";
import ConfirmModal from "../../ui/ConfirmModal";

interface SongCardProps {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  onDelete: (id: string) => Promise<void>;
}

export default function SongCard(props: SongCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isTouchDevice = useIsTouchDevice();
  const showHoverEffects = isTouchDevice || isHovering;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await props.onDelete(props.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
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
        <SongCardImage {...props} showHoverEffects={showHoverEffects} />
        <SongCardContent
          {...props}
          showHoverEffects={showHoverEffects}
          isDeleting={isDeleting}
          onDeleteClick={() => setShowDeleteModal(true)}
        />
      </div>

      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Song"
          message={`Are you sure you want to delete "${props.name}" by ${props.artist}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={isDeleting}
        />
      )}
    </>
  );
}
