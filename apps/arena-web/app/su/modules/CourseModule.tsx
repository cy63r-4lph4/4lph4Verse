"use client";
import { useState } from "react";
import { 
  BookOpen, 
  Search, 
  Plus, 
  MoreVertical, 
  Users, 
  Zap, 
  Pencil, 
  School, 
  LayoutGrid, 
  List,
  ChevronDown,
  ShieldAlert,
  Trash2
} from "lucide-react";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { cn } from "@verse/ui";

// Mock Data for Institutions
const mockHubs = [
  { id: "1", name: "Stanford University", code: "STAN" },
  { id: "2", name: "MIT", code: "MIT" },
  { id: "3", name: "Harvard University", code: "HARV" },
];

export default function CoursesModule() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedHubId, setSelectedHubId] = useState<string>("");

  const activeHub = mockHubs.find(h => h.id === selectedHubId);

  return (
    <div className="p-6 md:p-10 w-full min-h-[calc(100vh-80px)] space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col">
      
      {/* SECTOR HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("h-1 w-8 transition-all duration-500", selectedHubId ? "bg-arena-success shadow-[0_0_10px_rgba(var(--success-rgb),0.5)]" : "bg-white/20")} />
            <span className="text-[10px] font-mono text-arena-success tracking-[0.4em] uppercase">
              {selectedHubId ? `Sectors_Deployed // ${activeHub?.code}` : "Awaiting_Hub_Selection"}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter">
            Battle_Sectors
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* INSTITUTION SELECTOR */}
          <div className="relative group">
            <School className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-arena-success transition-colors pointer-events-none" size={14} />
            <select 
              value={selectedHubId}
              onChange={(e) => setSelectedHubId(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-[11px] font-mono text-white focus:border-arena-success/50 outline-none w-64 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0a0a0a]">SELECT_INSTITUTION</option>
              {mockHubs.map(hub => (
                <option key={hub.id} value={hub.id} className="bg-[#0a0a0a]">
                  {hub.name.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
          </div>
          
          {selectedHubId && (
            <>
              <div className="h-10 w-px bg-white/10 mx-2 hidden md:block" />
              
              <div className="hidden md:flex bg-white/5 p-1 rounded-lg border border-white/10">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={cn("p-2 rounded-md transition-all", viewMode === 'grid' ? 'bg-white/10 text-arena-success' : 'text-muted-foreground')}
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={cn("p-2 rounded-md transition-all", viewMode === 'list' ? 'bg-white/10 text-arena-success' : 'text-muted-foreground')}
                >
                  <List size={16} />
                </button>
              </div>

              <NeonButton size="lg" className="bg-arena-success hover:shadow-[0_0_20px_rgba(var(--success-rgb),0.4)]">
                <Plus size={18} className="mr-2" /> INITIALIZE_SECTOR
              </NeonButton>
            </>
          )}
        </div>
      </div>

      {/* CONTENT LOGIC */}
      {!selectedHubId ? (
        /* EMPTY STATE: NO INSTITUTION SELECTED */
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in-95 duration-1000">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-arena-success/10 blur-3xl rounded-full animate-pulse" />
            <div className="relative p-8 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl">
              <ShieldAlert size={48} className="text-white/20" />
            </div>
          </div>
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest mb-2">Neural_Link_Offline</h2>
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em] max-w-xs text-center leading-relaxed opacity-60">
            Select an institutional hub from the command console to scan for active battle sectors.
          </p>
        </div>
      ) : (
        /* SECTOR LISTING */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter active signatures..."
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white focus:border-arena-success/50 outline-none w-full max-w-md transition-all"
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SectorCard key={i} hubName={activeHub?.name || "Unknown"} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectorCard({ hubName }: { hubName: string }) {
  return (
    <div className="group relative bg-arena-card/30 border border-white/5 rounded-2xl p-6 hover:border-arena-success/40 transition-all hover:bg-arena-success/[0.02]">
      <div className="absolute top-0 right-10 h-px w-20 bg-gradient-to-r from-transparent via-arena-success/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-arena-success/20 group-hover:border-arena-success/30 transition-all">
          <BookOpen size={20} className="text-muted-foreground group-hover:text-arena-success" />
        </div>
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-arena-success border border-arena-success/30 px-2 py-0.5 rounded uppercase">Active</span>
            <button className="text-muted-foreground hover:text-white transition-colors"><MoreVertical size={16}/></button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-display font-bold text-white uppercase group-hover:text-glow-success transition-all">Data_Structures</h3>
        <p className="text-[10px] font-mono text-arena-success/60 mt-1 uppercase tracking-widest leading-none">Code: #CS101 // Hub: {hubName}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[9px] font-mono uppercase">
            <span className="text-muted-foreground">Sector_Integrity</span>
            <span className="text-arena-success">88%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-arena-success shadow-[0_0_8px_rgba(var(--success-rgb),0.5)] w-[88%]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users size={12} />
              <span className="text-[8px] font-mono uppercase">Fighters</span>
            </div>
            <span className="text-sm font-display font-bold text-white tracking-wide">420</span>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Zap size={12} />
              <span className="text-[8px] font-mono uppercase">Intel_Assets</span>
            </div>
            <span className="text-sm font-display font-bold text-white tracking-wide">156</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="flex-1 bg-white/5 hover:bg-white/10 text-[10px] font-mono py-2 rounded-lg text-white uppercase transition-all">Manage_Sector</button>
        <button className="px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"><Pencil size={14} /></button>
        <button className="px-3 bg-white/5 hover:bg-destructive/10 text-destructive rounded-lg transition-all hover:border hover:border-destructive/20"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}