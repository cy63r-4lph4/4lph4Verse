"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PersonaField, PersonaQuickStep } from "./components/core/PersonalQuickStep";
import { IdentityStep } from "./components/core/IdentityStep";
import { Stepper } from "./components/Stepper";
import { ModalWrapper } from "./components/ModalWrapper";
import { ReviewStep } from "./components/core/ReviewStep";
import { SuccessStep } from "./components/core/SuccessStep";
import {useVerseProfileWizard} from "@verse/sdk"


/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
type VerseProfileWizardV2Props = {
  open: boolean;
  onClose: () => void;
  dapp?: string;
  personaFields?: PersonaField[];
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function VerseProfileWizardV2({
  open,
  onClose,
  dapp,
  personaFields = [],
}: VerseProfileWizardV2Props) {
  const {
    profile,
    updateProfile,
    updatePersona,
    submitProfile,
    submitting,
    progress,
    error,
    resetWizard,
  } = useVerseProfileWizard(dapp);

  const [step, setStep] = useState(0);
  const totalSteps = 3 + (personaFields.length ? 1 : 0);

  function goNext() {
    if (step < totalSteps) setStep((s) => s + 1);
  }
  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function handleSubmit() {
    const success = await submitProfile();
    if (success) goNext();
  }

  const stepsForIndicator = [
    { id: 0, label: "Identity" },
    ...(personaFields.length ? [{ id: 1, label: "Persona" }] : []),
    { id: personaFields.length ? 2 : 1, label: "Review" },
    { id: totalSteps - 1, label: "Success" },
  ];

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-white font-orbitron text-lg">Verse Profile</div>
          <button
            onClick={() => {
              resetWizard();
              onClose();
            }}
            className="rounded-lg p-2 text-gray-300 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <Stepper
          steps={stepsForIndicator}
          current={Math.min(step, stepsForIndicator.length - 1)}
        />

        {/* Animated Step Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <IdentityStep
                profile={profile}
                updateProfile={updateProfile}
                onNext={goNext}
              />
            )}

            {step === 1 && personaFields.length > 0 && (
              <PersonaQuickStep
                dapp={dapp!}
                title={`${capitalize(dapp)} Setup`}
                description={`Complete your ${capitalize(dapp)} onboarding`}
                fields={personaFields}
                profile={profile}
                updatePersona={updatePersona}
                onNext={goNext}
                onBack={goBack}
              />
            )}

            {step === (personaFields.length ? 2 : 1) && (
              <ReviewStep
                profile={profile}
                dapp={dapp}
                onBack={goBack}
                onSubmit={handleSubmit}
                submitting={submitting}
                progress={progress}
                error={error}
              />
            )}

            {step === totalSteps - 1 && (
              <SuccessStep
                profile={profile}
                onContinue={() => {
                  resetWizard();
                  onClose();
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </ModalWrapper>
  );
}

/* -------------------------------------------------------------------------- */
/* Utils                                                                      */
/* -------------------------------------------------------------------------- */
function capitalize(str?: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
