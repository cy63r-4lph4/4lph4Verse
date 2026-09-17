import { useState } from "react";
import { BookOpen, Plus, Trash2, Edit2, CheckCircle, XCircle, FileText, Eye, AlertTriangle } from "lucide-react";
import { cn } from "@verse/ui";
import { useResources, ArenaResource } from "@verse/arena-web/hooks/useResources";

export function DatapadsPanel({ courseId }: { courseId: string }) {
  const { data: resources = [], isLoading, create, update, remove } = useResources(courseId);
  const [isEditing, setIsEditing] = useState<Partial<ArenaResource> | null>(null);
  const [datapadToDelete, setDatapadToDelete] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isPublished = formData.get("isPublished") === "on";

    if (isEditing?.id) {
      update.mutate({ id: isEditing.id, data: { title, content, isPublished } });
    } else {
      create.mutate({ title, content, isPublished });
    }
    setIsEditing(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
            <BookOpen size={20} className="text-cyan-400" />
            Datapads
          </h2>
          <p className="font-display text-[10px] text-white/40 uppercase tracking-widest mt-1">
            Manage course learning materials and Codex entries
          </p>
        </div>
        <button
          onClick={() => setIsEditing({ title: "", content: "", isPublished: false })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 transition-all font-display text-[10px] font-black text-cyan-400 uppercase tracking-wide"
        >
          <Plus size={14} /> New Datapad
        </button>
      </header>

      {isEditing ? (
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
          <h3 className="font-display text-xs font-black text-white uppercase tracking-wider mb-4">
            {isEditing.id ? "Edit Datapad" : "Create Datapad"}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-display text-[9px] text-white/40 uppercase tracking-widest mb-1.5">
                Title
              </label>
              <input
                name="title"
                defaultValue={isEditing.title}
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 outline-none"
              />
            </div>
            <div>
              <label className="block font-display text-[9px] text-white/40 uppercase tracking-widest mb-1.5">
                Markdown Content
              </label>
              <textarea
                name="content"
                defaultValue={isEditing.content}
                required
                rows={10}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 outline-none font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublished"
                id="isPublished"
                defaultChecked={isEditing.isPublished}
                className="rounded border-white/20 bg-black/50 text-cyan-500 focus:ring-cyan-500/30"
              />
              <label htmlFor="isPublished" className="font-display text-[10px] text-white/70 uppercase tracking-widest">
                Publish immediately
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(null)}
                className="px-4 py-2 rounded-lg font-display text-[10px] font-black text-white/50 hover:text-white uppercase tracking-wide"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={create.isPending || update.isPending}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-display text-[10px] font-black uppercase tracking-wide hover:bg-cyan-500/30"
              >
                {create.isPending || update.isPending ? "Saving..." : "Save Datapad"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-4">
          {isLoading ? (
            <p className="text-white/40 text-sm">Loading...</p>
          ) : resources.length === 0 ? (
            <div className="text-center py-12 border border-white/5 border-dashed rounded-2xl bg-white/[0.01]">
              <FileText size={32} className="mx-auto text-white/10 mb-3" />
              <p className="font-display text-[11px] text-white/30 uppercase tracking-widest">
                No datapads created yet
              </p>
            </div>
          ) : (
            resources.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <div>
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-wide">
                    {res.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-mono text-white/40">{res.id}</span>
                    {res.isPublished ? (
                      <span className="flex items-center gap-1 font-display text-[9px] text-green-400 uppercase tracking-widest">
                        <CheckCircle size={10} /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-display text-[9px] text-amber-400 uppercase tracking-widest">
                        <XCircle size={10} /> Draft
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(`/course/${courseId}/materials/${res.id}`, "_blank")}
                    className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30"
                    title="View Rendered Datapad"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => setIsEditing(res)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDatapadToDelete(res.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {datapadToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-black border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(239,68,68,0.15)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-400">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg font-black uppercase tracking-wide">Confirm Deletion</h3>
                <p className="font-mono text-[10px] text-red-400/60 uppercase tracking-widest">IRREVERSIBLE ACTION</p>
              </div>
            </div>
            <p className="font-sans text-sm text-white/70 mb-8">
              Are you sure you want to permanently delete this datapad? All sync progress and associated data will be purged from the archive.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDatapadToDelete(null)}
                className="px-4 py-2 rounded-lg font-display text-[10px] font-black text-white/50 hover:text-white uppercase tracking-wide transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  remove.mutate(datapadToDelete);
                  setDatapadToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all font-display text-[10px] font-black uppercase tracking-wide"
              >
                Execute Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
