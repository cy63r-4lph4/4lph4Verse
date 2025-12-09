import { Button } from "@verse/ui/components/ui/button";
import { ModalWrapper } from "@verse/ui/profile/components/ModalWrapper";
import { BadgeCheck } from "lucide-react";

export function RecoverySuccessModal({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) {
    return (
      <ModalWrapper open={open} onClose={onClose}>
        <div className="p-10 max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <BadgeCheck size={36} className="text-green-400" />
            </div>
          </div>
  
          <h2 className="text-2xl font-semibold tracking-tight">
            Recovery Successful
          </h2>
  
          <p className="text-slate-400 leading-relaxed">
            Your identity has been successfully verified and control of this Verse
            profile has been restored to your wallet.
          </p>
  
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onClose}
          >
            Continue
          </Button>
        </div>
      </ModalWrapper>
    );
  }
  