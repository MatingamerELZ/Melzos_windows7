export interface User {
  username: string;
  password: string;
  accountType: 'admin' | 'standard' | 'pro' | 'elite' | 'developer';
  avatar: string;
  isAdmin: boolean;
  proCode?: string;
  createdAt: string;
}

export interface Window {
  id: string;
  title: string;
  icon: string;
  app: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  zIndex: number;
  data?: any;
}

export interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  app: string;
  x?: number;
  y?: number;
  data?: any;
}

export type AppScreen = 'register' | 'login' | 'desktop';
