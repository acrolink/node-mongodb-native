import type { Document } from '../bson';
import { CursorResponse } from '../cmap/wire_protocol/responses';
import { type CursorTimeoutMode } from '../cursor/abstract_cursor';
import { type ExplainOptions } from '../explain';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { type MongoDBNamespace } from '../utils';
import { type CollationOptions, CommandOperation, type CommandOperationOptions } from './command';
import { type Hint } from './operation';
/** @internal */
export declare const DB_AGGREGATE_COLLECTION: 1;
/** @public */
export interface AggregateOptions extends Omit<CommandOperationOptions, 'explain'> {
    /** allowDiskUse lets the server know if it can use disk to store temporary results for the aggregation (requires mongodb 2.6 \>). */
    allowDiskUse?: boolean;
    /** The number of documents to return per batch. See [aggregation documentation](https://www.mongodb.com/docs/manual/reference/command/aggregate). */
    batchSize?: number;
    /** Allow driver to bypass schema validation. */
    bypassDocumentValidation?: boolean;
    /** Return the query as cursor, on 2.6 \> it returns as a real cursor on pre 2.6 it returns as an emulated cursor. */
    cursor?: Document;
    /**
     * Specifies a cumulative time limit in milliseconds for processing operations on the cursor. MongoDB interrupts the operation at the earliest following interrupt point.
     */
    maxTimeMS?: number;
    /** The maximum amount of time for the server to wait on new documents to satisfy a tailable cursor query. */
    maxAwaitTimeMS?: number;
    /** Specify collation. */
    collation?: CollationOptions;
    /** Add an index selection hint to an aggregation command */
    hint?: Hint;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
    out?: string;
    /**
     * Specifies the verbosity mode for the explain output.
     * @deprecated This API is deprecated in favor of `collection.aggregate().explain()`
     * or `db.aggregate().explain()`.
     */
    explain?: ExplainOptions['explain'];
    /** @internal */
    timeoutMode?: CursorTimeoutMode;
}
/** @internal */
export declare class AggregateOperation extends CommandOperation<CursorResponse> {
    options: AggregateOptions;
    target: string | typeof DB_AGGREGATE_COLLECTION;
    pipeline: Document[];
    hasWriteStage: boolean;
    constructor(ns: MongoDBNamespace, pipeline: Document[], options?: AggregateOptions);
    get commandName(): "aggregate";
    get canRetryRead(): boolean;
    addToPipeline(stage: Document): void;
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<CursorResponse>;
}
//# sourceMappingURL=aggregate.d.ts.map