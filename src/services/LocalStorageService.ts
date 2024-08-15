interface TimestampedData<T> {
    timestamp: number;
    data: T;
}

export const LocalStorageService = {
    save<T>(key: string, data: T): void {
        const timestampedData: TimestampedData<T> = {
            timestamp: new Date().getTime(),
            data,
        };
        localStorage.setItem(key, JSON.stringify(timestampedData));
    },

    load<T>(key: string, maxAge: number): T | null {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) {
            return null;
        }

        const item: TimestampedData<T> = JSON.parse(itemStr);
        const now = new Date().getTime();

        if (now - item.timestamp > maxAge) {
            localStorage.removeItem(key);
            return null;
        }

        return item.data;
    },

    remove(key: string): void {
        localStorage.removeItem(key);
    },
};
