export interface IDatabaseConcept {
    Wrap(name: string): any;
    Open(name: string): Promise<void>;
    Close(name: string): Promise<void>;
    CloseAll(): Promise<void>;
    Read<T>(name: string, key: string): Promise<T | null>;
    Write<T>(name: string, key: string, value: T): Promise<void>;
    SetupIndex(name: string, fields: Record<string, boolean>): Promise<Array<IDBIndex>>;
    Delete(name: string): Promise<void>;
}
export declare type DatabaseQueueCallbackType = (success: boolean) => void;
