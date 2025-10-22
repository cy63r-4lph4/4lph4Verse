"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Task } from "../types";
import { Button } from "@verse/ui/components/ui/button";
import { Input } from "@verse/ui/components/ui/input";
import { Textarea } from "@verse/ui/components/ui/textarea";
import { Send, Coins, X, Loader2, MessageSquare } from "lucide-react";
import { useOutsideClick } from "@verse/sdk";

export function ApplyBidDialog({
  open,
  onClose,
  task,
  containerSelector,
}: {
  open: boolean;
  onClose: () => void;
  task: Task;
  containerSelector?: string; 
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dialogRef, () => {
    if (open) onClose();
  });
  const [tab, setTab] = useState<"apply" | "bid">("apply");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bidAmount, setBidAmount] = useState(task.budget);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (containerSelector) {
      const el = document.querySelector(
        containerSelector
      ) as HTMLElement | null;
      setContainer(el ?? document.body);
    } else {
      setContainer(document.body);
    }
  }, [containerSelector]);

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(
        tab === "apply"
          ? "✅ Application submitted successfully!"
          : "💰 Bid placed successfully!"
      );
      onClose();
    }, 900);
  };

  if (!container) return null; // ✅ avoid SSR crash

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal forceMount container={container}>
        {/* Overlay */}
        <Dialog.Overlay asChild forceMount>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />
        </Dialog.Overlay>

        {/* Centered Content */}
        <Dialog.Content
          forceMount
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                ref={dialogRef}
                key="dialog"
                initial={{ opacity: 0, scale: 0.9, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 25 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="relative w-full max-w-lg rounded-2xl glass-effect border border-white/20 p-6 shadow-2xl bg-black/60"
              >
                {/* A11y labels */}
                <Dialog.Title asChild>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {tab === "apply" ? "Quick Apply" : "Custom Bid"}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p className="text-gray-400 text-sm mb-4">
                    {tab === "apply"
                      ? "Submit a quick application with a short message."
                      : "Place a custom bid with your offer and timeline."}
                  </p>
                </Dialog.Description>

                {/* Close */}
                <Dialog.Close asChild>
                  <button
                    aria-label="Close"
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>

                {/* Tabs */}
                <div className="flex items-center mb-6 border-b border-white/10">
                  <button
                    onClick={() => setTab("apply")}
                    className={`flex-1 py-2 text-sm font-medium transition-all ${
                      tab === "apply"
                        ? "text-blue-400 border-b-2 border-blue-500"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <MessageSquare className="inline w-4 h-4 mr-1" />
                    Quick Apply
                  </button>
                  <button
                    onClick={() => setTab("bid")}
                    className={`flex-1 py-2 text-sm font-medium transition-all ${
                      tab === "bid"
                        ? "text-purple-400 border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <Coins className="inline w-4 h-4 mr-1" />
                    Custom Bid
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">
                      Message to Client
                    </label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi, I'm interested in helping with this task..."
                      className="min-h-[100px] text-gray-200 bg-white/5 border-white/10 focus:border-blue-400 focus:ring-0"
                    />
                  </div>

                  {tab === "bid" && (
                    <>
                      <div>
                        <label className="text-gray-300 text-sm mb-1 block">
                          Your Offer (in CØRE)
                        </label>
                        <Input
                          type="number"
                          value={bidAmount}
                          onChange={(e) =>
                            setBidAmount(parseFloat(e.target.value))
                          }
                          className="bg-white/5 border-white/10 text-gray-200 focus:border-purple-400 focus:ring-0"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 text-sm mb-1 block">
                          Estimated Completion Time
                        </label>
                        <Input
                          type="text"
                          value={estimatedTime}
                          onChange={(e) => setEstimatedTime(e.target.value)}
                          placeholder="e.g., 3 days"
                          className="bg-white/5 border-white/10 text-gray-200 focus:border-purple-400 focus:ring-0"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Submit */}
                <div className="mt-6">
                  <Button
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`w-full py-3 text-lg font-medium flex items-center justify-center gap-2
                    ${
                      tab === "apply"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {tab === "apply" ? "Submit Application" : "Place Bid"}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
