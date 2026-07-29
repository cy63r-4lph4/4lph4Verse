"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode } from "lucide-react";
import { useParams } from "next/navigation";
import { useShowdownState } from "@verse/arena-web/lib/showdown/useShowdownState";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { useCourseAccessKey } from "@verse/arena-web/hooks/useCourseAccessKey";

export function QRJoinOverlay() {
  const params = useParams<{ id: string; showdownId: string }>();
  const token = useArenaToken();
  const { socket } = useShowdownState(params.showdownId, token) as any;
  const { data: course } = useCourseAccessKey(params.id);
  const [visible, setVisible] = useState(false);
  const [qrSvg, setQrSvg] = useState("");

  useEffect(() => {
    if (!socket) return;
    const onToggle = (payload: { show: boolean }) => setVisible(payload.show);
    socket.on("showdown:qr-toggle", onToggle);
    return () => { socket.off("showdown:qr-toggle", onToggle); };
  }, [socket]);

  useEffect(() => {
    if (!visible || !course) return;
    const url = `${window.location.origin}/join-tournament?courseId=${params.id}&accessKey=${course.accessKey}&showdownId=${params.showdownId}`;
    QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#020617", light: "#ffffff" } })
      .then(setQrSvg)
      .catch(() => setQrSvg(""));
  }, [visible, course, params.id, params.showdownId]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <QrCode size={14} className="text-primary animate-pulse" />
        <span className="font-display text-[10px] font-black text-primary uppercase tracking-[.3em]">
          Scan to Enter the Arena
        </span>
      </div>
      <div className="relative p-6 rounded-3xl border border-primary/20 bg-white shadow-[0_0_60px_rgba(var(--primary-rgb),.15)]">
        {qrSvg ? (
          <div className="w-64 h-64" dangerouslySetInnerHTML={{ __html: qrSvg }} />
        ) : (
          <div className="w-64 h-64 grid place-items-center text-slate-400 text-xs uppercase">Generating…</div>
        )}
      </div>
      <p className="mt-6 font-display text-[10px] font-bold text-white/30 uppercase tracking-[.2em]">
        New here? The link creates your account automatically.
      </p>
    </div>
  );
}