import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, TrendingUp } from "lucide-react";
import { HallData } from "@/lib/contractTransactions";

interface HallListProps {
  halls: HallData[];
  loading: boolean;
  onSelectHall: (hall: HallData) => void;
  onCreate: () => void;
}

export const HallList: React.FC<HallListProps> = ({
  halls,
  loading,
  onSelectHall,
  onCreate,
}) => {
  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="community-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-secondary rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-secondary rounded w-full mb-2"></div>
              <div className="h-3 bg-secondary rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );

  if (halls.length === 0)
    return (
      <div className="text-center py-16">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-2xl font-bold mb-2">No Reflection Halls Yet</h3>
        <p className="text-muted-foreground mb-6">
          Be the first to create a reflection hall for quest discussions!
        </p>
        <Button
          onClick={onCreate}
          className="bg-gradient-primary text-primary-foreground"
        >
          Create First Hall
        </Button>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {halls.map((hall) => (
        <Card
          key={hall.id}
          className="community-card hover:shadow-glow cursor-pointer"
          onClick={() => onSelectHall(hall)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{hall.topic}</CardTitle>
                <CardDescription className="mt-2">
                  {hall.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {hall.postCount} posts
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Active
                </span>
              </div>
              <Button size="sm" variant="outline">
                Join
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
