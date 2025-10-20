"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "./ToastContext";
import { Toast } from "./Toast";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="pointer-events-auto"
          >
            <Toast toast={toast} onClose={() => removeToast(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
