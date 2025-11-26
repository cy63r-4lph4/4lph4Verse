"use client";


import { Avatar, AvatarImage, AvatarFallback } from "@verse/ui/components/ui/avatar";
import { Input } from "@verse/ui/components/ui/input";
import { Textarea } from "@verse/ui/components/ui/textarea";
import {Button } from "@verse/ui/components/ui/button";
import {Card} from "@verse/ui/components/ui/card"

export default function ProfileForm({ form, setForm }: any) {
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

  const handleAvatar = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setForm((f: any) => ({ ...f, avatar: url }));
  };

  const toggleInterest = (v: string) => {
    setForm((f: any) => ({
      ...f,
      interests: f.interests.includes(v)
        ? f.interests.filter((i: string) => i !== v)
        : [...f.interests, v],
    }));
  };

  return (
    <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10 shadow-lg space-y-8">

      <h1 className="text-3xl font-bold">Forge Your Verse Identity</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border border-white/20">
          {form.avatar ? (
            <AvatarImage src={form.avatar} />
          ) : (
            <AvatarFallback className="bg-white/10">VP</AvatarFallback>
          )}
        </Avatar>

        <Input type="file" accept="image/*" onChange={handleAvatar} />
      </div>

      {/* Handle + Display Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          placeholder="@handle"
          value={form.handle}
          onChange={(e) => setForm((f: any) => ({ ...f, handle: e.target.value }))}
        />
        <Input
          placeholder="Display Name"
          value={form.displayName}
          onChange={(e) =>
            setForm((f: any) => ({ ...f, displayName: e.target.value }))
          }
        />
      </div>

      {/* Bio */}
      <Textarea
        rows={4}
        placeholder="Tell the Verse who you are..."
        value={form.bio}
        onChange={(e) => setForm((f: any) => ({ ...f, bio: e.target.value }))}
      />

      {/* Location */}
      <Input
        placeholder="Location (optional)"
        value={form.location}
        onChange={(e) =>
          setForm((f: any) => ({ ...f, location: e.target.value }))
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
              setForm((f: any) => ({
                ...f,
                links: { ...f.links, [key]: e.target.value },
              }))
            }
          />
        ))}
      </div>

      

    </Card>
  );
}
