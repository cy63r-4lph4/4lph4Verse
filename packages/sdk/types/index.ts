export * from "./verseProfile";
export interface Choice {
  text: string;
  nextNodeId: string;
}

export interface Node {
  text: string;
  choices: Choice[];
}

export interface Story {
  id: number;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  category: string;
  likes: number;
  views: number;
  tips: number;
  tags?: string[];
  isNftEligible: boolean;
  isMinted: boolean;
  onAuction: boolean;
  isInteractive?: boolean;
  interactiveContent?: Record<string, HTMLElement>;
  createdAt: string;
}
