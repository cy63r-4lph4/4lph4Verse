import React, { useState, useEffect } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { contractService, HallData } from "@/lib/contractTransactions";
import { HallDetail } from "@/components/room/HallDetail";
import { CreateHallForm } from "@/components/room/CreateHallForm";
import { HallList } from "@/components/room/HallList";



export const RoomsPage: React.FC = () => {
  const [selectedHall, setSelectedHall] = useState<HallData | null>(null);
  const [halls, setHalls] = useState<HallData[]>([]);
  const [showCreateHall, setShowCreateHall] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadHalls = async () => {
      try {
        setLoading(true);
        const allHalls = await contractService.getAllHalls();
        setHalls(allHalls);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error Loading Halls",
          description: "Could not fetch reflection halls.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadHalls();
  }, []);

  if (selectedHall)
    return (
      <HallDetail
        hall={selectedHall}
        onBack={() => setSelectedHall(null)}
        onHallUpdate={() => contractService.getAllHalls().then(setHalls)}
      />
    );

  if (showCreateHall)
    return (
      <CreateHallForm
        onBack={() => setShowCreateHall(false)}
        onSuccess={(newHall) => {
          setHalls((prev) => [newHall, ...prev]);
          setShowCreateHall(false);
        }}
      />
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Discussion Rooms
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Join reflections, share insights, and earn CØRE tips.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateHall(true)}
          className="bg-gradient-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Hall
        </Button>
      </div>

      <HallList
        halls={halls}
        loading={loading}
        onSelectHall={(hall) => setSelectedHall(hall)}
        onCreate={() => setShowCreateHall(true)}
      />
    </div>
  );
};
