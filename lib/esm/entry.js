import { GetGlobal, WaitForGlobal } from '@benbraide/inlinejs';
import { DatabaseConcept } from './concept';
import { DatabaseMagicHandlerCompact } from './magic/database';
export function InlineJSDatabase() {
    WaitForGlobal().then(() => {
        const concept = new DatabaseConcept();
        GetGlobal().SetConcept('database', concept);
        GetGlobal().SetConcept('db', concept);
        DatabaseMagicHandlerCompact();
    });
}
