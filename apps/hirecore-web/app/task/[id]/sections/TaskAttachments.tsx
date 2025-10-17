"use client";
import { useState } from "react";
import { FileText, Download, X } from "lucide-react";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { OverlayPortal } from "@verse/ui/profile/lib/overlayPortal";
import { motion } from "framer-motion";
import { Attachment } from "@verse/hirecore-web/utils/Interfaces";



export default function TaskAttachments({
  attachments,
  onPreview,
}: {
  attachments: Attachment[];
  onPreview: (a: Attachment) => void;
}) {
  if (!attachments || attachments.length === 0) return null;

  const isImage = (a: Attachment) =>
    a.type?.startsWith("image") || /\.(png|jpg|jpeg|gif|webp)$/i.test(a.url);
  const isPDF = (a: Attachment) =>
    a.type === "application/pdf" || /\.pdf$/i.test(a.url);

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold text-white mb-4">Attachments</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {attachments.map((a, i) => {
          const image = isImage(a);
          const pdf = isPDF(a);

          return (
            <div
              key={i}
              onClick={() => (image || pdf) && onPreview(a)}
              className={`relative group p-3 rounded-xl border border-white/10 hover:border-blue-500/40 transition-all cursor-pointer glass-effect ${
                image || pdf ? "hover:shadow-blue-500/20" : ""
              }`}
            >
              {image ? (
                <img
                  src={a.url}
                  alt={a.name}
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-300">
                  <FileText className="w-8 h-8 mb-2 text-blue-400" />
                  <p className="text-sm truncate w-full text-center">
                    {a.name}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

