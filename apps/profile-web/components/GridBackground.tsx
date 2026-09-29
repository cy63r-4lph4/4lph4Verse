"use client";

import React, { useEffect, useState } from "react";

export const GridBackground = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Move grid down slightly over time
      setOffset((prev) => (prev + delta * 0.02) % 40);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-20] opacity-80">
      {/* Perspective wrapper */}
      <div
        className="absolute w-[200%] h-[200%] left-[-50%] top-[20%]"
        style={{
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "top center",
        }}
      >
        {/* Animated Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            transform: `translateY(${offset}px)`,
          }}
        />
        {/* Deep magenta accents in the grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(176, 38, 255, 0.3) 2px, transparent 2px),
              linear-gradient(to bottom, rgba(176, 38, 255, 0.3) 2px, transparent 2px)
            `,
            backgroundSize: "200px 200px",
            transform: `translateY(${offset}px)`,
          }}
        />
      </div>
      
      {/* Fog/fade out at the top of the grid to blend with the background */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #010103 5%, transparent 30%, transparent 80%, #010103 100%)"
        }}
      />
    </div>
  );
};
