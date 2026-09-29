import React, { useState, useEffect } from "react";
import { ShieldCheck, Fingerprint, Activity, Power, Coins, ArrowRightLeft, Globe, RefreshCcw, Settings, ChevronLeft } from "lucide-react";
import { createPublicClient, http, formatEther } from "viem";

type Network = { id: number; name: string; color: string; symbol: string };
const NETWORKS: Network[] = [
  { id: 42220, name: "Celo", color: "#FCFF52", symbol: "CELO" },
  { id: 84532, name: "Base Sepolia", color: "#0052FF", symbol: "ETH" },
  { id: 4202, name: "Lisk Sepolia", color: "#4070F4", symbol: "ETH" },
];

export function Popup() {
  const [address, setAddress] = useState<string | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<Network>(NETWORKS[0]);
  const [balance, setBalance] = useState<string>("0.00");
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  // View states
  const [showSettings, setShowSettings] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);

  useEffect(() => {
    chrome.storage?.local.get(["verse_wallet_address", "verse_advanced_mode"], (res) => {
      if (res.verse_wallet_address) {
        setAddress(res.verse_wallet_address);
      } else {
        setAddress("0x8700a9cf2fdb13a670868f034509144410"); // Mock
      }
      if (res.verse_advanced_mode) {
        setAdvancedMode(res.verse_advanced_mode);
      }
    });
  }, []);

  const toggleAdvancedMode = () => {
    const newMode = !advancedMode;
    setAdvancedMode(newMode);
    chrome.storage?.local.set({ verse_advanced_mode: newMode });
  };

  useEffect(() => {
    if (!address) return;
    setLoadingBalance(true);

    const rpcUrl = activeNetwork.id === 42220 
      ? "https://forno.celo.org"
      : activeNetwork.id === 84532
      ? "https://sepolia.base.org"
      : "https://rpc.sepolia-api.lisk.com";

    const publicClient = createPublicClient({
      transport: http(rpcUrl)
    });

    publicClient.getBalance({ address: address as `0x${string}` })
      .then(bal => {
        const ethBalance = formatEther(bal);
        setBalance(parseFloat(ethBalance).toFixed(4));
        setLoadingBalance(false);
      })
      .catch(err => {
        console.error(err);
        setBalance("0.0000");
        setLoadingBalance(false);
      });
  }, [address, activeNetwork]);

  const shortAddr = address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "";

  return (
    <div className="w-[360px] h-[550px] bg-[#010103] text-[#ededed] flex flex-col font-sans relative overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00f0ff 2px, #00f0ff 4px)" }}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#00f0ff]/20 p-4 bg-[#010103]/80 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          {showSettings ? (
            <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-[#00f0ff]/10 text-[#00f0ff] transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <img src="/logo.png" alt="Verse" className="w-6 h-6 object-contain" />
          )}
          <h1 className="font-mono text-sm tracking-widest text-[#00f0ff] uppercase text-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
            {showSettings ? "Settings" : "Verse"}
          </h1>
        </div>
        
        {showSettings ? null : advancedMode ? (
          <div className="flex items-center gap-2 px-2 py-1 border border-white/10 hover:border-[#00f0ff]/50 bg-white/5 cursor-pointer transition-colors group">
            <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ color: activeNetwork.color, backgroundColor: activeNetwork.color }} />
            <span className="text-[10px] text-slate-300 font-mono tracking-widest uppercase group-hover:text-[#00f0ff] transition-colors">{activeNetwork.name}</span>
          </div>
        ) : (
          <button onClick={() => setShowSettings(true)} className="p-1.5 text-slate-400 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 z-10 overflow-y-auto">
        {showSettings ? (
          <div className="space-y-6">
            <div className="p-4 border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#00f0ff]">Advanced Mode</span>
                <button 
                  onClick={toggleAdvancedMode}
                  className={`w-10 h-5 flex items-center p-0.5 border transition-colors ${advancedMode ? 'border-[#00f0ff] bg-[#00f0ff]/20' : 'border-slate-600 bg-slate-800'}`}
                >
                  <div className={`w-3.5 h-3.5 bg-white transition-transform ${advancedMode ? 'translate-x-5 bg-[#00f0ff]' : ''}`} />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                Enable network switching, raw hex addresses, and developer tools. Recommended only for crypto-native power users.
              </p>
            </div>
            
            <button className="w-full flex flex-col items-center justify-center gap-2 p-4 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-colors">
              <Power className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest">Disconnect Session</span>
            </button>
          </div>
        ) : address ? (
          <div className="space-y-6">
            {/* Account Display */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest mb-2">
                <Globe className="w-3 h-3" /> Universal Account
              </div>
              {advancedMode ? (
                <div className="px-3 py-1.5 border border-[#00f0ff]/30 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 cursor-pointer transition-colors font-mono text-xs text-[#00f0ff]">
                  {shortAddr}
                </div>
              ) : (
                <div className="px-3 py-1.5 font-mono text-sm text-white font-bold tracking-widest">
                  @satoshi
                </div>
              )}
            </div>
            
            {/* Balance Display */}
            <div className="flex flex-col items-center justify-center py-6 border-y border-white/5">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Total Balance</p>
              <div className="flex items-end gap-2">
                {loadingBalance ? (
                  <RefreshCcw className="w-8 h-8 text-[#00f0ff] animate-spin" />
                ) : (
                  <>
                    <span className="text-4xl font-mono text-white text-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      {advancedMode ? balance : `$${(parseFloat(balance) * 2240.5).toFixed(2)}`}
                    </span>
                    {advancedMode && <span className="text-lg font-mono text-[#00f0ff] mb-1">{activeNetwork.symbol}</span>}
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 p-4 border border-[#00f0ff]/20 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/20 hover:border-[#00f0ff]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all group">
                <Power className="w-5 h-5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300 group-hover:text-white">Send</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 border border-[#00f0ff]/20 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/20 hover:border-[#00f0ff]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all group">
                <ArrowRightLeft className="w-5 h-5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300 group-hover:text-white">Swap</span>
              </button>
            </div>

            {/* Asset List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest border-b border-white/5 pb-2">
                <span>Assets</span>
                <Activity className="w-3 h-3" />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-black">
                    <Coins className="w-4 h-4 text-slate-300" style={{ color: activeNetwork.color }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{advancedMode ? activeNetwork.name : "CØRE"}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{advancedMode ? activeNetwork.symbol : "CØRE"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-mono">{loadingBalance ? "..." : (advancedMode ? balance : `$${(parseFloat(balance) * 2240.5).toFixed(2)}`)}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 border border-[#00f0ff]/30 flex items-center justify-center bg-[#00f0ff]/5 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
              <ShieldCheck className="w-8 h-8 text-[#00f0ff]" />
            </div>
            <div>
              <p className="font-mono text-[#00f0ff] text-sm uppercase tracking-widest font-bold">Unlinked</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed px-4">
                Initialize your smart wallet through the 4lph4verse identity dashboard.
              </p>
            </div>
            <button className="mt-4 flex items-center gap-2 px-6 py-3 border border-[#00f0ff]/50 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-xs font-mono text-[#00f0ff] uppercase tracking-widest hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
              <Fingerprint className="w-4 h-4" />
              Link Passkey
            </button>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[#00f0ff]/20 bg-[#010103]/90 flex justify-between items-center text-[9px] text-slate-500 font-mono uppercase tracking-widest z-10">
        <span>V1.0.0</span>
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500"/> SECURE ENCLAVE</span>
      </div>
    </div>
  );
}
