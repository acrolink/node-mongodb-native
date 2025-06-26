import type { Document } from '../bson';
import { Collection } from '../collection';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export interface RenameOptions extends CommandOperationOptions {
    /** Drop the target name collection if it previously exists. */
    dropTarget?: boolean;
    /** Unclear */
    new_collection?: boolean;
}
/** @internal */
export declare class RenameOperation extends CommandOperation<Document> {
    collection: Collection;
    newName: string;
    options: RenameOptions;
    constructor(collection: Collection, newName: string, options: RenameOptions);
    get commandName(): string;
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<Collection>;
}
//# sourceMappingURL=rename.d.ts.map