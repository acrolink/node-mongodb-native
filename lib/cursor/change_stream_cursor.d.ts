import type { Document } from '../bson';
import { type ChangeStreamDocument, type ChangeStreamEvents, type OperationTime, type ResumeToken } from '../change_stream';
import { type CursorResponse } from '../cmap/wire_protocol/responses';
import type { MongoClient } from '../mongo_client';
import type { CollationOptions } from '../operations/command';
import type { ClientSession } from '../sessions';
import { type MongoDBNamespace } from '../utils';
import { AbstractCursor, type AbstractCursorOptions, type InitialCursorResponse } from './abstract_cursor';
/** @internal */
export interface ChangeStreamCursorOptions extends AbstractCursorOptions {
    startAtOperationTime?: OperationTime;
    resumeAfter?: ResumeToken;
    startAfter?: ResumeToken;
    maxAwaitTimeMS?: number;
    collation?: CollationOptions;
    fullDocument?: string;
}
/** @internal */
export declare class ChangeStreamCursor<TSchema extends Document = Document, TChange extends Document = ChangeStreamDocument<TSchema>> extends AbstractCursor<TChange, ChangeStreamEvents> {
    private _resumeToken;
    private startAtOperationTime;
    private hasReceived?;
    private readonly changeStreamCursorOptions;
    private postBatchResumeToken?;
    private readonly pipeline;
    /**
     * @internal
     *
     * used to determine change stream resumability
     */
    maxWireVersion: number | undefined;
    constructor(client: MongoClient, namespace: MongoDBNamespace, pipeline?: Document[], options?: ChangeStreamCursorOptions);
    set resumeToken(token: ResumeToken);
    get resumeToken(): ResumeToken;
    get resumeOptions(): ChangeStreamCursorOptions;
    cacheResumeToken(resumeToken: ResumeToken): void;
    _processBatch(response: CursorResponse): void;
    clone(): AbstractCursor<TChange>;
    _initialize(session: ClientSession): Promise<InitialCursorResponse>;
    getMore(batchSize: number): Promise<CursorResponse>;
}
//# sourceMappingURL=change_stream_cursor.d.ts.map