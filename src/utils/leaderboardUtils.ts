import { 
  GridSize, 
  Difficulty, 
  Leaderboard, 
  GameHistoryEntry, 
  LeaderboardEntry,
  Achievement,
  LeaderboardData,
  GlobalStats,
  LeaderboardCategories 
} from '../types/game';
import { GameConstants, GridSizes } from '../constants/gameConstants';

/** Achievement definitions */
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: `Complete any puzzle under ${GameConstants.SPEED_ACHIEVEMENT_THRESHOLD} seconds`,
    unlockedAt: '',
    criteria: { type: 'time', value: GameConstants.SPEED_ACHIEVEMENT_THRESHOLD }
  },
  {
    id: 'efficiency-expert',
    name: 'Efficiency Expert',
    description: 'Complete a puzzle with minimum possible moves',
    unlockedAt: '',
    criteria: { type: 'moves', value: 0 }
  },
  {
    id: 'grid-master',
    name: 'Grid Master',
    description: 'Complete puzzles on all difficulties',
    unlockedAt: '',
    criteria: { type: 'special', value: 0 }
  }
];

/**
 * Calculate minimum possible moves for a grid size
 */
function calculateMinimumMoves(gridSize: GridSize): number {
  return gridSize * gridSize - GameConstants.GRID_INCREMENT;
}

/**
 * Initialize empty global stats
 */
function initializeGlobalStats(): GlobalStats {
  return {
    totalGamesPlayed: 0,
    totalTimePlayed: 0,
    totalMoves: 0,
    gamesPerDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    gamesPerSize: GridSizes.SIZES.reduce((acc, size) => ({
      ...acc,
      [size]: 0
    }), {} as Record<GridSize, number>)
  };
}

/**
 * Generate a unique key for leaderboard entries
 */
function getLeaderboardKey(gridSize: GridSize, difficulty: Difficulty): string {
  return `${gridSize}x${gridSize}-${difficulty}`;
}

interface OldLeaderboardCategoryData {
  bestMoves: LeaderboardEntry;
  bestTime: LeaderboardEntry;
}

/**
 * Type guard for LeaderboardEntry
 */
function isLeaderboardEntry(entry: unknown): entry is LeaderboardEntry {
  if (!entry || typeof entry !== 'object') return false;
  const e = entry as Partial<LeaderboardEntry>;
  return typeof e.moves === 'number' &&
         typeof e.timeSeconds === 'number' &&
         typeof e.completedAt === 'string' &&
         typeof e.difficulty === 'string' &&
         typeof e.gridSize === 'number';
}

/**
 * Type guard for old leaderboard category data
 */
function isOldLeaderboardCategory(data: unknown): data is OldLeaderboardCategoryData {
  if (!data || typeof data !== 'object') return false;
  const category = data as Partial<OldLeaderboardCategoryData>;
  return isLeaderboardEntry(category.bestMoves) &&
         isLeaderboardEntry(category.bestTime);
}

/**
 * Migrate old leaderboard data to new format
 */
function migrateLeaderboardData(oldData: Record<string, unknown>): LeaderboardData {
  const categories: LeaderboardCategories = {};

  // Migrate existing categories
  Object.entries(oldData).forEach(([key, data]) => {
    if (isOldLeaderboardCategory(data)) {
      categories[key] = {
        bestMoves: data.bestMoves,
        bestTime: data.bestTime,
        recentGames: [],
        stats: {
          gamesPlayed: 0,
          totalTime: 0,
          totalMoves: 0,
          averageTime: 0,
          averageMoves: 0
        }
      };
    }
  });

  return {
    categories,
    global: initializeGlobalStats(),
    achievements: ACHIEVEMENTS
  };
}

/**
 * Format time in seconds to mm:ss
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / GameConstants.SPEED_ACHIEVEMENT_THRESHOLD * 2);
  const remainingSeconds = seconds % GameConstants.SPEED_ACHIEVEMENT_THRESHOLD * 2;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Type guard for LeaderboardData
 */
function isLeaderboardData(data: unknown): data is LeaderboardData {
  if (!data || typeof data !== 'object') return false;
  const lbData = data as Partial<LeaderboardData>;
  return typeof lbData.categories === 'object' &&
         typeof lbData.global === 'object' &&
         Array.isArray(lbData.achievements);
}

/**
 * Load leaderboard data from localStorage
 */
export function loadLeaderboard(): Leaderboard {
  const defaultLeaderboard: LeaderboardData = {
    categories: {},
    global: initializeGlobalStats(),
    achievements: ACHIEVEMENTS
  };

  const data = localStorage.getItem('sliding-puzzle-leaderboard');
  if (!data) {
    return defaultLeaderboard;
  }

  try {
    const parsedData = JSON.parse(data);
    
    // Check if data needs migration
    if (!('categories' in parsedData)) {
      return migrateLeaderboardData(parsedData);
    }

    if (!isLeaderboardData(parsedData)) {
      return defaultLeaderboard;
    }

    // Update achievements array
    const leaderboard: LeaderboardData = {
      ...parsedData,
      achievements: ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        unlockedAt: parsedData.achievements.find(a => a.id === achievement.id)?.unlockedAt || ''
      }))
    };

    return leaderboard;
  } catch (error) {
    console.error('Failed to parse leaderboard data:', error);
    return defaultLeaderboard;
  }
}

/**
 * Save leaderboard data to localStorage
 */
function saveLeaderboard(leaderboard: Leaderboard): void {
  localStorage.setItem('sliding-puzzle-leaderboard', JSON.stringify(leaderboard));
}

interface GameResult {
  gridSize: GridSize;
  difficulty: Difficulty;
  moves: number;
  timeSeconds: number;
}

/**
 * Create a new GameHistoryEntry
 */
function createHistoryEntry(result: GameResult): GameHistoryEntry {
  return {
    id: Date.now().toString(),
    moves: result.moves,
    timeSeconds: result.timeSeconds,
    completedAt: new Date().toISOString(),
    difficulty: result.difficulty,
    gridSize: result.gridSize,
    achievementsUnlocked: []
  };
}

/**
 * Update leaderboard with a new game result
 */
export function updateLeaderboard(result: GameResult): void {
  let leaderboard = loadLeaderboard();
  const key = getLeaderboardKey(result.gridSize, result.difficulty);
  const historyEntry = createHistoryEntry(result);

  // Initialize or update category
  if (!leaderboard.categories[key]) {
    leaderboard.categories[key] = {
      bestMoves: historyEntry,
      bestTime: historyEntry,
      recentGames: [historyEntry],
      stats: {
        gamesPlayed: GameConstants.GRID_INCREMENT,
        totalTime: result.timeSeconds,
        totalMoves: result.moves,
        averageTime: result.timeSeconds,
        averageMoves: result.moves
      }
    };
  } else {
    const category = leaderboard.categories[key];
    
    // Update best scores
    if (result.moves < category.bestMoves.moves) {
      category.bestMoves = historyEntry;
    }
    if (result.timeSeconds < category.bestTime.timeSeconds) {
      category.bestTime = historyEntry;
    }
    
    // Update category statistics
    category.stats.gamesPlayed += GameConstants.GRID_INCREMENT;
    category.stats.totalTime += result.timeSeconds;
    category.stats.totalMoves += result.moves;
    category.stats.averageTime = category.stats.totalTime / category.stats.gamesPlayed;
    category.stats.averageMoves = category.stats.totalMoves / category.stats.gamesPlayed;
    
    // Add to recent games with size limit
    category.recentGames.unshift(historyEntry);
    if (category.recentGames.length > GameConstants.MAX_RECENT_GAMES) {
      category.recentGames.pop();
    }
  }

  // Update global statistics
  leaderboard.global.totalGamesPlayed += GameConstants.GRID_INCREMENT;
  leaderboard.global.totalTimePlayed += result.timeSeconds;
  leaderboard.global.totalMoves += result.moves;
  leaderboard.global.gamesPerDifficulty[result.difficulty] += GameConstants.GRID_INCREMENT;
  leaderboard.global.gamesPerSize[result.gridSize] += GameConstants.GRID_INCREMENT;

  // Check for achievements
  const unlockedAchievements: string[] = [];
  
  // Speed Demon achievement
  if (result.timeSeconds <= GameConstants.SPEED_ACHIEVEMENT_THRESHOLD && 
      !leaderboard.achievements.find(a => a.id === 'speed-demon')?.unlockedAt) {
    unlockedAchievements.push('speed-demon');
  }
  
  // Efficiency Expert achievement
  const minMoves = calculateMinimumMoves(result.gridSize);
  if (result.moves <= minMoves && 
      !leaderboard.achievements.find(a => a.id === 'efficiency-expert')?.unlockedAt) {
    unlockedAchievements.push('efficiency-expert');
  }

  // Update achievements
  unlockedAchievements.forEach(id => {
    const achievement = leaderboard.achievements.find(a => a.id === id);
    if (achievement) {
      achievement.unlockedAt = new Date().toISOString();
      historyEntry.achievementsUnlocked.push(id);
    }
  });

  saveLeaderboard(leaderboard);
}