"use client";

import { Card } from "@verse/ui/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@verse/ui/components/ui/avatar";

import { Twitter, Github, Send, Globe, Network } from "lucide-react";

export default function ProfilePreview({ form }: any) {
  const socialIcons: any = {
    x: <Twitter className="w-5 h-5 text-cyan-400" />,
    github: <Github className="w-5 h-5 text-cyan-400" />,
    telegram: <Send className="w-5 h-5 text-cyan-400" />,
    website: <Globe className="w-5 h-5 text-cyan-400" />,
    farcaster: <Network className="w-5 h-5 text-cyan-400" />,
  };
  return (
    <div className="p-10 hud-panel bg-black/40 border border-alpha-cyan/30 box-glow max-h-[80vh] relative overflow-y-auto">
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-alpha-cyan" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-alpha-cyan" />

      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="h-32 w-32 border-2 border-alpha-cyan/50 mb-6 bg-black flex items-center justify-center relative">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />
          {form.avatar ? (
            <img src={form.avatarPreview} className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-alpha-cyan/30">VP</span>
          )}
        </div>

        {/* Display Name */}
        <h2 className="text-2xl font-mono font-bold text-glow text-alpha-cyan uppercase tracking-wider">
          {form.displayName || "DISPLAY NAME"}
        </h2>

        {/* Handle */}
        <p className="text-alpha-magenta font-mono text-sm tracking-widest mt-1">
          {form.handle ? `@${form.handle}` : "@HANDLE"}
        </p>

        {/* Bio */}
        <p className="text-slate-400 text-center mt-6 font-mono text-sm">
          {form.bio ? `> ${form.bio}` : "> SYS.LOG // BIO WILL APPEAR HERE"}
        </p>

        {/* Location */}
        {form.location && (
          <p className="mt-4 text-xs font-mono uppercase text-slate-400 flex items-center gap-2">
            <span className="text-alpha-magenta">LOC:</span> {form.location}
          </p>
        )}

        {/* Interests */}
        {form.interests.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {form.interests.map((i: string) => (
              <span
                key={i}
                className="px-3 py-1 bg-alpha-cyan/10 border border-alpha-cyan/50 text-alpha-cyan font-mono uppercase tracking-wider text-xs"
              >
                {i}
              </span>
            ))}
          </div>
        )}

        {/* Social Icons */}
        <div className="mt-10 flex gap-4 justify-center">
          {Object.entries(form.links).map(([key, value]: any) =>
            value ? (
              <a
                key={key}
                href={value.startsWith("http") ? value : `https://${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-alpha-cyan/5 border border-alpha-cyan/30 hover:bg-alpha-cyan/20 transition hover:border-alpha-cyan shadow-[0_0_10px_rgba(0,240,255,0)] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                {socialIcons[key]}
              </a>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
