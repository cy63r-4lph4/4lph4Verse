import { CourseHeader } from "@verse/arena-web/app/course/[id]/modules/SectorSwitcher";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { CourseBottomNav } from "@verse/arena-web/app/course/[id]/modules/BottomNav";

const currentCourse = { id: "sector-7g", code: "CS_101", name: "DATA_STRUCTURES", members: 124 };
const allCourses = [currentCourse, { id: "sector-42", code: "MATH_201", name: "CALCULUS_II", members: 89 }];
const currentUser = { name: "SHADOW_OPERATOR", level: 14, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=shadow" };

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnergyBackground className="h-dvh w-full flex flex-col overflow-hidden">
    
      <div className="z-50 w-full  fixed">
        <CourseHeader
          currentCourse={currentCourse}
          courses={allCourses}
          currentUser={currentUser}
        />
      </div>

     
      <main className="flex-1 overflow-y-auto overscroll-contain scroll-smooth px-4 pb-32 pt-2">
        <div className="max-w-md mx-auto w-full"> {/* Keeps content readable on tablets */}
          {children}
        </div>
      </main>

      {/* Bottom Nav: Use a blur effect so the 
         background energy orbs are visible through it 
      */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-linear-to-t from-black to-transparent">
        <CourseBottomNav />
      </div>
    </EnergyBackground>
  );
}