"use client";
import React, { useState } from "react";
import { UserPlus, School, Loader2, ShieldCheck, Mail, Lock, User } from "lucide-react";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { useHubs } from "@verse/arena-web/hooks/useHubs";
import { useInstructors } from "@verse/arena-web/hooks/useInstructors";

export default function InstructorsModule() {
    const { hubs } = useHubs();
    const [schoolId, setSchoolId] = useState("");
    const { instructors, isLoading, createInstructor, isCreating, error } = useInstructors(schoolId || undefined);

    const [form, setForm] = useState({ username: "", password: "", email: "" });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.username || !form.password || !schoolId) return;
        try {
            await createInstructor({ ...form, schoolId });
            setForm({ username: "", password: "", email: "" });
        } catch (err) {
            console.error("Instructor deployment failed", err);
        }
    }

    return (
        <div className="p-6 md:p-10 w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border-b border-white/5 pb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-8 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                    <span className="text-[10px] font-mono text-primary tracking-[0.4em] uppercase">Command_Deployment</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter">
                    Instructors
                </h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1">
                    <div className="bg-arena-card/30 border border-white/5 rounded-2xl p-6 space-y-5 sticky top-6">
                        <div className="flex items-center gap-2">
                            <UserPlus size={16} className="text-primary" />
                            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Deploy Instructor</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-mono font-bold text-primary/70 uppercase tracking-widest">Assign Hub</label>
                                <div className="relative">
                                    <School className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                    <select
                                        required
                                        value={schoolId}
                                        onChange={(e) => setSchoolId(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white outline-none appearance-none"
                                    >
                                        <option value="" className="bg-black">SELECT_HUB</option>
                                        {hubs.map((h: any) => (
                                            <option key={h.id} value={h.id} className="bg-black">{h.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-mono font-bold text-primary/70 uppercase tracking-widest">Codename</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                    <input
                                        required
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        placeholder="e.g. prof_martinez"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-mono font-bold text-primary/70 uppercase tracking-widest">Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                    <input
                                        required
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder="Temporary password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-mono font-bold text-primary/70 uppercase tracking-widest">Contact (optional)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="instructor@school.edu"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-[10px] font-mono text-destructive uppercase tracking-wide">
                                    {error?.response?.data?.message || "Deployment failed."}
                                </p>
                            )}

                            <NeonButton type="submit" className="w-full py-6" disabled={isCreating}>
                                {isCreating ? <Loader2 className="animate-spin" /> : "DEPLOY_INSTRUCTOR"}
                            </NeonButton>
                        </form>
                    </div>
                </div>

                <div className="xl:col-span-2 space-y-3">
                    <div className="flex items-center gap-2 px-1 mb-4">
                        <ShieldCheck size={14} className="text-primary" />
                        <span className="text-[11px] font-mono font-bold text-primary tracking-widest uppercase">
                            {schoolId ? "Active Instructors" : "All Instructors"}
                        </span>
                    </div>

                    {isLoading && (
                        <div className="space-y-3">
                            {[1, 2].map((i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
                        </div>
                    )}

                    {!isLoading && instructors.length === 0 && (
                        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
                            <p className="text-xs font-mono text-muted-foreground uppercase">No instructors deployed yet</p>
                        </div>
                    )}

                    {instructors.map((i: any) => (
                        <div key={i.id} className="flex items-center justify-between p-4 bg-arena-card/30 border border-white/5 rounded-xl hover:border-primary/40 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                                    <ShieldCheck size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="font-display font-bold text-white uppercase text-sm">{i.user?.username}</p>
                                    <p className="text-[9px] font-mono text-muted-foreground uppercase">{i.school?.name}</p>
                                </div>
                            </div>
                            <span className="text-[8px] font-mono text-success border border-success/30 px-2 py-1 rounded uppercase">
                                Instructor
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}