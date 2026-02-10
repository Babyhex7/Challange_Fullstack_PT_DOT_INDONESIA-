// Modal konfirmasi hapus data - reusable (modern rounded UI)
import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-7 w-full max-w-sm mx-4 shadow-2xl animate-slideUp border border-gray-200/60">
        {/* Icon warning */}
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-500" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center">{title}</h3>
        <p className="text-sm text-gray-500 mt-2 text-center leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3 mt-7">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-linear-to-r from-red-500 to-red-600 rounded-2xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Menghapus...
              </span>
            ) : (
              "Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
