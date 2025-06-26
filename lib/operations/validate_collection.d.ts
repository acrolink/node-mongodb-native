import type { Admin } from '../admin';
import type { Document } from '../bson';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export interface ValidateCollectionOptions extends CommandOperationOptions {
    /** Validates a collection in the background, without interrupting read or write traffic (only in MongoDB 4.4+) */
    background?: boolean;
}
/** @internal */
export declare class ValidateCollectionOperation extends CommandOperation<Document> {
    options: ValidateCollectionOptions;
    collectionName: string;
    command: Document;
    constructor(admin: Admin, collectionName: string, options: ValidateCollectionOptions);
    get commandName(): "validate";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<Document>;
}
//# sourceMappingURL=validate_collection.d.ts.map