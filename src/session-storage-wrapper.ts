import { GetTarget } from "@benbraide/inlinejs";

export class SessionStorageWrapper {
    private name_: string;
    private data_: Record<string, any> | null = null;

    public constructor(name: string) {
        this.name_ = `inlinejs_db_${name}`;
    }

    public get Name(): string {
        return this.name_;
    }

    public get IsOpen(): boolean {
        return true; // sessionStorage is always "open"
    }

    public get IsOpening(): boolean {
        return false; // sessionStorage is synchronous
    }

    public Open(): Promise<void> {
        this.Load_();
        return Promise.resolve();
    }

    public Close(): Promise<void> {
        this.data_ = null; // Clear in-memory cache
        return Promise.resolve();
    }

    public Read<T>(key: string): Promise<T | null> {
        this.Load_();
        return Promise.resolve(this.data_?.[key] ?? null);
    }

    public Write<T>(key: string, value: T): Promise<void> {
        this.Load_();
        if (this.data_) {
            this.data_[key] = GetTarget(value);
            this.Save_();
        }
        return Promise.resolve();
    }

    public SetupIndex(fields: Record<string, boolean>): Promise<Array<any>> {
        // Not applicable for sessionStorage
        return Promise.resolve([]);
    }

    public Delete(): Promise<void> {
        try {
            sessionStorage.removeItem(this.name_);
        } catch {}
        this.data_ = null;
        return Promise.resolve();
    }

    private Load_() {
        if (this.data_ !== null) {
            return;
        }
        
        try {
            const stored = sessionStorage.getItem(this.name_);
            this.data_ = stored ? JSON.parse(stored) : {};
        } catch {
            this.data_ = {};
        }
    }

    private Save_() {
        if (this.data_ !== null) {
            try {
                sessionStorage.setItem(this.name_, JSON.stringify(this.data_));
            } catch {}
        }
    }
}