import type { Document } from '../bson';
import type { Db } from '../db';
import { type Abortable } from '../mongo_types';
import { type CollectionInfo, type ListCollectionsOptions } from '../operations/list_collections';
import type { ClientSession } from '../sessions';
import { AbstractCursor, type InitialCursorResponse } from './abstract_cursor';
/** @public */
export declare class ListCollectionsCursor<T extends Pick<CollectionInfo, 'name' | 'type'> | CollectionInfo = Pick<CollectionInfo, 'name' | 'type'> | CollectionInfo> extends AbstractCursor<T> {
    parent: Db;
    filter: Document;
    options?: ListCollectionsOptions & Abortable;
    constructor(db: Db, filter: Document, options?: ListCollectionsOptions & Abortable);
    clone(): ListCollectionsCursor<T>;
    /** @internal */
    _initialize(session: ClientSession | undefined): Promise<InitialCursorResponse>;
}
//# sourceMappingURL=list_collections_cursor.d.ts.map