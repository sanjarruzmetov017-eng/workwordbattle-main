
export enum View {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  WORDS = 'WORDS',
  PUZZLES = 'PUZZLES',
  LEARN = 'LEARN',
  TOURNAMENTS = 'TOURNAMENTS',
  SOCIAL = 'SOCIAL',
  PROFILE = 'PROFILE',
  SHOP = 'SHOP',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  SETTINGS = 'SETTINGS',
  PREMIUM = 'PREMIUM',
  SUPPORT = 'SUPPORT',
  NOTIFICATIONS = 'NOTIFICATIONS',
  THEME = 'THEME',
  GAME = 'GAME'
}

export enum GameMode {
  BULLET = 'Bullet',
  BLITZ = 'Blitz',
  RAPID = 'Rapid',
  COMPUTER = 'Vs Computer',
  FRIEND = 'Play a Friend',
  VOCAB_QUIZ = 'Vocabulary Quiz'
}

export interface UserStats {
  username: string;
  email?: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  streak: number;
  coins: number;
  profileImage?: string; // Base64 string for user profile picture
  avatarEmoji?: string;
}

export interface WordEntry {
  word: string;
  player: string;
  points: number;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  reward: string;
}
