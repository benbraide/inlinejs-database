import { AddMagicHandler, CreateMagicHandlerCallback, GetGlobal } from "@benbraide/inlinejs";
import { IDatabaseConcept } from "../types";

function DatabaseMagicHandler_(){
    return (name: string) => {
        if (!name || typeof name !== 'string'){// No name specified
            return null;
        }

        let concept: IDatabaseConcept | null = null;

        const getConcept = () => {
            return concept || GetGlobal().GetConcept<IDatabaseConcept>('database');
        };
        
        return {
            use: (conceptName: string | null) => concept = conceptName ? GetGlobal().GetConcept<IDatabaseConcept>(conceptName) : null,
            wrap: () => getConcept()?.Wrap(name),
            open: () => getConcept()?.Open(name),
            close: () => getConcept()?.Close(name),
            read: (key: string) => getConcept()?.Read(name, key),
            write: (key: string, value: any) => getConcept()?.Write(name, key, value),
            setupIndex: (fields: Record<string, boolean>) => getConcept()?.SetupIndex(name, fields),
            delete: () => getConcept()?.Delete(name),
        };
    };
}

export const DatabaseMagicHandler = CreateMagicHandlerCallback('database', DatabaseMagicHandler_);
export const DbMagicHandler = CreateMagicHandlerCallback('db', DatabaseMagicHandler_);

export function DatabaseMagicHandlerCompact(){
    AddMagicHandler(DatabaseMagicHandler);
    AddMagicHandler(DbMagicHandler);
}
