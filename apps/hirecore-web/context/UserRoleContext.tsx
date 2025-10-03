// context/UserRoleContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Role = "worker" | "client";
interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const UserRoleContext = createContext<RoleContextType | null>(null);

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("worker");

  useEffect(() => {
    const stored = localStorage.getItem("hirecore_user_role") as Role | null;
    if (stored) setRole(stored);
  }, []);

  const updateRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem("hirecore_user_role", newRole);
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole: updateRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export const useUserRole = () => {
  const ctx = useContext(UserRoleContext);
  if (!ctx) throw new Error("useUserRole must be used within UserRoleProvider");
  return ctx;
};
