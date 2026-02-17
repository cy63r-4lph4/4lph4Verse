"use client";
import React, { useState, useMemo, useEffect } from "react";
import { 
  BookOpen, Search, Plus, X, Zap, Pencil, School, 
  LayoutGrid, List, ChevronDown, ShieldAlert, Trash2, Loader2, Info, 
  Users
} from "lucide-react";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { cn } from "@verse/ui";
import { useHubs } from "@verse/arena-web/hooks/useHubs";
import { useSectors } from "@verse/arena-web/hooks/useSectors";

export default function CoursesModule() {
  const { hubs } = useHubs();
  const [selectedHubId, setSelectedHubId] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", code: "" });
  
  // Prevent hydration mismatch for viewMode or random states
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { sectors, isLoading, createSector, isCreating, deleteSector, isDeleting } = useSectors(selectedHubId);

  const activeHub = hubs.find(h => h.id === selectedHubId);

  const filteredSectors = useMemo(() => {
    return sectors.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sectors, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;
    try {
      await createSector(formData);
      setFormData({ name: "", code: "" });
      setIsFormOpen(false);
    } catch (err) { console.error("Initialization Failed", err); }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-full">
      <div className={cn(
        "p-6 md:p-10 w-full space-y-10 transition-all duration-500",
        isFormOpen ? "blur-xl opacity-50 scale-[0.98]" : "blur-0 opacity-100"
      )}>
        
        {/* SECTOR HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("h-1 w-8 transition-all duration-500", selectedHubId ? "bg-arena-success shadow-[0_0_10px_rgba(var(--success-rgb),0.5)]" : "bg-white/20")} />
              <span className="text-[10px] font-mono text-arena-success tracking-[0.4em] uppercase font-bold">
                {selectedHubId ? `Sectors_Deployed // ${activeHub?.slug || 'ARCHIVIST'}` : "Awaiting_Hub_Selection"}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter">
              Battle_Sectors
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 mr-2">
              <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-md transition-all", viewMode === 'grid' ? 'bg-white/10 text-arena-success' : 'text-muted-foreground')}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-md transition-all", viewMode === 'list' ? 'bg-white/10 text-arena-success' : 'text-muted-foreground')}>
                <List size={16} />
              </button>
            </div>

            <div className="relative group">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-arena-success pointer-events-none" size={14} />
              <select 
                value={selectedHubId}
                onChange={(e) => setSelectedHubId(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-[11px] font-mono text-white focus:border-arena-success/50 outline-none w-64 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-black text-white/40">SELECT_HUB</option>
                {hubs.map(hub => <option key={hub.id} value={hub.id} className="bg-black">{hub.name.toUpperCase()}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            </div>
            
            {selectedHubId && (
              <NeonButton variant="success" size="lg" onClick={() => setIsFormOpen(true)}>
                <Plus size={18} className="mr-2" /> INITIALIZE_SECTOR
              </NeonButton>
            )}
          </div>
        </div>

        {/* CONTENT AREA */}
        {!selectedHubId ? (
          <EmptyHubState />
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
              <input 
                type="text" 
                placeholder="Filter active signatures..."
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white focus:border-arena-success/50 outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={cn(
              viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex flex-col gap-4"
            )}>
              {filteredSectors.map((sector) => (
                <SectorCard 
                  key={sector.id} 
                  sector={sector} 
                  hubName={activeHub?.name || ""} 
                  onDelete={deleteSector}
                  isDeleting={isDeleting}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DRAWER REMAINS THE SAME... */}
      {isFormOpen && (
        <div className="fixed inset-0 z-100 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-arena-card border-l border-arena-success/20 p-10 flex flex-col shadow-2xl animate-in slide-in-from-right">
             {/* ... (Existing Form Code) */}
             <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-display font-black text-white uppercase italic">Init_Sector</h2>
                <button onClick={() => setIsFormOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-8 flex-1">
               <div className="space-y-2">
                 <label className="text-[10px] font-mono font-bold text-arena-success uppercase tracking-widest">Sector_Name</label>
                 <input autoFocus required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-display uppercase" placeholder="e.g. Data Structures" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-mono font-bold text-arena-success uppercase tracking-widest">Sector_Code</label>
                 <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-mono" placeholder="e.g. CS101" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} />
               </div>
               <div className="flex gap-4 p-4 bg-arena-success/5 border border-arena-success/20 rounded-xl">
                 <Info size={16} className="text-arena-success shrink-0" />
                 <p className="text-[9px] font-mono text-arena-success/80 leading-relaxed uppercase">Initialization grants full fighter deployment rights.</p>
               </div>
               <NeonButton type="submit" variant="success" className="w-full py-8 mt-auto" size="xl" disabled={isCreating}>
                 {isCreating ? <Loader2 className="animate-spin" /> : "DEPLOY_SECTOR"}
               </NeonButton>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SectorCard({ sector, hubName, onDelete, isDeleting, viewMode }: any) {
  const [localDeleting, setLocalDeleting] = useState(false);
  const handleDelete = async () => {
    setLocalDeleting(true);
    await onDelete(sector.id);
    setLocalDeleting(false);
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-arena-success/40 transition-all group">
        <div className="flex items-center gap-4">
          <BookOpen size={18} className="text-arena-success" />
          <span className="font-display font-bold text-white uppercase">{sector.name}</span>
          <span className="text-[10px] font-mono text-white/40">#{sector.code}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-arena-success" style={{ width: '85%' }} />
          </div>
          <button onClick={handleDelete} className="text-white/20 hover:text-destructive"><Trash2 size={16} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-arena-card/30 border border-white/5 rounded-2xl p-6 hover:border-arena-success/40 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-arena-success/20 transition-all">
          <BookOpen size={20} className="text-muted-foreground group-hover:text-arena-success" />
        </div>
        <div className="flex gap-2">
           <button className="p-2 text-white/20 hover:text-white transition-colors"><Pencil size={14} /></button>
           <button onClick={handleDelete} disabled={isDeleting} className="p-2 text-white/20 hover:text-destructive">
             {localDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
           </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-display font-bold text-white uppercase group-hover:text-glow-success">{sector.name}</h3>
        <p className="text-[10px] font-mono text-arena-success/60 mt-1 uppercase">Code: #{sector.code} // Hub: {hubName}</p>
      </div>

      {/* Tactical Integrity Bar */}
      <div className="space-y-1 mb-6">
         <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
           <span>Sector_Integrity</span>
           <span>85%</span>
         </div>
         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
           <div className="h-full bg-arena-success shadow-[0_0_10px_rgba(var(--success-rgb),0.5)]" style={{ width: '85%' }} />
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatBox label="Fighters" value={sector.fighterCount || 0} icon={<Users size={12} />} />
        <StatBox label="Intel_Assets" value={sector.intelAssets || 0} icon={<Zap size={12} />} />
      </div>
    </div>
  );
}

const EmptyHubState = () => (
  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01] py-20">
    <ShieldAlert size={48} className="text-white/10 mb-4" />
    <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest">Neural_Link_Offline</h2>
    <p className="text-muted-foreground font-mono text-[10px] uppercase opacity-60">Select a hub to scan battle sectors.</p>
  </div>
);

const StatBox = ({ label, value, icon }: any) => (
  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
    <div className="flex items-center gap-2 mb-1 opacity-40">
      {icon}
      <span className="text-[8px] font-mono uppercase text-muted-foreground">{label}</span>
    </div>
    <span className="text-sm font-display font-bold text-white tracking-wide">{value}</span>
  </div>
);