import type { Document } from '../bson';
import type { Db } from '../db';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export interface DbStatsOptions extends CommandOperationOptions {
    /** Divide the returned sizes by scale value. */
    scale?: number;
}
/** @internal */
export declare class DbStatsOperation extends CommandOperation<Document> {
    options: DbStatsOptions;
    constructor(db: Db, options: DbStatsOptions);
    get commandName(): "dbStats";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<Document>;
}
//# sourceMappingURL=stats.d.ts.map