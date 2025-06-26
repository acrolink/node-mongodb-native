import { type Document } from '../bson';
import { type ClientBulkWriteCursorResponse } from '../cmap/wire_protocol/responses';
import type { MongoClient } from '../mongo_client';
import { type ClientBulkWriteCommandBuilder } from '../operations/client_bulk_write/command_builder';
import { type ClientBulkWriteOptions } from '../operations/client_bulk_write/common';
import type { ClientSession } from '../sessions';
import { AbstractCursor, type AbstractCursorOptions, type InitialCursorResponse } from './abstract_cursor';
/** @public */
export interface ClientBulkWriteCursorOptions extends Omit<AbstractCursorOptions, 'maxAwaitTimeMS' | 'tailable' | 'awaitData'>, ClientBulkWriteOptions {
}
/**
 * This is the cursor that handles client bulk write operations. Note this is never
 * exposed directly to the user and is always immediately exhausted.
 * @internal
 */
export declare class ClientBulkWriteCursor extends AbstractCursor {
    commandBuilder: ClientBulkWriteCommandBuilder;
    /** @internal */
    private cursorResponse?;
    /** @internal */
    private clientBulkWriteOptions;
    /** @internal */
    constructor(client: MongoClient, commandBuilder: ClientBulkWriteCommandBuilder, options?: ClientBulkWriteCursorOptions);
    /**
     * We need a way to get the top level cursor response fields for
     * generating the bulk write result, so we expose this here.
     */
    get response(): ClientBulkWriteCursorResponse | null;
    get operations(): Document[];
    clone(): ClientBulkWriteCursor;
    /** @internal */
    _initialize(session: ClientSession): Promise<InitialCursorResponse>;
}
//# sourceMappingURL=client_bulk_write_cursor.d.ts.map