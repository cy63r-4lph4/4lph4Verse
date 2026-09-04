"use client";

import { useState } from "react";
import { Search, Users, Wifi, WifiOff, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { useCourseMembers } from "@verse/arena-web/hooks/useCourseMembers";
import { useCoursePresence } from "@verse/arena-web/hooks/useCoursePresence";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

type SortKey = "name" | "role" | "joined" | "status";
type SortDir = "asc" | "desc";

export function FighterRosterPanel({ courseId }: { courseId: string }) {
  const { data: members = [], isLoading } = useCourseMembers(courseId);
  const presence = useCoursePresence(courseId);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "online" | "offline">("all");
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const presenceMap = new Map(presence.map(p => [p.arenaUserId, p.status]));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = members
    .filter((m: any) => {
      if (search && !m.username.toLowerCase().includes(search.toLowerCase())) return false;
      const st = presenceMap.get(m.arenaUserId) ?? "offline";
      if (filter === "online" && st === "offline") return false;
      if (filter === "offline" && st !== "offline") return false;
      return true;
    })
    .sort((a: any, b: any) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.username.localeCompare(b.username);
      else if (sortKey === "role") cmp = a.role.localeCompare(b.role);
      else if (sortKey === "joined") cmp = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      else if (sortKey === "status") {
        const order = (m: any) => { const s = presenceMap.get(m.arenaUserId); return s === "online" ? 0 : s === "recent" ? 1 : 2; };
        cmp = order(a) - order(b);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  const onlineCount = members.filter((m: any) => presenceMap.get(m.arenaUserId) === "online").length;

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown size={10} className="text-white/20" />;
    return sortDir === "asc"
      ? <ArrowUp size={10} className="text-primary" />
      : <ArrowDown size={10} className="text-primary" />;
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-[16px] font-black text-white uppercase tracking-wide">Fighter Roster</h2>
          <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[.2em] mt-0.5">
            {members.length} enrolled · {onlineCount} online now
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "online", "offline"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-display text-[9px] font-black uppercase tracking-wider border transition-all",
                filter === f
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-white/[0.03] border-white/[0.06] text-white/35 hover:text-white/60"
              )}
            >
              {f === "online" && <Wifi size={9} className="inline mr-1" />}
              {f === "offline" && <WifiOff size={9} className="inline mr-1" />}
              {f === "all" && <Users size={9} className="inline mr-1" />}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search fighter by username…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 placeholder-white/20 font-display text-[11px] font-bold uppercase tracking-wide outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2.5rem_1fr_5rem_6rem_6rem] gap-3 px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
          {[
            { key: null,       label: "#" },
            { key: "name",     label: "Fighter" },
            { key: "role",     label: "Role" },
            { key: "joined",   label: "Joined" },
            { key: "status",   label: "Status" },
          ].map(col => (
            <button
              key={col.label}
              onClick={col.key ? () => handleSort(col.key as SortKey) : undefined}
              className={cn("flex items-center gap-1.5 font-display text-[8px] font-black text-white/25 uppercase tracking-[.2em]", col.key && "hover:text-white/50 transition-colors")}
            >
              {col.label}
              {col.key && <SortIcon col={col.key as SortKey} />}
            </button>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04] max-h-[calc(100vh-22rem)] overflow-y-auto styled-scrollbar">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <p className="font-display text-[9px] text-white/20 uppercase tracking-widest">Loading roster…</p>
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Users size={24} className="text-white/10" />
              <p className="font-display text-[9px] text-white/18 uppercase tracking-widest">No fighters match your filters</p>
            </div>
          )}
          {filtered.map((member: any, idx: number) => {
            const status = presenceMap.get(member.arenaUserId) ?? "offline";
            const isOnline = status === "online";
            const isRecent = status === "recent";

            return (
              <div
                key={member.arenaUserId}
                className="grid grid-cols-[2.5rem_1fr_5rem_6rem_6rem] gap-3 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* Index */}
                <span className="font-display text-[10px] font-black text-white/20">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Fighter */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <ArenaAvatar
                      src={dicebearUrl(member.username)}
                      size="sm"
                      className={cn(!isOnline && !isRecent && "grayscale opacity-40")}
                    />
                    {(isOnline || isRecent) && (
                      <span className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black",
                        isOnline ? "bg-green-400" : "bg-yellow-500"
                      )} style={isOnline ? { boxShadow: "0 0 4px rgba(74,222,128,.6)" } : undefined} />
                    )}
                  </div>
                  <p className={cn("font-display text-[11px] font-black uppercase tracking-wide truncate", isOnline ? "text-white" : "text-white/50")}>
                    {member.username}
                  </p>
                </div>

                {/* Role */}
                <span className={cn(
                  "font-display text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border w-fit",
                  member.role === "instructor" || member.role === "admin"
                    ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                    : "bg-white/[0.03] border-white/[0.06] text-white/30"
                )}>
                  {member.role}
                </span>

                {/* Joined */}
                <span className="font-display text-[9px] font-bold text-white/25">
                  {new Date(member.joinedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    isOnline ? "bg-green-400" : isRecent ? "bg-yellow-500" : "bg-white/15"
                  )} style={isOnline ? { boxShadow: "0 0 4px rgba(74,222,128,.6)", animation: "pulse 1.5s ease-in-out infinite" } : undefined} />
                  <span className={cn(
                    "font-display text-[8px] font-black uppercase tracking-wider",
                    isOnline ? "text-green-400" : isRecent ? "text-yellow-500" : "text-white/20"
                  )}>
                    {isOnline ? "Online" : isRecent ? "Recent" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
