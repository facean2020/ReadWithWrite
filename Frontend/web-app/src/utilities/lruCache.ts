// LRU cache implementation in TypeScript

type ImageBlob = string; // blob URL

export class ImageLRUCache {
    private capacity: number; // Maximum number of items in the cache
    private cache: Map<string, ImageBlob>;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    // Get an image blob from the cache
    get(key: string): ImageBlob | undefined {
        if (!this.cache.has(key)) return undefined;

        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value!); // Re-insert to mark as recently used

        return value;
    }

    // Put an image blob into the cache
    put(key: string, value: ImageBlob): void {
        if (this.cache.has(key)) {
            const oldValue = this.cache.get(key);
            if (oldValue && oldValue.startsWith('blob:')) {
                URL.revokeObjectURL(oldValue);
            }
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey)  {
                const oldValue = this.cache.get(oldestKey);
                if (oldValue && oldValue.startsWith('blob:')) {
                    URL.revokeObjectURL(oldValue);
                }
                this.cache.delete(oldestKey);
            }
        }
        this.cache.set(key, value);
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    clear(): void {
        this.cache.forEach((value) => {
            if (value.startsWith('blob:')) {
                URL.revokeObjectURL(value);
            }
        });
        this.cache.clear();
    }
}