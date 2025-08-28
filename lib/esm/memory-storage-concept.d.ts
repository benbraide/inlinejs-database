import { MemoryStorageWrapper } from './memory-storage-wrapper';
export declare class MemoryStorageConcept {
    private wrappers_;
    Wrap(name: string): MemoryStorageWrapper;
    Open(name: string): Promise<void>;
    Close(name: string): Promise<void>;
    CloseAll(): Promise<void>;
    Read<T>(name: string, key: string): Promise<T | null>;
    Write<T>(name: string, key: string, value: T): Promise<void>;
    SetupIndex(name: string, fields: Record<string, boolean>): Promise<Array<any>>;
    Delete(name: string): Promise<void>;
    private GetWrapper_;
}
