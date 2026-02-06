"use client";
import { useEffect, useState } from "react";
import {
    Shield, School, BookOpen, HelpCircle, LogOut, LayoutDashboard, Database, Activity
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
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const { user, isLoading, isAdmin, logout } = useAuth();
    const router = useRouter();

    // 1. Initial Protection Logic
    useEffect(() => {
        if (!isLoading && (!user || !isAdmin)) {
            router.push("/login");
        }
    }, [user, isLoading, isAdmin, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <Loader2 className="text-primary animate-spin" />
            </div>
        );
    }

    if (!isAdmin) return null;

    // 1. Module Selector Logic
    const renderActiveModule = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewModule />;
            case "schools":
                return <InstitutionsModule />;
            case "courses":
                return <CourseModule />;
            case "questions":
                return <QuestionsModule />;
            default:
                return <OverviewModule />;
        }
    };

    return (
        <EnergyBackground className="h-screen w-full overflow-hidden" variant="intense">
            <div className="flex h-full w-full">

                {/* --- 1. ARCHITECT SIDEBAR --- */}
                <aside className="hidden lg:flex w-72 border-r border-white/10 bg-black/40 backdrop-blur-xl flex-col shrink-0 z-50">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-10 group cursor-default">
                            <div className="p-2 bg-primary/20 border border-primary/40 rounded-lg group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] transition-all">
                                <Shield size={22} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-black tracking-widest text-white text-lg">ARENA_ROOT</span>
                                <span className="text-[9px] font-mono text-primary/60 tracking-tighter uppercase">Authority Level: Prime</span>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <AdminNavLink
                                icon={<LayoutDashboard size={18} />}
                                label="System Overview"
                                active={activeTab === "overview"}
                                onClick={() => setActiveTab("overview")}
                            />
                            <AdminNavLink
                                icon={<School size={18} />}
                                label="Institutions"
                                active={activeTab === "schools"}
                                onClick={() => setActiveTab("schools")}
                            />
                            <AdminNavLink
                                icon={<BookOpen size={18} />}
                                label="Battle Sectors"
                                active={activeTab === "courses"}
                                onClick={() => setActiveTab("courses")}
                            />
                            <AdminNavLink
                                icon={<HelpCircle size={18} />}
                                label="Knowledge Base"
                                active={activeTab === "questions"}
                                onClick={() => setActiveTab("questions")}
                            />
                        </nav>
                    </div>

                    <div className="mt-auto p-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-mono text-muted-foreground uppercase">Server_Status</span>
                                <span className="text-[10px] font-mono text-success uppercase">Optimal</span>
                            </div>
                            <Activity size={14} className="text-success animate-pulse" />
                        </div>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-mono text-[11px] uppercase tracking-wider">
                            <LogOut size={16} />
                            Terminate Session
                        </button>
                    </div>
                </aside>

                {/* --- 2. COMMAND VIEWPORT --- */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black/20">

                    {/* Top HUD Display (Shared across all modules) */}
                    <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0 z-40">
                        <div className="flex items-center gap-4">
                            <Database size={16} className="text-primary/60" />
                            <div className="h-4 w-px bg-white/10" />
                            <h2 className="text-[11px] font-mono font-bold text-white uppercase tracking-[0.4em]">
                                {activeTab}_Module // Root_Console
                            </h2>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-6 pr-6 border-r border-white/10">
                                <StatMinimal label="Schools" value="12" />
                                <StatMinimal label="Fighters" value="3,420" />
                                <StatMinimal label="Uptime" value="99.9%" />
                            </div>
                            <div className="h-10 w-10 rounded-full border border-primary/30 p-0.5 relative">
                                <div className="h-full w-full rounded-full bg-primary/20 animate-pulse" />
                            </div>
                        </div>
                    </header>

                    {/* --- 3. DYNAMIC MODULE SURFACE --- */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
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
            "w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all font-mono text-[11px] uppercase tracking-widest group",
            active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-white"
        )}>
            <span className={cn(active ? "text-primary" : "group-hover:text-primary transition-colors")}>{icon}</span>
            {label}
        </button>
    );
}

function StatMinimal({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>
            <span className="text-sm font-display font-black text-white">{value}</span>
        </div>
    );
}