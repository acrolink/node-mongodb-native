import type { Collection } from '../../collection';
import type { Server } from '../../sdam/server';
import type { ClientSession } from '../../sessions';
import { type TimeoutContext } from '../../timeout';
import { AbstractOperation } from '../operation';
/** @internal */
export declare class DropSearchIndexOperation extends AbstractOperation<void> {
    private readonly collection;
    private readonly name;
    constructor(collection: Collection, name: string);
    get commandName(): "dropSearchIndex";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<void>;
}
//# sourceMappingURL=drop.d.ts.map