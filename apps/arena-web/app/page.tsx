'use client'
import ArenaLogo from "@verse/arena-web/components/ui/ArenaLogo";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router=useRouter();
  return (
    <EnergyBackground className="flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Logo with animation */}
        <div className="animate-scale-in">
          <ArenaLogo size="xl" showTagline />
        </div>

        {/* CTA Button */}
        <div className="mt-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <NeonButton
            size="xl"
            onClick={() => router.push("/setup")}
            className="min-w-[280px]"
          >
            Enter the Arena
          </NeonButton>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <p className="text-muted-foreground/50 text-xs tracking-wider">
            v1.0.0 — Beta
          </p>
        </div>
      </div>
    </EnergyBackground>
  );
}
