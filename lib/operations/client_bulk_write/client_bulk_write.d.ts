import { ClientBulkWriteCursorResponse } from '../../cmap/wire_protocol/responses';
import type { Server } from '../../sdam/server';
import type { ClientSession } from '../../sessions';
import { type TimeoutContext } from '../../timeout';
import { CommandOperation } from '../command';
import { type ClientBulkWriteCommandBuilder } from './command_builder';
import { type ClientBulkWriteOptions } from './common';
/**
 * Executes a single client bulk write operation within a potential batch.
 * @internal
 */
export declare class ClientBulkWriteOperation extends CommandOperation<ClientBulkWriteCursorResponse> {
    commandBuilder: ClientBulkWriteCommandBuilder;
    options: ClientBulkWriteOptions;
    get commandName(): "bulkWrite";
    constructor(commandBuilder: ClientBulkWriteCommandBuilder, options: ClientBulkWriteOptions);
    resetBatch(): boolean;
    get canRetryWrite(): boolean;
    /**
     * Execute the command. Superclass will handle write concern, etc.
     * @param server - The server.
     * @param session - The session.
     * @returns The response.
     */
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<ClientBulkWriteCursorResponse>;
}
//# sourceMappingURL=client_bulk_write.d.ts.map