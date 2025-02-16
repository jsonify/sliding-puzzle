export const MOBILE_LAYOUT_STYLES = {
  // Core layout
  CONTAINER: 'min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4 flex flex-col items-center',
  
  // Score bar
  SCORE_BAR: {
    CONTAINER: 'w-full max-w-md flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-lg backdrop-blur-sm',
    SCORE: 'flex items-center gap-2 text-yellow-400',
    SCORE_TEXT: 'text-xl font-bold',
    TIMER: 'flex items-center gap-2 text-slate-200',
    TIMER_TEXT: 'text-xl font-mono',
  },

  // Pattern preview
  PATTERN_PREVIEW: {
    CONTAINER: 'bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700',
    HEADER: 'text-sm font-medium text-slate-200 mb-2',
    GRID_CONTAINER: 'flex justify-center items-center p-2',
    GRID: 'grid grid-cols-5 w-fit mx-auto bg-slate-700/50 p-1 rounded',
    HELPER_TEXT: 'text-xs text-slate-400 mt-2 text-center',
  },

  // Game board
  BOARD: {
    CONTAINER: 'w-full bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg',
    GRID: 'grid grid-cols-5 gap-2 p-4',
  },

  // Menu button
  MENU_BUTTON: {
    CONTAINER: 'mt-8',
    BUTTON: 'p-4 rounded-full bg-slate-700 text-slate-200 shadow-lg hover:bg-slate-600',
  },

  // Bottom sheet
  SHEET: {
    CONTENT: 'w-full max-w-md mx-auto rounded-t-xl bg-slate-900/95 backdrop-blur-xl border-slate-800',
    INNER: 'flex flex-col gap-3 pt-4 px-4 pb-safe',
    ACTIONS: {
      BUTTON: {
        PRIMARY: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg',
        SECONDARY: 'w-full bg-slate-800 hover:bg-slate-700 border-slate-700 text-white font-medium py-2 rounded-lg',
      },
    },
  },

  // Leaderboard section
  LEADERBOARD: {
    CONTAINER: 'mt-6',
    HEADER: 'text-2xl font-bold text-slate-200 mb-4',
    TABS: 'flex border-b border-slate-700 mb-4 overflow-x-auto hide-scrollbar',
    TAB: {
      BASE: 'px-4 py-2 font-medium whitespace-nowrap',
      ACTIVE: 'border-b-2 border-blue-500 text-blue-500',
      INACTIVE: 'text-slate-400',
    },
    FILTERS: {
      CONTAINER: 'flex gap-2 mb-4 overflow-x-auto hide-scrollbar',
      SELECT: 'px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200',
    },
    CARD: {
      CONTAINER: 'bg-slate-800 rounded-lg p-4 mb-4',
      HEADER: 'flex justify-between items-start mb-2',
      TITLE: 'text-lg font-semibold text-slate-200',
      GRID: 'grid grid-cols-2 gap-4',
      LABEL: 'text-sm text-slate-400',
      VALUE: 'ml-2 text-slate-200',
    },
  },

  // Achievement badges
  ACHIEVEMENT: {
    CONTAINER: 'mt-2 flex gap-2',
    BADGE: {
      BASE: 'inline-block text-xs px-2 py-1 rounded',
      UNLOCKED: 'bg-yellow-800 text-yellow-100',
      LOCKED: 'bg-slate-700 text-slate-300',
    },
  },

  // Animations
  ANIMATION: {
    HOVER: 'transition-transform duration-200 hover:scale-105',
    PRESS: 'active:scale-95',
    SLIDE: 'transition-all duration-200 ease-out',
  },

  // Utility classes
  UTILS: {
    HIDE_SCROLLBAR: 'scrollbar-none',
    SAFE_AREA_BOTTOM: 'pb-safe',
  },
} as const;

export const MOBILE_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
} as const;