"use client";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@verse/ui/components/ui/avatar";
import { Input } from "@verse/ui/components/ui/input";
import { Textarea } from "@verse/ui/components/ui/textarea";
import { Card } from "@verse/ui/components/ui/card";
import { useCheckHandle } from "@verse/sdk/hooks/useCheckHandle";

export default function ProfileForm({
  form,
  updateProfile,
  setAvatarFromFile,
}: any) {
  const interestOptions = [
    "Web3",
    "AI",
    "Gaming",
    "DeFi",
    "Art",
    "Programming",
    "Music",
    "Fitness",
  ];

  // --------------------------
  // HANDLE VERIFICATION HOOK
  // --------------------------
  const { status, validationReason } = useCheckHandle(form.handle);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFromFile(file);
    }
  };

  const toggleInterest = (v: string) => {
    const interests = form.interests.includes(v)
      ? form.interests.filter((i: string) => i !== v)
      : [...form.interests, v];

    updateProfile({ interests: interests });
  };

  // UI label text
  const handleStatusText = {
    idle: "",
    checking: "Checking availability...",
    available: "Handle is available ✔",
    taken: "Handle is already taken ✘",
    invalid: "Invalid handle format (a-z, 0-9, _ — min 3 chars)",
    error: "Unable to check handle. Try again.",
  }[status];

  // Border color logic
  const handleBorder =
    status === "available"
      ? "border-green-400 focus-visible:border-green-400"
      : status === "taken" || status === "invalid"
        ? "border-red-400 focus-visible:border-red-400 text-red-400"
        : status === "checking"
          ? "border-yellow-400 focus-visible:border-yellow-400"
          : "border-alpha-cyan/30 focus-visible:border-alpha-cyan";

  return (
    <div className="p-8 hud-panel border border-alpha-cyan/30 box-glow space-y-8 relative">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-alpha-cyan" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-alpha-cyan" />

      <h1 className="text-3xl font-mono font-bold uppercase tracking-widest text-glow text-alpha-cyan">
        Forge Identity
      </h1>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 border-2 border-alpha-cyan/50 relative bg-black flex items-center justify-center">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />
          {form.avatar ? (
            <img src={form.avatarPreview} className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-alpha-cyan/30">VP</span>
          )}
        </div>

        <Input type="file" accept="image/*" onChange={handleAvatar} className="font-mono text-xs border-alpha-cyan/30 rounded-none file:text-alpha-cyan file:bg-alpha-cyan/10 file:rounded-none file:border-0 file:mr-4 file:px-4 file:py-2" />
      </div>

      {/* Handle + Display Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Input
            placeholder="@HANDLE"
            className={`font-mono text-sm bg-black/20 border-0 border-b rounded-none focus-visible:ring-0 ${handleBorder} text-white`}
            value={form.handle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateProfile({
                handle: e.target.value.replace(/^@/, "").toLowerCase(),
              })
            }
          />

          {/* Status label */}
          {status !== "idle" && (
            <p
              className={`text-xs ${
                status === "available"
                  ? "text-green-400"
                  : status === "taken" || status === "invalid"
                    ? "text-red-400"
                    : status === "checking"
                      ? "text-yellow-300"
                      : "text-red-300"
              }`}
            >
              {status === "invalid" && validationReason
                ? validationReason.replace(/_/g, " ").toLowerCase() // nicer UX
                : status === "available"
                  ? "Handle is available ✔"
                  : status === "taken"
                    ? "Handle is already taken ✘"
                    : status === "checking"
                      ? "Checking availability..."
                      : "Unable to check handle. Try again."}
            </p>
          )}
        </div>

        <Input
          placeholder="DISPLAY NAME"
          value={form.displayName}
          className="font-mono text-sm bg-black/20 border-0 border-b border-alpha-cyan/30 rounded-none focus-visible:ring-0 focus-visible:border-alpha-cyan text-white"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateProfile({ displayName: e.target.value })
          }
        />
      </div>

      {/* Email / Contact */}
      <Input
        placeholder="CONTACT EMAIL [REQUIRED FOR RECOVERY]"
        type="email"
        value={form.email || ""}
        className="font-mono text-sm bg-black/20 border-0 border-b border-alpha-cyan/30 rounded-none focus-visible:ring-0 focus-visible:border-alpha-cyan text-white"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateProfile({ email: e.target.value })
        }
      />

      {/* Bio */}
      <Textarea
        rows={4}
        placeholder="> SYS.LOG // IDENTIFY YOURSELF..."
        value={form.bio}
        className="font-mono text-sm bg-black/20 border border-alpha-cyan/30 rounded-none focus-visible:ring-0 focus-visible:border-alpha-cyan text-white resize-none"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          updateProfile({ bio: e.target.value })
        }
      />

      {/* Location */}
      <Input
        placeholder="LOCATION [OPTIONAL]"
        value={form.location}
        className="font-mono text-sm bg-black/20 border-0 border-b border-alpha-cyan/30 rounded-none focus-visible:ring-0 focus-visible:border-alpha-cyan text-white"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateProfile({ location: e.target.value })
        }
      />

      {/* Interests */}
      <div className="space-y-4">
        <p className="text-alpha-cyan font-mono uppercase tracking-widest text-xs border-b border-alpha-cyan/20 pb-1">Interests</p>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((i) => (
            <button
              key={i}
              onClick={() => toggleInterest(i)}
              className={`px-4 py-1.5 font-mono uppercase tracking-widest text-xs transition border ${
                form.interests.includes(i)
                  ? "bg-alpha-cyan/20 text-alpha-cyan border-alpha-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  : "border-white/10 text-slate-500 hover:border-alpha-cyan/30 hover:text-alpha-cyan/70"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4 pt-2">
        <p className="text-alpha-cyan font-mono uppercase tracking-widest text-xs border-b border-alpha-cyan/20 pb-1">Social Uplinks</p>

        {Object.keys(form.links).map((key) => (
          <Input
            key={key}
            placeholder={key.toUpperCase()}
            value={form.links[key]}
            className="font-mono text-sm bg-black/20 border-0 border-b border-alpha-cyan/30 rounded-none focus-visible:ring-0 focus-visible:border-alpha-cyan text-white"
            onChange={(e) =>
              updateProfile({
                links: { ...form.links, [key]: e.target.value },
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
