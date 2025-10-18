"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Task } from "../types";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { Input } from "@verse/hirecore-web/components/ui/input";
import { Textarea } from "@verse/hirecore-web/components/ui/textarea";
import {
  Send,
  Coins,
  ClipboardEdit,
  X,
  Loader2,
  MessageSquare,
} from "lucide-react";

export function ApplyBidDialog({
  open,
  onClose,
  task,
}: {
  open: boolean;
  onClose: () => void;
  task: Task;
}) {
  const [tab, setTab] = useState<"apply" | "bid">("apply");
  const [loading, setLoading] = useState(false);

  // form fields
  const [message, setMessage] = useState("");
  const [bidAmount, setBidAmount] = useState(task.budget);
  const [estimatedTime, setEstimatedTime] = useState("");

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
    }, 1200);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* 🔲 Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              />
            </Dialog.Overlay>

            {/* 💠 Modal Content */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="fixed z-50 top-[50%] left-[50%] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2
                rounded-2xl glass-effect border border-white/20 p-6 shadow-xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {tab === "apply" ? "Quick Apply" : "Custom Bid"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {tab === "apply"
                        ? "Submit a quick application with a short message."
                        : "Place a custom bid with your offer and timeline."}
                    </p>
                  </div>
                  <Dialog.Close asChild>
                    <button className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

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

                {/* Form Body */}
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">
                      Message to Client
                    </label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi, I’m interested in helping with this task..."
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
                <div className="mt-6 flex justify-end">
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
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>
                          {tab === "apply" ? "Submit Application" : "Place Bid"}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
