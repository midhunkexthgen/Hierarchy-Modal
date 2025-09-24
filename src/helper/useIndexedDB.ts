const DB_NAME = "LayoutDB";
const STORE_NAME = "Layouts";
const DB_VERSION = 1;

export function useIndexedDB() {
  // Open DB
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Save layout by id
  const saveLayout = async (id: string, layout: unknown) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, layout });
    return new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
    });
  };

  // Get layout by id
  const getLayout = async <T = unknown>(id: string): Promise<T | null> => {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result?.layout ?? null);
      request.onerror = () => resolve(null);
    });
  };

  return { saveLayout, getLayout };
}
