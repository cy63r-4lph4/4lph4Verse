import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  QuestsPage,
  RoomsPage,
  CouncilPage,
  ProfilePage,
  AdminPage,
} from "@/components/pages";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { useContract } from "@/hooks/useContract";
import { ScrollToTop } from "@/components/ScrollToTop";

function App() {
  const { isAdmin } = useContract();

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAdmin={isAdmin} />
      <ScrollToTop /> 

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/council" element={<CouncilPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {isAdmin && <Route path="/admin" element={<AdminPage />} />}
        </Routes>
      </main>

      <Toaster />
    </div>
  );
}

export default App;
