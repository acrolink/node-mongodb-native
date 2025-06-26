import type { Collection } from '../collection';
import { type ListIndexesOptions } from '../operations/indexes';
import type { ClientSession } from '../sessions';
import { AbstractCursor, type InitialCursorResponse } from './abstract_cursor';
/** @public */
export declare class ListIndexesCursor extends AbstractCursor {
    parent: Collection;
    options?: ListIndexesOptions;
    constructor(collection: Collection, options?: ListIndexesOptions);
    clone(): ListIndexesCursor;
    /** @internal */
    _initialize(session: ClientSession | undefined): Promise<InitialCursorResponse>;
}
//# sourceMappingURL=list_indexes_cursor.d.ts.map