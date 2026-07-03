export interface Talisman {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  desc: string;
  tags: string[];
  power: string;
  stock: number;
  color: string;
}

export interface Supply {
  id: number;
  name: string;
  price: number;
  desc: string;
  category: string;
  stock: number;
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  mins: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  author: string;
  excerpt: string;
}

export interface ForumPost {
  id: number;
  user: string;
  avatar: string;
  title: string;
  replies: number;
  likes: number;
  tag: string;
  time: string;
  hot: boolean;
}

export interface ForumReply {
  user: string;
  avatar: string;
  time: string;
  text: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  color: string;
  popular?: boolean;
  tagline: string;
  perks: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  color: string;
  kind: 'talisman' | 'supply';
}

export interface ThemeTweaks {
  accentColor: string;
  bgColor: string;
  fontStyle: 'classic' | 'modern';
}

export interface FrogPersonality {
  id: string;
  name: string;
  color: string;
  emoji: string;
  tagline: string;
  openingLine: string;
}
