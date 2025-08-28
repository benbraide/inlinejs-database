import { AddMagicHandler, CreateMagicHandlerCallback, GetGlobal } from "@benbraide/inlinejs";
function DatabaseMagicHandler_() {
    return (name) => {
        if (!name || typeof name !== 'string') { // No name specified
            return null;
        }
        let concept = null;
        const getConcept = () => {
            return concept || GetGlobal().GetConcept('database');
        };
        return {
            use: (conceptName) => concept = conceptName ? GetGlobal().GetConcept(conceptName) : null,
            wrap: () => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.Wrap(name); },
            open: () => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.Open(name); },
            close: () => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.Close(name); },
            read: (key) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.Read(name, key); },
            write: (key, value) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.Write(name, key, value); },
            setupIndex: (fields) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.SetupIndex(name, fields); },
            delete: () => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.Delete(name); },
        };
    };
}
export const DatabaseMagicHandler = CreateMagicHandlerCallback('database', DatabaseMagicHandler_);
export const DbMagicHandler = CreateMagicHandlerCallback('db', DatabaseMagicHandler_);
export function DatabaseMagicHandlerCompact() {
    AddMagicHandler(DatabaseMagicHandler);
    AddMagicHandler(DbMagicHandler);
}
