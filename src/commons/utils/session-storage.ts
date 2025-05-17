export const sessionStorageUtil = {
  setItem: <T>(key: string, value: T): void => {
    try {
      const json = JSON.stringify(value);
      sessionStorage.setItem(key, json);
    } catch (err) {
      console.error(`Error saving "${key}" to sessionStorage`, err);
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const json = sessionStorage.getItem(key);
      if (!json) return null;
      return JSON.parse(json) as T;
    } catch (err) {
      console.error(`Error parsing "${key}" from sessionStorage`, err);
      return null;
    }
  },

  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  },

  clear: (): void => {
    sessionStorage.clear();
  },
};
