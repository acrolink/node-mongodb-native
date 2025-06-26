import type { Long } from '../bson';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { type MongoDBNamespace } from '../utils';
import { AbstractOperation, type OperationOptions } from './operation';
export declare class KillCursorsOperation extends AbstractOperation {
    cursorId: Long;
    constructor(cursorId: Long, ns: MongoDBNamespace, server: Server, options: OperationOptions);
    get commandName(): "killCursors";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<void>;
}
//# sourceMappingURL=kill_cursors.d.ts.map