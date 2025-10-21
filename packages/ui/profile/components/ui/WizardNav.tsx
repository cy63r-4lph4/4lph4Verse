"use client";

import React from "react";
import { Wand2 } from "lucide-react";
import { PrimaryButton,SecondaryButton} from "./PrimaryButton";

type WizardNavProps = {
  back?: () => void;
  next?: () => void;
  nextLabel?: string;
  disableNext?: boolean;
};

export function WizardNav({
  back,
  next,
  nextLabel = "Continue",
  disableNext,
}: WizardNavProps) {
  return (
    <div className="mt-6 flex items-center gap-3">
      {back && <SecondaryButton onClick={back}>Back</SecondaryButton>}
      {next && (
        <PrimaryButton onClick={next} disabled={disableNext}>
          <span className="inline-flex items-center gap-2">
            <Wand2 className="h-4 w-4" /> {nextLabel}
          </span>
        </PrimaryButton>
      )}
    </div>
  );
}
