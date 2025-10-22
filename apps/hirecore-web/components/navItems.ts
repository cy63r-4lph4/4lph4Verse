// apps/hirecore/app/navItems.ts
import type { NavbarItem } from "@verse/ui/Navbar/Navbar.types";
import {
  HomeIcon,
  UsersIcon,
  PlusCircleIcon,
  ClipboardIcon,
  ClipboardDocumentListIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export const workerNavItems: NavbarItem[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Find Tasks", href: "/tasks", icon: BriefcaseIcon },
  { label: "My Applications", href: "/applications", icon: ClipboardDocumentListIcon },
];

export const clientNavItems: NavbarItem[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Find Workers", href: "/workers", icon: UsersIcon },
  { label: "Post Task", href: "/tasks/new", icon: PlusCircleIcon },
  { label: "My Tasks", href: "/mytasks", icon: ClipboardIcon },
];
