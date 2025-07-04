import { type Document } from '../bson';
import { CursorResponse } from '../cmap/wire_protocol/responses';
import { ExplainableCursor, type ExplainCommandOptions, type ExplainVerbosityLike } from '../explain';
import type { MongoClient } from '../mongo_client';
import { type Abortable } from '../mongo_types';
import type { CollationOptions } from '../operations/command';
import { type CountOptions } from '../operations/count';
import { type FindOptions } from '../operations/find';
import type { Hint } from '../operations/operation';
import type { ClientSession } from '../sessions';
import { type Sort, type SortDirection } from '../sort';
import { type MongoDBNamespace } from '../utils';
import { type InitialCursorResponse } from './abstract_cursor';
/** @public Flags allowed for cursor */
export declare const FLAGS: readonly ["tailable", "oplogReplay", "noCursorTimeout", "awaitData", "exhaust", "partial"];
/** @public */
export declare class FindCursor<TSchema = any> extends ExplainableCursor<TSchema> {
    /** @internal */
    private cursorFilter;
    /** @internal */
    private numReturned;
    /** @internal */
    private readonly findOptions;
    /** @internal */
    constructor(client: MongoClient, namespace: MongoDBNamespace, filter?: Document, options?: FindOptions & Abortable);
    clone(): FindCursor<TSchema>;
    map<T>(transform: (doc: TSchema) => T): FindCursor<T>;
    /** @internal */
    _initialize(session: ClientSession): Promise<InitialCursorResponse>;
    /** @internal */
    getMore(batchSize: number): Promise<CursorResponse>;
    /**
     * Get the count of documents for this cursor
     * @deprecated Use `collection.estimatedDocumentCount` or `collection.countDocuments` instead
     */
    count(options?: CountOptions): Promise<number>;
    /** Execute the explain for the cursor */
    explain(): Promise<Document>;
    explain(verbosity: ExplainVerbosityLike | ExplainCommandOptions): Promise<Document>;
    explain(options: {
        timeoutMS?: number;
    }): Promise<Document>;
    explain(verbosity: ExplainVerbosityLike | ExplainCommandOptions, options: {
        timeoutMS?: number;
    }): Promise<Document>;
    /** Set the cursor query */
    filter(filter: Document): this;
    /**
     * Set the cursor hint
     *
     * @param hint - If specified, then the query system will only consider plans using the hinted index.
     */
    hint(hint: Hint): this;
    /**
     * Set the cursor min
     *
     * @param min - Specify a $min value to specify the inclusive lower bound for a specific index in order to constrain the results of find(). The $min specifies the lower bound for all keys of a specific index in order.
     */
    min(min: Document): this;
    /**
     * Set the cursor max
     *
     * @param max - Specify a $max value to specify the exclusive upper bound for a specific index in order to constrain the results of find(). The $max specifies the upper bound for all keys of a specific index in order.
     */
    max(max: Document): this;
    /**
     * Set the cursor returnKey.
     * If set to true, modifies the cursor to only return the index field or fields for the results of the query, rather than documents.
     * If set to true and the query does not use an index to perform the read operation, the returned documents will not contain any fields.
     *
     * @param value - the returnKey value.
     */
    returnKey(value: boolean): this;
    /**
     * Modifies the output of a query by adding a field $recordId to matching documents. $recordId is the internal key which uniquely identifies a document in a collection.
     *
     * @param value - The $showDiskLoc option has now been deprecated and replaced with the showRecordId field. $showDiskLoc will still be accepted for OP_QUERY stye find.
     */
    showRecordId(value: boolean): this;
    /**
     * Add a query modifier to the cursor query
     *
     * @param name - The query modifier (must start with $, such as $orderby etc)
     * @param value - The modifier value.
     */
    addQueryModifier(name: string, value: string | boolean | number | Document): this;
    /**
     * Add a comment to the cursor query allowing for tracking the comment in the log.
     *
     * @param value - The comment attached to this query.
     */
    comment(value: string): this;
    /**
     * Set a maxAwaitTimeMS on a tailing cursor query to allow to customize the timeout value for the option awaitData (Only supported on MongoDB 3.2 or higher, ignored otherwise)
     *
     * @param value - Number of milliseconds to wait before aborting the tailed query.
     */
    maxAwaitTimeMS(value: number): this;
    /**
     * Set a maxTimeMS on the cursor query, allowing for hard timeout limits on queries (Only supported on MongoDB 2.6 or higher)
     *
     * @param value - Number of milliseconds to wait before aborting the query.
     */
    maxTimeMS(value: number): this;
    /**
     * Add a project stage to the aggregation pipeline
     *
     * @remarks
     * In order to strictly type this function you must provide an interface
     * that represents the effect of your projection on the result documents.
     *
     * By default chaining a projection to your cursor changes the returned type to the generic
     * {@link Document} type.
     * You should specify a parameterized type to have assertions on your final results.
     *
     * @example
     * ```typescript
     * // Best way
     * const docs: FindCursor<{ a: number }> = cursor.project<{ a: number }>({ _id: 0, a: true });
     * // Flexible way
     * const docs: FindCursor<Document> = cursor.project({ _id: 0, a: true });
     * ```
     *
     * @remarks
     *
     * **Note for Typescript Users:** adding a transform changes the return type of the iteration of this cursor,
     * it **does not** return a new instance of a cursor. This means when calling project,
     * you should always assign the result to a new variable in order to get a correctly typed cursor variable.
     * Take note of the following example:
     *
     * @example
     * ```typescript
     * const cursor: FindCursor<{ a: number; b: string }> = coll.find();
     * const projectCursor = cursor.project<{ a: number }>({ _id: 0, a: true });
     * const aPropOnlyArray: {a: number}[] = await projectCursor.toArray();
     *
     * // or always use chaining and save the final cursor
     *
     * const cursor = coll.find().project<{ a: string }>({
     *   _id: 0,
     *   a: { $convert: { input: '$a', to: 'string' }
     * }});
     * ```
     */
    project<T extends Document = Document>(value: Document): FindCursor<T>;
    /**
     * Sets the sort order of the cursor query.
     *
     * @param sort - The key or keys set for the sort.
     * @param direction - The direction of the sorting (1 or -1).
     */
    sort(sort: Sort | string, direction?: SortDirection): this;
    /**
     * Allows disk use for blocking sort operations exceeding 100MB memory. (MongoDB 3.2 or higher)
     *
     * @remarks
     * {@link https://www.mongodb.com/docs/manual/reference/command/find/#find-cmd-allowdiskuse | find command allowDiskUse documentation}
     */
    allowDiskUse(allow?: boolean): this;
    /**
     * Set the collation options for the cursor.
     *
     * @param value - The cursor collation options (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     */
    collation(value: CollationOptions): this;
    /**
     * Set the limit for the cursor.
     *
     * @param value - The limit for the cursor query.
     */
    limit(value: number): this;
    /**
     * Set the skip for the cursor.
     *
     * @param value - The skip for the cursor query.
     */
    skip(value: number): this;
}
//# sourceMappingURL=find_cursor.d.ts.map