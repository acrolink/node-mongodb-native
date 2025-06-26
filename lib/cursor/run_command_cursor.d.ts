import type { BSONSerializeOptions, Document } from '../bson';
import { CursorResponse } from '../cmap/wire_protocol/responses';
import type { Db } from '../db';
import type { ReadConcernLike } from '../read_concern';
import type { ReadPreferenceLike } from '../read_preference';
import type { ClientSession } from '../sessions';
import { AbstractCursor, type CursorTimeoutMode, type InitialCursorResponse } from './abstract_cursor';
/** @public */
export type RunCursorCommandOptions = {
    readPreference?: ReadPreferenceLike;
    session?: ClientSession;
    /**
     * @experimental
     * Specifies the time an operation will run until it throws a timeout error. Note that if
     * `maxTimeMS` is provided in the command in addition to setting `timeoutMS` in the options, then
     * the original value of `maxTimeMS` will be overwritten.
     */
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
    tailable?: boolean;
    awaitData?: boolean;
} & BSONSerializeOptions;
/** @public */
export declare class RunCommandCursor extends AbstractCursor {
    readonly command: Readonly<Record<string, any>>;
    readonly getMoreOptions: {
        comment?: any;
        maxAwaitTimeMS?: number;
        batchSize?: number;
    };
    /**
     * Controls the `getMore.comment` field
     * @param comment - any BSON value
     */
    setComment(comment: any): this;
    /**
     * Controls the `getMore.maxTimeMS` field. Only valid when cursor is tailable await
     * @param maxTimeMS - the number of milliseconds to wait for new data
     */
    setMaxTimeMS(maxTimeMS: number): this;
    /**
     * Controls the `getMore.batchSize` field
     * @param batchSize - the number documents to return in the `nextBatch`
     */
    setBatchSize(batchSize: number): this;
    /** Unsupported for RunCommandCursor */
    clone(): never;
    /** Unsupported for RunCommandCursor: readConcern must be configured directly on command document */
    withReadConcern(_: ReadConcernLike): never;
    /** Unsupported for RunCommandCursor: various cursor flags must be configured directly on command document */
    addCursorFlag(_: string, __: boolean): never;
    /**
     * Unsupported for RunCommandCursor: maxTimeMS must be configured directly on command document
     */
    maxTimeMS(_: number): never;
    /** Unsupported for RunCommandCursor: batchSize must be configured directly on command document */
    batchSize(_: number): never;
    /** @internal */
    private db;
    /** @internal */
    constructor(db: Db, command: Document, options?: RunCursorCommandOptions);
    /** @internal */
    protected _initialize(session: ClientSession): Promise<InitialCursorResponse>;
    /** @internal */
    getMore(_batchSize: number): Promise<CursorResponse>;
}
//# sourceMappingURL=run_command_cursor.d.ts.map