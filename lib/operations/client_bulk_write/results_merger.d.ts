import { type Document } from '../../bson';
import { type ClientBulkWriteCursor } from '../../cursor/client_bulk_write_cursor';
import { type ClientBulkWriteError, type ClientBulkWriteOptions, type ClientBulkWriteResult } from './common';
/**
 * Merges client bulk write cursor responses together into a single result.
 * @internal
 */
export declare class ClientBulkWriteResultsMerger {
    private result;
    private options;
    private currentBatchOffset;
    writeConcernErrors: Document[];
    writeErrors: Map<number, ClientBulkWriteError>;
    /**
     * @returns The standard unacknowledged bulk write result.
     */
    static unacknowledged(): ClientBulkWriteResult;
    /**
     * Instantiate the merger.
     * @param options - The options.
     */
    constructor(options: ClientBulkWriteOptions);
    /**
     * Get the bulk write result object.
     */
    get bulkWriteResult(): ClientBulkWriteResult;
    /**
     * Merge the results in the cursor to the existing result.
     * @param currentBatchOffset - The offset index to the original models.
     * @param response - The cursor response.
     * @param documents - The documents in the cursor.
     * @returns The current result.
     */
    merge(cursor: ClientBulkWriteCursor): Promise<ClientBulkWriteResult>;
    /**
     * Process an individual document in the results.
     * @param cursor - The cursor.
     * @param document - The document to process.
     */
    private processDocument;
    /**
     * Increment the result counts.
     * @param document - The document with the results.
     */
    private incrementCounts;
}
//# sourceMappingURL=results_merger.d.ts.map