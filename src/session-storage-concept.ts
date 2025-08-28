import { SessionStorageWrapper } from './session-storage-wrapper';

export class SessionStorageConcept {
    private wrappers_: Record<string, SessionStorageWrapper> = {};

    public Wrap(name: string): SessionStorageWrapper {
        return (this.wrappers_[name] || (this.wrappers_[name] = new SessionStorageWrapper(name)));
    }

    public Open(name: string): Promise<void> {
        return this.GetWrapper_(name).Open();
    }

    public Close(name: string): Promise<void> {
        return this.wrappers_[name]?.Close() || Promise.resolve();
    }

    public CloseAll(): Promise<void> {
        const promises = Object.values(this.wrappers_).map(wrapper => wrapper.Close());
        return Promise.all(promises).then(() => {});
    }

    public Read<T>(name: string, key: string): Promise<T | null> {
        return this.GetWrapper_(name).Read<T>(key);
    }

    public Write<T>(name: string, key: string, value: T): Promise<void> {
        return this.GetWrapper_(name).Write<T>(key, value);
    }

    public SetupIndex(name: string, fields: Record<string, boolean>): Promise<Array<any>> {
        return this.GetWrapper_(name).SetupIndex(fields);
    }

    public Delete(name: string): Promise<void> {
        return this.GetWrapper_(name).Delete();
    }

    private GetWrapper_(name: string): SessionStorageWrapper {
        return (this.wrappers_[name] || (this.wrappers_[name] = new SessionStorageWrapper(name)));
    }
}