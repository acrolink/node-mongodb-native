import { Readable } from 'stream';
import { type BSONSerializeOptions, type Document, Long } from '../bson';
import { type OnDemandDocumentDeserializeOptions } from '../cmap/wire_protocol/on_demand/document';
import { type CursorResponse } from '../cmap/wire_protocol/responses';
import type { MongoClient } from '../mongo_client';
import { type Abortable, TypedEventEmitter } from '../mongo_types';
import { ReadConcern, type ReadConcernLike } from '../read_concern';
import { ReadPreference, type ReadPreferenceLike } from '../read_preference';
import { type AsyncDisposable } from '../resource_management';
import type { Server } from '../sdam/server';
import { ClientSession } from '../sessions';
import { type CSOTTimeoutContext, type Timeout, TimeoutContext } from '../timeout';
import { type MongoDBNamespace } from '../utils';
/**
 * @internal
 * TODO(NODE-2882): A cursor's getMore commands must be run on the same server it was started on
 * and the same session must be used for the lifetime of the cursor. This object serves to get the
 * server and session (along with the response) out of executeOperation back to the AbstractCursor.
 *
 * There may be a better design for communicating these values back to the cursor, currently an operation
 * MUST store the selected server on itself so it can be read after executeOperation has returned.
 */
export interface InitialCursorResponse {
    /** The server selected for the operation */
    server: Server;
    /** The session used for this operation, may be implicitly created */
    session?: ClientSession;
    /** The raw server response for the operation */
    response: CursorResponse;
}
/** @public */
export declare const CURSOR_FLAGS: readonly ["tailable", "oplogReplay", "noCursorTimeout", "awaitData", "exhaust", "partial"];
/** @public */
export interface CursorStreamOptions {
    /** A transformation method applied to each document emitted by the stream */
    transform?(this: void, doc: Document): Document;
}
/** @public */
export type CursorFlag = (typeof CURSOR_FLAGS)[number];
/**
 * @public
 * @experimental
 * Specifies how `timeoutMS` is applied to the cursor. Can be either `'cursorLifeTime'` or `'iteration'`
 * When set to `'iteration'`, the deadline specified by `timeoutMS` applies to each call of
 * `cursor.next()`.
 * When set to `'cursorLifetime'`, the deadline applies to the life of the entire cursor.
 *
 * Depending on the type of cursor being used, this option has different default values.
 * For non-tailable cursors, this value defaults to `'cursorLifetime'`
 * For tailable cursors, this value defaults to `'iteration'` since tailable cursors, by
 * definition can have an arbitrarily long lifetime.
 *
 * @example
 * ```ts
 * const cursor = collection.find({}, {timeoutMS: 100, timeoutMode: 'iteration'});
 * for await (const doc of cursor) {
 *  // process doc
 *  // This will throw a timeout error if any of the iterator's `next()` calls takes more than 100ms, but
 *  // will continue to iterate successfully otherwise, regardless of the number of batches.
 * }
 * ```
 *
 * @example
 * ```ts
 * const cursor = collection.find({}, { timeoutMS: 1000, timeoutMode: 'cursorLifetime' });
 * const docs = await cursor.toArray(); // This entire line will throw a timeout error if all batches are not fetched and returned within 1000ms.
 * ```
 */
export declare const CursorTimeoutMode: Readonly<{
    readonly ITERATION: "iteration";
    readonly LIFETIME: "cursorLifetime";
}>;
/**
 * @public
 * @experimental
 */
export type CursorTimeoutMode = (typeof CursorTimeoutMode)[keyof typeof CursorTimeoutMode];
/** @public */
export interface AbstractCursorOptions extends BSONSerializeOptions {
    session?: ClientSession;
    readPreference?: ReadPreferenceLike;
    readConcern?: ReadConcernLike;
    /**
     * Specifies the number of documents to return in each response from MongoDB
     */
    batchSize?: number;
    /**
     * When applicable `maxTimeMS` controls the amount of time the initial command
     * that constructs a cursor should take. (ex. find, aggregate, listCollections)
     */
    maxTimeMS?: number;
    /**
     * When applicable `maxAwaitTimeMS` controls the amount of time subsequent getMores
     * that a cursor uses to fetch more data should take. (ex. cursor.next())
     */
    maxAwaitTimeMS?: number;
    /**
     * Comment to apply to the operation.
     *
     * In server versions pre-4.4, 'comment' must be string.  A server
     * error will be thrown if any other type is provided.
     *
     * In server versions 4.4 and above, 'comment' can be any valid BSON type.
     */
    comment?: unknown;
    /**
     * By default, MongoDB will automatically close a cursor when the
     * client has exhausted all results in the cursor. However, for [capped collections](https://www.mongodb.com/docs/manual/core/capped-collections)
     * you may use a Tailable Cursor that remains open after the client exhausts
     * the results in the initial cursor.
     */
    tailable?: boolean;
    /**
     * If awaitData is set to true, when the cursor reaches the end of the capped collection,
     * MongoDB blocks the query thread for a period of time waiting for new data to arrive.
     * When new data is inserted into the capped collection, the blocked thread is signaled
     * to wake up and return the next batch to the client.
     */
    awaitData?: boolean;
    noCursorTimeout?: boolean;
    /** Specifies the time an operation will run until it throws a timeout error. See {@link AbstractCursorOptions.timeoutMode} for more details on how this option applies to cursors. */
    timeoutMS?: number;
    /**
     * @public
     * @experimental
     * Specifies how `timeoutMS` is applied to the cursor. Can be either `'cursorLifeTime'` or `'iteration'`
     * When set to `'iteration'`, the deadline specified by `timeoutMS` applies to each call of
     * `cursor.next()`.
     * When set to `'cursorLifetime'`, the deadline applies to the life of the entire cursor.
     *
     * Depending on the type of cursor being used, this option has different default values.
     * For non-tailable cursors, this value defaults to `'cursorLifetime'`
     * For tailable cursors, this value defaults to `'iteration'` since tailable cursors, by
     * definition can have an arbitrarily long lifetime.
     *
     * @example
     * ```ts
     * const cursor = collection.find({}, {timeoutMS: 100, timeoutMode: 'iteration'});
     * for await (const doc of cursor) {
     *  // process doc
     *  // This will throw a timeout error if any of the iterator's `next()` calls takes more than 100ms, but
     *  // will continue to iterate successfully otherwise, regardless of the number of batches.
     * }
     * ```
     *
     * @example
     * ```ts
     * const cursor = collection.find({}, { timeoutMS: 1000, timeoutMode: 'cursorLifetime' });
     * const docs = await cursor.toArray(); // This entire line will throw a timeout error if all batches are not fetched and returned within 1000ms.
     * ```
     */
    timeoutMode?: CursorTimeoutMode;
    /**
     * @internal
     *
     * A timeout context to govern the total time the cursor can live.  If provided, the cursor
     * cannot be used in ITERATION mode.
     */
    timeoutContext?: CursorTimeoutContext;
}
/** @internal */
export type InternalAbstractCursorOptions = Omit<AbstractCursorOptions, 'readPreference'> & {
    readPreference: ReadPreference;
    readConcern?: ReadConcern;
    oplogReplay?: boolean;
    exhaust?: boolean;
    partial?: boolean;
    omitMaxTimeMS?: boolean;
};
/** @public */
export type AbstractCursorEvents = {
    [AbstractCursor.CLOSE](): void;
};
/** @public */
export declare abstract class AbstractCursor<TSchema = any, CursorEvents extends AbstractCursorEvents = AbstractCursorEvents> extends TypedEventEmitter<CursorEvents> implements AsyncDisposable {
    /** @internal */
    private cursorId;
    /** @internal */
    private cursorSession;
    /** @internal */
    private selectedServer?;
    /** @internal */
    private cursorNamespace;
    /** @internal */
    private documents;
    /** @internal */
    private cursorClient;
    /** @internal */
    private transform?;
    /**
     * @internal
     * This is true whether or not the first command fails. It only indicates whether or not the first
     * command has been run.
     */
    private initialized;
    /** @internal */
    private isClosed;
    /** @internal */
    private isKilled;
    /** @internal */
    protected readonly cursorOptions: InternalAbstractCursorOptions;
    /** @internal */
    protected timeoutContext?: CursorTimeoutContext;
    /** @event */
    static readonly CLOSE: "close";
    /** @internal */
    protected deserializationOptions: OnDemandDocumentDeserializeOptions;
    protected signal: AbortSignal | undefined;
    private abortListener;
    /** @internal */
    protected constructor(client: MongoClient, namespace: MongoDBNamespace, options?: AbstractCursorOptions & Abortable);
    /**
     * The cursor has no id until it receives a response from the initial cursor creating command.
     *
     * It is non-zero for as long as the database has an open cursor.
     *
     * The initiating command may receive a zero id if the entire result is in the `firstBatch`.
     */
    get id(): Long | undefined;
    /** @internal */
    get isDead(): boolean;
    /** @internal */
    get client(): MongoClient;
    /** @internal */
    get server(): Server | undefined;
    get namespace(): MongoDBNamespace;
    get readPreference(): ReadPreference;
    get readConcern(): ReadConcern | undefined;
    /** @internal */
    get session(): ClientSession;
    set session(clientSession: ClientSession);
    /**
     * The cursor is closed and all remaining locally buffered documents have been iterated.
     */
    get closed(): boolean;
    /**
     * A `killCursors` command was attempted on this cursor.
     * This is performed if the cursor id is non zero.
     */
    get killed(): boolean;
    get loadBalanced(): boolean;
    /**
     * @beta
     * @experimental
     * An alias for {@link AbstractCursor.close|AbstractCursor.close()}.
     */
    [Symbol.asyncDispose]: () => Promise<void>;
    /** @internal */
    asyncDispose(): Promise<void>;
    /** Adds cursor to client's tracking so it will be closed by MongoClient.close() */
    private trackCursor;
    /** Returns current buffered documents length */
    bufferedCount(): number;
    /** Returns current buffered documents */
    readBufferedDocuments(number?: number): NonNullable<TSchema>[];
    [Symbol.asyncIterator](): AsyncGenerator<TSchema, void, void>;
    stream(options?: CursorStreamOptions): Readable & AsyncIterable<TSchema>;
    hasNext(): Promise<boolean>;
    /** Get the next available document from the cursor, returns null if no more documents are available. */
    next(): Promise<TSchema | null>;
    /**
     * Try to get the next available document from the cursor or `null` if an empty batch is returned
     */
    tryNext(): Promise<TSchema | null>;
    /**
     * Iterates over all the documents for this cursor using the iterator, callback pattern.
     *
     * If the iterator returns `false`, iteration will stop.
     *
     * @param iterator - The iteration callback.
     * @deprecated - Will be removed in a future release. Use for await...of instead.
     */
    forEach(iterator: (doc: TSchema) => boolean | void): Promise<void>;
    /**
     * Frees any client-side resources used by the cursor.
     */
    close(options?: {
        timeoutMS?: number;
    }): Promise<void>;
    /**
     * Returns an array of documents. The caller is responsible for making sure that there
     * is enough memory to store the results. Note that the array only contains partial
     * results when this cursor had been previously accessed. In that case,
     * cursor.rewind() can be used to reset the cursor.
     */
    toArray(): Promise<TSchema[]>;
    /**
     * Add a cursor flag to the cursor
     *
     * @param flag - The flag to set, must be one of following ['tailable', 'oplogReplay', 'noCursorTimeout', 'awaitData', 'partial' -.
     * @param value - The flag boolean value.
     */
    addCursorFlag(flag: CursorFlag, value: boolean): this;
    /**
     * Map all documents using the provided function
     * If there is a transform set on the cursor, that will be called first and the result passed to
     * this function's transform.
     *
     * @remarks
     *
     * **Note** Cursors use `null` internally to indicate that there are no more documents in the cursor. Providing a mapping
     * function that maps values to `null` will result in the cursor closing itself before it has finished iterating
     * all documents.  This will **not** result in a memory leak, just surprising behavior.  For example:
     *
     * ```typescript
     * const cursor = collection.find({});
     * cursor.map(() => null);
     *
     * const documents = await cursor.toArray();
     * // documents is always [], regardless of how many documents are in the collection.
     * ```
     *
     * Other falsey values are allowed:
     *
     * ```typescript
     * const cursor = collection.find({});
     * cursor.map(() => '');
     *
     * const documents = await cursor.toArray();
     * // documents is now an array of empty strings
     * ```
     *
     * **Note for Typescript Users:** adding a transform changes the return type of the iteration of this cursor,
     * it **does not** return a new instance of a cursor. This means when calling map,
     * you should always assign the result to a new variable in order to get a correctly typed cursor variable.
     * Take note of the following example:
     *
     * @example
     * ```typescript
     * const cursor: FindCursor<Document> = coll.find();
     * const mappedCursor: FindCursor<number> = cursor.map(doc => Object.keys(doc).length);
     * const keyCounts: number[] = await mappedCursor.toArray(); // cursor.toArray() still returns Document[]
     * ```
     * @param transform - The mapping transformation method.
     */
    map<T = any>(transform: (doc: TSchema) => T): AbstractCursor<T>;
    /**
     * Set the ReadPreference for the cursor.
     *
     * @param readPreference - The new read preference for the cursor.
     */
    withReadPreference(readPreference: ReadPreferenceLike): this;
    /**
     * Set the ReadPreference for the cursor.
     *
     * @param readPreference - The new read preference for the cursor.
     */
    withReadConcern(readConcern: ReadConcernLike): this;
    /**
     * Set a maxTimeMS on the cursor query, allowing for hard timeout limits on queries (Only supported on MongoDB 2.6 or higher)
     *
     * @param value - Number of milliseconds to wait before aborting the query.
     */
    maxTimeMS(value: number): this;
    /**
     * Set the batch size for the cursor.
     *
     * @param value - The number of documents to return per batch. See {@link https://www.mongodb.com/docs/manual/reference/command/find/|find command documentation}.
     */
    batchSize(value: number): this;
    /**
     * Rewind this cursor to its uninitialized state. Any options that are present on the cursor will
     * remain in effect. Iterating this cursor will cause new queries to be sent to the server, even
     * if the resultant data has already been retrieved by this cursor.
     */
    rewind(): void;
    /**
     * Returns a new uninitialized copy of this cursor, with options matching those that have been set on the current instance
     */
    abstract clone(): AbstractCursor<TSchema>;
    /** @internal */
    protected abstract _initialize(session: ClientSession | undefined): Promise<InitialCursorResponse>;
    /** @internal */
    getMore(batchSize: number): Promise<CursorResponse>;
    /**
     * @internal
     *
     * This function is exposed for the unified test runner's createChangeStream
     * operation.  We cannot refactor to use the abstract _initialize method without
     * a significant refactor.
     */
    private cursorInit;
    /** @internal Attempt to obtain more documents */
    private fetchBatch;
    /** @internal */
    private cleanup;
    /** @internal */
    private hasEmittedClose;
    /** @internal */
    private emitClose;
    /** @internal */
    private transformDocument;
    /** @internal */
    protected throwIfInitialized(): void;
}
/**
 * @internal
 * The cursor timeout context is a wrapper around a timeout context
 * that keeps track of the "owner" of the cursor.  For timeout contexts
 * instantiated inside a cursor, the owner will be the cursor.
 *
 * All timeout behavior is exactly the same as the wrapped timeout context's.
 */
export declare class CursorTimeoutContext extends TimeoutContext {
    timeoutContext: TimeoutContext;
    owner: symbol | AbstractCursor;
    constructor(timeoutContext: TimeoutContext, owner: symbol | AbstractCursor);
    get serverSelectionTimeout(): Timeout | null;
    get connectionCheckoutTimeout(): Timeout | null;
    get clearServerSelectionTimeout(): boolean;
    get timeoutForSocketWrite(): Timeout | null;
    get timeoutForSocketRead(): Timeout | null;
    csotEnabled(): this is CSOTTimeoutContext;
    refresh(): void;
    clear(): void;
    get maxTimeMS(): number | null;
    get timeoutMS(): number | null;
    refreshed(): CursorTimeoutContext;
    addMaxTimeMSToCommand(command: Document, options: {
        omitMaxTimeMS?: boolean;
    }): void;
    getSocketTimeoutMS(): number | undefined;
}
//# sourceMappingURL=abstract_cursor.d.ts.map