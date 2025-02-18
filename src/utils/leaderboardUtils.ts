import { 
  GridSize, 
  Leaderboard, 
  GameHistoryEntry, 
  LeaderboardEntry,
  Achievement,
  LeaderboardData,
  GlobalStats,
  LeaderboardCategories,
  GameResult,
  GameMode
} from '../types/game';
import { GameConstants, GridSizes } from '../constants/gameConstants';

const MAX_COLOR_MODE_SCORES = 5;
const LEADERBOARD_VERSION = 2; // Increment when data structure changes
const STORAGE_KEY = 'sliding-puzzle-leaderboard';
const VERSION_KEY = 'sliding-puzzle-leaderboard-version';

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
    description: 'Complete all grid sizes',
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
    gamesPerMode: {
      classic: 0,
      color: 0
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
function getLeaderboardKey(gridSize: GridSize): string {
  return `${gridSize}x${gridSize}`;
}

/**
 * Reset leaderboard data
 */
export function resetLeaderboard(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VERSION_KEY);
}

/**
 * Clear old leaderboard data and set version
 */
function clearOldData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(VERSION_KEY, LEADERBOARD_VERSION.toString());
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
      // Combine bestMoves and bestTime into classicScores array for classic mode
      const classicScores = [data.bestMoves, data.bestTime].filter((entry, index, self) =>
        // Remove duplicates
        index === self.findIndex(e => e.moves === entry.moves && e.timeSeconds === entry.timeSeconds)
      );

      categories[key] = {
        mode: 'classic', // Assume old data is from classic mode
        classicScores,
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

  const newData = {
    categories,
    global: initializeGlobalStats(),
    achievements: ACHIEVEMENTS
  };

  // Save migrated data and update version
  saveLeaderboard(newData);
  localStorage.setItem(VERSION_KEY, LEADERBOARD_VERSION.toString());

  return newData;
}

/**
 * Format time in seconds to mm:ss
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / GameConstants.SECONDS_IN_MINUTE);
  const remainingSeconds = seconds % GameConstants.SECONDS_IN_MINUTE;
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

  // Check version and clear old data if necessary
  const currentVersion = parseInt(localStorage.getItem(VERSION_KEY) || '0', 10);
  if (currentVersion < LEADERBOARD_VERSION) {
    clearOldData();
    return defaultLeaderboard;
  }

  const data = localStorage.getItem(STORAGE_KEY);
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
      clearOldData();
      return defaultLeaderboard;
    }

    // Update achievements array and ensure proper structure
    const leaderboard: LeaderboardData = {
      ...parsedData,
      achievements: ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        unlockedAt: parsedData.achievements.find(a => a.id === achievement.id)?.unlockedAt || ''
      }))
    };

    // Ensure gamesPerMode exists in global stats
    if (!leaderboard.global.gamesPerMode) {
      leaderboard.global.gamesPerMode = {
        classic: 0,
        color: 0
      };
    }

    // Ensure gamesPerSize exists in global stats
    if (!leaderboard.global.gamesPerSize) {
      leaderboard.global.gamesPerSize = GridSizes.SIZES.reduce(
        (acc, size) => ({ ...acc, [size]: 0 }),
        {} as Record<GridSize, number>
      );
    }

    return leaderboard;
  } catch (error) {
    console.error('Failed to parse leaderboard data:', error);
    clearOldData();
    return defaultLeaderboard;
  }
}

/**
 * Save leaderboard data to localStorage
 */
function saveLeaderboard(leaderboard: Leaderboard): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard));
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
    mode: result.mode,
    gridSize: result.gridSize,
    achievementsUnlocked: []
  };
}

/**
 * Sort and limit color mode scores
 */
function updateColorModeScores(scores: LeaderboardEntry[], newEntry: LeaderboardEntry): LeaderboardEntry[] {
  const allScores = [...scores, newEntry];
  
  // Sort by moves first, then by time
  return allScores
    .sort((a, b) => {
      if (a.moves === b.moves) {
        return a.timeSeconds - b.timeSeconds;
      }
      return a.moves - b.moves;
    })
    .slice(0, MAX_COLOR_MODE_SCORES);
}

/**
 * Update classic mode scores
 */
function updateClassicModeScores(scores: LeaderboardEntry[], newEntry: LeaderboardEntry): LeaderboardEntry[] {
  const existingScores = scores || [];
  
  // Add new entry if it's better than existing ones
  const isBetterScore = !existingScores.some(score => 
    score.moves <= newEntry.moves && score.timeSeconds <= newEntry.timeSeconds
  );

  if (isBetterScore) {
    return [...existingScores, newEntry]
      .sort((a, b) => {
        // Sort by moves first, then by time
        if (a.moves === b.moves) {
          return a.timeSeconds - b.timeSeconds;
        }
        return a.moves - b.moves;
      });
  }

  return existingScores;
}

/**
 * Update leaderboard with a new game result
 */
export function updateLeaderboard(result: GameResult): void {
  let leaderboard = loadLeaderboard();
  const key = getLeaderboardKey(result.gridSize);
  const historyEntry = createHistoryEntry(result);

  // Initialize or update category
  if (!leaderboard.categories[key]) {
    leaderboard.categories[key] = {
      mode: result.mode,
      classicScores: result.mode === 'classic' ? [historyEntry] : undefined,
      colorScores: result.mode === 'color' ? [historyEntry] : undefined,
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
    category.mode = result.mode;
    
    // Update mode-specific scores
    if (result.mode === 'classic') {
      category.classicScores = updateClassicModeScores(category.classicScores || [], historyEntry);
    } else {
      category.colorScores = updateColorModeScores(category.colorScores || [], historyEntry);
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
  leaderboard.global.gamesPerMode[result.mode] += GameConstants.GRID_INCREMENT;
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

  // Grid Master achievement
  const completedSizes = new Set(Object.keys(leaderboard.categories).map(key => 
    parseInt(key.split('x')[0], 10) as GridSize
  ));
  if (completedSizes.size === GridSizes.SIZES.length &&
      !leaderboard.achievements.find(a => a.id === 'grid-master')?.unlockedAt) {
    unlockedAchievements.push('grid-master');
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