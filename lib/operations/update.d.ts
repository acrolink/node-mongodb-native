import type { Document } from '../bson';
import type { Collection } from '../collection';
import type { InferIdType } from '../mongo_types';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type Sort, type SortForCmd } from '../sort';
import { type TimeoutContext } from '../timeout';
import { type MongoDBNamespace } from '../utils';
import { type CollationOptions, CommandOperation, type CommandOperationOptions } from './command';
import { type Hint } from './operation';
/** @public */
export interface UpdateOptions extends CommandOperationOptions {
    /** A set of filters specifying to which array elements an update should apply */
    arrayFilters?: Document[];
    /** If true, allows the write to opt-out of document level validation */
    bypassDocumentValidation?: boolean;
    /** Specifies a collation */
    collation?: CollationOptions;
    /** Specify that the update query should only consider plans using the hinted index */
    hint?: Hint;
    /** When true, creates a new document if no document matches the query */
    upsert?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
}
/**
 * @public
 * `TSchema` is the schema of the collection
 */
export interface UpdateResult<TSchema extends Document = Document> {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined */
    acknowledged: boolean;
    /** The number of documents that matched the filter */
    matchedCount: number;
    /** The number of documents that were modified */
    modifiedCount: number;
    /** The number of documents that were upserted */
    upsertedCount: number;
    /** The identifier of the inserted document if an upsert took place */
    upsertedId: InferIdType<TSchema> | null;
}
/** @public */
export interface UpdateStatement {
    /** The query that matches documents to update. */
    q: Document;
    /** The modifications to apply. */
    u: Document | Document[];
    /**  If true, perform an insert if no documents match the query. */
    upsert?: boolean;
    /** If true, updates all documents that meet the query criteria. */
    multi?: boolean;
    /** Specifies the collation to use for the operation. */
    collation?: CollationOptions;
    /** An array of filter documents that determines which array elements to modify for an update operation on an array field. */
    arrayFilters?: Document[];
    /** A document or string that specifies the index to use to support the query predicate. */
    hint?: Hint;
    /** Specifies the sort order for the documents matched by the filter. */
    sort?: SortForCmd;
}
/**
 * @internal
 * UpdateOperation is used in bulk write, while UpdateOneOperation and UpdateManyOperation are only used in the collections API
 */
export declare class UpdateOperation extends CommandOperation<Document> {
    options: UpdateOptions & {
        ordered?: boolean;
    };
    statements: UpdateStatement[];
    constructor(ns: MongoDBNamespace, statements: UpdateStatement[], options: UpdateOptions & {
        ordered?: boolean;
    });
    get commandName(): "update";
    get canRetryWrite(): boolean;
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<Document>;
}
/** @internal */
export declare class UpdateOneOperation extends UpdateOperation {
    constructor(collection: Collection, filter: Document, update: Document, options: UpdateOptions);
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<UpdateResult>;
}
/** @internal */
export declare class UpdateManyOperation extends UpdateOperation {
    constructor(collection: Collection, filter: Document, update: Document, options: UpdateOptions);
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<UpdateResult>;
}
/** @public */
export interface ReplaceOptions extends CommandOperationOptions {
    /** If true, allows the write to opt-out of document level validation */
    bypassDocumentValidation?: boolean;
    /** Specifies a collation */
    collation?: CollationOptions;
    /** Specify that the update query should only consider plans using the hinted index */
    hint?: string | Document;
    /** When true, creates a new document if no document matches the query */
    upsert?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
    /** Specifies the sort order for the documents matched by the filter. */
    sort?: Sort;
}
/** @internal */
export declare class ReplaceOneOperation extends UpdateOperation {
    constructor(collection: Collection, filter: Document, replacement: Document, options: ReplaceOptions);
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<UpdateResult>;
}
export declare function makeUpdateStatement(filter: Document, update: Document | Document[], options: UpdateOptions & {
    multi?: boolean;
} & {
    sort?: Sort;
}): UpdateStatement;
//# sourceMappingURL=update.d.ts.map