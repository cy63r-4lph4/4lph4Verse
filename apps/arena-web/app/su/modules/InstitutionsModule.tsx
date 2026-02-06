"use client";
import React, { useState } from "react";
import { 
  School, 
  Search, 
  Plus, 
  MoreVertical, 
  Users, 
  BookOpen, 
  Pencil, 
  Trash2, 
  Globe, 
  LayoutGrid, 
  List,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { cn } from "@verse/ui";

// Mock Data
const mockHubs = [
  { id: "1", name: "Stanford University", code: "STAN", fighters: 450, sectors: 12, status: "Active" },
  { id: "2", name: "MIT", code: "MIT", fighters: 380, sectors: 10, status: "Active" },
  { id: "3", name: "Harvard University", code: "HARV", fighters: 520, sectors: 15, status: "Maintenance" },
];

export default function InstitutionsModule() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 md:p-10 w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. HUB HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
            <span className="text-[10px] font-mono text-primary tracking-[0.4em] uppercase">Global_Registry_Online</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter">
            Institutional_Hubs
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search Hub Signatures..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white focus:border-primary/50 outline-none w-64 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="h-10 w-px bg-white/10 mx-2 hidden md:block" />
          
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-md transition-all", viewMode === 'grid' ? 'bg-white/10 text-primary' : 'text-muted-foreground')}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-md transition-all", viewMode === 'list' ? 'bg-white/10 text-primary' : 'text-muted-foreground')}
            >
              <List size={16} />
            </button>
          </div>

          <NeonButton size="lg" className="bg-primary hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
            <Plus size={18} className="mr-2" /> REGISTER_HUB
          </NeonButton>
        </div>
      </div>

      {/* 2. HUB GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockHubs.map((hub) => (
          <HubCard key={hub.id} hub={hub} />
        ))}
      </div>
    </div>
  );
}

function HubCard({ hub }: { hub: any }) {
  const isActive = hub.status === "Active";

  return (
    <div className="group relative bg-arena-card/30 border border-white/5 rounded-2xl p-6 hover:border-primary/40 transition-all hover:bg-primary/[0.02]">
      {/* Visual Accent */}
      <div className="absolute top-0 right-10 h-px w-20 bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
          <Globe size={20} className="text-muted-foreground group-hover:text-primary" />
        </div>
        <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-mono uppercase tracking-wider",
              isActive ? "text-success border-success/30" : "text-warning border-warning/30"
            )}>
              {isActive ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
              {hub.status}
            </div>
            <button className="text-muted-foreground hover:text-white transition-colors"><MoreVertical size={16}/></button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-display font-bold text-white uppercase group-hover:text-glow-primary transition-all">
          {hub.name}
        </h3>
        <p className="text-[10px] font-mono text-primary/60 mt-1 uppercase tracking-widest">
          Signature: #{hub.code} // ID: {hub.id.padStart(3, '0')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users size={12} />
            <span className="text-[8px] font-mono uppercase">Population</span>
          </div>
          <span className="text-sm font-display font-bold text-white tracking-wide">{hub.fighters}</span>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BookOpen size={12} />
            <span className="text-[8px] font-mono uppercase">Sectors</span>
          </div>
          <span className="text-sm font-display font-bold text-white tracking-wide">{hub.sectors}</span>
        </div>
      </div>

      {/* Action Overlay (Visible on Hover) */}
      <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
        <button className="flex-1 bg-primary text-black text-[10px] font-mono font-bold py-2 rounded-lg uppercase transition-all flex items-center justify-center gap-2 hover:bg-white">
          Enter_Registry <ArrowUpRight size={14} />
        </button>
        <button className="px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/5">
          <Pencil size={14} />
        </button>
        <button className="px-3 bg-white/5 hover:bg-destructive/10 text-destructive rounded-lg transition-all border border-white/5">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}