"use client";

import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { WizardNav } from "../ui/WizardNav";
import { BadgePlus, Tags, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { VerseProfile } from "@verse/sdk/types";
import { Input } from "components/ui/input";
import { Textarea } from "textarea";

type FieldType = "text" | "textarea" | "select" | "tags";

export type PersonaField = {
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

export type PersonaQuickStepProps = {
  dapp: string;
  title: string;
  description?: string;
  fields: PersonaField[];
  profile: VerseProfile;
  updatePersona: (dapp: string, data: Record<string, any>) => void;
  onNext: () => void;
  onBack?: () => void;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function PersonaQuickStep({
  dapp,
  title,
  description,
  fields,
  profile,
  updatePersona,
  onNext,
  onBack,
}: PersonaQuickStepProps) {
  const personaData = profile.personas?.[dapp] || {};
  const [localData, setLocalData] = useState<Record<string, any>>(personaData);
  const [error, setError] = useState<string | null>(null);

  function handleNext() {
    // Basic required field validation
    const missing = fields.find((f) => f.required && !localData[f.name]);
    if (missing) {
      setError(`${missing.label} is required`);
      return;
    }

    updatePersona(dapp, localData);
    setError(null);
    onNext();
  }

  function handleChange(name: string, value: any) {
    setLocalData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <GlassCard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-white">
            {title}
          </h2>
          {description && (
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          )}
        </div>

        {/* Dynamic Field Rendering */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-sm text-gray-300 mb-1 block">
                {field.label}{" "}
                {field.required && <span className="text-red-400">*</span>}
              </label>

              {field.type === "text" && (
                <Input
                  value={localData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="bg-background/60 border-white/10 text-white"
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  value={localData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="bg-background/60 border-white/10 text-white min-h-[100px]"
                />
              )}

              {field.type === "select" && (
                <div className="relative">
                  <select
                    value={localData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              )}

              {field.type === "tags" && (
                <TagsInput
                  value={localData[field.name] || []}
                  onChange={(tags) => handleChange(field.name, tags)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Nav */}
        <WizardNav back={onBack} next={handleNext} nextLabel="Continue" />
      </motion.div>
    </GlassCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Tags Input Subcomponent                                                    */
/* -------------------------------------------------------------------------- */
function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const t = input.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setInput("");
  }

  function removeTag(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-800/50 p-2">
      <div className="flex flex-wrap gap-2">
        {value.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white"
          >
            {t}
            <button
              className="hover:text-red-400"
              onClick={() => removeTag(i)}
              type="button"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder || "Add and press Enter"}
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500"
        />
        <button
          onClick={addTag}
          className="text-indigo-400 hover:text-indigo-300 transition text-sm flex items-center gap-1"
        >
          <BadgePlus className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}
