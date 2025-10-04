"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function Stepper({
  steps,
  current,
}: {
  steps: { id: number; label: string }[];
  current: number;
}) {
  return (
    <>
      {/* 🖥 Desktop Stepper */}
      <div className="hidden sm:block relative w-full max-w-3xl mx-auto mb-10">
        {/* Gradient line behind steps */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 opacity-30" />

        <div className="relative flex justify-between">
          {steps.map((s, i) => {
            const isActive = i === current;
            const isCompleted = i < current;

            return (
              <div
                key={s.id}
                className="flex flex-col items-center w-full text-center"
              >
                {/* Step circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.25 : 1,
                    boxShadow: isActive
                      ? "0 0 20px rgba(99,102,241,0.9), 0 0 40px rgba(34,211,238,0.6)"
                      : "0 0 0px rgba(0,0,0,0)",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 font-orbitron text-sm
                    ${
                      isCompleted
                        ? "bg-gradient-to-br from-indigo-500 to-emerald-400 text-white border-transparent"
                        : isActive
                        ? "bg-gradient-to-br from-indigo-400 to-cyan-400 text-white border-transparent"
                        : "border-gray-600 text-gray-400 bg-zinc-900"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </motion.div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 h-[2px] -z-0 ${
                      isCompleted
                        ? "bg-gradient-to-r from-indigo-500 to-emerald-400"
                        : "bg-gray-700"
                    }`}
                    style={{
                      width: `${100 / (steps.length - 1)}%`,
                    }}
                  />
                )}

                {/* Label */}
                <div
                  className={`mt-3 text-xs tracking-wide uppercase ${
                    isActive ? "text-white font-semibold" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📱 Mobile Stepper */}
      <div className="block sm:hidden w-full max-w-md mx-auto mb-6">
        {/* Progress bar */}
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
            initial={{ width: 0 }}
            animate={{
              width: `${((current + 1) / steps.length) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
          />
        </div>

        {/* Step text below */}
        <div className="mt-2 text-xs text-gray-400 text-center font-orbitron tracking-wide">
          Step {current + 1} of {steps.length} —{" "}
          <span className="text-white">{steps[current]?.label}</span>
        </div>
      </div>
    </>
  );
}
