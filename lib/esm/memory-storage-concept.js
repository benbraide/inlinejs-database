import { MemoryStorageWrapper } from './memory-storage-wrapper';
export class MemoryStorageConcept {
    constructor() {
        this.wrappers_ = {};
    }
    Wrap(name) {
        return (this.wrappers_[name] || (this.wrappers_[name] = new MemoryStorageWrapper(name)));
    }
    Open(name) {
        return this.GetWrapper_(name).Open();
    }
    Close(name) {
        var _a;
        return ((_a = this.wrappers_[name]) === null || _a === void 0 ? void 0 : _a.Close()) || Promise.resolve();
    }
    CloseAll() {
        const promises = Object.values(this.wrappers_).map(wrapper => wrapper.Close());
        return Promise.all(promises).then(() => { });
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
        return (this.wrappers_[name] || (this.wrappers_[name] = new MemoryStorageWrapper(name)));
    }
}
