export default function OwnerProfileActions() {
  return (
    <>
      <button className="px-6 py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-400/20 hover:bg-cyan-500/30 transition">
        Edit Profile
      </button>
      <button className="px-6 py-2.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition">
        Manage Guardians
      </button>
      <button className="px-6 py-2.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition">
        Wallets & Keys
      </button>
      <button className="px-6 py-2.5 rounded-lg bg-red-500/20 border border-red-400/20 hover:bg-red-500/30 transition">
        Recovery
      </button>
    </>
  );
}
