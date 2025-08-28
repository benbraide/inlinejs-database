import { GetTarget, JournalTry } from "@benbraide/inlinejs";
import { DatabaseQueueCallbackType } from "./types";

export class DatabaseWrapper{
    private handle_: IDBDatabase | null = null;
    private isOpening_ = false;
    private queuedRequests_ = new Array<DatabaseQueueCallbackType>();
    
    public constructor(private name_: string){}

    public get Name(): string{
        return this.name_;
    }

    public get IsOpen(): boolean{
        return (this.handle_ !== null);
    }

    public get IsOpening(): boolean{
        return this.isOpening_;
    }

    public Open(): Promise<void>{
        if (this.handle_){// Already open
            return Promise.resolve();
        }

        if (this.isOpening_){// Database is already opening
            return new Promise((resolve, reject) => {// Queue request
                this.queuedRequests_.push(success => (success ? resolve() : reject()));
            });
        }

        this.isOpening_ = true;// Database is opening
        
        return new Promise((resolve, reject) => {// Open database
            const request = indexedDB.open(this.name_);

            request.addEventListener('success', (event) => {// Database opened successfully
                this.handle_ = (event.target as IDBOpenDBRequest).result;
                this.isOpening_ = false;
                this.ExecuteQueue_(true);
                resolve();
            });

            request.addEventListener('error', (event) => {// Database failed to open
                this.isOpening_ = false;
                this.ExecuteQueue_(false);
                reject((event.target as IDBOpenDBRequest).error);
            });

            request.addEventListener('upgradeneeded', (event) => {// Database is being upgraded
                const db = (event.target as IDBOpenDBRequest).result;

                db.addEventListener('error', (event) => {
                    this.isOpening_ = false;
                    this.ExecuteQueue_(false);
                    reject((event.target as IDBOpenDBRequest).error);
                });

                if (!db.objectStoreNames.contains('data')){
                    db.createObjectStore('data');
                }
            });
        });
    }

    public Close(): Promise<void>{
        if (this.isOpening_){// Database is opening
            return new Promise((resolve, reject) => {// Queue request
                this.queuedRequests_.push(success => (success ? this.Close().then(resolve, reject) : reject()));
            });
        }
        
        if (this.handle_){// Database is open
            this.handle_!.close();// Close database
            this.handle_ = null;// Clear handle
        }

        return Promise.resolve();
    }

    public Read<T>(key: string): Promise<T | null>{
        if (this.isOpening_){// Database is opening
            return new Promise((resolve, reject) => {// Queue request
                this.queuedRequests_.push(success => (success ? this.Read<T>(key).then(resolve, reject) : reject()));
            });
        }
        
        if (!this.handle_){// Database is closed
            return Promise.reject(new Error('Database is closed'));
        }

        return new Promise((resolve, reject) => {// Read from database
            const transaction = this.handle_!.transaction('data', 'readonly');
            const objectStore = transaction.objectStore('data');
            const request = objectStore.get(key);

            request.addEventListener('success', (event) => {
                resolve((event.target as IDBRequest).result);
            });

            request.addEventListener('error', (event) => {
                reject((event.target as IDBRequest).error);
            });
        });
    }

    public Write<T>(key: string, value: T): Promise<void>{
        if (this.isOpening_){// Database is opening
            return new Promise((resolve, reject) => {// Queue request
                this.queuedRequests_.push(success => (success ? this.Write<T>(key, value).then(resolve, reject) : reject()));
            });
        }

        if (!this.handle_){// Database is closed
            return Promise.reject(new Error('Database is closed'));
        }

        return new Promise((resolve, reject) => {// Write to database
            const transaction = this.handle_!.transaction('data', 'readwrite');
            const objectStore = transaction.objectStore('data');
            const request = objectStore.put(GetTarget(value), key);

            request.addEventListener('success', () => {
                resolve();
            });

            request.addEventListener('error', (event) => {
                reject((event.target as IDBRequest).error);
            });
        });
    }

    public SetupIndex(fields: Record<string, boolean>): Promise<Array<IDBIndex>>{
        if (this.isOpening_){// Database is opening
            return new Promise((resolve, reject) => {// Queue request
                this.queuedRequests_.push(success => (success ? this.SetupIndex(fields).then(resolve, reject) : reject()));
            });
        }

        if (!this.handle_){ // Database is closed, open it first
            return this.Open().then(() => this.SetupIndex(fields));
        }
        
        const transaction = this.handle_.transaction('data', 'readonly');
        const objectStore = transaction.objectStore('data');
        const existingIndexes = Array.from(objectStore.indexNames);
        const needsUpgrade = Object.keys(fields).some(field => !existingIndexes.includes(field));

        if (!needsUpgrade) {
            return Promise.resolve([]);
        }

        // Needs upgrade, must close and reopen with a new version
        const currentVersion = this.handle_.version;
        this.handle_.close();
        this.handle_ = null;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name_, currentVersion + 1);
            
            request.addEventListener('success', (event) => {
                this.handle_ = (event.target as IDBOpenDBRequest).result;
                resolve([]); // Don't have access to the created indexes here, but the operation succeeded.
            });

            request.addEventListener('error', (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            });

            request.addEventListener('upgradeneeded', (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = (event.target as IDBOpenDBRequest).transaction;
                if (!transaction) return;

                const objectStore = transaction.objectStore('data');
                for (const [field, unique] of Object.entries(fields)){
                    !objectStore.indexNames.contains(field) && objectStore.createIndex(field, field, {unique});
                }
            });
        });
    }

    public Delete(): Promise<void>{
        return new Promise((resolve, reject) => {// Delete database
            this.Close().then(() => {// Close database
                const request = indexedDB.deleteDatabase(this.name_);

                request.addEventListener('success', () => {
                    resolve();
                });

                request.addEventListener('error', (event) => {
                    reject((event.target as IDBOpenDBRequest).error);
                });
            }, reject);
        });
    }

    private ExecuteQueue_(success: boolean): void{
        this.queuedRequests_.forEach(callback => JournalTry(() => callback(success)));
        this.queuedRequests_ = new Array<DatabaseQueueCallbackType>();
    }
}
