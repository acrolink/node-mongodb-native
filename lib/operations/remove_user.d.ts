import type { Db } from '../db';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export type RemoveUserOptions = CommandOperationOptions;
/** @internal */
export declare class RemoveUserOperation extends CommandOperation<boolean> {
    options: RemoveUserOptions;
    username: string;
    constructor(db: Db, username: string, options: RemoveUserOptions);
    get commandName(): "dropUser";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<boolean>;
}
//# sourceMappingURL=remove_user.d.ts.map