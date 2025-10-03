"use client";

import { useEffect, useState } from "react";
import ClientProfileLayout from "./sections/ClientProfileLayout";
import WorkerProfileLayout from "@verse/hirecore-web/app/profile/sections/WorkerProfileLayout";
import { useUserRole } from "@verse/hirecore-web/context/UserRoleContext";

export default function ProfilePage() {
  const {role}=useUserRole()

 

  if (!role) return null; 

  return role === "client" ? <ClientProfileLayout /> : <WorkerProfileLayout />;
}
