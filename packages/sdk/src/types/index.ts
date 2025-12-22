export * from "@verse/sdk/types/verseProfile";
import { type StaticImageData } from "next/image";
export interface Choice {
  text: string;
  nextNodeId: string;
}

export interface StoryNode {
  id: string | number;
  text: string;
  choices: Choice[];
}

export interface Story {
  id?: number;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  category: string;
  likes?: number;
  views?: number;
  tips?: number;
  tags?: string[];
  isNftEligible?: boolean;
  isMinted?: boolean;
  onAuction?: boolean;
  isInteractive?: boolean;
  interactiveContent?: Record<string | number, StoryNode>;
  createdAt?: string;
}

export type WalletLogo = StaticImageData | string;

export type WalletMeta = {
  name: string;
  logo: WalletLogo;
  priority: number;
};
