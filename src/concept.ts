import { IDatabaseConcept } from "./types";
import { DatabaseWrapper } from "./wrapper";

export class DatabaseConcept implements IDatabaseConcept{
    private wrappers_: Record<string, DatabaseWrapper> = {};

    public Wrap(name: string): any{
        return (this.wrappers_[name] || (this.wrappers_[name] = new DatabaseWrapper(name)));
    }

    public Open(name: string): Promise<void>{
        return (this.wrappers_[name] || (this.wrappers_[name] = new DatabaseWrapper(name))).Open();
    }

    public Close(name: string): Promise<void>{
        return (this.wrappers_[name]?.Close() || Promise.resolve());
    }

    public CloseAll(): Promise<void>{
        return new Promise((resolve, reject) => {
            const promises = new Array<Promise<void>>();

            for (const name in this.wrappers_){
                promises.push(this.wrappers_[name].Close());
            }

            Promise.all(promises).then(() => resolve(), reject);
        });
    }

    public Read<T>(name: string, key: string): Promise<T | null>{
        return this.GetWrapper_(name).Read<T>(key);
    }

    public Write<T>(name: string, key: string, value: T): Promise<void>{
        return this.GetWrapper_(name).Write<T>(key, value);
    }

    public SetupIndex(name: string, fields: Record<string, boolean>): Promise<Array<IDBIndex>>{
        return this.GetWrapper_(name).SetupIndex(fields);
    }

    public Delete(name: string): Promise<void>{
        return this.GetWrapper_(name).Delete();
    }

    private GetWrapper_(name: string): DatabaseWrapper{
        if (!this.wrappers_[name]){// Database not open
            (this.wrappers_[name] = new DatabaseWrapper(name)).Open();
        }

        return this.wrappers_[name];
    }
}
