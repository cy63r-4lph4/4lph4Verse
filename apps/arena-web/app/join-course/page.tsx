"use client";
import { useState } from "react";
import { Link2, Plus, ShieldCheck, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { InputField } from "@verse/arena-web/components/ui/InputField";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";

const JoinCourse = () => {
  const router = useRouter();
  const [courseCode, setCourseCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleJoin = () => {
    if (courseCode.trim()) {
      setIsVerifying(true);
      // Artificial delay to simulate "Sector Verification"
      setTimeout(() => {
        router.push("/lobby");
      }, 1200);
    }
  };

  return (
    <EnergyBackground className="flex flex-col h-dvh">
      <div className="flex-1 flex flex-col px-6 py-12 max-w-lg mx-auto w-full">
        
        {/* Step Header */}
        <div className="text-center mb-12 animate-fade-scale-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
             <Target size={12} className="text-primary animate-pulse" />
             <span className="text-[10px] font-mono text-primary tracking-[0.2em] uppercase">Sector Selection</span>
          </div>
          <h1 className="font-display text-2xl font-black text-white tracking-widest uppercase mb-2 text-glow">
            Enter Course
          </h1>
          <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
            Acquiring Battleground Access
          </p>
        </div>

        {/* Input Area */}
        <div className="flex-1 flex flex-col justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="w-full space-y-8">
            <div className="relative">
              <InputField
                label="Sector Access Key"
                prefixText="ARENA_ID"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                placeholder="E.G. CS50-CAMBRIDGE"
                className="text-center text-lg md:text-xl font-display tracking-[0.2em] uppercase py-6"
              />
              {courseCode.length > 3 && !isVerifying && (
                <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                   <span className="text-[8px] font-mono text-primary animate-pulse tracking-widest">
                     READY TO SYNC...
                   </span>
                </div>
              )}
            </div>

            <NeonButton
              size="responsive"
              onClick={handleJoin}
              disabled={!courseCode.trim() || isVerifying}
              className="w-full shadow-glow-primary"
            >
              {isVerifying ? "VERIFYING SECTOR..." : "INITIALIZE SYNC"}
            </NeonButton>

            {/* Tactical Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-linear-to-r from-transparent to-arena-border" />
              <span className="text-muted-foreground/40 font-mono text-[9px] tracking-widest">OR</span>
              <div className="flex-1 h-px bg-linear-to-l from-transparent to-arena-border" />
            </div>

            {/* Alternative Tactical Options */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-arena-card border border-arena-border hover:border-primary/40 transition-all group">
                <Link2 size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground group-hover:text-white">Uplink</span>
              </button>

              <button 
                onClick={() => router.push("/lobby")}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-arena-card border border-arena-border hover:border-secondary/40 transition-all group"
              >
                <Plus size={16} className="text-muted-foreground group-hover:text-secondary transition-colors" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground group-hover:text-white">Create</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Footer / Skip */}
        <div className="mt-auto pt-8 text-center space-y-6">
          <div className="flex flex-col items-center opacity-30">
             <ShieldCheck size={24} className="mb-2" />
             <p className="text-[8px] font-mono uppercase tracking-[0.3em]">
               Verified Secure by DeskMate Infrastructure
             </p>
          </div>

          <button
            onClick={() => router.push("/lobby")}
            className="group inline-flex flex-col items-center gap-1"
          >
            <span className="text-muted-foreground/60 text-[10px] uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
              Skip for Test-Deployment
            </span>
            <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-300" />
          </button>
        </div>
      </div>
    </EnergyBackground>
  );
};

export default JoinCourse;