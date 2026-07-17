"use client";
import React from "react";
import { School, BookOpen, HelpCircle, Plus, ChevronRight, Activity, Database, Shield } from "lucide-react";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";

interface OverviewModuleProps {
  onNavigate: (tab: "schools" | "courses" | "instructors" | "questions") => void;
  stats?: { schoolCount: number; courseCount: number; userCount: number; questionCount: number };
}

export default function OverviewModule({ onNavigate, stats }: OverviewModuleProps) {
  return (
    <div className="p-6 md:p-10 w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-primary" />
            <span className="text-[10px] font-mono text-primary tracking-[0.4em] uppercase">Sector_Alpha_Active</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter">
            Operations_Center
          </h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-2 opacity-60">
            System-wide deployment and neural-link scaling protocols.
          </p>
        </div>

        <div className="flex gap-4">
          <NeonButton onClick={() => onNavigate("schools")} size="lg" variant="secondary" className="px-8 font-mono tracking-widest text-[11px]">
            <Plus size={18} className="mr-2" /> NEW_INSTITUTION
          </NeonButton>
          <NeonButton onClick={() => onNavigate("courses")} size="lg" className="px-8 font-mono tracking-widest text-[11px]">
            <Plus size={18} className="mr-2" /> CREATE_SECTOR
          </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono font-bold text-primary tracking-widest uppercase">Active_Directives</span>
              <div className="h-px w-24 bg-primary/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: School, label: "Institutional Hubs", desc: "Global school registry & domain authentication", count: `${stats?.schoolCount ?? 0} Sites`, status: "STABLE", tab: "schools" as const },
              { icon: BookOpen, label: "Combat Sectors", desc: "Active course curriculum & battle logic", count: `${stats?.courseCount ?? 0} Sectors`, status: "ENGAGED", tab: "courses" as const },
              { icon: HelpCircle, label: "Knowledge Assets", desc: "Question bank & neural assessment patterns", count: `${stats?.questionCount ?? 0} Items`, status: "READY", tab: "questions" as const },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate(item.tab)}
                className="group flex items-center justify-between p-6 bg-arena-card/30 border border-white/5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary/20 transition-all group-hover:scale-110">
                    <item.icon size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display font-bold text-white text-xl uppercase tracking-tight group-hover:text-glow-primary transition-all">
                        {item.label}
                      </h3>
                      <span className="text-[8px] font-mono text-success border border-success/30 px-1 rounded">{item.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono tracking-tight uppercase opacity-60 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-10 relative z-10">
                  <div className="hidden xl:flex flex-col items-end">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase">Population</span>
                    <span className="text-lg font-display font-bold text-white">{item.count}</span>
                  </div>
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                    <ChevronRight size={24} className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="bg-arena-card border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <Activity size={16} className="text-primary" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-[0.2em]">Live_Integrity</h3>
              </div>

              <div className="space-y-8">
                <HealthBar label="Database_Relay" value={42} />
                <HealthBar label="Active_Uplinks" value={78} />
                <HealthBar label="Neural_Load" value={24} />
                <HealthBar label="Memory_Cache" value={91} />
              </div>

              <div className="mt-12 p-5 bg-white/5 border border-white/5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Shield size={14} />
                  <span className="text-[10px] font-mono uppercase font-bold">Security_Scan</span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed uppercase">
                  All systems operational. No unauthorized breaches detected in Sector_Alpha.
                </p>
              </div>
            </div>
            <Database size={120} className="absolute -bottom-10 -right-10 opacity-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[9px] font-mono uppercase">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all duration-1000 ease-out" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}