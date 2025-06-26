import type { Long } from '../bson';
import { CursorResponse } from '../cmap/wire_protocol/responses';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { type MongoDBNamespace } from '../utils';
import { AbstractOperation, type OperationOptions } from './operation';
/** @internal */
export interface GetMoreOptions extends OperationOptions {
    /** Set the batchSize for the getMoreCommand when iterating over the query results. */
    batchSize?: number;
    /**
     * Comment to apply to the operation.
     *
     * getMore only supports 'comment' in server versions 4.4 and above.
     */
    comment?: unknown;
    /** Number of milliseconds to wait before aborting the query. */
    maxTimeMS?: number;
    /** TODO(NODE-4413): Address bug with maxAwaitTimeMS not being passed in from the cursor correctly */
    maxAwaitTimeMS?: number;
}
/**
 * GetMore command: https://www.mongodb.com/docs/manual/reference/command/getMore/
 * @internal
 */
export interface GetMoreCommand {
    getMore: Long;
    collection: string;
    batchSize?: number;
    maxTimeMS?: number;
    /** Only supported on wire versions 10 or greater */
    comment?: unknown;
}
/** @internal */
export declare class GetMoreOperation extends AbstractOperation {
    cursorId: Long;
    options: GetMoreOptions;
    constructor(ns: MongoDBNamespace, cursorId: Long, server: Server, options: GetMoreOptions);
    get commandName(): "getMore";
    /**
     * Although there is a server already associated with the get more operation, the signature
     * for execute passes a server so we will just use that one.
     */
    execute(server: Server, _session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<CursorResponse>;
}
//# sourceMappingURL=get_more.d.ts.map