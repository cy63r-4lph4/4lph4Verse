import React from 'react';
import { Button } from '@/components/ui/button';
import { WalletConnection } from '@/components/WalletConnection';
import { Home, Trophy, MessageSquare, Vote, User, Settings, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  isAdmin 
}) => {
  const tabs = [
    { id: 'home', label: 'Nexus', icon: Home },
    { id: 'quests', label: 'Quests', icon: Trophy },
    { id: 'rooms', label: 'Halls', icon: MessageSquare },
    { id: 'council', label: 'Council', icon: Vote },
    { id: 'profile', label: 'Aura', icon: User },
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
              <p className="text-xs text-muted-foreground -mt-1">4lph4Verse Academy</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(id)}
                className={`gap-2 transition-all duration-300 ${
                  activeTab === id 
                    ? 'mystic-button shadow-mystic' 
                    : 'hover:bg-accent/50 hover:text-primary'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
            {isAdmin && (
              <Button
                variant={activeTab === 'admin' ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange('admin')}
                className={`gap-2 ml-2 transition-all duration-300 ${
                  activeTab === 'admin' 
                    ? 'bg-gradient-council text-council-foreground shadow-council' 
                    : 'hover:bg-accent/50 hover:text-council'
                }`}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <select 
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value)}
              className="bg-card/50 border border-border rounded-md px-3 py-2 text-sm backdrop-blur-sm"
            >
              {tabs.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
              {isAdmin && <option value="admin">Admin</option>}
            </select>
          </div>

          {/* Wallet Connection */}
          <WalletConnection />
        </div>
      </div>
    </header>
  );
};
