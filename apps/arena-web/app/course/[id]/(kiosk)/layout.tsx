// (kiosk)/layout.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";

type Variant = "default" | "battle" | "duel";
const VariantContext = createContext<(v: Variant) => void>(() => { });

export function useKioskVariant(variant: Variant) {
    const setVariant = useContext(VariantContext);
    React.useEffect(() => { setVariant(variant); }, [variant, setVariant]);
}

export default function KioskLayout({ children }: { children: React.ReactNode }) {
    const [variant, setVariant] = useState<Variant>("duel");
    return (
        <VariantContext.Provider value={setVariant}>
            <EnergyBackground className="h-dvh w-full flex flex-col overflow-hidden" variant={variant}>
                {children}
            </EnergyBackground>
        </VariantContext.Provider>
    );
}