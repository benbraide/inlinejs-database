export declare class LocalStorageWrapper {
    private name_;
    private data_;
    constructor(name: string);
    get Name(): string;
    get IsOpen(): boolean;
    get IsOpening(): boolean;
    Open(): Promise<void>;
    Close(): Promise<void>;
    Read<T>(key: string): Promise<T | null>;
    Write<T>(key: string, value: T): Promise<void>;
    SetupIndex(fields: Record<string, boolean>): Promise<Array<any>>;
    Delete(): Promise<void>;
    private Load_;
    private Save_;
}
