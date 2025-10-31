import { useState, useEffect } from 'react';
import { WalletService } from '@/lib/walletService';
import { useToast } from '@/hooks/use-toast';

export const useWallet = () => {
  const { toast } = useToast();
  const [walletService] = useState(() => new WalletService({
    onToast: (title: string, description: string) => {
      toast({ title, description });
    }
  }));

  const [state, setState] = useState({
    account: '',
    currentNetwork: '',
    isConnecting: false,
    balance: '',
    isLoadingBalance: false
  });

  useEffect(() => {
    walletService.onStateUpdate(setState);
    
    return () => {
      walletService.destroy();
    };
  }, [walletService]);

  return {
    ...state,
    connectWallet: () => walletService.connectWallet(),
    disconnectWallet: () => walletService.disconnectWallet(),
    walletService
  };
};
