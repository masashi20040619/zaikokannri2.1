
import { Prize } from '../types';

const DB_NAME = 'CraneStockDB';
const STORE_NAME = 'prizes';
const DB_VERSION = 1;

export class StorageService {
  private static openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  static async savePrizes(prizes: Prize[]): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(prizes, 'current_inventory');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  static async loadPrizes(): Promise<Prize[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('current_inventory');

      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // localStorageからの移行用
  static getLocalStorageData(): Prize[] | null {
    try {
      const data = localStorage.getItem('crane-game-prizes');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static clearLocalStorage(): void {
    localStorage.removeItem('crane-game-prizes');
  }
}
