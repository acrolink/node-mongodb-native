import type { Document } from '../bson';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import type { MongoDBNamespace } from '../utils';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export interface CountOptions extends CommandOperationOptions {
    /** The number of documents to skip. */
    skip?: number;
    /** The maximum amounts to count before aborting. */
    limit?: number;
    /**
     * Number of milliseconds to wait before aborting the query.
     */
    maxTimeMS?: number;
    /** An index name hint for the query. */
    hint?: string | Document;
}
/** @internal */
export declare class CountOperation extends CommandOperation<number> {
    options: CountOptions;
    collectionName?: string;
    query: Document;
    constructor(namespace: MongoDBNamespace, filter: Document, options: CountOptions);
    get commandName(): "count";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<number>;
}
//# sourceMappingURL=count.d.ts.map