import type { Document } from '../bson';
import { CursorResponse } from '../cmap/wire_protocol/responses';
import { type AbstractCursorOptions, type CursorTimeoutMode } from '../cursor/abstract_cursor';
import { type ExplainOptions } from '../explain';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type Sort } from '../sort';
import { type TimeoutContext } from '../timeout';
import { type MongoDBNamespace } from '../utils';
import { type CollationOptions, CommandOperation, type CommandOperationOptions } from './command';
import { type Hint } from './operation';
/**
 * @public
 * @typeParam TSchema - Unused schema definition, deprecated usage, only specify `FindOptions` with no generic
 */
export interface FindOptions<TSchema extends Document = Document> extends Omit<CommandOperationOptions, 'writeConcern' | 'explain'>, AbstractCursorOptions {
    /** Sets the limit of documents returned in the query. */
    limit?: number;
    /** Set to sort the documents coming back from the query. Array of indexes, `[['a', 1]]` etc. */
    sort?: Sort;
    /** The fields to return in the query. Object of fields to either include or exclude (one of, not both), `{'a':1, 'b': 1}` **or** `{'a': 0, 'b': 0}` */
    projection?: Document;
    /** Set to skip N documents ahead in your query (useful for pagination). */
    skip?: number;
    /** Tell the query to use specific indexes in the query. Object of indexes to use, `{'_id':1}` */
    hint?: Hint;
    /** Specify if the cursor can timeout. */
    timeout?: boolean;
    /** Specify if the cursor is tailable. */
    tailable?: boolean;
    /** Specify if the cursor is a tailable-await cursor. Requires `tailable` to be true */
    awaitData?: boolean;
    /** Set the batchSize for the getMoreCommand when iterating over the query results. */
    batchSize?: number;
    /** If true, returns only the index keys in the resulting documents. */
    returnKey?: boolean;
    /** The inclusive lower bound for a specific index */
    min?: Document;
    /** The exclusive upper bound for a specific index */
    max?: Document;
    /** Number of milliseconds to wait before aborting the query. */
    maxTimeMS?: number;
    /** The maximum amount of time for the server to wait on new documents to satisfy a tailable cursor query. Requires `tailable` and `awaitData` to be true */
    maxAwaitTimeMS?: number;
    /** The server normally times out idle cursors after an inactivity period (10 minutes) to prevent excess memory use. Set this option to prevent that. */
    noCursorTimeout?: boolean;
    /** Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields). */
    collation?: CollationOptions;
    /** Allows disk use for blocking sort operations exceeding 100MB memory. (MongoDB 3.2 or higher) */
    allowDiskUse?: boolean;
    /** Determines whether to close the cursor after the first batch. Defaults to false. */
    singleBatch?: boolean;
    /** For queries against a sharded collection, allows the command (or subsequent getMore commands) to return partial results, rather than an error, if one or more queried shards are unavailable. */
    allowPartialResults?: boolean;
    /** Determines whether to return the record identifier for each document. If true, adds a field $recordId to the returned documents. */
    showRecordId?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
    /**
     * Option to enable an optimized code path for queries looking for a particular range of `ts` values in the oplog. Requires `tailable` to be true.
     * @deprecated Starting from MongoDB 4.4 this flag is not needed and will be ignored.
     */
    oplogReplay?: boolean;
    /**
     * Specifies the verbosity mode for the explain output.
     * @deprecated This API is deprecated in favor of `collection.find().explain()`.
     */
    explain?: ExplainOptions['explain'];
    /** @internal*/
    timeoutMode?: CursorTimeoutMode;
}
/** @internal */
export declare class FindOperation extends CommandOperation<CursorResponse> {
    /**
     * @remarks WriteConcern can still be present on the options because
     * we inherit options from the client/db/collection.  The
     * key must be present on the options in order to delete it.
     * This allows typescript to delete the key but will
     * not allow a writeConcern to be assigned as a property on options.
     */
    options: FindOptions & {
        writeConcern?: never;
    };
    filter: Document;
    constructor(ns: MongoDBNamespace, filter?: Document, options?: FindOptions);
    get commandName(): "find";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<CursorResponse>;
}
//# sourceMappingURL=find.d.ts.map