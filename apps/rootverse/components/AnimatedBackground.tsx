"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  // simple particle shimmer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 1,
      s: Math.random() * 0.4 + 0.2,
    }));

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${star.a})`;
        ctx.fill();
        star.y += star.s;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* moving gradient aurora */}
      <motion.div
        animate={controls}
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-br from-cyan-800/40 via-purple-800/40 to-pink-700/40 blur-3xl opacity-40"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
      />
    </div>
  );
};
