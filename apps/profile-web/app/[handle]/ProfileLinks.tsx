"use client";

import { Card } from "@verse/ui/components/ui/card";
import { Twitter, Github, Send, Globe, Network } from "lucide-react";

const socialIcons: any = {
  x: Twitter,
  github: Github,
  telegram: Send,
  website: Globe,
  farcaster: Network,
};

export default function ProfileLinks({ profile }: any) {
  const entries = Object.entries(profile.links || {}).filter(
    ([_, value]) => value
  );

  if (entries.length === 0) return null;

  return (
    <Card className="p-8 bg-white/5 border-white/10 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Links</h2>

      <div className="flex flex-wrap gap-4">
        {entries.map(([key, url]: any) => {
          const Icon = socialIcons[key];
          return (
            <a
              key={key}
              href={url.startsWith("http") ? url : `https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10"
            >
              <Icon className="w-5 h-5 text-cyan-300" />
              <span className="text-white/80 capitalize">{key}</span>
            </a>
          );
        })}
      </div>
    </Card>
  );
}
