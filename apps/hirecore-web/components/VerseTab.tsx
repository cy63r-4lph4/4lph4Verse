"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@verse/ui/components/ui/tabs";
import { Button } from "@verse/ui/components/ui/button";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@verse/hirecore-web/lib/utils";

export type TabItem = {
  value: string;
  label: string;
};

interface VerseTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (val: string) => void;
  children: ReactNode;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  className?: string;
}

/**
 * Reusable tab header layout with optional view toggle.
 * Keeps consistent spacing and layout across all pages (Tasks, Applications, etc.)
 */
export default function VerseTabs({
  tabs,
  activeTab,
  onTabChange,
  children,
  viewMode,
  onViewModeChange,
  className = "",
}: VerseTabsProps) {
  const showViewToggle = typeof viewMode !== "undefined" && onViewModeChange;
  const tabCount = tabs.length;
  const cols = Math.min(Math.max(tabCount, 2), 8); // clamp between 2 and 8
  const gridColsClass = `grid-cols-${cols}`;

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className={`w-full ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Consistent Tabs List */}
        <TabsList
          className={cn(
            "flex-1 h-11  bg-white/10 border border-white/20 rounded-none",
            gridColsClass
          )}
        >
          {" "}
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-white data-[state=active]:bg-blue-600 rounded-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Optional View Toggle */}
        {showViewToggle && (
          <div className="flex gap-2 shrink-0">
            <Button
              size="icon"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => onViewModeChange!("grid")}
              className="rounded-none"
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => onViewModeChange!("list")}
              className="rounded-none"
            >
              <ListIcon className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <TabsContent value={activeTab} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
}
