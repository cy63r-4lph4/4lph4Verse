"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  PersonaField,
  PersonaQuickStep,
} from "./components/core/PersonalQuickStep";
import { IdentityStep } from "./components/core/IdentityStep";
import { Stepper } from "./components/Stepper";
import { ModalWrapper } from "./components/ModalWrapper";
import { ReviewStep } from "./components/core/ReviewStep";
import { SuccessStep } from "./components/core/SuccessStep";
import { WelcomeStep } from "./components/core/WelcomeStep";
import { useVerseProfileWizard } from "@verse/sdk";

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
    setAvatarFromFile,
    submitting,
    progress,
    error,
    resetWizard,
  } = useVerseProfileWizard();

  const [step, setStep] = useState(0);
  const hasPersona = personaFields.length > 0;

  /* -------------------------------- Navigation ------------------------------- */
  function goNext() {
    setStep((s) => s + 1);
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    const success = await submitProfile();
    if (success) setStep((s) => s + 1);
  }

  function handleClose() {
    resetWizard();
    setStep(0);
    onClose();
  }

  /* -------------------------------- Step Logic ------------------------------- */
  const stepsForIndicator = [
    { id: 0, label: "Identity" },
    ...(hasPersona ? [{ id: 1, label: "Persona" }] : []),
    { id: hasPersona ? 2 : 1, label: "Review" },
  ];

  /* -------------------------------- Component -------------------------------- */
  return (
    <ModalWrapper open={open} onClose={handleClose}>
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-white font-orbitron text-lg">Verse Profile</div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-300 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Only show stepper after Welcome */}
        {step > 0 && step < (hasPersona ? 4 : 3) && (
          <Stepper
            steps={stepsForIndicator}
            current={Math.min(step - 1, stepsForIndicator.length - 1)}
          />
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* 0️⃣ Welcome */}
            {step === 0 && <WelcomeStep onNext={goNext} />}

            {/* 1️⃣ Identity */}
            {step === 1 && (
              <IdentityStep
                profile={profile}
                updateProfile={updateProfile}
                onNext={goNext}
                setAvatarFromFile={setAvatarFromFile}
              />
            )}

            {/* 2️⃣ Persona (optional) */}
            {step === 2 && hasPersona && (
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

            {/* 3️⃣ Review */}
            {step === (hasPersona ? 3 : 2) && (
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

            {/* ✅ Success */}
            {step === (hasPersona ? 4 : 3) && (
              <SuccessStep profile={profile} onContinue={handleClose} />
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
