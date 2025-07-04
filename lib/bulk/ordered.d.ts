import type { Document } from '../bson';
import type { Collection } from '../collection';
import type { DeleteStatement } from '../operations/delete';
import type { UpdateStatement } from '../operations/update';
import { BatchType, BulkOperationBase, type BulkWriteOptions } from './common';
/** @public */
export declare class OrderedBulkOperation extends BulkOperationBase {
    /** @internal */
    constructor(collection: Collection, options: BulkWriteOptions);
    addToOperationsList(batchType: BatchType, document: Document | UpdateStatement | DeleteStatement): this;
}
//# sourceMappingURL=ordered.d.ts.map