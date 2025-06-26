import { type BSONSerializeOptions, type Document } from './bson';
import type { AnyBulkWriteOperation, BulkWriteOptions, BulkWriteResult } from './bulk/common';
import { OrderedBulkOperation } from './bulk/ordered';
import { UnorderedBulkOperation } from './bulk/unordered';
import { ChangeStream, type ChangeStreamDocument, type ChangeStreamOptions } from './change_stream';
import { AggregationCursor } from './cursor/aggregation_cursor';
import { FindCursor } from './cursor/find_cursor';
import { ListIndexesCursor } from './cursor/list_indexes_cursor';
import { ListSearchIndexesCursor, type ListSearchIndexesOptions } from './cursor/list_search_indexes_cursor';
import type { Db } from './db';
import type { MongoClient, PkFactory } from './mongo_client';
import type { Abortable, Filter, Flatten, OptionalUnlessRequiredId, UpdateFilter, WithId, WithoutId } from './mongo_types';
import type { AggregateOptions } from './operations/aggregate';
import { type CountOptions } from './operations/count';
import { type DeleteOptions, type DeleteResult } from './operations/delete';
import { type DistinctOptions } from './operations/distinct';
import { type DropCollectionOptions } from './operations/drop';
import { type EstimatedDocumentCountOptions } from './operations/estimated_document_count';
import type { FindOptions } from './operations/find';
import { type FindOneAndDeleteOptions, type FindOneAndReplaceOptions, type FindOneAndUpdateOptions } from './operations/find_and_modify';
import { type CreateIndexesOptions, type DropIndexesOptions, type IndexDescription, type IndexDescriptionCompact, type IndexDescriptionInfo, type IndexInformationOptions, type IndexSpecification, type ListIndexesOptions } from './operations/indexes';
import { type InsertManyResult, type InsertOneOptions, type InsertOneResult } from './operations/insert';
import type { Hint, OperationOptions } from './operations/operation';
import { type RenameOptions } from './operations/rename';
import { type SearchIndexDescription } from './operations/search_indexes/create';
import { type ReplaceOptions, type UpdateOptions, type UpdateResult } from './operations/update';
import { ReadConcern, type ReadConcernLike } from './read_concern';
import { ReadPreference, type ReadPreferenceLike } from './read_preference';
import { type Sort } from './sort';
import { MongoDBCollectionNamespace } from './utils';
import { WriteConcern, type WriteConcernOptions } from './write_concern';
/** @public */
export interface ModifyResult<TSchema = Document> {
    value: WithId<TSchema> | null;
    lastErrorObject?: Document;
    ok: 0 | 1;
}
/** @public */
export interface CountDocumentsOptions extends AggregateOptions {
    /** The number of documents to skip. */
    skip?: number;
    /** The maximum amount of documents to consider. */
    limit?: number;
}
/** @public */
export interface CollectionOptions extends BSONSerializeOptions, WriteConcernOptions {
    /** Specify a read concern for the collection. (only MongoDB 3.2 or higher supported) */
    readConcern?: ReadConcernLike;
    /** The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST). */
    readPreference?: ReadPreferenceLike;
    /**
     * @experimental
     * Specifies the time an operation will run until it throws a timeout error
     */
    timeoutMS?: number;
}
/** @internal */
export interface CollectionPrivate {
    pkFactory: PkFactory;
    db: Db;
    options: any;
    namespace: MongoDBCollectionNamespace;
    readPreference?: ReadPreference;
    bsonOptions: BSONSerializeOptions;
    collectionHint?: Hint;
    readConcern?: ReadConcern;
    writeConcern?: WriteConcern;
}
/**
 * The **Collection** class is an internal class that embodies a MongoDB collection
 * allowing for insert/find/update/delete and other command operation on that MongoDB collection.
 *
 * **COLLECTION Cannot directly be instantiated**
 * @public
 *
 * @example
 * ```ts
 * import { MongoClient } from 'mongodb';
 *
 * interface Pet {
 *   name: string;
 *   kind: 'dog' | 'cat' | 'fish';
 * }
 *
 * const client = new MongoClient('mongodb://localhost:27017');
 * const pets = client.db().collection<Pet>('pets');
 *
 * const petCursor = pets.find();
 *
 * for await (const pet of petCursor) {
 *   console.log(`${pet.name} is a ${pet.kind}!`);
 * }
 * ```
 */
export declare class Collection<TSchema extends Document = Document> {
    /** @internal */
    s: CollectionPrivate;
    /** @internal */
    client: MongoClient;
    /**
     * Create a new Collection instance
     * @internal
     */
    constructor(db: Db, name: string, options?: CollectionOptions);
    /**
     * The name of the database this collection belongs to
     */
    get dbName(): string;
    /**
     * The name of this collection
     */
    get collectionName(): string;
    /**
     * The namespace of this collection, in the format `${this.dbName}.${this.collectionName}`
     */
    get namespace(): string;
    /**
     *  @internal
     *
     * The `MongoDBNamespace` for the collection.
     */
    get fullNamespace(): MongoDBCollectionNamespace;
    /**
     * The current readConcern of the collection. If not explicitly defined for
     * this collection, will be inherited from the parent DB
     */
    get readConcern(): ReadConcern | undefined;
    /**
     * The current readPreference of the collection. If not explicitly defined for
     * this collection, will be inherited from the parent DB
     */
    get readPreference(): ReadPreference | undefined;
    get bsonOptions(): BSONSerializeOptions;
    /**
     * The current writeConcern of the collection. If not explicitly defined for
     * this collection, will be inherited from the parent DB
     */
    get writeConcern(): WriteConcern | undefined;
    /** The current index hint for the collection */
    get hint(): Hint | undefined;
    set hint(v: Hint | undefined);
    get timeoutMS(): number | undefined;
    /**
     * Inserts a single document into MongoDB. If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @param doc - The document to insert
     * @param options - Optional settings for the command
     */
    insertOne(doc: OptionalUnlessRequiredId<TSchema>, options?: InsertOneOptions): Promise<InsertOneResult<TSchema>>;
    /**
     * Inserts an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @param docs - The documents to insert
     * @param options - Optional settings for the command
     */
    insertMany(docs: ReadonlyArray<OptionalUnlessRequiredId<TSchema>>, options?: BulkWriteOptions): Promise<InsertManyResult<TSchema>>;
    /**
     * Perform a bulkWrite operation without a fluent API
     *
     * Legal operation types are
     * - `insertOne`
     * - `replaceOne`
     * - `updateOne`
     * - `updateMany`
     * - `deleteOne`
     * - `deleteMany`
     *
     * If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @param operations - Bulk operations to perform
     * @param options - Optional settings for the command
     * @throws MongoDriverError if operations is not an array
     */
    bulkWrite(operations: ReadonlyArray<AnyBulkWriteOperation<TSchema>>, options?: BulkWriteOptions): Promise<BulkWriteResult>;
    /**
     * Update a single document in a collection
     *
     * The value of `update` can be either:
     * - UpdateFilter<TSchema> - A document that contains update operator expressions,
     * - Document[] - an aggregation pipeline.
     *
     * @param filter - The filter used to select the document to update
     * @param update - The modifications to apply
     * @param options - Optional settings for the command
     */
    updateOne(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Document[], options?: UpdateOptions & {
        sort?: Sort;
    }): Promise<UpdateResult<TSchema>>;
    /**
     * Replace a document in a collection with another document
     *
     * @param filter - The filter used to select the document to replace
     * @param replacement - The Document that replaces the matching document
     * @param options - Optional settings for the command
     */
    replaceOne(filter: Filter<TSchema>, replacement: WithoutId<TSchema>, options?: ReplaceOptions): Promise<UpdateResult<TSchema>>;
    /**
     * Update multiple documents in a collection
     *
     * The value of `update` can be either:
     * - UpdateFilter<TSchema> - A document that contains update operator expressions,
     * - Document[] - an aggregation pipeline.
     *
     * @param filter - The filter used to select the document to update
     * @param update - The modifications to apply
     * @param options - Optional settings for the command
     */
    updateMany(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Document[], options?: UpdateOptions): Promise<UpdateResult<TSchema>>;
    /**
     * Delete a document from a collection
     *
     * @param filter - The filter used to select the document to remove
     * @param options - Optional settings for the command
     */
    deleteOne(filter?: Filter<TSchema>, options?: DeleteOptions): Promise<DeleteResult>;
    /**
     * Delete multiple documents from a collection
     *
     * @param filter - The filter used to select the documents to remove
     * @param options - Optional settings for the command
     */
    deleteMany(filter?: Filter<TSchema>, options?: DeleteOptions): Promise<DeleteResult>;
    /**
     * Rename the collection.
     *
     * @remarks
     * This operation does not inherit options from the Db or MongoClient.
     *
     * @param newName - New name of of the collection.
     * @param options - Optional settings for the command
     */
    rename(newName: string, options?: RenameOptions): Promise<Collection>;
    /**
     * Drop the collection from the database, removing it permanently. New accesses will create a new collection.
     *
     * @param options - Optional settings for the command
     */
    drop(options?: DropCollectionOptions): Promise<boolean>;
    /**
     * Fetches the first document that matches the filter
     *
     * @param filter - Query for find Operation
     * @param options - Optional settings for the command
     */
    findOne(): Promise<WithId<TSchema> | null>;
    findOne(filter: Filter<TSchema>): Promise<WithId<TSchema> | null>;
    findOne(filter: Filter<TSchema>, options: Omit<FindOptions, 'timeoutMode'> & Abortable): Promise<WithId<TSchema> | null>;
    findOne<T = TSchema>(): Promise<T | null>;
    findOne<T = TSchema>(filter: Filter<TSchema>): Promise<T | null>;
    findOne<T = TSchema>(filter: Filter<TSchema>, options?: Omit<FindOptions, 'timeoutMode'> & Abortable): Promise<T | null>;
    /**
     * Creates a cursor for a filter that can be used to iterate over results from MongoDB
     *
     * @param filter - The filter predicate. If unspecified, then all documents in the collection will match the predicate
     */
    find(): FindCursor<WithId<TSchema>>;
    find(filter: Filter<TSchema>, options?: FindOptions & Abortable): FindCursor<WithId<TSchema>>;
    find<T extends Document>(filter: Filter<TSchema>, options?: FindOptions & Abortable): FindCursor<T>;
    /**
     * Returns the options of the collection.
     *
     * @param options - Optional settings for the command
     */
    options(options?: OperationOptions): Promise<Document>;
    /**
     * Returns if the collection is a capped collection
     *
     * @param options - Optional settings for the command
     */
    isCapped(options?: OperationOptions): Promise<boolean>;
    /**
     * Creates an index on the db and collection collection.
     *
     * @param indexSpec - The field name or index specification to create an index for
     * @param options - Optional settings for the command
     *
     * @example
     * ```ts
     * const collection = client.db('foo').collection('bar');
     *
     * await collection.createIndex({ a: 1, b: -1 });
     *
     * // Alternate syntax for { c: 1, d: -1 } that ensures order of indexes
     * await collection.createIndex([ [c, 1], [d, -1] ]);
     *
     * // Equivalent to { e: 1 }
     * await collection.createIndex('e');
     *
     * // Equivalent to { f: 1, g: 1 }
     * await collection.createIndex(['f', 'g'])
     *
     * // Equivalent to { h: 1, i: -1 }
     * await collection.createIndex([ { h: 1 }, { i: -1 } ]);
     *
     * // Equivalent to { j: 1, k: -1, l: 2d }
     * await collection.createIndex(['j', ['k', -1], { l: '2d' }])
     * ```
     */
    createIndex(indexSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string>;
    /**
     * Creates multiple indexes in the collection, this method is only supported for
     * MongoDB 2.6 or higher. Earlier version of MongoDB will throw a command not supported
     * error.
     *
     * **Note**: Unlike {@link Collection#createIndex| createIndex}, this function takes in raw index specifications.
     * Index specifications are defined {@link https://www.mongodb.com/docs/manual/reference/command/createIndexes/| here}.
     *
     * @param indexSpecs - An array of index specifications to be created
     * @param options - Optional settings for the command
     *
     * @example
     * ```ts
     * const collection = client.db('foo').collection('bar');
     * await collection.createIndexes([
     *   // Simple index on field fizz
     *   {
     *     key: { fizz: 1 },
     *   }
     *   // wildcard index
     *   {
     *     key: { '$**': 1 }
     *   },
     *   // named index on darmok and jalad
     *   {
     *     key: { darmok: 1, jalad: -1 }
     *     name: 'tanagra'
     *   }
     * ]);
     * ```
     */
    createIndexes(indexSpecs: IndexDescription[], options?: CreateIndexesOptions): Promise<string[]>;
    /**
     * Drops an index from this collection.
     *
     * @param indexName - Name of the index to drop.
     * @param options - Optional settings for the command
     */
    dropIndex(indexName: string, options?: DropIndexesOptions): Promise<Document>;
    /**
     * Drops all indexes from this collection.
     *
     * @param options - Optional settings for the command
     */
    dropIndexes(options?: DropIndexesOptions): Promise<boolean>;
    /**
     * Get the list of all indexes information for the collection.
     *
     * @param options - Optional settings for the command
     */
    listIndexes(options?: ListIndexesOptions): ListIndexesCursor;
    /**
     * Checks if one or more indexes exist on the collection, fails on first non-existing index
     *
     * @param indexes - One or more index names to check.
     * @param options - Optional settings for the command
     */
    indexExists(indexes: string | string[], options?: ListIndexesOptions): Promise<boolean>;
    /**
     * Retrieves this collections index info.
     *
     * @param options - Optional settings for the command
     */
    indexInformation(options: IndexInformationOptions & {
        full: true;
    }): Promise<IndexDescriptionInfo[]>;
    indexInformation(options: IndexInformationOptions & {
        full?: false;
    }): Promise<IndexDescriptionCompact>;
    indexInformation(options: IndexInformationOptions): Promise<IndexDescriptionCompact | IndexDescriptionInfo[]>;
    indexInformation(): Promise<IndexDescriptionCompact>;
    /**
     * Gets an estimate of the count of documents in a collection using collection metadata.
     * This will always run a count command on all server versions.
     *
     * due to an oversight in versions 5.0.0-5.0.8 of MongoDB, the count command,
     * which estimatedDocumentCount uses in its implementation, was not included in v1 of
     * the Stable API, and so users of the Stable API with estimatedDocumentCount are
     * recommended to upgrade their server version to 5.0.9+ or set apiStrict: false to avoid
     * encountering errors.
     *
     * @see {@link https://www.mongodb.com/docs/manual/reference/command/count/#behavior|Count: Behavior}
     * @param options - Optional settings for the command
     */
    estimatedDocumentCount(options?: EstimatedDocumentCountOptions): Promise<number>;
    /**
     * Gets the number of documents matching the filter.
     * For a fast count of the total documents in a collection see {@link Collection#estimatedDocumentCount| estimatedDocumentCount}.
     *
     * Due to countDocuments using the $match aggregation pipeline stage, certain query operators cannot be used in countDocuments. This includes the $where and $near query operators, among others. Details can be found in the documentation for the $match aggregation pipeline stage.
     *
     * **Note**: When migrating from {@link Collection#count| count} to {@link Collection#countDocuments| countDocuments}
     * the following query operators must be replaced:
     *
     * | Operator | Replacement |
     * | -------- | ----------- |
     * | `$where`   | [`$expr`][1] |
     * | `$near`    | [`$geoWithin`][2] with [`$center`][3] |
     * | `$nearSphere` | [`$geoWithin`][2] with [`$centerSphere`][4] |
     *
     * [1]: https://www.mongodb.com/docs/manual/reference/operator/query/expr/
     * [2]: https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/
     * [3]: https://www.mongodb.com/docs/manual/reference/operator/query/center/#op._S_center
     * [4]: https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/#op._S_centerSphere
     *
     * @param filter - The filter for the count
     * @param options - Optional settings for the command
     *
     * @see https://www.mongodb.com/docs/manual/reference/operator/query/expr/
     * @see https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/
     * @see https://www.mongodb.com/docs/manual/reference/operator/query/center/#op._S_center
     * @see https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/#op._S_centerSphere
     */
    countDocuments(filter?: Filter<TSchema>, options?: CountDocumentsOptions & Abortable): Promise<number>;
    /**
     * The distinct command returns a list of distinct values for the given key across a collection.
     *
     * @param key - Field of the document to find distinct values for
     * @param filter - The filter for filtering the set of documents to which we apply the distinct filter.
     * @param options - Optional settings for the command
     */
    distinct<Key extends keyof WithId<TSchema>>(key: Key): Promise<Array<Flatten<WithId<TSchema>[Key]>>>;
    distinct<Key extends keyof WithId<TSchema>>(key: Key, filter: Filter<TSchema>): Promise<Array<Flatten<WithId<TSchema>[Key]>>>;
    distinct<Key extends keyof WithId<TSchema>>(key: Key, filter: Filter<TSchema>, options: DistinctOptions): Promise<Array<Flatten<WithId<TSchema>[Key]>>>;
    distinct(key: string): Promise<any[]>;
    distinct(key: string, filter: Filter<TSchema>): Promise<any[]>;
    distinct(key: string, filter: Filter<TSchema>, options: DistinctOptions): Promise<any[]>;
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param options - Optional settings for the command
     */
    indexes(options: IndexInformationOptions & {
        full?: true;
    }): Promise<IndexDescriptionInfo[]>;
    indexes(options: IndexInformationOptions & {
        full: false;
    }): Promise<IndexDescriptionCompact>;
    indexes(options: IndexInformationOptions): Promise<IndexDescriptionCompact | IndexDescriptionInfo[]>;
    indexes(options?: ListIndexesOptions): Promise<IndexDescriptionInfo[]>;
    /**
     * Find a document and delete it in one atomic operation. Requires a write lock for the duration of the operation.
     *
     * @param filter - The filter used to select the document to remove
     * @param options - Optional settings for the command
     */
    findOneAndDelete(filter: Filter<TSchema>, options: FindOneAndDeleteOptions & {
        includeResultMetadata: true;
    }): Promise<ModifyResult<TSchema>>;
    findOneAndDelete(filter: Filter<TSchema>, options: FindOneAndDeleteOptions & {
        includeResultMetadata: false;
    }): Promise<WithId<TSchema> | null>;
    findOneAndDelete(filter: Filter<TSchema>, options: FindOneAndDeleteOptions): Promise<WithId<TSchema> | null>;
    findOneAndDelete(filter: Filter<TSchema>): Promise<WithId<TSchema> | null>;
    /**
     * Find a document and replace it in one atomic operation. Requires a write lock for the duration of the operation.
     *
     * @param filter - The filter used to select the document to replace
     * @param replacement - The Document that replaces the matching document
     * @param options - Optional settings for the command
     */
    findOneAndReplace(filter: Filter<TSchema>, replacement: WithoutId<TSchema>, options: FindOneAndReplaceOptions & {
        includeResultMetadata: true;
    }): Promise<ModifyResult<TSchema>>;
    findOneAndReplace(filter: Filter<TSchema>, replacement: WithoutId<TSchema>, options: FindOneAndReplaceOptions & {
        includeResultMetadata: false;
    }): Promise<WithId<TSchema> | null>;
    findOneAndReplace(filter: Filter<TSchema>, replacement: WithoutId<TSchema>, options: FindOneAndReplaceOptions): Promise<WithId<TSchema> | null>;
    findOneAndReplace(filter: Filter<TSchema>, replacement: WithoutId<TSchema>): Promise<WithId<TSchema> | null>;
    /**
     * Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.
     *
     * The value of `update` can be either:
     * - UpdateFilter<TSchema> - A document that contains update operator expressions,
     * - Document[] - an aggregation pipeline consisting of the following stages:
     *   - $addFields and its alias $set
     *   - $project and its alias $unset
     *   - $replaceRoot and its alias $replaceWith.
     * See the [findAndModify command documentation](https://www.mongodb.com/docs/manual/reference/command/findAndModify) for details.
     *
     * @param filter - The filter used to select the document to update
     * @param update - The modifications to apply
     * @param options - Optional settings for the command
     */
    findOneAndUpdate(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Document[], options: FindOneAndUpdateOptions & {
        includeResultMetadata: true;
    }): Promise<ModifyResult<TSchema>>;
    findOneAndUpdate(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Document[], options: FindOneAndUpdateOptions & {
        includeResultMetadata: false;
    }): Promise<WithId<TSchema> | null>;
    findOneAndUpdate(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Document[], options: FindOneAndUpdateOptions): Promise<WithId<TSchema> | null>;
    findOneAndUpdate(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Document[]): Promise<WithId<TSchema> | null>;
    /**
     * Execute an aggregation framework pipeline against the collection, needs MongoDB \>= 2.2
     *
     * @param pipeline - An array of aggregation pipelines to execute
     * @param options - Optional settings for the command
     */
    aggregate<T extends Document = Document>(pipeline?: Document[], options?: AggregateOptions & Abortable): AggregationCursor<T>;
    /**
     * Create a new Change Stream, watching for new changes (insertions, updates, replacements, deletions, and invalidations) in this collection.
     *
     * @remarks
     * watch() accepts two generic arguments for distinct use cases:
     * - The first is to override the schema that may be defined for this specific collection
     * - The second is to override the shape of the change stream document entirely, if it is not provided the type will default to ChangeStreamDocument of the first argument
     * @example
     * By just providing the first argument I can type the change to be `ChangeStreamDocument<{ _id: number }>`
     * ```ts
     * collection.watch<{ _id: number }>()
     *   .on('change', change => console.log(change._id.toFixed(4)));
     * ```
     *
     * @example
     * Passing a second argument provides a way to reflect the type changes caused by an advanced pipeline.
     * Here, we are using a pipeline to have MongoDB filter for insert changes only and add a comment.
     * No need start from scratch on the ChangeStreamInsertDocument type!
     * By using an intersection we can save time and ensure defaults remain the same type!
     * ```ts
     * collection
     *   .watch<Schema, ChangeStreamInsertDocument<Schema> & { comment: string }>([
     *     { $addFields: { comment: 'big changes' } },
     *     { $match: { operationType: 'insert' } }
     *   ])
     *   .on('change', change => {
     *     change.comment.startsWith('big');
     *     change.operationType === 'insert';
     *     // No need to narrow in code because the generics did that for us!
     *     expectType<Schema>(change.fullDocument);
     *   });
     * ```
     *
     * @remarks
     * When `timeoutMS` is configured for a change stream, it will have different behaviour depending
     * on whether the change stream is in iterator mode or emitter mode. In both cases, a change
     * stream will time out if it does not receive a change event within `timeoutMS` of the last change
     * event.
     *
     * Note that if a change stream is consistently timing out when watching a collection, database or
     * client that is being changed, then this may be due to the server timing out before it can finish
     * processing the existing oplog. To address this, restart the change stream with a higher
     * `timeoutMS`.
     *
     * If the change stream times out the initial aggregate operation to establish the change stream on
     * the server, then the client will close the change stream. If the getMore calls to the server
     * time out, then the change stream will be left open, but will throw a MongoOperationTimeoutError
     * when in iterator mode and emit an error event that returns a MongoOperationTimeoutError in
     * emitter mode.
     *
     * To determine whether or not the change stream is still open following a timeout, check the
     * {@link ChangeStream.closed} getter.
     *
     * @example
     * In iterator mode, if a next() call throws a timeout error, it will attempt to resume the change stream.
     * The next call can just be retried after this succeeds.
     * ```ts
     * const changeStream = collection.watch([], { timeoutMS: 100 });
     * try {
     *     await changeStream.next();
     * } catch (e) {
     *     if (e instanceof MongoOperationTimeoutError && !changeStream.closed) {
     *       await changeStream.next();
     *     }
     *     throw e;
     * }
     * ```
     *
     * @example
     * In emitter mode, if the change stream goes `timeoutMS` without emitting a change event, it will
     * emit an error event that returns a MongoOperationTimeoutError, but will not close the change
     * stream unless the resume attempt fails. There is no need to re-establish change listeners as
     * this will automatically continue emitting change events once the resume attempt completes.
     *
     * ```ts
     * const changeStream = collection.watch([], { timeoutMS: 100 });
     * changeStream.on('change', console.log);
     * changeStream.on('error', e => {
     *     if (e instanceof MongoOperationTimeoutError && !changeStream.closed) {
     *         // do nothing
     *     } else {
     *         changeStream.close();
     *     }
     * });
     * ```
     *
     * @param pipeline - An array of {@link https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
     * @param options - Optional settings for the command
     * @typeParam TLocal - Type of the data being detected by the change stream
     * @typeParam TChange - Type of the whole change stream document emitted
     */
    watch<TLocal extends Document = TSchema, TChange extends Document = ChangeStreamDocument<TLocal>>(pipeline?: Document[], options?: ChangeStreamOptions): ChangeStream<TLocal, TChange>;
    /**
     * Initiate an Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     *
     * @throws MongoNotConnectedError
     * @remarks
     * **NOTE:** MongoClient must be connected prior to calling this method due to a known limitation in this legacy implementation.
     * However, `collection.bulkWrite()` provides an equivalent API that does not require prior connecting.
     */
    initializeUnorderedBulkOp(options?: BulkWriteOptions): UnorderedBulkOperation;
    /**
     * Initiate an In order bulk write operation. Operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     *
     * @throws MongoNotConnectedError
     * @remarks
     * **NOTE:** MongoClient must be connected prior to calling this method due to a known limitation in this legacy implementation.
     * However, `collection.bulkWrite()` provides an equivalent API that does not require prior connecting.
     */
    initializeOrderedBulkOp(options?: BulkWriteOptions): OrderedBulkOperation;
    /**
     * An estimated count of matching documents in the db to a filter.
     *
     * **NOTE:** This method has been deprecated, since it does not provide an accurate count of the documents
     * in a collection. To obtain an accurate count of documents in the collection, use {@link Collection#countDocuments| countDocuments}.
     * To obtain an estimated count of all documents in the collection, use {@link Collection#estimatedDocumentCount| estimatedDocumentCount}.
     *
     * @deprecated use {@link Collection#countDocuments| countDocuments} or {@link Collection#estimatedDocumentCount| estimatedDocumentCount} instead
     *
     * @param filter - The filter for the count.
     * @param options - Optional settings for the command
     */
    count(filter?: Filter<TSchema>, options?: CountOptions): Promise<number>;
    /**
     * Returns all search indexes for the current collection.
     *
     * @param options - The options for the list indexes operation.
     *
     * @remarks Only available when used against a 7.0+ Atlas cluster.
     */
    listSearchIndexes(options?: ListSearchIndexesOptions): ListSearchIndexesCursor;
    /**
     * Returns all search indexes for the current collection.
     *
     * @param name - The name of the index to search for.  Only indexes with matching index names will be returned.
     * @param options - The options for the list indexes operation.
     *
     * @remarks Only available when used against a 7.0+ Atlas cluster.
     */
    listSearchIndexes(name: string, options?: ListSearchIndexesOptions): ListSearchIndexesCursor;
    /**
     * Creates a single search index for the collection.
     *
     * @param description - The index description for the new search index.
     * @returns A promise that resolves to the name of the new search index.
     *
     * @remarks Only available when used against a 7.0+ Atlas cluster.
     */
    createSearchIndex(description: SearchIndexDescription): Promise<string>;
    /**
     * Creates multiple search indexes for the current collection.
     *
     * @param descriptions - An array of `SearchIndexDescription`s for the new search indexes.
     * @returns A promise that resolves to an array of the newly created search index names.
     *
     * @remarks Only available when used against a 7.0+ Atlas cluster.
     * @returns
     */
    createSearchIndexes(descriptions: SearchIndexDescription[]): Promise<string[]>;
    /**
     * Deletes a search index by index name.
     *
     * @param name - The name of the search index to be deleted.
     *
     * @remarks Only available when used against a 7.0+ Atlas cluster.
     */
    dropSearchIndex(name: string): Promise<void>;
    /**
     * Updates a search index by replacing the existing index definition with the provided definition.
     *
     * @param name - The name of the search index to update.
     * @param definition - The new search index definition.
     *
     * @remarks Only available when used against a 7.0+ Atlas cluster.
     */
    updateSearchIndex(name: string, definition: Document): Promise<void>;
}
//# sourceMappingURL=collection.d.ts.map