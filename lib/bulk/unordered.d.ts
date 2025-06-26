import type { Document } from '../bson';
import type { Collection } from '../collection';
import type { DeleteStatement } from '../operations/delete';
import type { UpdateStatement } from '../operations/update';
import { BatchType, BulkOperationBase, type BulkWriteOptions, type BulkWriteResult } from './common';
/** @public */
export declare class UnorderedBulkOperation extends BulkOperationBase {
    /** @internal */
    constructor(collection: Collection, options: BulkWriteOptions);
    handleWriteError(writeResult: BulkWriteResult): void;
    addToOperationsList(batchType: BatchType, document: Document | UpdateStatement | DeleteStatement): this;
}
//# sourceMappingURL=unordered.d.ts.map