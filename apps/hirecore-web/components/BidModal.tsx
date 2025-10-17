"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@verse/hirecore-web/components/ui/card";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { toast } from "sonner";

export function BidModal({ task, onClose }: any) {
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    toast(
      <>
        <span className="font-semibold">💰 Bid Submitted!</span>
        <div className="text-sm text-gray-300">
          You bid {amount} CØRE and promised delivery in {time}.
        </div>
      </>
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <Card className="w-full max-w-md glass-effect border-white/20 relative z-10">
        <CardHeader>
          <CardTitle className="text-white">Place Your Bid</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-300">
          <div>
            <label className="block text-sm mb-1">Amount (CØRE)</label>
            <input
              type="number"
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 outline-none"
              placeholder="e.g. 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Estimated Time (e.g. 2 hours)</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 outline-none"
              placeholder="e.g. 3 hours"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Message (optional)</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 outline-none"
              placeholder="Any details for the client..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600"
            >
              Submit Bid
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
