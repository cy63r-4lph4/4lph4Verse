import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/components/pages/HomePage';
import { QuestsPage } from '@/components/pages/QuestsPage';
import { RoomsPage } from '@/components/pages/RoomsPage';
import { CouncilPage } from '@/components/pages/CouncilPage';
import { ProfilePage } from '@/components/pages/ProfilePage';
import { AdminPage } from '@/components/pages/AdminPage';
import { useWallet } from '@/hooks/useWallet';
import { useContract } from '@/hooks/useContract';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { account } = useWallet();
  const { isAdmin } = useContract();

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onTabChange={setActiveTab} />;
      case 'quests':
        return <QuestsPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'council':
        return <CouncilPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <HomePage onTabChange={setActiveTab} />;
      default:
        return <HomePage onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      <Toaster />
    </div>
  );
};

export default App;
