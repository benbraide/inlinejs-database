"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConcept = void 0;
const wrapper_1 = require("./wrapper");
class DatabaseConcept {
    constructor() {
        this.wrappers_ = {};
    }
    Wrap(name) {
        return (this.wrappers_[name] || (this.wrappers_[name] = new wrapper_1.DatabaseWrapper(name)));
    }
    Open(name) {
        return (this.wrappers_[name] || (this.wrappers_[name] = new wrapper_1.DatabaseWrapper(name))).Open();
    }
    Close(name) {
        var _a;
        return (((_a = this.wrappers_[name]) === null || _a === void 0 ? void 0 : _a.Close()) || Promise.resolve());
    }
    CloseAll() {
        return new Promise((resolve, reject) => {
            const promises = new Array();
            for (const name in this.wrappers_) {
                promises.push(this.wrappers_[name].Close());
            }
            Promise.all(promises).then(() => resolve(), reject);
        });
    }
    Read(name, key) {
        return this.GetWrapper_(name).Read(key);
    }
    Write(name, key, value) {
        return this.GetWrapper_(name).Write(key, value);
    }
    SetupIndex(name, fields) {
        return this.GetWrapper_(name).SetupIndex(fields);
    }
    Delete(name) {
        return this.GetWrapper_(name).Delete();
    }
    GetWrapper_(name) {
        if (!this.wrappers_[name]) { // Database not open
            (this.wrappers_[name] = new wrapper_1.DatabaseWrapper(name)).Open();
        }
        return this.wrappers_[name];
    }
}
exports.DatabaseConcept = DatabaseConcept;
