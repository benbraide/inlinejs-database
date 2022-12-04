import { AddMagicHandler, CreateMagicHandlerCallback, GetGlobal } from "@benbraide/inlinejs";
import { IDatabaseConcept } from "../types";

function DatabaseMagicHandler_(){
    return (name: string) => {
        if (!name || typeof name !== 'string'){// No name specified
            return null;
        }
        
        return {
            wrap: () => GetGlobal().GetConcept<IDatabaseConcept>('database')?.Wrap(name),
            open: () => GetGlobal().GetConcept<IDatabaseConcept>('database')?.Open(name),
            close: () => GetGlobal().GetConcept<IDatabaseConcept>('database')?.Close(name),
            read: (key: string) => GetGlobal().GetConcept<IDatabaseConcept>('database')?.Read(name, key),
            write: (key: string, value: any) => GetGlobal().GetConcept<IDatabaseConcept>('database')?.Write(name, key, value),
            setupIndex: (fields: Record<string, boolean>) => GetGlobal().GetConcept<IDatabaseConcept>('database')?.SetupIndex(name, fields),
            delete: () => GetGlobal().GetConcept<IDatabaseConcept>('database')?.Delete(name),
        };
    };
}

export const DatabaseMagicHandler = CreateMagicHandlerCallback('database', DatabaseMagicHandler_);
export const DbMagicHandler = CreateMagicHandlerCallback('db', DatabaseMagicHandler_);

export function DatabaseMagicHandlerCompact(){
    AddMagicHandler(DatabaseMagicHandler);
    AddMagicHandler(DbMagicHandler);
}
