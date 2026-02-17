import { CourseHeader } from "@verse/arena-web/app/course/[id]/modules/SectorSwitcher";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { CourseBottomNav } from "@verse/arena-web/app/course/[id]/modules/BottomNav";

const currentCourse = { id: "sector-7g", code: "CS_101", name: "DATA_STRUCTURES", members: 124 };
const allCourses = [currentCourse, { id: "sector-42", code: "MATH_201", name: "CALCULUS_II", members: 89 }];
const currentUser = { name: "SHADOW_OPERATOR", level: 14, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=shadow" };

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnergyBackground className="h-dvh w-full flex flex-col overflow-hidden">
      <CourseHeader currentCourse={currentCourse} courses={allCourses} currentUser={currentUser} />
      
      <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
        {children}
      </div>    

      <CourseBottomNav />
    </EnergyBackground>
  );
}