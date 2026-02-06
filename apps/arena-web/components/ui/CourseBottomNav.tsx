import { cn } from "@/lib/utils";
import { MessageSquare, Swords, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <MessageSquare size={22} />, label: "Feed", path: "/course" },
  { icon: <Swords size={22} />, label: "Quizzes", path: "/quizzes" },
  { icon: <Trophy size={22} />, label: "Ranks", path: "/leaderboard" },
];

interface CourseBottomNavProps {
  onBackToLobby?: () => void;
}

export const CourseBottomNav = ({ onBackToLobby }: CourseBottomNavProps) => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-arena-darker/95 backdrop-blur-lg border-t border-arena-border">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative",
                isActive && "text-glow"
              )}>
                {item.icon}
                {isActive && (
                  <div className="absolute -inset-2 bg-primary/10 rounded-xl -z-10" />
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default CourseBottomNav;
