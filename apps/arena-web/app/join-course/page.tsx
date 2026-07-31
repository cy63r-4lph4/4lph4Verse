"use client";
import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { 
  Link2, Plus, ShieldCheck, Target, Lock, 
  AlertTriangle, Loader2, Search, Check, Swords, UserPlus, LogIn 
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { InputField } from "@verse/arena-web/components/ui/InputField";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import useJoinSector from "@verse/arena-web/hooks/useJoinSector";
import useFetch from "@verse/arena-web/hooks/useFetch";
import { api } from "@verse/arena-web/lib/api";
import { cn } from "@verse/ui";

interface ArenaCourse {
  id: string;
  title: string;
  accessKey: string;
  schoolId: string;
  code: string;
}

interface SectorInfo {
  id: string;
  title: string;
  code: string;
  accessKey: string;
  schoolId: string;
  schoolName: string | null;
}

function JoinCourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const urlAccessKey = searchParams.get("accessKey") || searchParams.get("key") || searchParams.get("code") || "";
  
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mode, setMode] = useState<"checking" | "direct-auth" | "radar">("checking");
  const [sectorInfo, setSectorInfo] = useState<SectorInfo | null>(null);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { join, isVerifying, errorMessage } = useJoinSector();
  
  // 1. Fetching available sectors for radar search
  const { data: availableSectors = [], isLoading: sectorsLoading } = useFetch<ArenaCourse[]>(
    "/v1/gateway/available-sectors",
    "available-sectors"
  );

  // 2. Direct link processing logic
  useEffect(() => {
    if (!urlAccessKey) {
      setMode("radar");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("arena_token") : null;

    if (token) {
      executeDirectJoin(urlAccessKey);
    } else {
      // Fetch course information publicly for display
      api.get(`/v1/gateway/sector-info/${urlAccessKey.toUpperCase()}`)
        .then((res) => {
          setSectorInfo(res.data);
          setMode("direct-auth");
        })
        .catch(() => {
          // Fall back to radar search if key is invalid
          setQuery(urlAccessKey.toUpperCase());
          setMode("radar");
        });
    }
  }, [urlAccessKey]);

  async function executeDirectJoin(keyToJoin: string) {
    setBusy(true);
    try {
      const res = await api.post("/v1/gateway/join-sector", { accessKey: keyToJoin.toUpperCase() });
      const targetCourseId = res.data?.courseId;
      if (targetCourseId) {
        router.replace(`/course/${targetCourseId}`);
      } else {
        router.replace("/lobby");
      }
    } catch (err: any) {
      // If already joined or joined successfully
      if (err?.response?.data?.courseId) {
        router.replace(`/course/${err.response.data.courseId}`);
      } else {
        router.replace("/lobby");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!sectorInfo) return;
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.post("/v1/gateway/register", {
        username: form.username,
        password: form.password,
        email: form.email || undefined,
        sector: sectorInfo.schoolId,
      });
      localStorage.setItem("arena_token", data.access_token);
      await executeDirectJoin(sectorInfo.accessKey);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Registration failed.");
      setBusy(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!sectorInfo) return;
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.post("/v1/gateway/login", {
        identity: form.username,
        password: form.password,
      });
      localStorage.setItem("arena_token", data.access_token);
      await executeDirectJoin(sectorInfo.accessKey);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed.");
      setBusy(false);
    }
  }

  // Click outside handler for radar search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic (Title or Key)
  const suggestedSectors = useMemo(() => {
    if (query.length < 2) return [];
    const term = query.toUpperCase();
    return availableSectors.filter(s =>
      s.accessKey.toUpperCase().includes(term) || 
      s.title.toUpperCase().includes(term) || 
      s.code.toUpperCase().includes(term)
    ).slice(0, 5);
  }, [query, availableSectors]);

  const handleJoinRadar = async (targetKey: string) => {
    if (!targetKey.trim()) return;
    try {
      await join(targetKey.trim().toUpperCase());
    } catch (e) {
      console.error("Uplink failed", e);
    }
  };

  const handleClipboardUplink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes("accessKey=") || text.includes("key=") || text.includes("code=")) {
        const key = new URL(text).searchParams.get("accessKey") || new URL(text).searchParams.get("key") || new URL(text).searchParams.get("code");
        if (key) setQuery(key.toUpperCase());
      } else if (text.length > 3 && text.length < 25) {
        setQuery(text.trim().toUpperCase());
      }
    } catch (err) {
      console.error("Clipboard access denied");
    }
  };

  // 1. Loading State
  if (mode === "checking") {
    return (
      <main className="h-dvh w-full bg-black flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 size={28} className="text-primary animate-spin" />
        <p className="font-display text-[10px] font-bold text-white/30 uppercase tracking-[.3em]">
          Verifying Sector Link…
        </p>
      </main>
    );
  }

  // 2. Direct Auth Invite Mode (when user visits via link/QR code without an active session)
  if (mode === "direct-auth" && sectorInfo) {
    return (
      <main className="h-dvh w-full bg-black flex flex-col items-center justify-center px-6 text-white overflow-y-auto no-scrollbar">
        <div className="w-full max-w-sm space-y-6 my-auto py-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 shadow-[0_0_30px_rgba(var(--primary-rgb),.2)]">
              <Swords size={24} className="text-primary" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 mt-2">
              <ShieldCheck size={12} className="text-primary" />
              <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest">
                {sectorInfo.schoolName ?? "Academic Sector"}
              </span>
            </div>
            <h1 className="font-display text-2xl font-black uppercase tracking-wide text-white">
              {sectorInfo.title}
            </h1>
            <p className="font-display text-[10px] font-bold text-primary/70 uppercase tracking-[.2em]">
              CODE: {sectorInfo.code} // KEY: {sectorInfo.accessKey}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-1">
            <button
              onClick={() => setAuthTab("register")}
              className={`py-2.5 rounded-xl font-display text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${authTab === "register" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
            >
              <UserPlus size={12} /> New Combatant
            </button>
            <button
              onClick={() => setAuthTab("login")}
              className={`py-2.5 rounded-xl font-display text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${authTab === "login" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
            >
              <LogIn size={12} /> I Have an Account
            </button>
          </div>

          <form onSubmit={authTab === "register" ? handleRegister : handleLogin} className="space-y-3">
            <input
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Codename / Username"
              className="w-full rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3.5 text-sm text-white outline-none focus:border-primary/40 transition-colors"
            />
            {authTab === "register" && (
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email (optional)"
                className="w-full rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3.5 text-sm text-white outline-none focus:border-primary/40 transition-colors"
              />
            )}
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className="w-full rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3.5 text-sm text-white outline-none focus:border-primary/40 transition-colors"
            />

            {error && <p className="text-center font-display text-[10px] text-red-400 uppercase tracking-wide">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 rounded-2xl bg-primary text-black font-display text-xs font-black uppercase tracking-[.2em] disabled:opacity-40 flex items-center justify-center gap-2 shadow-glow-primary transition-all active:scale-[0.98]"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
              {authTab === "register" ? "Create Account & Join" : "Sign In & Join"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // 3. Radar Search Mode (default manual entry/browse)
  return (
    <EnergyBackground className="flex flex-col h-dvh overflow-hidden">
      <div className="flex-1 flex flex-col px-6 py-12 max-w-lg mx-auto w-full overflow-y-auto no-scrollbar">

        {/* Step Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-in fade-in zoom-in duration-500">
            <Target size={12} className="text-primary animate-pulse" />
            <span className="text-[10px] font-mono text-primary tracking-[0.2em] uppercase">Neural Link</span>
          </div>
          <h1 className="font-display text-3xl font-black text-white tracking-tighter uppercase mb-2 text-glow-primary">
            Initialize_Sync
          </h1>
          <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.3em] opacity-70">
            Acquiring Battleground Access
          </p>
        </div>

        {/* Input Area */}
        <div className="flex-1 flex flex-col justify-center gap-8">
          <div className="relative group" ref={dropdownRef}>
            <InputField
              label="Sector Radar"
              prefixText="SCAN_SIG"
              value={query}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setQuery(e.target.value.toUpperCase());
                setShowSuggestions(true);
              }}
              placeholder="ENTER TITLE OR KEY..."
              className={cn(
                "text-center text-lg font-display tracking-[0.1em] uppercase py-6",
                errorMessage && "border-destructive/50"
              )}
            />

            {/* Scanning Status Icon */}
            <div className="absolute right-4 top-[48px] flex items-center gap-2">
              {(sectorsLoading || isVerifying) && <Loader2 size={14} className="text-primary animate-spin" />}
              <Search size={16} className={cn(
                "transition-colors",
                query.length > 0 ? "text-primary" : "text-white/10"
              )} />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (query.length >= 2 || sectorsLoading) && (
              <div className="absolute z-50 w-full mt-2 bg-black/90 border border-primary/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2">
                <div className="p-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-primary/60 tracking-widest uppercase px-2">
                    {sectorsLoading ? "Scanning_Grid..." : `Detected_Signals [${suggestedSectors.length}]`}
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  {suggestedSectors.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setQuery(s.accessKey);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-primary/10 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white group-hover:text-primary uppercase">{s.title}</span>
                        <span className="text-[8px] font-mono text-white/40">{s.accessKey}</span>
                      </div>
                      <Check size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                  
                  {!sectorsLoading && suggestedSectors.length === 0 && (
                    <div className="p-6 text-center">
                      <AlertTriangle size={16} className="mx-auto text-destructive mb-2 opacity-50" />
                      <p className="text-[9px] font-mono text-destructive/70 uppercase">No Matches Identified</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-destructive animate-bounce">
                <AlertTriangle size={12} />
                <span className="text-[9px] font-mono uppercase font-bold tracking-tighter">
                  Error: {errorMessage}
                </span>
              </div>
            )}
          </div>

          <NeonButton
            size="xl"
            onClick={() => handleJoinRadar(query)}
            disabled={!query.trim() || isVerifying}
            className="w-full shadow-glow-primary py-8"
          >
            {isVerifying ? (
              <span className="flex items-center gap-3">
                <Loader2 size={20} className="animate-spin" /> UPLINKING...
              </span>
            ) : "ENGAGE_SECTOR"}
          </NeonButton>

          {/* Tactical UI Divider */}
          <div className="flex items-center gap-4 py-2 opacity-30">
            <div className="flex-1 h-px bg-linear-to-r from-transparent to-white" />
            <span className="text-[9px] font-mono text-white uppercase tracking-widest">Alt_Input</span>
            <div className="flex-1 h-px bg-linear-to-l from-transparent to-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleClipboardUplink}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <Link2 size={18} className="text-white/40 group-hover:text-primary group-hover:scale-110 transition-all" />
              <span className="text-[10px] font-mono text-white/60 uppercase">Paste_Key</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02] cursor-not-allowed opacity-50 relative group">
              <Lock size={18} className="text-white/20" />
              <span className="text-[10px] font-mono text-white/20 uppercase">Request</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={14} className="text-destructive" />
              </div>
            </button>
          </div>
        </div>

        {/* Tactical Footer */}
        <div className="mt-auto pt-12 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 opacity-20">
            <ShieldCheck size={28} className="text-white" />
            <p className="text-[8px] font-mono text-white uppercase tracking-[0.4em]">
              Authorized Access Only // DeskMate_v1.0
            </p>
          </div>

          <button
            onClick={() => router.push("/lobby")}
            className="text-[10px] font-mono text-white/40 hover:text-primary transition-colors uppercase tracking-[0.2em] relative group"
          >
            Skip_To_Lobby
            <div className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
          </button>
        </div>
      </div>
    </EnergyBackground>
  );
}

export default function JoinCoursePage() {
  return (
    <Suspense fallback={
      <main className="h-dvh w-full bg-black flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 size={28} className="text-primary animate-spin" />
      </main>
    }>
      <JoinCourseContent />
    </Suspense>
  );
}