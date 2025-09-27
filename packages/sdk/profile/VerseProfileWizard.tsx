"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useWriteContract } from "wagmi";
import type { Abi } from "viem";
import { X, Loader2, Check, Wand2, Sparkles, Image as ImageIcon } from "lucide-react";

/** ------------------------------------------------------
 *  4lph4Verse — VerseProfile Wizard (SDK-ready)
 *  ------------------------------------------------------
 *  • Universal identity onboarding for the 4lph4Verse
 *  • Works as a full page OR a modal
 *  • Extensible per dApp via "extensions" config
 *  • Beautiful glassmorphic UI + framer-motion
 *
 *  Usage (Page):
 *    <VerseProfileWizard
 *      dapp="hirecore"
 *      contractAddress={VERSE_PROFILE_ADDRESS}
 *      contractAbi={verseProfileAbi}
 *      onComplete={(profile) => router.push("/tasks")}
 *      extensions={[
 *        {
 *          id: "hirecore",
 *          title: "HireCore Setup",
 *          description: "Tell us how you want to use HireCore",
 *          fields: [
 *            { name: "role", label: "Role", type: "select", options: ["Worker", "Client"], required: true },
 *            { name: "skills", label: "Skills / Interests", type: "tags", placeholder: "e.g. Electrician, Plumber" }
 *          ]
 *        }
 *      ]}
 *    />
 *
 *  Usage (Modal):
 *    <VerseProfileWizard asModal onClose={() => setOpen(false)} ...props />
 */

/* ----------------------------- Types ----------------------------- */
export type ExtensionField =
  | { type: "text" | "textarea"; name: string; label: string; placeholder?: string; required?: boolean; maxLength?: number }
  | { type: "select"; name: string; label: string; options: string[]; required?: boolean }
  | { type: "tags"; name: string; label: string; placeholder?: string };

export type ExtensionStep = {
  id: string; // dapp key, e.g. "hirecore"
  title: string;
  description?: string;
  fields?: ExtensionField[]; // quick config fields
  render?: (state: ProfileState, setState: React.Dispatch<React.SetStateAction<ProfileState>>) => React.ReactNode; // advanced
};

export type ProfileState = {
  handle: string;
  displayName: string;
  bio: string;
  avatar: string; // URL/DataURL
  extras: Record<string, any>; // dapp-specific
};

export type VerseProfileWizardProps = {
  dapp?: string; // current dapp key used for namespacing extras
  asModal?: boolean;
  onClose?: () => void;
  onComplete?: (profile: ProfileState) => void;
  // contract wiring (use either this or "onChainWrite" override)
  contractAddress?: `0x${string}`;
  contractAbi?: Abi;
  functionName?: string; // default: "createProfile"
  onChainWrite?: (profile: ProfileState) => Promise<void>; // optional custom writer
  // UI
  className?: string;
  extensions?: ExtensionStep[]; // dApp-specific steps appended after identity
};

/* ----------------------------- Component ----------------------------- */
export default function VerseProfileWizard(props: VerseProfileWizardProps) {
  const {
    dapp,
    asModal,
    onClose,
    onComplete,
    contractAbi,
    contractAddress,
    functionName = "createProfile",
    onChainWrite,
    className,
    extensions = [],
  } = props;

  const { address } = useAccount();

  const [step, setStep] = useState<number>(0); // 0 Welcome → 1 Identity → 2+ Extensions → Review → Success
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<ProfileState>({
    handle: "",
    displayName: "",
    bio: "",
    avatar: "",
    extras: {},
  });

  const extSteps = useMemo(() => extensions.filter(Boolean), [extensions]);
  const totalSteps = 2 + extSteps.length + 2; // welcome + identity + ext... + review + success (success not counted in stepper)

  const { writeContractAsync } = useWriteContract();

  async function defaultWrite(profile: ProfileState) {
    if (!contractAddress || !contractAbi) throw new Error("Missing contract wiring: contractAddress/contractAbi");
    // Example args — adjust to your VerseProfile contract signature
    // e.g. createProfile(handle, displayName, bio, avatarURI)
    await writeContractAsync({
      address: contractAddress,
      abi: contractAbi,
      functionName: functionName as any,
      args: [profile.handle, profile.displayName, profile.bio, profile.avatar],
    });
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      if (!address) throw new Error("Connect wallet to continue");
      if (!state.handle || !state.displayName) throw new Error("Please complete your handle and display name");
      if (onChainWrite) await onChainWrite(state);
      else await defaultWrite(state);
      setStep(step + 1); // go to success
      onComplete?.(state);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create profile");
    } finally {
      setSubmitting(false);
    }
  }

  /* ----------------------------- Layout Shell ----------------------------- */
  const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={"w-full " + (asModal ? "fixed inset-0 z-[70] flex items-center justify-center" : "pt-24 pb-16")}>
      {asModal && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      )}
      <div className={(asModal ? "relative z-[71] max-w-2xl w-[92vw]" : "max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8") + (className ? ` ${className}` : "") }>
        {children}
      </div>
    </div>
  );

  /* ----------------------------- Stepper ----------------------------- */
  const stepsForIndicator = [
    { id: 0, label: "Welcome" },
    { id: 1, label: "Identity" },
    ...extSteps.map((e, i) => ({ id: i + 2, label: e.title })),
    { id: extSteps.length + 2, label: "Review" },
  ];

  /* ----------------------------- Renderers ----------------------------- */
  function renderWelcome() {
    return (
      <GlassCard>
        <div className="text-center py-8 sm:py-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-emerald-500/30">
            <Sparkles className="h-8 w-8 text-indigo-300" />
          </div>
          <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white">Welcome to the 4lph4Verse</h1>
          <p className="mt-3 text-gray-300">Let's forge your Verse Identity and unlock the ecosystem.</p>
          <div className="mt-6">
            <PrimaryButton onClick={() => setStep(1)}>Begin Setup</PrimaryButton>
          </div>
        </div>
      </GlassCard>
    );
  }

  function renderIdentity() {
    return (
      <GlassCard>
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-4">Your Universal Identity</h2>
        <p className="text-sm text-gray-400 mb-6">Pick a unique handle, a display name, and a short bio. You can change metadata later.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            <TextField
              label="Handle"
              prefix="@"
              value={state.handle}
              onChange={(v) => setState((s) => ({ ...s, handle: v.replace(/^@/, "") }))}
              placeholder="cy63r_4lph4"
              required
            />
            <TextField
              label="Display Name"
              value={state.displayName}
              onChange={(v) => setState((s) => ({ ...s, displayName: v }))}
              placeholder="Barry Dragon"
              required
            />
            <TextArea
              label="Bio"
              value={state.bio}
              onChange={(v) => setState((s) => ({ ...s, bio: v }))}
              placeholder="Web3 builder. Hiring dragons. Paying in CØRE."
              maxLength={180}
            />
          </div>
          <div>
            <AvatarPicker
              value={state.avatar}
              onChange={(url) => setState((s) => ({ ...s, avatar: url }))}
            />
          </div>
        </div>

        <WizardNav
          back={() => setStep(0)}
          next={() => setStep(2)}
          nextLabel={extSteps.length ? "Continue" : "Review"}
        />
      </GlassCard>
    );
  }

  function renderExtension(index: number) {
    const ext = extSteps[index];
    const extKey = ext?.id || `ext-${index}`;

    return (
      <GlassCard>
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-4">{ext.title}</h2>
        {ext.description && <p className="text-sm text-gray-400 mb-6">{ext.description}</p>}

        {ext.render ? (
          <div>{ext.render(state, setState)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ext.fields?.map((field) => (
              <FieldRenderer
                key={`${extKey}-${field.name}`}
                field={field}
                value={state.extras[field.name]}
                onChange={(val) => setState((s) => ({ ...s, extras: { ...s.extras, [field.name]: val } }))}
              />
            ))}
          </div>
        )}

        <WizardNav
          back={() => setStep(step - 1)}
          next={() => setStep(step + 1)}
          nextLabel={index === extSteps.length - 1 ? "Review" : "Continue"}
        />
      </GlassCard>
    );
  }

  function renderReview() {
    return (
      <GlassCard>
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-4">Review & Deploy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-3">
            <SummaryRow label="Handle" value={`@${state.handle}`} />
            <SummaryRow label="Display Name" value={state.displayName} />
            <SummaryRow label="Bio" value={state.bio || "—"} />
            {Object.keys(state.extras).length > 0 && (
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-white mb-2">DApp Fields</h4>
                <div className="space-y-2">
                  {Object.entries(state.extras).map(([k, v]) => (
                    <SummaryRow key={k} label={k} value={Array.isArray(v) ? v.join(", ") : String(v)} />
                  ))}
                </div>
              </div>
            )}
            {error && (
              <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-md px-3 py-2">{error}</div>
            )}
          </div>
          <div>
            <AvatarPreview value={state.avatar} />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <SecondaryButton onClick={() => setStep(step - 1)}>Back</SecondaryButton>
          <PrimaryButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating…</span>
            ) : (
              <span className="inline-flex items-center gap-2"><Wand2 className="h-4 w-4" /> Confirm & Deploy</span>
            )}
          </PrimaryButton>
        </div>
      </GlassCard>
    );
  }

  function renderSuccess() {
    return (
      <GlassCard>
        <div className="text-center py-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h3 className="font-orbitron text-2xl font-bold text-white">Identity Forged</h3>
          <p className="mt-2 text-gray-300">Welcome to the 4lph4Verse, @{state.handle}.</p>
          <div className="mt-6">
            <PrimaryButton onClick={() => onComplete?.(state)}>Continue</PrimaryButton>
          </div>
        </div>
      </GlassCard>
    );
  }

  /* ----------------------------- Return ----------------------------- */
  const content = (
    <div className="relative">
      {/* Floating background orbs */}
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 blur-3xl" />

      {/* Header / Stepper */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-white font-orbitron text-lg">Verse Profile</div>
        {asModal && (
          <button onClick={onClose} className="rounded-lg p-2 text-gray-300 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <Stepper steps={stepsForIndicator} current={Math.min(step, stepsForIndicator.length - 1)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.24 }}
        >
          {step === 0 && renderWelcome()}
          {step === 1 && renderIdentity()}
          {step >= 2 && step < 2 + extSteps.length && renderExtension(step - 2)}
          {step === 2 + extSteps.length && renderReview()}
          {step === 3 + extSteps.length && renderSuccess()}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return <Shell>{content}</Shell>;
}

/* ----------------------------- Primitives ----------------------------- */
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-5 sm:p-6">
      {children}
    </div>
  );
}

function PrimaryButton({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={"inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition " + className}
      {...rest}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={"inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-gray-200 border border-white/15 hover:bg-white/10 transition " + className}
      {...rest}
    >
      {children}
    </button>
  );
}

function WizardNav({ back, next, nextLabel = "Continue" }: { back?: () => void; next?: () => void; nextLabel?: string }) {
  return (
    <div className="mt-6 flex items-center gap-3">
      {back && <SecondaryButton onClick={back}>Back</SecondaryButton>}
      {next && (
        <PrimaryButton onClick={next}>
          <span className="inline-flex items-center gap-2"><Wand2 className="h-4 w-4" /> {nextLabel}</span>
        </PrimaryButton>
      )}
    </div>
  );
}

function Stepper({ steps, current }: { steps: { id: number; label: string }[]; current: number }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${i <= current ? "bg-indigo-400" : "bg-white/20"}`} />
          <div className={`text-xs ${i === current ? "text-white" : "text-gray-400"}`}>{s.label}</div>
          {i < steps.length - 1 && <div className="mx-2 h-px w-6 bg-white/10" />}
        </div>
      ))}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, prefix, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; prefix?: string; required?: boolean }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </div>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{prefix}</span>}
        <input
          className={`w-full rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-2 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-indigo-600 ${prefix ? "pl-7" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, maxLength }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-gray-300">{label}</div>
      <textarea
        className="w-full min-h-[110px] rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-2 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-indigo-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {maxLength ? (
        <div className="mt-1 text-right text-xs text-gray-500">{value.length}/{maxLength}</div>
      ) : null}
    </label>
  );
}

function AvatarPicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-4 text-center">
      <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-500" />
        )}
      </div>
      <SecondaryButton onClick={() => inputRef.current?.click()}>Upload Avatar</SecondaryButton>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onSelectFile} />
      {value && (
        <div className="mt-2">
          <button className="text-xs text-gray-400 underline" onClick={() => onChange("")}>Remove</button>
        </div>
      )}
    </div>
  );
}

function AvatarPreview({ value }: { value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-4 text-center">
      <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-500" />
        )}
      </div>
      <div className="text-xs text-gray-400">Profile Picture</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-zinc-800/40 px-3 py-2">
      <div className="min-w-[110px] text-xs uppercase tracking-wide text-gray-400">{label}</div>
      <div className="text-sm text-gray-100">{value}</div>
    </div>
  );
}

function FieldRenderer({ field, value, onChange }: { field: ExtensionField; value: any; onChange: (v: any) => void }) {
  if (field.type === "text")
    return (
      <TextField label={field.label} placeholder={field.placeholder} value={value || ""} onChange={onChange} required={field.required} />
    );

  if (field.type === "textarea")
    return (
      <TextArea label={field.label} placeholder={field.placeholder} value={value || ""} onChange={onChange} maxLength={field.maxLength} />
    );

  if (field.type === "select")
    return (
      <label className="block">
        <div className="mb-1 text-sm text-gray-300">{field.label}{field.required && <span className="text-red-400">*</span>}</div>
        <select
          className="w-full rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-600"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            Select…
          </option>
          {field.options.map((opt) => (
            <option key={opt} value={opt} className="bg-zinc-900">
              {opt}
            </option>
          ))}
        </select>
      </label>
    );

  if (field.type === "tags")
    return <TagsInput label={field.label} placeholder={field.placeholder} value={Array.isArray(value) ? value : []} onChange={onChange} />;

  return null;
}

function TagsInput({ label, value, onChange, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
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
    <div>
      <div className="mb-1 text-sm text-gray-300">{label}</div>
      <div className="rounded-lg border border-white/10 bg-zinc-800/50 p-2">
        <div className="flex flex-wrap gap-2">
          {value.map((t, i) => (
            <span key={`${t}-${i}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
              {t}
              <button className="text-white/70 hover:text-white" onClick={() => removeTag(i)} aria-label={`remove ${t}`}>
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            className="flex-1 rounded-md border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-indigo-600"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? (e.preventDefault(), addTag()) : undefined)}
            placeholder={placeholder || "Add tag and press Enter"}
          />
          <SecondaryButton onClick={addTag}>Add</SecondaryButton>
        </div>
      </div>
    </div>
  );
}
