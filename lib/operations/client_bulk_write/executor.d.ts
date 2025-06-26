import { type Document } from '../../bson';
import { type MongoClient } from '../../mongo_client';
import { type AnyClientBulkWriteModel, type ClientBulkWriteOptions, type ClientBulkWriteResult } from './common';
/**
 * Responsible for executing a client bulk write.
 * @internal
 */
export declare class ClientBulkWriteExecutor {
    private readonly client;
    private readonly options;
    private readonly operations;
    /**
     * Instantiate the executor.
     * @param client - The mongo client.
     * @param operations - The user supplied bulk write models.
     * @param options - The bulk write options.
     */
    constructor(client: MongoClient, operations: ReadonlyArray<AnyClientBulkWriteModel<Document>>, options?: ClientBulkWriteOptions);
    /**
     * Execute the client bulk write. Will split commands into batches and exhaust the cursors
     * for each, then merge the results into one.
     * @returns The result.
     */
    execute(): Promise<ClientBulkWriteResult>;
}
//# sourceMappingURL=executor.d.ts.map