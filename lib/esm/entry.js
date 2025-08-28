import { GetGlobal, WaitForGlobal } from '@benbraide/inlinejs';
import { DatabaseConcept } from './concept';
import { LocalStorageConcept } from './local-storage-concept';
import { MemoryStorageConcept } from './memory-storage-concept';
import { SessionStorageConcept } from './session-storage-concept';
import { DatabaseMagicHandlerCompact } from './magic/database';
export function InlineJSDatabase() {
    WaitForGlobal().then(() => {
        const concept = new DatabaseConcept();
        const localStorage = new LocalStorageConcept();
        const sessionStorage = new SessionStorageConcept();
        const memoryStorage = new MemoryStorageConcept();
        GetGlobal().SetConcept('database', concept);
        GetGlobal().SetConcept('db', concept);
        GetGlobal().SetConcept('localStorage', localStorage);
        GetGlobal().SetConcept('lsdb', localStorage);
        GetGlobal().SetConcept('sessionStorage', sessionStorage);
        GetGlobal().SetConcept('ssdb', sessionStorage);
        GetGlobal().SetConcept('memoryStorage', memoryStorage);
        GetGlobal().SetConcept('msdb', memoryStorage);
        DatabaseMagicHandlerCompact();
    });
}
