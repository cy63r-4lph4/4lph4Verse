import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";

export default function KioskLayout({ children }: { children: React.ReactNode }) {
    return <EnergyBackground className="h-dvh w-full flex flex-col overflow-hidden" variant="duel">{children}</EnergyBackground>;
}