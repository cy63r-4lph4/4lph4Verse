"use client";
import React, { useState, useMemo } from "react";
import { 
  Plus, X, Globe, Trash2, LayoutGrid, List, CheckCircle2, 
  AlertTriangle, BookOpen, Users, Loader2, Search, Info
} from "lucide-react";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { cn } from "@verse/ui";
import { useHubs } from "@verse/arena-web/hooks/useHubs";

export default function InstitutionsModule() {
  const { hubs, isLoading, createHub, isCreating, deleteHub, isDeleting } = useHubs();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", slug: "" });

  // Filter hubs based on search query
  const filteredHubs = useMemo(() => {
    return hubs.filter(hub => 
      hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [hubs, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;
    try {
      await createHub(formData); 
      setFormData({ name: "", slug: "" });
      setIsFormOpen(false);
    } catch (err) {
      console.error("Uplink Failed:", err);
    }
  };

  return (
    <div className="relative min-h-full">
      <div className={cn(
        "p-6 md:p-10 w-full space-y-10 transition-all duration-700",
        isFormOpen ? "blur-xl scale-[0.98] pointer-events-none opacity-50" : "blur-0 scale-100 opacity-100"
      )}>
        
        {/* HEADER SECTION */}
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
            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search Signatures..."
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white focus:border-primary/50 outline-none w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-md transition-all", viewMode === 'grid' ? 'bg-white/10 text-primary' : 'text-muted-foreground')}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-md transition-all", viewMode === 'list' ? 'bg-white/10 text-primary' : 'text-muted-foreground')}>
                <List size={16} />
              </button>
            </div>

            <NeonButton size="lg" onClick={() => setIsFormOpen(true)}>
              <Plus size={18} className="mr-2" /> REGISTER_HUB
            </NeonButton>
          </div>
        </div>

        {/* LOADING & EMPTY STATES */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <HubSkeleton key={i} />)}
          </div>
        ) : filteredHubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
             <div className="p-4 rounded-full bg-white/5 text-white/20"><Search size={40} /></div>
             <p className="font-mono text-xs text-white/40 uppercase tracking-widest">No matching signatures found in registry</p>
          </div>
        ) : (
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex flex-col gap-4"
          )}>
            {filteredHubs.map((hub) => (
              <HubCard 
                key={hub.id} 
                hub={hub} 
                onDelete={deleteHub} 
                isDeleting={isDeleting}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* TACTICAL FORM DRAWER */}
      {isFormOpen && (
        <div className="fixed inset-0 z-100 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="w-full max-w-md bg-arena-card border-l border-white/10 p-10 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-2xl font-display font-black text-white uppercase italic">Register_Hub</h2>
                <div className="h-1 w-12 bg-primary mt-1 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Institution_Identity</label>
                <input 
                  autoFocus
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-primary focus:bg-primary/5 outline-none transition-all font-display uppercase tracking-wider"
                  placeholder="e.g. Stanford University"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Combat_Code</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-mono focus:border-primary outline-none transition-all"
                  placeholder="e.g. STAN"
                  maxLength={5}
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toUpperCase()})}
                />
              </div>

              <div className="flex gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <Info size={16} className="text-primary shrink-0" />
                <p className="text-[9px] font-mono text-primary/80 leading-relaxed uppercase">
                  By initializing this hub, you allocate server-side resources and create a unique battle signature for all associated fighters.
                </p>
              </div>

              <NeonButton 
                type="submit" 
                className="w-full py-8 mt-auto" 
                size="xl" 
                disabled={isCreating}
              >
                {isCreating ? <Loader2 className="animate-spin mr-2" /> : "INITIALIZE_PROTOCOL"}
              </NeonButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// SUB-COMPONENTS
function HubCard({ hub, onDelete, isDeleting, viewMode }: any) {
  const [localDeleting, setLocalDeleting] = useState(false);

  const handleDelete = async () => {
    setLocalDeleting(true);
    await onDelete(hub.id);
    setLocalDeleting(false);
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-4 bg-arena-card/30 border border-white/5 rounded-xl hover:border-primary/40 transition-all">
        <div className="flex items-center gap-4">
           <Globe size={18} className="text-primary" />
           <span className="font-display font-bold text-white uppercase">{hub.name}</span>
           <span className="font-mono text-[10px] text-primary/40 tracking-widest">#{hub.code}</span>
        </div>
        <div className="flex items-center gap-8">
           <div className="flex gap-4 text-[10px] font-mono text-white/60">
             <span>FIGHTERS: {hub.fighters || 0}</span>
             <span>SECTORS: {hub.sectors || 0}</span>
           </div>
           <button onClick={handleDelete} disabled={isDeleting} className="text-white/20 hover:text-destructive transition-colors">
              {localDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-arena-card/30 border border-white/5 rounded-2xl p-6 hover:border-primary/40 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-primary/20 transition-all">
          <Globe size={20} className="text-muted-foreground group-hover:text-primary" />
        </div>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 hover:bg-destructive/10 rounded-lg text-white/20 hover:text-destructive transition-all"
        >
          {localDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>
      
      <h3 className="text-xl font-display font-black text-white uppercase mb-1">{hub.name}</h3>
      <p className="text-[10px] font-mono text-primary/60 uppercase mb-6 tracking-widest">Signature: #{hub.code}</p>

      <div className="grid grid-cols-2 gap-4">
        <StatBox icon={<Users size={12}/>} label="Fighters" value={hub.fighters || 0} />
        <StatBox icon={<BookOpen size={12}/>} label="Sectors" value={hub.sectors || 0} />
      </div>
    </div>
  );
}

const HubSkeleton = () => (
  <div className="h-[200px] bg-white/5 border border-white/5 rounded-2xl animate-pulse flex flex-col p-6 space-y-4">
    <div className="w-12 h-12 bg-white/10 rounded-xl" />
    <div className="w-3/4 h-6 bg-white/10 rounded" />
    <div className="w-1/2 h-3 bg-white/10 rounded" />
    <div className="flex gap-4 mt-auto">
      <div className="flex-1 h-12 bg-white/10 rounded-lg" />
      <div className="flex-1 h-12 bg-white/10 rounded-lg" />
    </div>
  </div>
);

const StatBox = ({ icon, label, value }: any) => (
  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
    <div className="flex items-center gap-2 text-muted-foreground mb-1">
      {icon} <span className="text-[8px] font-mono uppercase">{label}</span>
    </div>
    <span className="text-sm font-display font-bold text-white tracking-wide">{value}</span>
  </div>
);