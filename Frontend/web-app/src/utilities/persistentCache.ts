import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface ImageCacheDB extends DBSchema {
  images: {
    key: string; // image URL
    value: {
      key: string;
      data: Blob;
      timestamp: number;
      size: number;
    };
    indexes: { 'timestamp': number };
  };
}

const DB_NAME = 'ImageCacheDB';
const STORE_NAME = 'images';
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_ITEM_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ImageCacheDB>> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<ImageCacheDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            },
        });
    }
    return dbPromise!;
}

export async function getImageFromCache(url: string): Promise<Blob | null> {
    try {
        const db = await getDB();
        const record = await db.get(STORE_NAME, url);
        if (!record || (Date.now() - record.timestamp) > MAX_ITEM_AGE) {
            if (record) await db.delete(STORE_NAME, url); // Remove stale item
            return null;
        }
        return record.data;
    } catch (error) {
        console.error('Error getting image from cache:', error);
        return null;
    }
}

export async function putImageInCache(url: string, data: Blob): Promise<void> {
    try {
        const db = await getDB();
        await db.put(STORE_NAME, { key: url, data, timestamp: Date.now(), size: data.size });
        await enforceCacheSizeLimit(db);
    } catch (error) {
        console.error('Error putting image in cache:', error);
    }
}

async function enforceCacheSizeLimit(db: IDBPDatabase<ImageCacheDB>) {
    try {
        let totalSize = 0;
        const tx = db.transaction(STORE_NAME);
        let cursor = await tx.store.openCursor();
        const records: {key: string; size: number; timestamp: number}[] = [];

        while (cursor) {
            const { key, size, timestamp } = cursor.value;
            totalSize += size;
            records.push({ key, size, timestamp });
            cursor = await cursor.continue();
        }

        if (totalSize <= MAX_CACHE_SIZE) return;

        records.sort((a, b) => a.timestamp - b.timestamp); // Oldest first

        for (const record of records) {
            if (totalSize <= MAX_CACHE_SIZE) break;
            await db.delete(STORE_NAME, record.key);
            totalSize -= record.size;
        }
    } catch (error) {
        console.error('Error enforcing cache size limit:', error);
    }
}