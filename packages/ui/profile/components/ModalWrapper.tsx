import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export function ModalWrapper({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (typeof window === "undefined") return null;

  // lock background scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 🌐 Desktop Modal */}
          <motion.div
            className="hidden sm:block relative z-10 w-full max-w-3xl my-auto rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-5 sm:p-6 shadow-2xl overflow-y-auto"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
          >
            {children}
          </motion.div>

          {/* 📱 Mobile Bottom Sheet */}
          <motion.div
            className="sm:hidden fixed bottom-0 left-0 right-0 z-10 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-t-2xl border-t border-white/10 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 p-2 shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* optional drag handle */}
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/20" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root") || document.body
  );
}
