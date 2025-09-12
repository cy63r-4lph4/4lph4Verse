export default function UtilityCards() {
  const apps = [
    { name: "HireX", desc: "Hire skills & earn in CØRE", coming: true },
    { name: "LeaseVault", desc: "Rent & pay with CØRE", coming: true },
    { name: "VaultOfLove", desc: "Tip authors & creators", coming: true },
  ];

  return (
    <div className="w-full max-w-md mt-8 space-y-3">
      <h2 className="text-center text-lg font-semibold mb-2">What can I do with CØRE?</h2>
      <div className="grid gap-3">
        {apps.map((app) => (
          <div
            key={app.name}
            className="rounded-2xl bg-gray-900 border border-gray-700 p-4 text-center hover:border-cyan-500 transition"
          >
            <h3 className="font-bold text-cyan-400">{app.name}</h3>
            <p className="text-gray-400 text-sm">{app.desc}</p>
            <p className="text-xs text-purple-400 mt-1">{app.coming ? "Coming soon" : ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
