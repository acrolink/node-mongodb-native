import type { Document } from '../../bson';
import type { Collection } from '../../collection';
import type { Server } from '../../sdam/server';
import type { ClientSession } from '../../sessions';
import { type TimeoutContext } from '../../timeout';
import { AbstractOperation } from '../operation';
/**
 * @public
 */
export interface SearchIndexDescription extends Document {
    /** The name of the index. */
    name?: string;
    /** The index definition. */
    definition: Document;
    /** The type of the index.  Currently `search` or `vectorSearch` are supported. */
    type?: string;
}
/** @internal */
export declare class CreateSearchIndexesOperation extends AbstractOperation<string[]> {
    private readonly collection;
    private readonly descriptions;
    constructor(collection: Collection, descriptions: ReadonlyArray<SearchIndexDescription>);
    get commandName(): "createSearchIndexes";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<string[]>;
}
//# sourceMappingURL=create.d.ts.map