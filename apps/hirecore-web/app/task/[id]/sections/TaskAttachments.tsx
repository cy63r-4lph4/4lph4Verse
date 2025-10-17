"use client";
import { useState } from "react";
import { FileText, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@verse/hirecore-web/components/ui/dialog";
import { Button } from "@verse/hirecore-web/components/ui/button";

interface Attachment {
  name: string;
  url: string;
  type?: string;
}

export default function TaskAttachments({
  attachments,
}: {
  attachments: Attachment[];
}) {
  const [selected, setSelected] = useState<Attachment | null>(null);

  if (!attachments || attachments.length === 0) return null;

  const isImage = (a: Attachment) =>
    a.type?.startsWith("image") || /\.(png|jpg|jpeg|gif|webp)$/i.test(a.url);
  const isPDF = (a: Attachment) =>
    a.type === "application/pdf" || /\.pdf$/i.test(a.url);

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold text-white mb-4">Attachments</h3>

      {/* Attachment Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {attachments.map((a, i) => {
          const image = isImage(a);
          const pdf = isPDF(a);

          return (
            <div
              key={i}
              onClick={() => (image || pdf) && setSelected(a)}
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

              {/* Download for non-image/pdf */}
              {!image && !pdf && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement("a");
                    link.href = a.url;
                    link.download = a.name || "attachment";
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* 🪟 Modal Viewer */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="p-0 bg-black/90 border border-white/10 max-w-4xl rounded-2xl overflow-hidden">
          <DialogHeader className="flex items-center justify-between p-4 border-b border-white/10">
            <DialogTitle className="text-white text-base truncate">
              {selected?.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelected(null)}
              className="text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>

          {/* 🖼️ Image or PDF Inline */}
          {selected && (
            <div className="bg-black flex items-center justify-center max-h-[80vh] overflow-auto">
              {isImage(selected) ? (
                <img
                  src={selected.url}
                  alt={selected.name}
                  className="w-auto h-full object-contain"
                />
              ) : isPDF(selected) ? (
                <iframe
                  src={`${selected.url}#toolbar=0&navpanes=0`}
                  className="w-full h-[80vh] border-none rounded-b-2xl"
                />
              ) : (
                <div className="p-6 text-gray-400 text-center">
                  <p>Preview not available for this file type.</p>
                  <Button
                    className="mt-4"
                    onClick={() => window.open(selected.url, "_blank")}
                  >
                    <Download className="w-4 h-4 mr-1" /> Download File
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
