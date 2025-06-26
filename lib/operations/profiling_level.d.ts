import type { Db } from '../db';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export type ProfilingLevelOptions = CommandOperationOptions;
/** @internal */
export declare class ProfilingLevelOperation extends CommandOperation<string> {
    options: ProfilingLevelOptions;
    constructor(db: Db, options: ProfilingLevelOptions);
    get commandName(): "profile";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<string>;
}
//# sourceMappingURL=profiling_level.d.ts.map