"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseWrapper = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
class DatabaseWrapper {
    constructor(name_) {
        this.name_ = name_;
        this.handle_ = null;
        this.isOpening_ = false;
        this.queuedRequests_ = new Array();
    }
    get Name() {
        return this.name_;
    }
    get IsOpen() {
        return (this.handle_ !== null);
    }
    get IsOpening() {
        return this.isOpening_;
    }
    Open() {
        if (this.handle_) { // Already open
            return Promise.resolve();
        }
        if (this.isOpening_) { // Database is already opening
            return new Promise((resolve, reject) => {
                this.queuedRequests_.push(success => (success ? resolve() : reject()));
            });
        }
        this.isOpening_ = true; // Database is opening
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name_);
            request.addEventListener('success', (event) => {
                this.handle_ = event.target.result;
                this.isOpening_ = false;
                this.ExecuteQueue_(true);
                resolve();
            });
            request.addEventListener('error', (event) => {
                this.isOpening_ = false;
                this.ExecuteQueue_(false);
                reject(event.target.error);
            });
            request.addEventListener('upgradeneeded', (event) => {
                const db = event.target.result;
                db.addEventListener('error', (event) => {
                    this.isOpening_ = false;
                    this.ExecuteQueue_(false);
                    reject(event.target.error);
                });
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data');
                }
            });
        });
    }
    Close() {
        if (this.isOpening_) { // Database is opening
            return new Promise((resolve, reject) => {
                this.queuedRequests_.push(success => (success ? this.Close().then(resolve, reject) : reject()));
            });
        }
        if (this.handle_) { // Database is open
            this.handle_.close(); // Close database
            this.handle_ = null; // Clear handle
        }
        return Promise.resolve();
    }
    Read(key) {
        if (this.isOpening_) { // Database is opening
            return new Promise((resolve, reject) => {
                this.queuedRequests_.push(success => (success ? this.Read(key).then(resolve, reject) : reject()));
            });
        }
        if (!this.handle_) { // Database is closed
            return Promise.reject(new Error('Database is closed'));
        }
        return new Promise((resolve, reject) => {
            const transaction = this.handle_.transaction('data', 'readonly');
            const objectStore = transaction.objectStore('data');
            const request = objectStore.get(key);
            request.addEventListener('success', (event) => {
                resolve(event.target.result);
            });
            request.addEventListener('error', (event) => {
                reject(event.target.error);
            });
        });
    }
    Write(key, value) {
        if (this.isOpening_) { // Database is opening
            return new Promise((resolve, reject) => {
                this.queuedRequests_.push(success => (success ? this.Write(key, value).then(resolve, reject) : reject()));
            });
        }
        if (!this.handle_) { // Database is closed
            return Promise.reject(new Error('Database is closed'));
        }
        return new Promise((resolve, reject) => {
            const transaction = this.handle_.transaction('data', 'readwrite');
            const objectStore = transaction.objectStore('data');
            const request = objectStore.put((0, inlinejs_1.GetTarget)(value), key);
            request.addEventListener('success', () => {
                resolve();
            });
            request.addEventListener('error', (event) => {
                reject(event.target.error);
            });
        });
    }
    SetupIndex(fields) {
        if (this.isOpening_) { // Database is opening
            return new Promise((resolve, reject) => {
                this.queuedRequests_.push(success => (success ? this.SetupIndex(fields).then(resolve, reject) : reject()));
            });
        }
        if (!this.handle_) { // Database is closed, open it first
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
                this.handle_ = event.target.result;
                resolve([]); // Don't have access to the created indexes here, but the operation succeeded.
            });
            request.addEventListener('error', (event) => {
                reject(event.target.error);
            });
            request.addEventListener('upgradeneeded', (event) => {
                const db = event.target.result;
                const transaction = event.target.transaction;
                if (!transaction)
                    return;
                const objectStore = transaction.objectStore('data');
                for (const [field, unique] of Object.entries(fields)) {
                    !objectStore.indexNames.contains(field) && objectStore.createIndex(field, field, { unique });
                }
            });
        });
    }
    Delete() {
        return new Promise((resolve, reject) => {
            this.Close().then(() => {
                const request = indexedDB.deleteDatabase(this.name_);
                request.addEventListener('success', () => {
                    resolve();
                });
                request.addEventListener('error', (event) => {
                    reject(event.target.error);
                });
            }, reject);
        });
    }
    ExecuteQueue_(success) {
        this.queuedRequests_.forEach(callback => (0, inlinejs_1.JournalTry)(() => callback(success)));
        this.queuedRequests_ = new Array();
    }
}
exports.DatabaseWrapper = DatabaseWrapper;
