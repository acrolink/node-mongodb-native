import type { Document } from '../bson';
import type { Collection } from '../collection';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { type MongoDBNamespace } from '../utils';
import { type WriteConcernOptions } from '../write_concern';
import { type CollationOptions, CommandOperation, type CommandOperationOptions } from './command';
import { type Hint } from './operation';
/** @public */
export interface DeleteOptions extends CommandOperationOptions, WriteConcernOptions {
    /** If true, when an insert fails, don't execute the remaining writes. If false, continue with remaining inserts when one fails. */
    ordered?: boolean;
    /** Specifies the collation to use for the operation */
    collation?: CollationOptions;
    /** Specify that the update query should only consider plans using the hinted index */
    hint?: string | Document;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
}
/** @public */
export interface DeleteResult {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined. */
    acknowledged: boolean;
    /** The number of documents that were deleted */
    deletedCount: number;
}
/** @public */
export interface DeleteStatement {
    /** The query that matches documents to delete. */
    q: Document;
    /** The number of matching documents to delete. */
    limit: number;
    /** Specifies the collation to use for the operation. */
    collation?: CollationOptions;
    /** A document or string that specifies the index to use to support the query predicate. */
    hint?: Hint;
}
/** @internal */
export declare class DeleteOperation extends CommandOperation<DeleteResult> {
    options: DeleteOptions;
    statements: DeleteStatement[];
    constructor(ns: MongoDBNamespace, statements: DeleteStatement[], options: DeleteOptions);
    get commandName(): "delete";
    get canRetryWrite(): boolean;
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<DeleteResult>;
}
export declare class DeleteOneOperation extends DeleteOperation {
    constructor(collection: Collection, filter: Document, options: DeleteOptions);
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<DeleteResult>;
}
export declare class DeleteManyOperation extends DeleteOperation {
    constructor(collection: Collection, filter: Document, options: DeleteOptions);
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<DeleteResult>;
}
export declare function makeDeleteStatement(filter: Document, options: DeleteOptions & {
    limit?: number;
}): DeleteStatement;
//# sourceMappingURL=delete.d.ts.map