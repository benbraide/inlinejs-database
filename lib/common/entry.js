"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSDatabase = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const concept_1 = require("./concept");
const local_storage_concept_1 = require("./local-storage-concept");
const memory_storage_concept_1 = require("./memory-storage-concept");
const session_storage_concept_1 = require("./session-storage-concept");
const database_1 = require("./magic/database");
function InlineJSDatabase() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        const concept = new concept_1.DatabaseConcept();
        const localStorage = new local_storage_concept_1.LocalStorageConcept();
        const sessionStorage = new session_storage_concept_1.SessionStorageConcept();
        const memoryStorage = new memory_storage_concept_1.MemoryStorageConcept();
        (0, inlinejs_1.GetGlobal)().SetConcept('database', concept);
        (0, inlinejs_1.GetGlobal)().SetConcept('db', concept);
        (0, inlinejs_1.GetGlobal)().SetConcept('localStorage', localStorage);
        (0, inlinejs_1.GetGlobal)().SetConcept('lsdb', localStorage);
        (0, inlinejs_1.GetGlobal)().SetConcept('sessionStorage', sessionStorage);
        (0, inlinejs_1.GetGlobal)().SetConcept('ssdb', sessionStorage);
        (0, inlinejs_1.GetGlobal)().SetConcept('memoryStorage', memoryStorage);
        (0, inlinejs_1.GetGlobal)().SetConcept('msdb', memoryStorage);
        (0, database_1.DatabaseMagicHandlerCompact)();
    });
}
exports.InlineJSDatabase = InlineJSDatabase;
