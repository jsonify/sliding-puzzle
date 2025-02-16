# Mobile Layout Implementation Plan

[Previous sections unchanged until Storage & Data Management section...]

## Storage & Data Management

### Local Storage Strategy
```typescript
interface StorageStrategy {
  // Core operations
  save: (key: string, data: unknown) => void;
  load: <T>(key: string) => T | null;
  remove: (key: string) => void;
  
  // Advanced operations
  backup: () => Promise<void>;
  restore: () => Promise<void>;
  migrate: () => Promise<void>;
}

class LocalStorageManager implements StorageStrategy {
  private readonly STORAGE_VERSION = '1';
  private readonly STORAGE_PREFIX = 'sliding-puzzle';
  
  // Keys
  private readonly KEYS = {
    LEADERBOARD: `${this.STORAGE_PREFIX}-leaderboard`,
    SETTINGS: `${this.STORAGE_PREFIX}-settings`,
    VERSION: `${this.STORAGE_PREFIX}-version`,
  };
  
  // Error handling
  private handleStorageError(operation: string, error: unknown): void {
    console.error(`Storage operation ${operation} failed:`, error);
    // Implement user notification system
  }
  
  // Implementation details...
}
```

### Data Management Improvements

1. Optimistic Updates:
```typescript
async function updateLeaderboardWithRetry(
  result: GameResult,
  retries = 3
): Promise<void> {
  try {
    // Optimistically update UI
    updateUIState(result);
    
    // Attempt storage
    await storage.save(KEYS.LEADERBOARD, result);
  } catch (error) {
    if (retries > 0) {
      await delay(1000);
      return updateLeaderboardWithRetry(result, retries - 1);
    }
    // Handle permanent failure
    handleStorageError(error);
  }
}
```

2. Data Integrity:
```typescript
interface DataValidation {
  validateLeaderboard: (data: unknown) => boolean;
  sanitizeInput: (data: unknown) => LeaderboardData;
  createBackup: () => Promise<void>;
}
```

3. Migration Support:
```typescript
interface MigrationStrategy {
  version: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

const migrations: MigrationStrategy[] = [
  {
    version: '1.1',
    up: async () => {
      // Migration logic
    },
    down: async () => {
      // Rollback logic
    },
  },
];
```

### Offline Support

1. Implementation:
```typescript
class OfflineSupport {
  private queue: GameResult[] = [];
  
  async queueUpdate(result: GameResult): Promise<void> {
    this.queue.push(result);
    await this.processQueue();
  }
  
  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const result = this.queue[0];
      try {
        await updateLeaderboard(result);
        this.queue.shift();
      } catch (error) {
        // Wait for next opportunity
        break;
      }
    }
  }
}
```

2. Storage Quota Management:
```typescript
class StorageQuotaManager {
  private readonly MAX_ENTRIES = 1000;
  private readonly CLEANUP_THRESHOLD = 0.9; // 90%
  
  async checkQuota(): Promise<void> {
    const usage = await this.calculateUsage();
    if (usage > this.CLEANUP_THRESHOLD) {
      await this.cleanup();
    }
  }
  
  private async cleanup(): Promise<void> {
    // Implement cleanup strategy
  }
}
```

### Error Recovery

1. Automatic Recovery:
```typescript
class ErrorRecovery {
  async attemptRecovery(): Promise<void> {
    try {
      // 1. Validate current data
      const isValid = await this.validateData();
      if (!isValid) {
        // 2. Attempt to restore from backup
        await this.restoreFromBackup();
      }
    } catch (error) {
      // 3. Reset to default state if all recovery fails
      await this.resetToDefault();
    }
  }
}
```

2. User Communication:
```typescript
interface StorageError {
  type: 'quota_exceeded' | 'corruption' | 'version_mismatch';
  message: string;
  recovery?: () => Promise<void>;
}

const handleStorageError = async (error: StorageError): Promise<void> => {
  // Show user-friendly error message
  // Provide recovery options if available
};
```

### Integration with UI

1. Loading States:
```typescript
interface LoadingState {
  isLoading: boolean;
  error: StorageError | null;
  lastSync: Date | null;
}
```

2. Sync Indicators:
```typescript
const SyncStatus: React.FC = () => {
  const { pendingUpdates, lastSync } = useStorageSync();
  
  return (
    <div className="text-sm text-slate-400">
      {pendingUpdates > 0 ? (
        <span>Syncing {pendingUpdates} updates...</span>
      ) : (
        <span>Last updated: {formatTime(lastSync)}</span>
      )}
    </div>
  );
};
```

### Testing Considerations

1. Storage Scenarios:
- Test quota exceeded cases
- Validate corruption recovery
- Verify offline queue processing
- Check migration paths

2. Error Handling:
- Test recovery procedures
- Verify user notifications
- Validate fallback behaviors

3. Performance:
- Measure storage operation times
- Monitor memory usage
- Track update frequencies

[Rest of plan remains unchanged...]