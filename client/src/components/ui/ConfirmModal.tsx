"use client";

import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Simple solution: don't manipulate body overflow at all
  // This avoids scroll issues while still allowing the modal to work

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
      <div
        ref={modalRef}
        className="bg-[#1f1f1f] border border-[#333333] rounded-lg w-full max-w-md shadow-xl"
      >
        <div className="p-6">
          <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
          <p className="text-[#a0a0a0] mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-[#a0a0a0] hover:text-white hover:bg-[#333333] transition-colors duration-200"
            >
              {cancelText}
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                isDestructive
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-[#FFCC00] hover:bg-[#FFD700] text-black"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
