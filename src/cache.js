class LRUCache {
    constructor(maxSize = 50 * 1024 * 1024) { // Default 50MB
        this.maxSize = maxSize;
        this.currentSize = 0;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) {
            return null;
        }
        
        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        
        return value.data;
    }

    set(key, data) {
        // If key exists, remove it first
        if (this.cache.has(key)) {
            this.remove(key);
        }

        const size = this._getSize(data);
        
        // Evict oldest entries if needed
        while (this.currentSize + size > this.maxSize && this.cache.size > 0) {
            const firstKey = this.cache.keys().next().value;
            this.remove(firstKey);
        }

        // Add new entry
        this.cache.set(key, { data, size });
        this.currentSize += size;
    }

    remove(key) {
        if (this.cache.has(key)) {
            const entry = this.cache.get(key);
            this.currentSize -= entry.size;
            this.cache.delete(key);
        }
    }

    clear() {
        this.cache.clear();
        this.currentSize = 0;
    }

    _getSize(obj) {
        // Rough estimation of object size in bytes
        const str = JSON.stringify(obj);
        return str.length * 2; // Assuming 2 bytes per character
    }

    getStats() {
        return {
            entries: this.cache.size,
            currentSize: this.currentSize,
            maxSize: this.maxSize,
            utilization: (this.currentSize / this.maxSize * 100).toFixed(2) + '%'
        };
    }
}

// Singleton instance
let cacheInstance = null;

function getCache(maxSize) {
    if (!cacheInstance) {
        cacheInstance = new LRUCache(maxSize);
    }
    return cacheInstance;
}

module.exports = { LRUCache, getCache };