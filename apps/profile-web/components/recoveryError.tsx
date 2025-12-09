import { Button } from "@verse/ui/components/ui/button";
import { ModalWrapper } from "@verse/ui/profile/components/ModalWrapper";
import { AlertTriangle } from "lucide-react";

export function RecoveryErrorModal({
  open,
  onClose,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="p-10 max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
            <AlertTriangle size={34} className="text-yellow-400" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          {title ?? "Unable to complete recovery"}
        </h2>

        <p className="text-slate-400 leading-relaxed">
          {message ??
            "The recovery attempt could not be completed. Your profile remains unchanged."}
        </p>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={onClose}
          >
            Dismiss
          </Button>

          <p className="text-xs text-slate-500">
            Repeated failed recovery attempts may affect reputation or aura.
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
}
