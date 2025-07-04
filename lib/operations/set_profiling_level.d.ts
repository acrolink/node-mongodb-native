import type { Db } from '../db';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export declare const ProfilingLevel: Readonly<{
    readonly off: "off";
    readonly slowOnly: "slow_only";
    readonly all: "all";
}>;
/** @public */
export type ProfilingLevel = (typeof ProfilingLevel)[keyof typeof ProfilingLevel];
/** @public */
export type SetProfilingLevelOptions = CommandOperationOptions;
/** @internal */
export declare class SetProfilingLevelOperation extends CommandOperation<ProfilingLevel> {
    options: SetProfilingLevelOptions;
    level: ProfilingLevel;
    profile: 0 | 1 | 2;
    constructor(db: Db, level: ProfilingLevel, options: SetProfilingLevelOptions);
    get commandName(): "profile";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<ProfilingLevel>;
}
//# sourceMappingURL=set_profiling_level.d.ts.map