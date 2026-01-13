import { cn } from "@verse/ui";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefixText?: string; // e.g., "ID_" or "LOC_"
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, error, prefixText, ...props }, ref) => {
    return (
      <div className="w-full group">
        {label && (
          <div className="flex justify-between items-end mb-2 px-1">
            <label className="text-[10px] font-display font-bold text-primary tracking-[0.2em] uppercase">
              {label}
            </label>
            {prefixText && <span className="text-[8px] font-mono text-muted-foreground opacity-50">{prefixText}</span>}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-4 rounded-xl font-sans",
              "bg-arena-card border-2 border-arena-border",
              "text-white placeholder:text-muted-foreground/30",
              "focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]",
              "transition-all duration-300",
              error && "border-destructive focus:ring-destructive/50",
              className
            )}
            {...props}
          />
          {/* Subtle corner accent that lights up on focus */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/0 group-focus-within:border-primary/50 transition-all" />
        </div>
        {error && (
          <p className="mt-1.5 text-[10px] font-mono text-destructive uppercase tracking-tighter animate-pulse">
            {`> ERROR: ${error}`}
          </p>
        )}
      </div>
    );
  }
);