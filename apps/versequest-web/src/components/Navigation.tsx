import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WalletConnection } from "@/components/WalletConnection";
import {
  Home,
  Trophy,
  MessageSquare,
  Vote,
  User,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils"; // optional helper, replace with template strings if not present

interface NavigationProps {
  isAdmin: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isAdmin }) => {
  const tabs = [
    { to: "/", label: "Nexus", icon: Home },
    { to: "/quests", label: "Quests", icon: Trophy },
    { to: "/rooms", label: "Halls", icon: MessageSquare },
    { to: "/council", label: "Council", icon: Vote },
    { to: "/profile", label: "Aura", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center aura-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl gradient-text">VerseQuest</h1>
              <p className="text-xs text-muted-foreground -mt-1">
                4lph4Verse Academy
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2 transition-all duration-300",
                      isActive
                        ? "mystic-button shadow-mystic"
                        : "hover:bg-accent/50 hover:text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                )}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink to="/admin">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2 ml-2 transition-all duration-300",
                      isActive
                        ? "bg-gradient-council text-council-foreground shadow-council"
                        : "hover:bg-accent/50 hover:text-council"
                    )}
                  >
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                )}
              </NavLink>
            )}
          </nav>

          {/* Mobile Navigation (Dropdown) */}
          <div className="md:hidden">
            <select
              onChange={(e) => (window.location.href = e.target.value)}
              className="bg-card/50 border border-border rounded-md px-3 py-2 text-sm backdrop-blur-sm"
              defaultValue={window.location.pathname}
            >
              {tabs.map(({ to, label }) => (
                <option key={to} value={to}>
                  {label}
                </option>
              ))}
              {isAdmin && <option value="/admin">Admin</option>}
            </select>
          </div>

          {/* Wallet Connection */}
          <WalletConnection />
        </div>
      </div>
    </header>
  );
};
