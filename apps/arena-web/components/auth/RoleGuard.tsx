"use client";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import useAuth from "@verse/arena-web/hooks/useAuth";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: "admin" | "student";
}

export default function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== requiredRole)) {
      router.push("/login"); 
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading || !user || user.role !== requiredRole) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={32} />
      </div>
    );
  }

  return <>{children}</>;
}