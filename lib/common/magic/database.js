"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseMagicHandlerCompact = exports.DbMagicHandler = exports.DatabaseMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function DatabaseMagicHandler_() {
    return (name) => {
        if (!name || typeof name !== 'string') { // No name specified
            return null;
        }
        return {
            wrap: () => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept('database')) === null || _a === void 0 ? void 0 : _a.Wrap(name); },
            open: () => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept('database')) === null || _a === void 0 ? void 0 : _a.Open(name); },
            close: () => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept('database')) === null || _a === void 0 ? void 0 : _a.Close(name); },
            read: (key) => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept('database')) === null || _a === void 0 ? void 0 : _a.Read(name, key); },
            write: (key, value) => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept('database')) === null || _a === void 0 ? void 0 : _a.Write(name, key, value); },
            setupIndex: (fields) => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept('database')) === null || _a === void 0 ? void 0 : _a.SetupIndex(name, fields); },
            delete: () => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept('database')) === null || _a === void 0 ? void 0 : _a.Delete(name); },
        };
    };
}
exports.DatabaseMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('database', DatabaseMagicHandler_);
exports.DbMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('db', DatabaseMagicHandler_);
function DatabaseMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.DatabaseMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.DbMagicHandler);
}
exports.DatabaseMagicHandlerCompact = DatabaseMagicHandlerCompact;
