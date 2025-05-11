import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onClose: () => void;
  isDestructive?: boolean;
  isLoading: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
  isDestructive = false,
  isLoading = false,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-white text-xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-300 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-md font-medium transition ${
              isDestructive
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-[#FFCC00] hover:bg-[#FFD700] text-black"
            }`}
          >
            {confirmText}
            {isLoading && <Spinner className="inline-block ml-2" size={16} />}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
