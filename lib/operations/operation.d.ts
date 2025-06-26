import { type BSONSerializeOptions, type Document } from '../bson';
import { type Abortable } from '../mongo_types';
import { ReadPreference, type ReadPreferenceLike } from '../read_preference';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import type { MongoDBNamespace } from '../utils';
export declare const Aspect: {
    readonly READ_OPERATION: symbol;
    readonly WRITE_OPERATION: symbol;
    readonly RETRYABLE: symbol;
    readonly EXPLAINABLE: symbol;
    readonly SKIP_COLLATION: symbol;
    readonly CURSOR_CREATING: symbol;
    readonly MUST_SELECT_SAME_SERVER: symbol;
    readonly COMMAND_BATCHING: symbol;
};
/** @public */
export type Hint = string | Document;
/** @public */
export interface OperationOptions extends BSONSerializeOptions {
    /** Specify ClientSession for this command */
    session?: ClientSession;
    willRetryWrite?: boolean;
    /** The preferred read preference (ReadPreference.primary, ReadPreference.primary_preferred, ReadPreference.secondary, ReadPreference.secondary_preferred, ReadPreference.nearest). */
    readPreference?: ReadPreferenceLike;
    /** @internal Hints to `executeOperation` that this operation should not unpin on an ended transaction */
    bypassPinningCheck?: boolean;
    omitReadPreference?: boolean;
    /** @internal Hint to `executeOperation` to omit maxTimeMS */
    omitMaxTimeMS?: boolean;
    /**
     * @experimental
     * Specifies the time an operation will run until it throws a timeout error
     */
    timeoutMS?: number;
}
/**
 * This class acts as a parent class for any operation and is responsible for setting this.options,
 * as well as setting and getting a session.
 * Additionally, this class implements `hasAspect`, which determines whether an operation has
 * a specific aspect.
 * @internal
 */
export declare abstract class AbstractOperation<TResult = any> {
    ns: MongoDBNamespace;
    readPreference: ReadPreference;
    server: Server;
    bypassPinningCheck: boolean;
    trySecondaryWrite: boolean;
    bsonOptions?: BSONSerializeOptions;
    options: OperationOptions & Abortable;
    /** Specifies the time an operation will run until it throws a timeout error. */
    timeoutMS?: number;
    private _session;
    static aspects?: Set<symbol>;
    constructor(options?: OperationOptions & Abortable);
    /** Must match the first key of the command object sent to the server.
    Command name should be stateless (should not use 'this' keyword) */
    abstract get commandName(): string;
    abstract execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<TResult>;
    hasAspect(aspect: symbol): boolean;
    get session(): ClientSession | undefined;
    clearSession(): void;
    resetBatch(): boolean;
    get canRetryRead(): boolean;
    get canRetryWrite(): boolean;
}
export declare function defineAspects(operation: {
    aspects?: Set<symbol>;
}, aspects: symbol | symbol[] | Set<symbol>): Set<symbol>;
//# sourceMappingURL=operation.d.ts.map