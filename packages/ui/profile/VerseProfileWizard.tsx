// "use client";

// import React, { useMemo, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAccount, useChainId, useWriteContract } from "wagmi";
// import { X, Loader2, Check, Wand2, Image as ImageIcon } from "lucide-react";
// import Image from "next/image";
// import { Stepper } from "./components/Stepper";
// import { ModalWrapper } from "./components/ModalWrapper";

// import { waitForTransactionReceipt } from "wagmi/actions";
// import { useConfig } from "wagmi";
// import { uploadProfileToPinata } from "@verse/sdk/src/services/storage";
// import { ChainId, getDeployedContract } from "@verse/sdk";

// /** ------------------------------------------------------
//  *  4lph4Verse — VerseProfile Wizard (SDK-ready)
//  *  ------------------------------------------------------
//  *  • Universal identity onboarding for the 4lph4Verse
//  *  • Works as a full page OR a modal
//  *  • Extensible per dApp via "extensions" config
//  *  • Beautiful glassmorphic UI + framer-motion
//  *
//  *  Usage (Page):
//  *    <VerseProfileWizard
//  *      dapp="hirecore"
//  *      contractAddress={VERSE_PROFILE_ADDRESS}
//  *      contractAbi={verseProfileAbi}
//  *      onComplete={(profile) => router.push("/tasks")}
//  *      extensions={[
//  *        {
//  *          id: "hirecore",
//  *          title: "HireCore Setup",
//  *          description: "Tell us how you want to use HireCore",
//  *          fields: [
//  *            { name: "role", label: "Role", type: "select", options: ["Worker", "Client"], required: true },
//  *            { name: "skills", label: "Skills / Interests", type: "tags", placeholder: "e.g. Electrician, Plumber" }
//  *          ]
//  *        }
//  *      ]}
//  *    />
//  *
//  *  Usage (Modal):
//  *    <VerseProfileWizard asModal onClose={() => setOpen(false)} ...props />
//  */

// /* ----------------------------- Types ----------------------------- */
// export type ExtensionField =
//   | {
//       type: "text" | "textarea";
//       name: string;
//       label: string;
//       placeholder?: string;
//       required?: boolean;
//       maxLength?: number;
//     }
//   | {
//       type: "select";
//       name: string;
//       label: string;
//       options: string[];
//       required?: boolean;
//     }
//   | {
//       type: "tags";
//       name: string;
//       label: string;
//       placeholder?: string;
//       required?: boolean; // ✅ Add this
//     };

// export type ExtensionStep = {
//   id: string;
//   title: string;
//   description?: string;
//   fields?: ExtensionField[];
//   defaults?: Record<string, any>;

//   render?: (
//     state: ProfileState,
//     setState: React.Dispatch<React.SetStateAction<ProfileState>>
//   ) => React.ReactNode;
//   validate?: (state: ProfileState) => string | null;
//   optional?: boolean;

//   shouldRender?: (state: ProfileState) => boolean;
//   order?: number;
// };

// export type ProfileState = {
//   handle: string;
//   displayName: string;
//   bio: string;
//   avatar: string; // URL/DataURL
//   extras: Record<string, any>; // dapp-specific
// };

// export type VerseProfileWizardProps = {
//   dapp?: string; // current dapp key used for namespacing extras
//   asModal?: boolean;
//   onClose?: () => void;
//   onComplete?: (profile: ProfileState) => void;
//   // contract wiring (use either this or "onChainWrite" override)
//   //   contractAddress?: `0x${string}`;
//   //   contractAbi?: Abi;
//   functionName?: string;
//   onChainWrite?: (profile: ProfileState) => Promise<void>; // optional custom writer
//   // UI
//   className?: string;
//   extensions?: ExtensionStep[]; // dApp-specific steps appended after identity
// };

// /* ----------------------------- Component ----------------------------- */
// export default function VerseProfileWizard(props: VerseProfileWizardProps) {
//   const { asModal, onClose, onComplete, extensions = [] } = props;

//   const { address } = useAccount();

//   const [step, setStep] = useState<number>(0);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const FALLBACK_AVATAR = "/placeholder-soul.png";
//   const [progress, setProgress] = useState<
//     "idle" | "uploading" | "writing" | "done"
//   >("idle");
//   const [state, setState] = useState<ProfileState>({
//     handle: "",
//     displayName: "",
//     bio: "",
//     avatar: "",
//     extras: {},
//   });
//   const config = useConfig();

//   const extSteps = useMemo(() => extensions.filter(Boolean), [extensions]);
//   const { writeContractAsync } = useWriteContract();
//   const chainId = useChainId() as ChainId;
//   const contractAddress = getDeployedContract(chainId, "VerseProfile").address;
//   const contractAbi = getDeployedContract(chainId, "VerseProfile").abi;
//   const functionName = "createProfile";
//   const TEST_MODE = false;

//   async function handleSubmit() {
//     setError(null);
//     setSubmitting(true);

//     if (TEST_MODE) {
//       console.log("🧪 Running in TEST_MODE - skipping upload/write");
//       setTimeout(() => {
//         setProgress("done");
//         setStep(step + 1);
//         setSubmitting(false);
//         setProgress("idle");
//       }, 500);
//       return;
//     }

//     setProgress("uploading");

//     try {
//       if (!address) throw new Error("Connect wallet to continue");
//       if (!state.handle || !state.displayName) {
//         throw new Error("Please complete your handle and display name");
//       }

//       // 1️⃣ Upload everything to Pinata (handles avatar + JSON)
//       const { metadataCID } = await uploadProfileToPinata({
//         handle: state.handle,
//         displayName: state.displayName,
//         bio: state.bio,
//         avatar: state.avatar || FALLBACK_AVATAR,
//         extras: state.extras,
//       });

//       setProgress("writing");

//       // 2️⃣ Write the IPFS metadata URI on-chain
//       const tx = await writeContractAsync({
//         address: contractAddress,
//         abi: contractAbi,
//         functionName: functionName,
//         args: [
//           state.handle,
//           `ipfs://${metadataCID}`,
//           "0x0000000000000000000000000000000000000000000000000000000000000000",
//         ],
//       });

//       await waitForTransactionReceipt(config, {
//         hash: tx,
//         confirmations: 1,
//       });

//       setProgress("done");
//       setStep(step + 1);
//       onComplete?.(state);
//     } catch (e: any) {
//       console.error("❌ Profile creation failed:", e);
//       setError(
//         progress === "uploading"
//           ? "Failed to upload profile to Pinata"
//           : progress === "writing"
//             ? "Failed to write profile on-chain"
//             : "Something went wrong"
//       );
//     } finally {
//       setSubmitting(false);
//       setProgress("idle");
//     }
//   }

//   /* ----------------------------- Layout Shell ----------------------------- */

//   /* ----------------------------- Stepper ----------------------------- */
//   const stepsForIndicator = [
//     { id: 0, label: "Welcome" },
//     { id: 1, label: "Identity" },
//     ...extSteps.map((e, i) => ({ id: i + 2, label: e.title })),
//     { id: extSteps.length + 2, label: "Review" },
//   ];

//   /* ----------------------------- Renderers ----------------------------- */
//   function renderWelcome() {
//     return (
//       <GlassCard>
//         <div className="relative text-center py-10">
//           {/* Animated aura + logo */}
//           <div className="relative mx-auto mb-10 flex items-center justify-center">
//             <div className="absolute h-56 w-56 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 opacity-30 blur-3xl animate-pulse" />
//             <Image
//               src="/Verse-logo.png"
//               alt="4lph4Verse Logo"
//               width={200}
//               height={200}
//               className="relative z-10 animate-float"
//             />
//           </div>

//           {/* Greeting */}
//           <h2 className="font-orbitron text-lg sm:text-xl text-indigo-300 tracking-wide mb-2">
//             Hi there, Rebel
//           </h2>
//           <h1 className="font-orbitron text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
//             Welcome to the 4lph4Verse
//           </h1>

//           {/* Description */}
//           <p className="mt-4 text-gray-300 max-w-lg mx-auto">
//             Let's forge your{" "}
//             <span className="text-indigo-400">Verse Identity</span> and unlock
//             the <span className="text-emerald-400">ecosystem</span>.
//           </p>

//           {/* CTA */}
//           <div className="mt-8">
//             <PrimaryButton
//               onClick={() => setStep(1)}
//               className="px-8 py-3 text-lg relative overflow-hidden"
//             >
//               <span className="relative z-10">🚀 Begin Setup</span>
//               <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 opacity-40 blur-xl animate-pulse" />
//             </PrimaryButton>
//           </div>
//         </div>
//       </GlassCard>
//     );
//   }

//   function renderIdentity() {
//     const handleNext = () => {
//       if (!state.handle || state.handle.trim() === "") {
//         setError("Handle is required.");
//         return;
//       }
//       if (!state.displayName || state.displayName.trim() === "") {
//         setError("Display Name is required.");
//         return;
//       }

//       setError(null);
//       setStep(2);
//     };

//     return (
//       <GlassCard>
//         <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-4">
//           Your Universal Identity
//         </h2>
//         <p className="text-sm text-gray-400 mb-6">
//           Pick a unique handle, a display name, and a short bio. You can change
//           metadata later.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           <div className="md:col-span-2 space-y-4">
//             <TextField
//               label="Handle"
//               prefix="@"
//               value={state.handle}
//               onChange={(v) =>
//                 setState((s) => ({ ...s, handle: v.replace(/^@/, "") }))
//               }
//               placeholder="cy63r_4lph4"
//               required
//             />
//             <TextField
//               label="Display Name"
//               value={state.displayName}
//               onChange={(v) => setState((s) => ({ ...s, displayName: v }))}
//               placeholder="Barry Dragon"
//               required
//             />
//             <TextArea
//               label="Bio"
//               value={state.bio}
//               onChange={(v) => setState((s) => ({ ...s, bio: v }))}
//               placeholder="Web3 builder. Hiring dragons. Paying in CØRE."
//               maxLength={180}
//             />
//           </div>
//           <div>
//             <AvatarPicker
//               value={state.avatar}
//               onChange={(url) => setState((s) => ({ ...s, avatar: url }))}
//             />
//           </div>
//         </div>

//         {error && (
//           <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-2">
//             {error}
//           </div>
//         )}

//         <WizardNav
//           back={() => setStep(0)}
//           next={handleNext}
//           nextLabel={extSteps.length ? "Continue" : "Review"}
//         />
//       </GlassCard>
//     );
//   }

//   function renderExtension(index: number) {
//     const ext = extSteps[index];
//     const extKey = ext?.id || `ext-${index}`;

//     const handleNext = () => {
//       const extData = state.extras || {};
//       const missingRequired = ext.fields?.find(
//         (f) => f.required && !extData[f.name]
//       );

//       if (missingRequired) {
//         setError(`${missingRequired.label} is required.`);
//         return;
//       }

//       // ✅ 3. If everything's fine, move to the next step
//       setError(null);
//       setStep(step + 1);
//     };

//     return (
//       <GlassCard>
//         <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-4">
//           {ext.title}
//         </h2>
//         {ext.description && (
//           <p className="text-sm text-gray-400 mb-6">{ext.description}</p>
//         )}

//         {ext.render ? (
//           <div>{ext.render(state, setState)}</div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {ext.fields?.map((field) => (
//               <FieldRenderer
//                 key={`${extKey}-${field.name}`}
//                 field={field}
//                 value={state.extras[field.name]}
//                 onChange={(val) =>
//                   setState((s) => ({
//                     ...s,
//                     extras: { ...s.extras, [field.name]: val },
//                   }))
//                 }
//               />
//             ))}
//           </div>
//         )}

//         {error && (
//           <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-2">
//             {error}
//           </div>
//         )}

//         <WizardNav
//           back={() => setStep(step - 1)}
//           next={handleNext}
//           nextLabel={index === extSteps.length - 1 ? "Review" : "Continue"}
//         />
//       </GlassCard>
//     );
//   }

//   function renderReview() {
//     if (state.avatar == "") {
//       setState((s) => ({ ...s, avatar: FALLBACK_AVATAR }));
//     }
//     return (
//       <GlassCard>
//         <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-4">
//           Review & Deploy
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           <div className="md:col-span-2 space-y-3">
//             <SummaryRow label="Handle" value={`@${state.handle}`} />
//             <SummaryRow label="Display Name" value={state.displayName} />
//             <SummaryRow label="Bio" value={state.bio || "—"} />
//             {Object.keys(state.extras).length > 0 && (
//               <div className="pt-2">
//                 <h4 className="text-sm font-semibold text-white mb-2">
//                   DApp Fields
//                 </h4>
//                 <div className="space-y-2">
//                   {Object.entries(state.extras).map(([k, v]) => (
//                     <SummaryRow
//                       key={k}
//                       label={k}
//                       value={Array.isArray(v) ? v.join(", ") : String(v)}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//             {error && (
//               <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-md px-3 py-2">
//                 {error}
//               </div>
//             )}
//           </div>
//           <div>
//             <AvatarPreview value={state.avatar} />
//           </div>
//         </div>

//         <div className="mt-6 flex items-center gap-3">
//           <SecondaryButton onClick={() => setStep(step - 1)}>
//             Back
//           </SecondaryButton>
//           <PrimaryButton onClick={handleSubmit} disabled={submitting}>
//             {submitting ? (
//               <span className="inline-flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 {progress === "uploading" && "Saving to Pinata…"}
//                 {progress === "writing" && "Creating on-chain profile…"}
//                 {progress === "done" && "Finalizing…"}
//               </span>
//             ) : (
//               <span className="inline-flex items-center gap-2">
//                 <Wand2 className="h-4 w-4" /> Confirm & Deploy
//               </span>
//             )}
//           </PrimaryButton>
//         </div>
//       </GlassCard>
//     );
//   }

//   function renderSuccess() {
//     return (
//       <GlassCard>
//         <div className="relative text-center py-12 overflow-hidden">
//           {/* 🌌 Animated background orbs */}
//           <div className="absolute inset-0 -z-10">
//             <div className="absolute top-[-50px] left-[-50px] h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-400/30 blur-3xl animate-pulse" />
//             <div className="absolute bottom-[-60px] right-[-60px] h-72 w-72 rounded-full bg-gradient-to-br from-emerald-500/30 to-purple-500/30 blur-3xl animate-pulse delay-300" />
//           </div>

//           {/* ✨ Glowing checkmark */}
//           <motion.div
//             initial={{ scale: 0.5, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: "spring", stiffness: 200, damping: 15 }}
//             className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 shadow-[0_0_30px_rgba(34,211,238,0.8)]"
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.4, type: "spring" }}
//             >
//               <Check className="h-12 w-12 text-white" />
//             </motion.div>
//           </motion.div>

//           {/* 🏆 Title */}
//           <motion.h3
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="font-orbitron text-3xl font-bold text-white tracking-wide"
//           >
//             Identity Forged
//           </motion.h3>

//           {/* Subtitle */}
//           <motion.p
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mt-2 text-gray-300"
//           >
//             Welcome to the 4lph4Verse,{" "}
//             <span className="text-indigo-400">@{state.handle}</span>.
//           </motion.p>

//           {/* 🌠 Confetti burst */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             className="absolute inset-0 pointer-events-none"
//           >
//             {/* Simple confetti effect */}
//             {[...Array(20)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 initial={{
//                   x: "50%",
//                   y: "50%",
//                   rotate: 0,
//                   opacity: 1,
//                 }}
//                 animate={{
//                   x: `${Math.random() * 200 - 100}%`,
//                   y: "120%",
//                   rotate: 360,
//                   opacity: 0,
//                 }}
//                 transition={{
//                   duration: 2,
//                   delay: i * 0.05,
//                   ease: "easeOut",
//                 }}
//                 className="absolute top-1/2 left-1/2 w-2 h-2 rounded-sm bg-gradient-to-r from-pink-500 via-indigo-400 to-emerald-400"
//               />
//             ))}
//           </motion.div>

//           {/* CTA */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.8 }}
//             className="mt-8"
//           >
//             <PrimaryButton
//               onClick={() => onComplete?.(state)}
//               className="px-6 py-3 text-lg"
//             >
//               Enter HireCore →
//             </PrimaryButton>
//           </motion.div>
//         </div>
//       </GlassCard>
//     );
//   }

//   /* ----------------------------- Return ----------------------------- */
//   const content = (
//     <div className="relative">
//       {/* Floating background orbs */}
//       <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 blur-3xl" />
//       <div className="pointer-events-none absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 blur-3xl" />

//       {/* Header / Stepper */}
//       <div className="mb-6 flex items-center justify-between">
//         <div className="text-white font-orbitron text-lg">Verse Profile</div>
//         {asModal && (
//           <button
//             onClick={onClose}
//             className="rounded-lg p-2 text-gray-300 hover:bg-white/10"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         )}
//       </div>

//       <Stepper
//         steps={stepsForIndicator}
//         current={Math.min(step, stepsForIndicator.length - 1)}
//       />

//       <AnimatePresence mode="wait">
//         <motion.div
//           key={`step-${step}`}
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -12 }}
//           transition={{ duration: 0.24 }}
//         >
//           {step === 0 && renderWelcome()}
//           {step === 1 && renderIdentity()}
//           {step >= 2 && step < 2 + extSteps.length && renderExtension(step - 2)}
//           {step === 2 + extSteps.length && renderReview()}
//           {step === 3 + extSteps.length && renderSuccess()}
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );

//   return asModal ? (
//     <ModalWrapper open={true} onClose={onClose!}>
//       {content}
//     </ModalWrapper>
//   ) : (
//     <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{content}</div>
//   );
// }

// /* ----------------------------- Primitives ----------------------------- */
// function GlassCard({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-5 sm:p-6">
//       {children}
//     </div>
//   );
// }

// function PrimaryButton({
//   children,
//   className = "",
//   ...rest
// }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
//   return (
//     <button
//       className={
//         "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition " +
//         className
//       }
//       {...rest}
//     >
//       {children}
//     </button>
//   );
// }

// function SecondaryButton({
//   children,
//   className = "",
//   ...rest
// }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
//   return (
//     <button
//       className={
//         "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-gray-200 border border-white/15 hover:bg-white/10 transition " +
//         className
//       }
//       {...rest}
//     >
//       {children}
//     </button>
//   );
// }

// function WizardNav({
//   back,
//   next,
//   nextLabel = "Continue",
// }: {
//   back?: () => void;
//   next?: () => void;
//   nextLabel?: string;
// }) {
//   return (
//     <div className="mt-6 flex items-center gap-3">
//       {back && <SecondaryButton onClick={back}>Back</SecondaryButton>}
//       {next && (
//         <PrimaryButton onClick={next}>
//           <span className="inline-flex items-center gap-2">
//             <Wand2 className="h-4 w-4" /> {nextLabel}
//           </span>
//         </PrimaryButton>
//       )}
//     </div>
//   );
// }

// function TextField({
//   label,
//   value,
//   onChange,
//   placeholder,
//   prefix,
//   required,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
//   prefix?: string;
//   required?: boolean;
// }) {
//   return (
//     <label className="block">
//       <div className="mb-1 text-sm text-gray-300">
//         {label} {required && <span className="text-red-400">*</span>}
//       </div>
//       <div className="relative">
//         {prefix && (
//           <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//             {prefix}
//           </span>
//         )}
//         <input
//           className={`w-full rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-2 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-indigo-600 ${prefix ? "pl-7" : ""}`}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//         />
//       </div>
//     </label>
//   );
// }

// function TextArea({
//   label,
//   value,
//   onChange,
//   placeholder,
//   maxLength,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
//   maxLength?: number;
// }) {
//   return (
//     <label className="block">
//       <div className="mb-1 text-sm text-gray-300">{label}</div>
//       <textarea
//         className="w-full min-h-[110px] rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-2 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-indigo-600"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         maxLength={maxLength}
//       />
//       {maxLength ? (
//         <div className="mt-1 text-right text-xs text-gray-500">
//           {value.length}/{maxLength}
//         </div>
//       ) : null}
//     </label>
//   );
// }

// function AvatarPicker({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (url: string) => void;
// }) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       onChange(String(reader.result));
//     };
//     reader.readAsDataURL(file);
//   }

//   return (
//     <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-3 sm:p-4 text-center">
//       <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900">
//         {value ? (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img
//             src={value}
//             alt="avatar"
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <ImageIcon className="h-8 w-8 text-gray-500" />
//         )}
//       </div>
//       <SecondaryButton onClick={() => inputRef.current?.click()}>
//         Upload Avatar
//       </SecondaryButton>
//       <input
//         ref={inputRef}
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={onSelectFile}
//       />
//       {value && (
//         <div className="mt-2">
//           <button
//             className="text-xs text-gray-400 underline"
//             onClick={() => onChange("")}
//           >
//             Remove
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function AvatarPreview({ value }: { value: string }) {
//   return (
//     <div className="rounded-xl border border-white/10 bg-zinc-800/40 p-4 text-center">
//       <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900">
//         {value ? (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img
//             src={value}
//             alt="avatar"
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <ImageIcon className="h-8 w-8 text-gray-500" />
//         )}
//       </div>
//       <div className="text-xs text-gray-400">Profile Picture</div>
//     </div>
//   );
// }

// function SummaryRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-zinc-800/40 px-3 py-2">
//       <div className="min-w-[110px] text-xs uppercase tracking-wide text-gray-400">
//         {label}
//       </div>
//       <div className="text-sm text-gray-100">{value}</div>
//     </div>
//   );
// }

// function FieldRenderer({
//   field,
//   value,
//   onChange,
// }: {
//   field: ExtensionField;
//   value: any;
//   onChange: (v: any) => void;
// }) {
//   if (field.type === "text")
//     return (
//       <TextField
//         label={field.label}
//         placeholder={field.placeholder}
//         value={value || ""}
//         onChange={onChange}
//         required={field.required}
//       />
//     );

//   if (field.type === "textarea")
//     return (
//       <TextArea
//         label={field.label}
//         placeholder={field.placeholder}
//         value={value || ""}
//         onChange={onChange}
//         maxLength={field.maxLength}
//       />
//     );

//   if (field.type === "select")
//     return (
//       <label className="block">
//         <div className="mb-1 text-sm text-gray-300">
//           {field.label}
//           {field.required && <span className="text-red-400">*</span>}
//         </div>
//         <select
//           className="w-full rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-600"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//         >
//           <option value="" disabled>
//             Select…
//           </option>
//           {field.options.map((opt) => (
//             <option key={opt} value={opt} className="bg-zinc-900">
//               {opt}
//             </option>
//           ))}
//         </select>
//       </label>
//     );

//   if (field.type === "tags")
//     return (
//       <TagsInput
//         label={field.label}
//         placeholder={field.placeholder}
//         value={Array.isArray(value) ? value : []}
//         onChange={onChange}
//       />
//     );

//   return null;
// }

// function TagsInput({
//   label,
//   value,
//   onChange,
//   placeholder,
// }: {
//   label: string;
//   value: string[];
//   onChange: (v: string[]) => void;
//   placeholder?: string;
// }) {
//   const [input, setInput] = useState("");

//   function addTag() {
//     const t = input.trim();
//     if (!t) return;
//     if (!value.includes(t)) onChange([...value, t]);
//     setInput("");
//   }

//   function removeTag(idx: number) {
//     onChange(value.filter((_, i) => i !== idx));
//   }

//   return (
//     <div>
//       <div className="mb-1 text-sm text-gray-300">{label}</div>
//       <div className="rounded-lg border border-white/10 bg-zinc-800/50 p-2">
//         <div className="flex flex-wrap gap-2">
//           {value.map((t, i) => (
//             <span
//               key={`${t}-${i}`}
//               className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white"
//             >
//               {t}
//               <button
//                 className="text-white/70 hover:text-white"
//                 onClick={() => removeTag(i)}
//                 aria-label={`remove ${t}`}
//               >
//                 x
//               </button>
//             </span>
//           ))}
//         </div>
//         <div className="mt-2 flex items-center gap-2">
//           <input
//             className="flex-1 rounded-md border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-indigo-600"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) =>
//               e.key === "Enter" ? (e.preventDefault(), addTag()) : undefined
//             }
//             placeholder={placeholder || "Add tag and press Enter"}
//           />
//           <SecondaryButton onClick={addTag}>Add</SecondaryButton>
//         </div>
//       </div>
//     </div>
//   );
// }
