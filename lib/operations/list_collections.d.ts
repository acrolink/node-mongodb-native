import type { Binary, Document } from '../bson';
import { CursorResponse } from '../cmap/wire_protocol/responses';
import { type CursorTimeoutContext, type CursorTimeoutMode } from '../cursor/abstract_cursor';
import type { Db } from '../db';
import { type Abortable } from '../mongo_types';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export interface ListCollectionsOptions extends Omit<CommandOperationOptions, 'writeConcern'>, Abortable {
    /** Since 4.0: If true, will only return the collection name in the response, and will omit additional info */
    nameOnly?: boolean;
    /** Since 4.0: If true and nameOnly is true, allows a user without the required privilege (i.e. listCollections action on the database) to run the command when access control is enforced. */
    authorizedCollections?: boolean;
    /** The batchSize for the returned command cursor or if pre 2.8 the systems batch collection */
    batchSize?: number;
    /** @internal */
    timeoutMode?: CursorTimeoutMode;
    /** @internal */
    timeoutContext?: CursorTimeoutContext;
}
/** @internal */
export declare class ListCollectionsOperation extends CommandOperation<CursorResponse> {
    /**
     * @remarks WriteConcern can still be present on the options because
     * we inherit options from the client/db/collection.  The
     * key must be present on the options in order to delete it.
     * This allows typescript to delete the key but will
     * not allow a writeConcern to be assigned as a property on options.
     */
    options: ListCollectionsOptions & {
        writeConcern?: never;
    };
    db: Db;
    filter: Document;
    nameOnly: boolean;
    authorizedCollections: boolean;
    batchSize?: number;
    constructor(db: Db, filter: Document, options?: ListCollectionsOptions);
    get commandName(): "listCollections";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<CursorResponse>;
    generateCommand(wireVersion: number): Document;
}
/** @public */
export interface CollectionInfo extends Document {
    name: string;
    type?: string;
    options?: Document;
    info?: {
        readOnly?: false;
        uuid?: Binary;
    };
    idIndex?: Document;
}
//# sourceMappingURL=list_collections.d.ts.map