"use client";
import { useEffect, useState } from "react";
import {
    Shield, School, BookOpen, HelpCircle, LogOut, LayoutDashboard, Database, Activity, Loader2
} from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";

// --- MODULE IMPORTS ---
import OverviewModule from "./modules/OverviewModule";
import InstitutionsModule from "./modules/InstitutionsModule";
import CourseModule from "./modules/CourseModule";
import QuestionsModule from "./modules/QuestionaModule";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [mounted, setMounted] = useState(false);
    const { user, isLoading, isAdmin, logout } = useAuth();
    const router = useRouter();

    // 1. HYDRATION GUARD: Ensures server/client match on first pass
    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. AUTH PROTECTION: Redirect non-admins
    useEffect(() => {
        if (mounted && !isLoading && (!user || !isAdmin)) {
            router.push("/login");
        }
    }, [user, isLoading, isAdmin, router, mounted]);

    // 3. RENDER LOGIC
    if (!mounted || isLoading) {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
                    <Loader2 className="text-primary animate-spin relative z-10" size={32} />
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    const renderActiveModule = () => {
        switch (activeTab) {
            case "overview": return <OverviewModule />;
            case "schools": return <InstitutionsModule />;
            case "courses": return <CourseModule />;
            case "questions": return <QuestionsModule />;
            default: return <OverviewModule />;
        }
    };

    return (
        <EnergyBackground className="h-screen w-full overflow-hidden" variant="intense">
            <div className="flex h-full w-full animate-in fade-in duration-1000">

                {/* --- 1. ARCHITECT SIDEBAR --- */}
                <aside className="hidden lg:flex w-72 border-r border-white/10 bg-black/60 backdrop-blur-xl flex-col shrink-0 z-50">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-10 group cursor-default">
                            <div className="p-2 bg-primary/20 border border-primary/40 rounded-lg group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all duration-500">
                                <Shield size={22} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-black tracking-widest text-white text-lg leading-none">ARENA_ROOT</span>
                                <span className="text-[9px] font-mono text-primary/60 tracking-tighter uppercase mt-1">Authority Level: Prime</span>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <AdminNavLink icon={<LayoutDashboard size={18} />} label="System Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                            <AdminNavLink icon={<School size={18} />} label="Institutions" active={activeTab === "schools"} onClick={() => setActiveTab("schools")} />
                            <AdminNavLink icon={<BookOpen size={18} />} label="Battle Sectors" active={activeTab === "courses"} onClick={() => setActiveTab("courses")} />
                            <AdminNavLink icon={<HelpCircle size={18} />} label="Knowledge Base" active={activeTab === "questions"} onClick={() => setActiveTab("questions")} />
                        </nav>
                    </div>

                    <div className="mt-auto p-8 border-t border-white/5 space-y-6">
                        <div className="flex items-center justify-between px-2 bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <Activity size={10} className="text-success animate-pulse" />
                                    <span className="text-[8px] font-mono text-muted-foreground uppercase">Server_Link</span>
                                </div>
                                <span className="text-[10px] font-mono text-success uppercase font-bold">Optimal_Flow</span>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_#22c55e]" />
                        </div>
                        
                        <button 
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-mono text-[11px] uppercase tracking-wider border border-transparent hover:border-destructive/20"
                        >
                            <LogOut size={16} />
                            Terminate_Session
                        </button>
                    </div>
                </aside>

                {/* --- 2. COMMAND VIEWPORT --- */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black/40 backdrop-blur-sm">

                    {/* Top HUD Display */}
                    <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/20 shrink-0 z-40">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Database size={16} className="text-primary/60" />
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="flex flex-col">
                                <h2 className="text-[11px] font-mono font-bold text-white uppercase tracking-[0.4em]">
                                    {activeTab}_Module
                                </h2>
                                <span className="text-[8px] font-mono text-primary/40 uppercase tracking-widest">Active_Session // {user?.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden xl:flex items-center gap-8 pr-8 border-r border-white/10">
                                <StatMinimal label="Schools" value="12" />
                                <StatMinimal label="Fighters" value="3,420" />
                                <StatMinimal label="Neural_Load" value="24%" />
                            </div>
                            <div className="flex items-center gap-3 pl-2">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-mono text-white leading-none uppercase font-bold">{user?.name || "Architect"}</p>
                                    <p className="text-[8px] font-mono text-primary/60 uppercase tracking-tighter">Verified_SU</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl border border-primary/30 p-1 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                                    <div className="h-full w-full bg-primary/20 animate-pulse rounded-sm" />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* --- 3. DYNAMIC MODULE SURFACE --- */}
                    <div className="flex-1 overflow-y-auto no-scrollbar relative">
                        {renderActiveModule()}
                    </div>
                </main>
            </div>
        </EnergyBackground>
    );
}

// --- SHARED UTILITIES ---
function AdminNavLink({ icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={cn(
            "w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all font-mono text-[11px] uppercase tracking-widest group border",
            active 
                ? "bg-primary/10 text-primary border-primary/20 shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.1)]" 
                : "text-muted-foreground border-transparent hover:bg-white/5 hover:text-white"
        )}>
            <span className={cn("transition-colors", active ? "text-primary" : "group-hover:text-primary")}>{icon}</span>
            {label}
        </button>
    );
}

function StatMinimal({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col items-end group cursor-default">
            <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{label}</span>
            <span className="text-sm font-display font-black text-white group-hover:text-glow-primary transition-all">{value}</span>
        </div>
    );
}