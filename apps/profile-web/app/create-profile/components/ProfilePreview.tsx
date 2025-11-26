"use client";

import { Card } from "@verse/ui/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@verse/ui/components/ui/avatar";

export default function ProfilePreview({ form }: any) {
  return (
    <Card className="p-10 bg-white/5 border-white/10 backdrop-blur-xl shadow-xl h-fit">
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <Avatar className="h-32 w-32 border-2 border-cyan-400 mb-6">
          {form.avatar ? (
            <AvatarImage src={form.avatar} />
          ) : (
            <AvatarFallback className="bg-white/10">VP</AvatarFallback>
          )}
        </Avatar>

        {/* Display Name */}
        <h2 className="text-2xl font-bold text-white">
          {form.displayName || "Display Name"}
        </h2>

        {/* Handle */}
        <p className="text-cyan-400 mt-1">
          {form.handle ? `@${form.handle}` : "@handle"}
        </p>

        {/* Bio */}
        <p className="text-white/70 text-center mt-4">
          {form.bio || "Your bio will appear here..."}
        </p>

        {/* Location */}
        {form.location && (
          <p className="mt-4 text-sm text-white/60">📍 {form.location}</p>
        )}

        {/* Interests */}
        {form.interests.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {form.interests.map((i: string) => (
              <span
                key={i}
                className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 text-cyan-300 rounded-full text-xs"
              >
                {i}
              </span>
            ))}
          </div>
        )}

        {/* Social Links */}
        <div className="mt-8 w-full space-y-2">
          {Object.entries(form.links).map(([key, value]: any) =>
            value ? (
              <p key={key} className="text-sm text-white/60">
                <span className="capitalize text-white">{key}:</span> {value}
              </p>
            ) : null
          )}
        </div>
      </div>
    </Card>
  );
}
