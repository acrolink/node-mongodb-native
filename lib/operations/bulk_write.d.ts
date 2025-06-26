import type { AnyBulkWriteOperation, BulkWriteOptions, BulkWriteResult } from '../bulk/common';
import type { Collection } from '../collection';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { AbstractOperation } from './operation';
/** @internal */
export declare class BulkWriteOperation extends AbstractOperation<BulkWriteResult> {
    options: BulkWriteOptions;
    collection: Collection;
    operations: ReadonlyArray<AnyBulkWriteOperation>;
    constructor(collection: Collection, operations: ReadonlyArray<AnyBulkWriteOperation>, options: BulkWriteOptions);
    get commandName(): "bulkWrite";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<BulkWriteResult>;
}
//# sourceMappingURL=bulk_write.d.ts.map