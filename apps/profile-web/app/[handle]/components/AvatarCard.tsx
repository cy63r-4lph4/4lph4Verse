export default function AvatarCard({ text }: { text: string }) {
  const letters = text?.slice(0, 2).toUpperCase();

  return (
    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-4xl font-bold">
      {letters}
    </div>
  );
}
