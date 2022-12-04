import { GetGlobal, WaitForGlobal } from '@benbraide/inlinejs';

import { DatabaseConcept } from './concept';

import { DatabaseMagicHandlerCompact } from './magic/database';

WaitForGlobal().then(() => {
    GetGlobal().SetConcept('database', new DatabaseConcept());
    GetGlobal().SetConcept('db', new DatabaseConcept());

    DatabaseMagicHandlerCompact();
});
