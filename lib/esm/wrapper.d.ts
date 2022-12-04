export declare class DatabaseWrapper {
    private name_;
    private handle_;
    private isOpening_;
    private queuedRequests_;
    constructor(name_: string);
    get Name(): string;
    get IsOpen(): boolean;
    get IsOpening(): boolean;
    Open(): Promise<void>;
    Close(): Promise<void>;
    Read<T>(key: string): Promise<T>;
    Write<T>(key: string, value: T): Promise<void>;
    SetupIndex(fields: Record<string, boolean>): Promise<Array<IDBIndex>>;
    Delete(): Promise<void>;
    private ExecuteQueue_;
}
