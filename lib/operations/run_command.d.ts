import type { BSONSerializeOptions, Document } from '../bson';
import { type MongoDBResponseConstructor } from '../cmap/wire_protocol/responses';
import { type Db } from '../db';
import type { ReadPreferenceLike } from '../read_preference';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { AbstractOperation } from './operation';
/** @public */
export type RunCommandOptions = {
    /** Specify ClientSession for this command */
    session?: ClientSession;
    /** The read preference */
    readPreference?: ReadPreferenceLike;
    /**
     * @experimental
     * Specifies the time an operation will run until it throws a timeout error
     */
    timeoutMS?: number;
    /** @internal */
    omitMaxTimeMS?: boolean;
} & BSONSerializeOptions;
/** @internal */
export declare class RunCommandOperation<T = Document> extends AbstractOperation<T> {
    command: Document;
    options: RunCommandOptions & {
        responseType?: MongoDBResponseConstructor;
    };
    constructor(parent: Db, command: Document, options: RunCommandOptions & {
        responseType?: MongoDBResponseConstructor;
    });
    get commandName(): "runCommand";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<T>;
}
export declare class RunAdminCommandOperation<T = Document> extends AbstractOperation<T> {
    command: Document;
    options: RunCommandOptions & {
        noResponse?: boolean;
        bypassPinningCheck?: boolean;
    };
    constructor(command: Document, options: RunCommandOptions & {
        noResponse?: boolean;
        bypassPinningCheck?: boolean;
    });
    get commandName(): "runCommand";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<T>;
}
//# sourceMappingURL=run_command.d.ts.map