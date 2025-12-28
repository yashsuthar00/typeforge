/**
 * Represents a player in a typing race
 */
export interface Player {
  id: string;
  username: string;
  avatarUrl?: string;
  isReady: boolean;
  progress: number; // 0-100 percentage
  wpm: number;
  accuracy: number;
  finishedAt?: Date;
}

/**
 * Represents a typing race session
 */
export interface Race {
  id: string;
  text: string;
  players: Player[];
  status: "waiting" | "countdown" | "racing" | "finished";
  startedAt?: Date;
  endsAt?: Date;
  createdAt: Date;
  maxPlayers: number;
  countdownSeconds: number;
}

/**
 * Result of a completed race for a player
 */
export interface RaceResult {
  raceId: string;
  playerId: string;
  username: string;
  wpm: number;
  accuracy: number;
  position: number;
  timeMs: number;
  mistakes: number;
  finishedAt: Date;
}

/**
 * Real-time progress update during a race
 */
export interface RaceProgressUpdate {
  raceId: string;
  playerId: string;
  progress: number; // 0-100
  wpm: number;
  accuracy: number;
  currentPosition: number;
}

/**
 * Entry in the leaderboard
 */
export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  avatarUrl?: string;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  racesCompleted: number;
  racesWon: number;
}
