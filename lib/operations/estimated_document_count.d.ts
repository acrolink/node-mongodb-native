import type { Collection } from '../collection';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export interface EstimatedDocumentCountOptions extends CommandOperationOptions {
    /**
     * The maximum amount of time to allow the operation to run.
     *
     * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
     */
    maxTimeMS?: number;
}
/** @internal */
export declare class EstimatedDocumentCountOperation extends CommandOperation<number> {
    options: EstimatedDocumentCountOptions;
    collectionName: string;
    constructor(collection: Collection, options?: EstimatedDocumentCountOptions);
    get commandName(): "count";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<number>;
}
//# sourceMappingURL=estimated_document_count.d.ts.map