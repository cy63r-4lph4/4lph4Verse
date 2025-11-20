import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@verse/ui/components/ui/button";

import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google"; // Main font

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jet = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet" });

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0b0d10] text-white font-inter variable-font-smoothing">
      {/* -------------------------------------------------- */}
      {/* PARTICLES */}
      {/* -------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0">
        <canvas
          id="particleCanvas"
          className="absolute inset-0 w-full h-full opacity-60"
        ></canvas>
      </div>

      {/* -------------------------------------------------- */}
      {/* PORTAL CORE (Refined Look) */}
      {/* -------------------------------------------------- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div className="absolute w-[900px] h-[900px] rounded-full border border-white/5 animate-portal-spin-slow blur-[1px]" />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-cyan-400/10 animate-portal-spin-reverse blur-[1px]" />
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-core-breathe" />
        <div className="absolute w-[240px] h-[240px] border-2 border-purple-400/30 rounded-full animate-portal-ring" />
        <div className="absolute w-[160px] h-[160px] rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 blur-[3px] animate-core-breathe shadow-[0_0_40px_rgba(56,189,248,0.5)]" />
      </div>

      {/* -------------------------------------------------- */}
      {/* CONTENT */}
      {/* -------------------------------------------------- */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 animate-camera-drift">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight font-jetbrains-mono bg-gradient-to-br from-cyan-400 via-sky-400 to-purple-600 bg-clip-text text-transparent ">
          VerseWallet
        </h1>

        <p className="mt-4 max-w-xl text-lg md:text-xl text-white mb-20 drop-shadow-[0_0_10px_rgba(56,189,248,0.15)]">
          Step beyond the boundary.
          <br />
          Your sovereign gateway to the{" "}
          <span className="text-cyan-400 font-semibold">4lph4Verse</span>.
        </p>

        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="group px-7 py-5 text-base font-semibold rounded-xl bg-gradient-to-br from-cyan-500 to-purple-700 text-white hover:brightness-110 transition-all  relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Enter Portal
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.4),transparent_70%)] opacity-20 group-hover:opacity-40 blur-2xl transition-opacity" />
            </Button>
          </Link>

          <Link href="/auth/signup">
            <Button
              variant="outline"
              size="lg"
              className="px-7 py-5 text-base font-semibold rounded-xl border-white/15 text-white backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              Create Identity
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-[#9aa5b1]">
          Already a citizen?{" "}
          <Link
            href="/auth/login"
            className="text-cyan-400 hover:underline underline-offset-4"
          >
            Restore Access
          </Link>
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/40 to-transparent" />

      <style>{`
        @keyframes portalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes portalSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes coreBreathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes portalRing {
          0% { transform: scale(0.9) rotate(0deg); opacity: 0.7; }
          50% { transform: scale(1.07) rotate(3deg); opacity: 1; }
          100% { transform: scale(0.9) rotate(0deg); opacity: 0.7; }
        }
        @keyframes cameraDrift {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-10px,6px); }
          100% { transform: translate3d(0,0,0); }
        }
        
        .animate-portal-spin-slow {
          animation: portalSpin 18s linear infinite;
        }
        .animate-portal-spin-reverse {
          animation: portalSpinReverse 26s linear infinite;
        }
        .animate-core-breathe {
          animation: coreBreathe 6s ease-in-out infinite;
        }
        .animate-portal-ring {
          animation: portalRing 4s ease-in-out infinite;
        }
        .animate-camera-drift {
          animation: cameraDrift 14s ease-in-out infinite;
        }
      `}</style>

      {/* -------------------------------------------------- */}
      {/* PARTICLE SCRIPT */}
      {/* -------------------------------------------------- */}
      <script>{`
        const canvas = document.getElementById('particleCanvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const particles = [];
          const count = 70;

          function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }
          resize();
          window.onresize = resize;

          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              r: Math.random() * 2 + 1,
              dx: (Math.random() - 0.5) * 0.5,
              dy: (Math.random() - 0.5) * 0.5,
            });
          }

          function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(148, 212, 255, 0.7)';
              ctx.fill();

              p.x += p.dx;
              p.y += p.dy;

              if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
              if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });

            requestAnimationFrame(draw);
          }

          draw();
        }
      `}</script>
    </main>
  );
}
