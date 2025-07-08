// Utility functions for localStorage operations
export const storage = {
  // Generic get function
  get: <T>(key: string, defaultValue: T): T => {\
    if (typeof window === 'undefined') return defaultValue;
    try {\
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":\`, error);
      return defaultValue;
    }
  },

  // Generic set function
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(\`Error writing to localStorage key "${key}":\`, error);
    }
  },

  // Remove function
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(\`Error removing localStorage key "${key}":\`, error);
    }
  },

  // Clear all function
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  AD_SPEND_DATA: 'adSpendData',
  CALL_CENTER_DATA: 'callCenterData',
  PROFIT_DATA: 'profitData',
  PERFORMANCE_DATA: 'performanceData',
  RAW_MATERIALS: 'rawMaterials',
  FINISHED_GOODS: 'finishedGoods',
  DISPATCH_DATA: 'dispatchData',
  ATTENDANCE_DATA: 'attendanceData',
  PAYROLL_DATA: 'payrollData',
  PRODUCTS_DATA: 'productsData',
  EXPENSES_DATA: 'expensesData',
  STAFF_DATA: 'staffData'
} as const;

// Type for storage keys
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Helper functions for specific data types
export const storageHelpers = {
  // Get array data with fallback
  getArray: <T>(key: StorageKey, defaultValue: T[] = []): T[] => {
    return storage.get(key, defaultValue);
  },

  // Set array data
  setArray: <T>(key: StorageKey, value: T[]): void => {
    storage.set(key, value);
  },

  // Add item to array
  addToArray: <T extends { id: string }>(key: StorageKey, item: T): T[] => {
    const currentData = storageHelpers.getArray<T>(key);
    const newData = [item, ...currentData];
    storage.set(key, newData);
    return newData;
  },

  // Update item in array
  updateInArray: <T extends { id: string }>(key: StorageKey, id: string, updates: Partial<T>): T[] => {
    const currentData = storageHelpers.getArray<T>(key);
    const newData = currentData.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    storage.set(key, newData);
    return newData;
  },

  // Remove item from array
  removeFromArray: <T extends { id: string }>(key: StorageKey, id: string): T[] => {
    const currentData = storageHelpers.getArray<T>(key);
    const newData = currentData.filter(item => item.id !== id);
    storage.set(key, newData);
    return newData;
  }\
};
