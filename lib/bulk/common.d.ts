import { type BSONSerializeOptions, type Document } from '../bson';
import type { Collection } from '../collection';
import { type AnyError, MongoServerError } from '../error';
import type { Filter, OneOrMore, OptionalId, UpdateFilter, WithoutId } from '../mongo_types';
import type { CollationOptions, CommandOperationOptions } from '../operations/command';
import { type DeleteStatement } from '../operations/delete';
import { AbstractOperation, type Hint } from '../operations/operation';
import { type UpdateStatement } from '../operations/update';
import type { Server } from '../sdam/server';
import type { Topology } from '../sdam/topology';
import type { ClientSession } from '../sessions';
import { type Sort } from '../sort';
import { type TimeoutContext } from '../timeout';
import { type MongoDBNamespace } from '../utils';
import { WriteConcern } from '../write_concern';
/** @public */
export declare const BatchType: Readonly<{
    readonly INSERT: 1;
    readonly UPDATE: 2;
    readonly DELETE: 3;
}>;
/** @public */
export type BatchType = (typeof BatchType)[keyof typeof BatchType];
/** @public */
export interface InsertOneModel<TSchema extends Document = Document> {
    /** The document to insert. */
    document: OptionalId<TSchema>;
}
/** @public */
export interface DeleteOneModel<TSchema extends Document = Document> {
    /** The filter to limit the deleted documents. */
    filter: Filter<TSchema>;
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
}
/** @public */
export interface DeleteManyModel<TSchema extends Document = Document> {
    /** The filter to limit the deleted documents. */
    filter: Filter<TSchema>;
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
}
/** @public */
export interface ReplaceOneModel<TSchema extends Document = Document> {
    /** The filter that specifies which document to replace. In the case of multiple matches, the first document matched is replaced. */
    filter: Filter<TSchema>;
    /** The document with which to replace the matched document. */
    replacement: WithoutId<TSchema>;
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
    /** When true, creates a new document if no document matches the query. */
    upsert?: boolean;
    /** Specifies the sort order for the documents matched by the filter. */
    sort?: Sort;
}
/** @public */
export interface UpdateOneModel<TSchema extends Document = Document> {
    /** The filter that specifies which document to update. In the case of multiple matches, the first document matched is updated. */
    filter: Filter<TSchema>;
    /**
     * The modifications to apply. The value can be either:
     * UpdateFilter<TSchema> - A document that contains update operator expressions,
     * Document[] - an aggregation pipeline.
     */
    update: UpdateFilter<TSchema> | Document[];
    /** A set of filters specifying to which array elements an update should apply. */
    arrayFilters?: Document[];
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
    /** When true, creates a new document if no document matches the query. */
    upsert?: boolean;
    /** Specifies the sort order for the documents matched by the filter. */
    sort?: Sort;
}
/** @public */
export interface UpdateManyModel<TSchema extends Document = Document> {
    /** The filter to limit the updated documents. */
    filter: Filter<TSchema>;
    /**
     * The modifications to apply. The value can be either:
     * UpdateFilter<TSchema> - A document that contains update operator expressions,
     * Document[] - an aggregation pipeline.
     */
    update: UpdateFilter<TSchema> | Document[];
    /** A set of filters specifying to which array elements an update should apply. */
    arrayFilters?: Document[];
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
    /** When true, creates a new document if no document matches the query. */
    upsert?: boolean;
}
/** @public */
export type AnyBulkWriteOperation<TSchema extends Document = Document> = {
    insertOne: InsertOneModel<TSchema>;
} | {
    replaceOne: ReplaceOneModel<TSchema>;
} | {
    updateOne: UpdateOneModel<TSchema>;
} | {
    updateMany: UpdateManyModel<TSchema>;
} | {
    deleteOne: DeleteOneModel<TSchema>;
} | {
    deleteMany: DeleteManyModel<TSchema>;
};
/** @internal */
export interface BulkResult {
    ok: number;
    writeErrors: WriteError[];
    writeConcernErrors: WriteConcernError[];
    insertedIds: Document[];
    nInserted: number;
    nUpserted: number;
    nMatched: number;
    nModified: number;
    nRemoved: number;
    upserted: Document[];
}
/**
 * Keeps the state of a unordered batch so we can rewrite the results
 * correctly after command execution
 *
 * @public
 */
export declare class Batch<T = Document> {
    originalZeroIndex: number;
    currentIndex: number;
    originalIndexes: number[];
    batchType: BatchType;
    operations: T[];
    size: number;
    sizeBytes: number;
    constructor(batchType: BatchType, originalZeroIndex: number);
}
/**
 * @public
 * The result of a bulk write.
 */
export declare class BulkWriteResult {
    private readonly result;
    /** Number of documents inserted. */
    readonly insertedCount: number;
    /** Number of documents matched for update. */
    readonly matchedCount: number;
    /** Number of documents modified. */
    readonly modifiedCount: number;
    /** Number of documents deleted. */
    readonly deletedCount: number;
    /** Number of documents upserted. */
    readonly upsertedCount: number;
    /** Upserted document generated Id's, hash key is the index of the originating operation */
    readonly upsertedIds: {
        [key: number]: any;
    };
    /** Inserted document generated Id's, hash key is the index of the originating operation */
    readonly insertedIds: {
        [key: number]: any;
    };
    private static generateIdMap;
    /**
     * Create a new BulkWriteResult instance
     * @internal
     */
    constructor(bulkResult: BulkResult, isOrdered: boolean);
    /** Evaluates to true if the bulk operation correctly executes */
    get ok(): number;
    /**
     * Returns document_ids that were actually inserted
     * @internal
     */
    private getSuccessfullyInsertedIds;
    /** Returns the upserted id at the given index */
    getUpsertedIdAt(index: number): Document | undefined;
    /** Returns raw internal result */
    getRawResponse(): Document;
    /** Returns true if the bulk operation contains a write error */
    hasWriteErrors(): boolean;
    /** Returns the number of write errors from the bulk operation */
    getWriteErrorCount(): number;
    /** Returns a specific write error object */
    getWriteErrorAt(index: number): WriteError | undefined;
    /** Retrieve all write errors */
    getWriteErrors(): WriteError[];
    /** Retrieve the write concern error if one exists */
    getWriteConcernError(): WriteConcernError | undefined;
    toString(): string;
    isOk(): boolean;
}
/** @public */
export interface WriteConcernErrorData {
    code: number;
    errmsg: string;
    errInfo?: Document;
}
/**
 * An error representing a failure by the server to apply the requested write concern to the bulk operation.
 * @public
 * @category Error
 */
export declare class WriteConcernError {
    /** @internal */
    private serverError;
    constructor(error: WriteConcernErrorData);
    /** Write concern error code. */
    get code(): number | undefined;
    /** Write concern error message. */
    get errmsg(): string | undefined;
    /** Write concern error info. */
    get errInfo(): Document | undefined;
    toJSON(): WriteConcernErrorData;
    toString(): string;
}
/** @public */
export interface BulkWriteOperationError {
    index: number;
    code: number;
    errmsg: string;
    errInfo: Document;
    op: Document | UpdateStatement | DeleteStatement;
}
/**
 * An error that occurred during a BulkWrite on the server.
 * @public
 * @category Error
 */
export declare class WriteError {
    err: BulkWriteOperationError;
    constructor(err: BulkWriteOperationError);
    /** WriteError code. */
    get code(): number;
    /** WriteError original bulk operation index. */
    get index(): number;
    /** WriteError message. */
    get errmsg(): string | undefined;
    /** WriteError details. */
    get errInfo(): Document | undefined;
    /** Returns the underlying operation that caused the error */
    getOperation(): Document;
    toJSON(): {
        code: number;
        index: number;
        errmsg?: string;
        op: Document;
    };
    toString(): string;
}
/** Merges results into shared data structure */
export declare function mergeBatchResults(batch: Batch, bulkResult: BulkResult, err?: AnyError, result?: Document): void;
/**
 * An error indicating an unsuccessful Bulk Write
 * @public
 * @category Error
 */
export declare class MongoBulkWriteError extends MongoServerError {
    result: BulkWriteResult;
    writeErrors: OneOrMore<WriteError>;
    err?: WriteConcernError;
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(error: {
        message: string;
        code: number;
        writeErrors?: WriteError[];
    } | WriteConcernError | AnyError, result: BulkWriteResult);
    get name(): string;
    /** Number of documents inserted. */
    get insertedCount(): number;
    /** Number of documents matched for update. */
    get matchedCount(): number;
    /** Number of documents modified. */
    get modifiedCount(): number;
    /** Number of documents deleted. */
    get deletedCount(): number;
    /** Number of documents upserted. */
    get upsertedCount(): number;
    /** Inserted document generated Id's, hash key is the index of the originating operation */
    get insertedIds(): {
        [key: number]: any;
    };
    /** Upserted document generated Id's, hash key is the index of the originating operation */
    get upsertedIds(): {
        [key: number]: any;
    };
}
/**
 * A builder object that is returned from {@link BulkOperationBase#find}.
 * Is used to build a write operation that involves a query filter.
 *
 * @public
 */
export declare class FindOperators {
    bulkOperation: BulkOperationBase;
    /**
     * Creates a new FindOperators object.
     * @internal
     */
    constructor(bulkOperation: BulkOperationBase);
    /** Add a multiple update operation to the bulk operation */
    update(updateDocument: Document | Document[]): BulkOperationBase;
    /** Add a single update operation to the bulk operation */
    updateOne(updateDocument: Document | Document[]): BulkOperationBase;
    /** Add a replace one operation to the bulk operation */
    replaceOne(replacement: Document): BulkOperationBase;
    /** Add a delete one operation to the bulk operation */
    deleteOne(): BulkOperationBase;
    /** Add a delete many operation to the bulk operation */
    delete(): BulkOperationBase;
    /** Upsert modifier for update bulk operation, noting that this operation is an upsert. */
    upsert(): this;
    /** Specifies the collation for the query condition. */
    collation(collation: CollationOptions): this;
    /** Specifies arrayFilters for UpdateOne or UpdateMany bulk operations. */
    arrayFilters(arrayFilters: Document[]): this;
    /** Specifies hint for the bulk operation. */
    hint(hint: Hint): this;
}
/** @internal */
export interface BulkOperationPrivate {
    bulkResult: BulkResult;
    currentBatch?: Batch;
    currentIndex: number;
    currentBatchSize: number;
    currentBatchSizeBytes: number;
    currentInsertBatch?: Batch;
    currentUpdateBatch?: Batch;
    currentRemoveBatch?: Batch;
    batches: Batch[];
    writeConcern?: WriteConcern;
    maxBsonObjectSize: number;
    maxBatchSizeBytes: number;
    maxWriteBatchSize: number;
    maxKeySize: number;
    namespace: MongoDBNamespace;
    topology: Topology;
    options: BulkWriteOptions;
    bsonOptions: BSONSerializeOptions;
    currentOp?: Document;
    executed: boolean;
    collection: Collection;
    err?: AnyError;
    checkKeys: boolean;
    bypassDocumentValidation?: boolean;
}
/** @public */
export interface BulkWriteOptions extends CommandOperationOptions {
    /**
     * Allow driver to bypass schema validation.
     * @defaultValue `false` - documents will be validated by default
     **/
    bypassDocumentValidation?: boolean;
    /**
     * If true, when an insert fails, don't execute the remaining writes.
     * If false, continue with remaining inserts when one fails.
     * @defaultValue `true` - inserts are ordered by default
     */
    ordered?: boolean;
    /**
     * Force server to assign _id values instead of driver.
     * @defaultValue `false` - the driver generates `_id` fields by default
     **/
    forceServerObjectId?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
    /** @internal */
    timeoutContext?: TimeoutContext;
}
/**
 * TODO(NODE-4063)
 * BulkWrites merge complexity is implemented in executeCommands
 * This provides a vehicle to treat bulkOperations like any other operation (hence "shim")
 * We would like this logic to simply live inside the BulkWriteOperation class
 * @internal
 */
export declare class BulkWriteShimOperation extends AbstractOperation {
    bulkOperation: BulkOperationBase;
    constructor(bulkOperation: BulkOperationBase, options: BulkWriteOptions);
    get commandName(): string;
    execute(_server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<any>;
}
/** @public */
export declare abstract class BulkOperationBase {
    private collection;
    isOrdered: boolean;
    /** @internal */
    s: BulkOperationPrivate;
    operationId?: number;
    /**
     * Create a new OrderedBulkOperation or UnorderedBulkOperation instance
     * @internal
     */
    constructor(collection: Collection, options: BulkWriteOptions, isOrdered: boolean);
    /**
     * Add a single insert document to the bulk operation
     *
     * @example
     * ```ts
     * const bulkOp = collection.initializeOrderedBulkOp();
     *
     * // Adds three inserts to the bulkOp.
     * bulkOp
     *   .insert({ a: 1 })
     *   .insert({ b: 2 })
     *   .insert({ c: 3 });
     * await bulkOp.execute();
     * ```
     */
    insert(document: Document): BulkOperationBase;
    /**
     * Builds a find operation for an update/updateOne/delete/deleteOne/replaceOne.
     * Returns a builder object used to complete the definition of the operation.
     *
     * @example
     * ```ts
     * const bulkOp = collection.initializeOrderedBulkOp();
     *
     * // Add an updateOne to the bulkOp
     * bulkOp.find({ a: 1 }).updateOne({ $set: { b: 2 } });
     *
     * // Add an updateMany to the bulkOp
     * bulkOp.find({ c: 3 }).update({ $set: { d: 4 } });
     *
     * // Add an upsert
     * bulkOp.find({ e: 5 }).upsert().updateOne({ $set: { f: 6 } });
     *
     * // Add a deletion
     * bulkOp.find({ g: 7 }).deleteOne();
     *
     * // Add a multi deletion
     * bulkOp.find({ h: 8 }).delete();
     *
     * // Add a replaceOne
     * bulkOp.find({ i: 9 }).replaceOne({writeConcern: { j: 10 }});
     *
     * // Update using a pipeline (requires Mongodb 4.2 or higher)
     * bulk.find({ k: 11, y: { $exists: true }, z: { $exists: true } }).updateOne([
     *   { $set: { total: { $sum: [ '$y', '$z' ] } } }
     * ]);
     *
     * // All of the ops will now be executed
     * await bulkOp.execute();
     * ```
     */
    find(selector: Document): FindOperators;
    /** Specifies a raw operation to perform in the bulk write. */
    raw(op: AnyBulkWriteOperation): this;
    get length(): number;
    get bsonOptions(): BSONSerializeOptions;
    get writeConcern(): WriteConcern | undefined;
    get batches(): Batch[];
    execute(options?: BulkWriteOptions): Promise<BulkWriteResult>;
    /**
     * Handles the write error before executing commands
     * @internal
     */
    handleWriteError(writeResult: BulkWriteResult): void;
    abstract addToOperationsList(batchType: BatchType, document: Document | UpdateStatement | DeleteStatement): this;
    private shouldForceServerObjectId;
}
//# sourceMappingURL=common.d.ts.map