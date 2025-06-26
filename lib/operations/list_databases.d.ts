import type { Document } from '../bson';
import type { Db } from '../db';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export interface ListDatabasesResult {
    databases: ({
        name: string;
        sizeOnDisk?: number;
        empty?: boolean;
    } & Document)[];
    totalSize?: number;
    totalSizeMb?: number;
    ok: 1 | 0;
}
/** @public */
export interface ListDatabasesOptions extends CommandOperationOptions {
    /** A query predicate that determines which databases are listed */
    filter?: Document;
    /** A flag to indicate whether the command should return just the database names, or return both database names and size information */
    nameOnly?: boolean;
    /** A flag that determines which databases are returned based on the user privileges when access control is enabled */
    authorizedDatabases?: boolean;
}
/** @internal */
export declare class ListDatabasesOperation extends CommandOperation<ListDatabasesResult> {
    options: ListDatabasesOptions;
    constructor(db: Db, options?: ListDatabasesOptions);
    get commandName(): "listDatabases";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<ListDatabasesResult>;
}
//# sourceMappingURL=list_databases.d.ts.map