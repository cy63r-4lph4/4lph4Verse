import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Zap } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { AuraRing } from '@/components/AuraRing';
import { mockUserProfile } from '@/data/mockData';

export const WalletConnection: React.FC = () => {
  const { account, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (account) {
    return (
      <div className="flex items-center gap-3">
        {/* Mini Aura Ring for connected wallet */}
        <div className="hidden sm:flex items-center gap-3">
          <AuraRing 
            aura={mockUserProfile.aura} 
            rank={mockUserProfile.rank} 
            size="sm" 
          />
          <div className="text-sm">
            <div className="font-medium">{formatAddress(account)}</div>
            <div className="text-xs text-muted-foreground">
              {mockUserProfile.rank.name} • {mockUserProfile.streak} day streak
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="gap-2 mystic-button"
    >
      {isConnecting ? (
        <Zap className="h-4 w-4 animate-pulse" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      {isConnecting ? 'Awakening...' : 'Connect Wallet'}
    </Button>
  );
};
