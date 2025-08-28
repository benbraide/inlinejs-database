"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStorageWrapper = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
class MemoryStorageWrapper {
    constructor(name) {
        this.data_ = {};
        // Name is not used for memory storage, but kept for API consistency
    }
    get Name() {
        return 'memory';
    }
    get IsOpen() {
        return true;
    }
    get IsOpening() {
        return false;
    }
    Open() {
        return Promise.resolve();
    }
    Close() {
        this.data_ = {}; // Clear in-memory cache
        return Promise.resolve();
    }
    Read(key) {
        return Promise.resolve(this.data_.hasOwnProperty(key) ? this.data_[key] : null);
    }
    Write(key, value) {
        this.data_[key] = (0, inlinejs_1.GetTarget)(value);
        return Promise.resolve();
    }
    SetupIndex(fields) {
        // Not applicable for memory storage
        return Promise.resolve([]);
    }
    Delete() {
        this.data_ = {};
        return Promise.resolve();
    }
}
exports.MemoryStorageWrapper = MemoryStorageWrapper;
