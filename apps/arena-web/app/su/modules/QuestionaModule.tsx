"use client";
import React, { useState } from "react";
import { 
  HelpCircle, Search, Plus, MoreVertical, 
  Pencil, Trash2, School, BookOpen, 
  CheckCircle2, Filter, AlertTriangle,
  ChevronDown, Database
} from "lucide-react";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { cn } from "@verse/ui";

// Mock Data
const mockQuestions = [
  {
    id: "1",
    text: "What is the time complexity of binary search?",
    difficulty: "medium",
    course: "CS101",
    school: "Stanford",
    answer: "O(log n)"
  },
  {
    id: "2",
    text: "Which data structure uses the FIFO principle?",
    difficulty: "easy",
    course: "CS101",
    school: "Stanford",
    answer: "Queue"
  }
];

export default function QuestionsModule() {
  const [selectedHub, setSelectedHub] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 md:p-10 w-full min-h-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. ASSET HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-arena-warning shadow-[0_0_10px_rgba(var(--warning-rgb),0.5)]" />
            <span className="text-[10px] font-mono text-arena-warning tracking-[0.4em] uppercase">Intel_Repository_Live</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter">
            Knowledge_Assets
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-arena-warning transition-colors" size={14} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query Intel Patterns..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white focus:border-arena-warning/50 outline-none w-64 transition-all"
            />
          </div>

          <div className="h-10 w-px bg-white/10 mx-2 hidden md:block" />

          <NeonButton size="lg" className="bg-arena-warning hover:shadow-[0_0_20px_rgba(var(--warning-rgb),0.4)] text-black">
            <Plus size={18} className="mr-2" /> CREATE_ASSET
          </NeonButton>
        </div>
      </div>

      {/* 2. TACTICAL FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FilterSelect icon={<School size={14}/>} label="Source_Hub" options={["Stanford", "MIT", "Harvard"]} />
        <FilterSelect icon={<BookOpen size={14}/>} label="Combat_Sector" options={["CS101", "CS229", "6.006"]} />
        <FilterSelect icon={<Database size={14}/>} label="Difficulty_Tier" options={["Easy", "Medium", "Hard"]} />
      </div>

      {/* 3. ASSET GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {mockQuestions.map((q) => (
          <IntelCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
}

/**
 * Tactical Intel Card
 */
function IntelCard({ question }: { question: any }) {
  const difficultyColor = {
    easy: "text-arena-success border-arena-success/30",
    medium: "text-arena-warning border-arena-warning/30",
    hard: "text-destructive border-destructive/30"
  }[question.difficulty as "easy" | "medium" | "hard"];

  return (
    <div className="group bg-arena-card/20 border border-white/5 rounded-2xl p-6 hover:border-arena-warning/40 transition-all hover:bg-arena-warning/[0.02] flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <span className={cn("text-[8px] font-mono border px-2 py-0.5 rounded uppercase", difficultyColor)}>
              Tier_{question.difficulty}
            </span>
            <span className="text-[8px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded uppercase">
              {question.course}
            </span>
          </div>
          <button className="text-white/20 hover:text-white transition-colors"><MoreVertical size={16}/></button>
        </div>

        <h3 className="text-white font-display font-medium text-lg leading-snug group-hover:text-glow-warning transition-all">
          {question.text}
        </h3>

        <div className="flex items-center gap-2 py-2 px-3 bg-white/5 border border-white/5 rounded-lg">
          <CheckCircle2 size={12} className="text-arena-success" />
          <span className="text-[10px] font-mono text-arena-success uppercase tracking-widest">
            Verified_Key: <span className="text-white ml-1">{question.answer}</span>
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 opacity-40">
           <School size={12} className="text-white" />
           <span className="text-[9px] font-mono text-white uppercase">{question.school}</span>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button className="p-2 bg-white/5 hover:bg-arena-warning/20 hover:text-arena-warning text-white rounded-lg transition-all">
            <Pencil size={14} />
          </button>
          <button className="p-2 bg-white/5 hover:bg-destructive/20 hover:text-destructive text-white rounded-lg transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Styled Tactical Select
 */
function FilterSelect({ icon, label, options }: { icon: React.ReactNode, label: string, options: string[] }) {
  return (
    <div className="relative group flex-1">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-arena-warning transition-colors pointer-events-none">
        {icon}
      </div>
      <select className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-[10px] font-mono text-white/60 focus:text-white focus:border-arena-warning/50 outline-none appearance-none cursor-pointer transition-all">
        <option value="">{label.toUpperCase()}</option>
        {options.map(opt => <option key={opt} value={opt} className="bg-black">{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none" size={12} />
    </div>
  );
}