import type { Document } from '../bson';
import type { Db } from '../db';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export interface DropCollectionOptions extends CommandOperationOptions {
    /** @experimental */
    encryptedFields?: Document;
}
/** @internal */
export declare class DropCollectionOperation extends CommandOperation<boolean> {
    options: DropCollectionOptions;
    db: Db;
    name: string;
    constructor(db: Db, name: string, options?: DropCollectionOptions);
    get commandName(): "drop";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<boolean>;
    private executeWithoutEncryptedFieldsCheck;
}
/** @public */
export type DropDatabaseOptions = CommandOperationOptions;
/** @internal */
export declare class DropDatabaseOperation extends CommandOperation<boolean> {
    options: DropDatabaseOptions;
    constructor(db: Db, options: DropDatabaseOptions);
    get commandName(): "dropDatabase";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<boolean>;
}
//# sourceMappingURL=drop.d.ts.map