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
    updateProfile((f: any) => ({
      ...f,
      interests: f.interests.includes(v)
        ? f.interests.filter((i: string) => i !== v)
        : [...f.interests, v],
    }));
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
      ? "border-green-400"
      : status === "taken" || status === "invalid"
        ? "border-red-400"
        : status === "checking"
          ? "border-yellow-400"
          : "border-white/20";

  return (
    <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10 shadow-lg space-y-8">
      <h1 className="text-3xl font-bold">Forge Your Verse Identity</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border border-white/20">
          {form.avatar ? (
            <AvatarImage src={form.avatarPreview} />
          ) : (
            <AvatarFallback className="bg-white/10">VP</AvatarFallback>
          )}
        </Avatar>

        <Input type="file" accept="image/*" onChange={handleAvatar} />
      </div>

      {/* Handle + Display Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <Input
            placeholder="@handle"
            className={`${handleBorder}`}
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
          placeholder="Display Name"
          value={form.displayName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateProfile({ displayName: e.target.value })
          }
        />
      </div>

      {/* Bio */}
      <Textarea
        rows={4}
        placeholder="Tell the Verse who you are..."
        value={form.bio}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          updateProfile({ bio: e.target.value })
        }
      />

      {/* Location */}
      <Input
        placeholder="Location (optional)"
        value={form.location}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateProfile({ location: e.target.value })
        }
      />

      {/* Interests */}
      <div className="space-y-2">
        <p className="text-white/80 text-sm">Interests</p>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((i) => (
            <button
              key={i}
              onClick={() => toggleInterest(i)}
              className={`px-4 py-1 rounded-full text-sm border transition ${
                form.interests.includes(i)
                  ? "bg-cyan-400 text-black border-cyan-400"
                  : "border-white/20 text-white/60"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4 pt-2">
        <p className="text-white/80 font-medium text-sm">Social Links</p>

        {Object.keys(form.links).map((key) => (
          <Input
            key={key}
            placeholder={key}
            value={form.links[key]}
            onChange={(e) =>
              updateProfile({
                links: { ...form.links, [key]: e.target.value },
              })
            }
          />
        ))}
      </div>
    </Card>
  );
}
