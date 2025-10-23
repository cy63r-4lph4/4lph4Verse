"use client";
import { Card, CardContent } from "@verse/ui/components/ui/card";
import { Badge } from "@verse/ui/components/ui/badge";

export const RealmCard = ({
  name,
  emoji,
  color,
  desc,
}: {
  name: string;
  emoji: string;
  color: string;
  desc: string;
}) => (
  <Card
    className={`bg-gradient-to-br from-${color}-500/10 to-${color}-800/10 border-2 border-${color}-400/30 backdrop-blur-md hover:border-${color}-300/50 transition`}
  >
    <CardContent className="p-6 text-left">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
          <span className="text-xl">{emoji}</span>
        </div>
        <Badge variant="outline" className={`text-${color}-400 border-${color}-400/50`}>
          Realm
        </Badge>
      </div>
      <h3 className={`text-lg font-bold mb-2 text-${color}-300`}>{name}</h3>
      <p className="text-sm text-white/70">{desc}</p>
    </CardContent>
  </Card>
);
