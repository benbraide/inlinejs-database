import { GetTarget } from "@benbraide/inlinejs";

export class MemoryStorageWrapper {
    private data_: Record<string, any> = {};

    public constructor(name: string) {
        // Name is not used for memory storage, but kept for API consistency
    }

    public get Name(): string {
        return 'memory';
    }

    public get IsOpen(): boolean {
        return true;
    }

    public get IsOpening(): boolean {
        return false;
    }

    public Open(): Promise<void> {
        return Promise.resolve();
    }

    public Close(): Promise<void> {
        this.data_ = {}; // Clear in-memory cache
        return Promise.resolve();
    }

    public Read<T>(key: string): Promise<T | null> {
        return Promise.resolve(this.data_.hasOwnProperty(key) ? this.data_[key] : null);
    }

    public Write<T>(key: string, value: T): Promise<void> {
        this.data_[key] = GetTarget(value);
        return Promise.resolve();
    }

    public SetupIndex(fields: Record<string, boolean>): Promise<Array<any>> {
        // Not applicable for memory storage
        return Promise.resolve([]);
    }

    public Delete(): Promise<void> {
        this.data_ = {};
        return Promise.resolve();
    }
}