"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@verse/hirecore-web/components/ui/tabs";
import ClientProfileLayout from "./ClientProfileLayout";
import WorkerProfileLayout from "./WorkerProfileLayout";

export default function DualProfileLayout({ profile }) {
  const [activeTab, setActiveTab] = useState("worker");

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto">
      <Tabs defaultValue="worker" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="worker">Worker Profile</TabsTrigger>
          <TabsTrigger value="client">Client Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="worker">
          <WorkerProfileLayout profile={profile.workerData} />
        </TabsContent>

        <TabsContent value="client">
          <ClientProfileLayout profile={profile.clientData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
