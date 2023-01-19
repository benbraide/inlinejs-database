"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSDatabase = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const concept_1 = require("./concept");
const database_1 = require("./magic/database");
function InlineJSDatabase() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        const concept = new concept_1.DatabaseConcept();
        (0, inlinejs_1.GetGlobal)().SetConcept('database', concept);
        (0, inlinejs_1.GetGlobal)().SetConcept('db', concept);
        (0, database_1.DatabaseMagicHandlerCompact)();
    });
}
exports.InlineJSDatabase = InlineJSDatabase;
