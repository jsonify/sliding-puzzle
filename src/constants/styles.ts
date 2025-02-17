export const LEVEL_SELECT_STYLES = {
  BASE_BUTTON: 'transition-all duration-200 w-24', // Fixed width for grid buttons
  SELECTED_BUTTON: 'ring-2 ring-blue-500 bg-blue-50 dark:bg-gray-700',
  HOVER_BUTTON: 'hover:bg-gray-50 dark:hover:bg-gray-700',
  CONTAINER: 'w-full max-w-xl mx-auto p-6 pb-24', // Add bottom padding for menu button
  TITLE: 'text-3xl font-bold text-center text-gray-900 dark:text-white mb-8',
  SECTION: 'space-y-4',
  SECTION_TITLE: 'text-xl font-semibold text-gray-800 dark:text-gray-200',
  GRID_CONTAINER: 'grid grid-cols-3 gap-6 mx-auto max-w-md justify-items-center', // 3 columns, centered grid
  INSTRUCTIONS: 'text-center text-gray-600 dark:text-gray-400 text-sm mt-8',
  LOCK_OVERLAY: 'absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center',
  LOCK_ICON: 'text-white w-8 h-8',
  MENU_BUTTON: 'fixed bottom-8 left-4 z-50 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200',
} as const;