"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Swords, Loader2, ShieldCheck } from "lucide-react";
import { api } from "@verse/arena-web/lib/api";

function JoinTournamentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const courseId = params.get("courseId") ?? "";
  const accessKey = params.get("accessKey") ?? "";
  const showdownId = params.get("showdownId") ?? "";

  const [course, setCourse] = useState<{ title: string; schoolId: string } | null>(null);
  const [mode, setMode] = useState<"checking" | "auth" | "joining">("checking");
  const [authTab, setAuthTab] = useState<"login" | "register">("register");
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    api.get(`/arena/courses/${courseId}`).then((res) => setCourse(res.data));
  }, [courseId]);

  useEffect(() => {
    const token = localStorage.getItem("arena_token");
    if (token) {
      completeJoin();
    } else {
      setMode("auth");
    }
  }, []);

  async function completeJoin() {
    setMode("joining");
    try {
      await api.post("/v1/gateway/join-sector", { accessKey });
    } catch {
      // already-joined case is a soft success on the backend; ignore other errors here
    }
    router.replace(`/course/${courseId}/duels/tournament/${showdownId}/play`);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.post("/v1/gateway/register", {
        username: form.username,
        password: form.password,
        email: form.email || undefined,
        sector: course.schoolId,
      });
      localStorage.setItem("arena_token", data.access_token);
      await completeJoin();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Registration failed.");
      setBusy(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.post("/v1/gateway/login", {
        identity: form.username,
        password: form.password,
      });
      localStorage.setItem("arena_token", data.access_token);
      await completeJoin();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed.");
      setBusy(false);
    }
  }

  if (mode === "checking" || mode === "joining") {
    return (
      <main className="h-dvh w-full bg-black flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 size={28} className="text-primary animate-spin" />
        <p className="font-display text-[10px] font-bold text-white/30 uppercase tracking-[.3em]">
          {mode === "joining" ? "Entering the arena…" : "Verifying invite…"}
        </p>
      </main>
    );
  }

  return (
    <main className="h-dvh w-full bg-black flex flex-col items-center justify-center px-6 text-white">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25">
            <Swords size={24} className="text-primary" />
          </div>
          <h1 className="font-display text-2xl font-black uppercase tracking-wide">
            {course?.title ?? "Joining Course"}
          </h1>
          <p className="font-display text-[10px] font-bold text-white/30 uppercase tracking-[.2em]">
            Sign in or create a combatant to enter the tournament
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-1">
          <button
            onClick={() => setAuthTab("register")}
            className={`py-2.5 rounded-xl font-display text-[10px] font-black uppercase tracking-wider transition-all ${authTab === "register" ? "bg-white text-black" : "text-white/40"}`}
          >
            New Combatant
          </button>
          <button
            onClick={() => setAuthTab("login")}
            className={`py-2.5 rounded-xl font-display text-[10px] font-black uppercase tracking-wider transition-all ${authTab === "login" ? "bg-white text-black" : "text-white/40"}`}
          >
            I Have an Account
          </button>
        </div>

        <form onSubmit={authTab === "register" ? handleRegister : handleLogin} className="space-y-3">
          <input
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Codename"
            className="w-full rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3.5 text-sm text-white outline-none focus:border-primary/40"
          />
          {authTab === "register" && (
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email (optional)"
              className="w-full rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3.5 text-sm text-white outline-none focus:border-primary/40"
            />
          )}
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="w-full rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3.5 text-sm text-white outline-none focus:border-primary/40"
          />

          {error && <p className="text-center font-display text-[10px] text-red-400 uppercase tracking-wide">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 rounded-2xl bg-primary text-black font-display text-xs font-black uppercase tracking-[.2em] disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
            {authTab === "register" ? "Create & Join" : "Login & Join"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function JoinTournamentPage() {
  return (
    <Suspense fallback={
      <main className="h-dvh w-full bg-black flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 size={28} className="text-primary animate-spin" />
      </main>
    }>
      <JoinTournamentContent />
    </Suspense>
  );
}