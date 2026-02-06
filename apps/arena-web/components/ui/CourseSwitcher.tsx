import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  code: string;
  name: string;
  members: number;
}

interface CourseSwitcherProps {
  currentCourse: Course;
  courses: Course[];
}

const CourseSwitcher = ({ currentCourse, courses }: CourseSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (course: Course) => {
    setIsOpen(false);
    // In a real app, this would switch the active course context
    // For now, we just close the dropdown
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground text-left">
            {currentCourse.code}
          </h1>
          <p className="text-muted-foreground text-sm text-left">{currentCourse.name}</p>
        </div>
        <ChevronDown 
          size={20} 
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-72 z-50 bg-arena-dark border border-arena-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-scale-in">
            <div className="p-2">
              <p className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Your Arenas
              </p>
              
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleSelect(course)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
                    course.id === currentCourse.id 
                      ? "bg-primary/10 text-foreground" 
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex-1 text-left">
                    <p className="font-display font-semibold">{course.code}</p>
                    <p className="text-xs text-muted-foreground">{course.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users size={12} />
                      <span>{course.members}</span>
                    </div>
                    {course.id === currentCourse.id && (
                      <Check size={16} className="text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="border-t border-arena-border p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/lobby");
                }}
                className="w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-left"
              >
                ← Back to Lobby
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseSwitcher;
