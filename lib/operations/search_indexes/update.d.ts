import type { Document } from '../../bson';
import type { Collection } from '../../collection';
import type { Server } from '../../sdam/server';
import type { ClientSession } from '../../sessions';
import { type TimeoutContext } from '../../timeout';
import { AbstractOperation } from '../operation';
/** @internal */
export declare class UpdateSearchIndexOperation extends AbstractOperation<void> {
    private readonly collection;
    private readonly name;
    private readonly definition;
    constructor(collection: Collection, name: string, definition: Document);
    get commandName(): "updateSearchIndex";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<void>;
}
//# sourceMappingURL=update.d.ts.map