"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageWrapper = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
class LocalStorageWrapper {
    constructor(name) {
        this.data_ = null;
        this.name_ = `inlinejs_db_${name}`;
    }
    get Name() {
        return this.name_;
    }
    get IsOpen() {
        return true; // localStorage is always "open"
    }
    get IsOpening() {
        return false; // localStorage is synchronous
    }
    Open() {
        this.Load_();
        return Promise.resolve();
    }
    Close() {
        this.data_ = null; // Clear in-memory cache
        return Promise.resolve();
    }
    Read(key) {
        var _a, _b;
        this.Load_();
        return Promise.resolve((_b = (_a = this.data_) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : null);
    }
    Write(key, value) {
        this.Load_();
        if (this.data_) {
            this.data_[key] = (0, inlinejs_1.GetTarget)(value);
            this.Save_();
        }
        return Promise.resolve();
    }
    SetupIndex(fields) {
        // Not applicable for localStorage
        return Promise.resolve([]);
    }
    Delete() {
        try {
            localStorage.removeItem(this.name_);
        }
        catch (_a) { }
        this.data_ = null;
        return Promise.resolve();
    }
    Load_() {
        if (this.data_ !== null) {
            return;
        }
        try {
            const stored = localStorage.getItem(this.name_);
            this.data_ = stored ? JSON.parse(stored) : {};
        }
        catch (_a) {
            this.data_ = {};
        }
    }
    Save_() {
        if (this.data_ !== null) {
            try {
                localStorage.setItem(this.name_, JSON.stringify(this.data_));
            }
            catch (_a) { }
        }
    }
}
exports.LocalStorageWrapper = LocalStorageWrapper;
