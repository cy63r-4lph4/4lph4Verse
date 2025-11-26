"use client";

export default function ProfileTabs({ active, onChange }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "guardians", label: "Guardians" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="mt-10 flex gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-xl transition font-medium ${
            active === tab.id
              ? "bg-white/10 border border-white/20 text-white"
              : "text-slate-300 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
