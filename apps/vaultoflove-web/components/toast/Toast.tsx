"use client";
import { cn } from "@verse/vaultoflove-web/lib/utils";
import { motion } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export const Toast = ({ toast, onClose }: { toast: any; onClose: () => void }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    error: <AlertTriangle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    default: <Info className="w-5 h-5 text-pink-400" />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative w-full rounded-2xl border border-pink-500/20 p-4 pr-10 shadow-lg backdrop-blur-md",
        "bg-gradient-to-r from-black/40 via-purple-900/10 to-pink-900/10",
        "hover:border-pink-400/40 transition-all duration-300"
      )}
    >
      <div className="flex items-start gap-3">
        {icons[toast.variant || "default"]}
        <div>
          <h4 className="font-semibold text-white">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm text-pink-200/70 mt-1">{toast.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-pink-400/60 hover:text-pink-200"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
