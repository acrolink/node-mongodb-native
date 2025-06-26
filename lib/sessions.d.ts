import { Binary, type Document, type Timestamp } from './bson';
import type { CommandOptions, Connection } from './cmap/connection';
import { type MongoDBResponse } from './cmap/wire_protocol/responses';
import type { AbstractCursor } from './cursor/abstract_cursor';
import { type AnyError, type MongoDriverError } from './error';
import type { MongoClient, MongoOptions } from './mongo_client';
import { TypedEventEmitter } from './mongo_types';
import { type AsyncDisposable } from './resource_management';
import { type ClusterTime } from './sdam/common';
import { TimeoutContext } from './timeout';
import { Transaction, type TransactionOptions } from './transactions';
import { List } from './utils';
/** @public */
export interface ClientSessionOptions {
    /** Whether causal consistency should be enabled on this session */
    causalConsistency?: boolean;
    /** Whether all read operations should be read from the same snapshot for this session (NOTE: not compatible with `causalConsistency=true`) */
    snapshot?: boolean;
    /** The default TransactionOptions to use for transactions started on this session. */
    defaultTransactionOptions?: TransactionOptions;
    /**
     * @public
     * @experimental
     * An overriding timeoutMS value to use for a client-side timeout.
     * If not provided the session uses the timeoutMS specified on the MongoClient.
     */
    defaultTimeoutMS?: number;
    /** @internal */
    owner?: symbol | AbstractCursor;
    /** @internal */
    explicit?: boolean;
    /** @internal */
    initialClusterTime?: ClusterTime;
}
/** @public */
export type WithTransactionCallback<T = any> = (session: ClientSession) => Promise<T>;
/** @public */
export type ClientSessionEvents = {
    ended(session: ClientSession): void;
};
/** @public */
export interface EndSessionOptions {
    /**
     * An optional error which caused the call to end this session
     * @internal
     */
    error?: AnyError;
    force?: boolean;
    forceClear?: boolean;
    /** Specifies the time an operation will run until it throws a timeout error */
    timeoutMS?: number;
}
/**
 * A class representing a client session on the server
 *
 * NOTE: not meant to be instantiated directly.
 * @public
 */
export declare class ClientSession extends TypedEventEmitter<ClientSessionEvents> implements AsyncDisposable {
    /** @internal */
    client: MongoClient;
    /** @internal */
    sessionPool: ServerSessionPool;
    hasEnded: boolean;
    clientOptions: MongoOptions;
    supports: {
        causalConsistency: boolean;
    };
    clusterTime?: ClusterTime;
    operationTime?: Timestamp;
    explicit: boolean;
    /** @internal */
    owner?: symbol | AbstractCursor;
    defaultTransactionOptions: TransactionOptions;
    transaction: Transaction;
    /**
     * @internal
     * Keeps track of whether or not the current transaction has attempted to be committed. Is
     * initially undefined. Gets set to false when startTransaction is called. When commitTransaction is sent to server, if the commitTransaction succeeds, it is then set to undefined, otherwise, set to true
     */
    private commitAttempted?;
    readonly snapshotEnabled: boolean;
    /** @internal */
    private _serverSession;
    /** @internal */
    snapshotTime?: Timestamp;
    /** @internal */
    pinnedConnection?: Connection;
    /** @internal */
    txnNumberIncrement: number;
    /**
     * @experimental
     * Specifies the time an operation in a given `ClientSession` will run until it throws a timeout error
     */
    timeoutMS?: number;
    /** @internal */
    timeoutContext: TimeoutContext | null;
    /**
     * Create a client session.
     * @internal
     * @param client - The current client
     * @param sessionPool - The server session pool (Internal Class)
     * @param options - Optional settings
     * @param clientOptions - Optional settings provided when creating a MongoClient
     */
    constructor(client: MongoClient, sessionPool: ServerSessionPool, options: ClientSessionOptions, clientOptions: MongoOptions);
    /** The server id associated with this session */
    get id(): ServerSessionId | undefined;
    get serverSession(): ServerSession;
    get loadBalanced(): boolean;
    /** @internal */
    pin(conn: Connection): void;
    /** @internal */
    unpin(options?: {
        force?: boolean;
        forceClear?: boolean;
        error?: AnyError;
    }): void;
    get isPinned(): boolean;
    /**
     * Frees any client-side resources held by the current session.  If a session is in a transaction,
     * the transaction is aborted.
     *
     * Does not end the session on the server.
     *
     * @param options - Optional settings. Currently reserved for future use
     */
    endSession(options?: EndSessionOptions): Promise<void>;
    /**
     * @beta
     * @experimental
     * An alias for {@link ClientSession.endSession|ClientSession.endSession()}.
     */
    [Symbol.asyncDispose]: () => Promise<void>;
    /** @internal */
    asyncDispose(): Promise<void>;
    /**
     * Advances the operationTime for a ClientSession.
     *
     * @param operationTime - the `BSON.Timestamp` of the operation type it is desired to advance to
     */
    advanceOperationTime(operationTime: Timestamp): void;
    /**
     * Advances the clusterTime for a ClientSession to the provided clusterTime of another ClientSession
     *
     * @param clusterTime - the $clusterTime returned by the server from another session in the form of a document containing the `BSON.Timestamp` clusterTime and signature
     */
    advanceClusterTime(clusterTime: ClusterTime): void;
    /**
     * Used to determine if this session equals another
     *
     * @param session - The session to compare to
     */
    equals(session: ClientSession): boolean;
    /**
     * Increment the transaction number on the internal ServerSession
     *
     * @privateRemarks
     * This helper increments a value stored on the client session that will be
     * added to the serverSession's txnNumber upon applying it to a command.
     * This is because the serverSession is lazily acquired after a connection is obtained
     */
    incrementTransactionNumber(): void;
    /** @returns whether this session is currently in a transaction or not */
    inTransaction(): boolean;
    /**
     * Starts a new transaction with the given options.
     *
     * @remarks
     * **IMPORTANT**: Running operations in parallel is not supported during a transaction. The use of `Promise.all`,
     * `Promise.allSettled`, `Promise.race`, etc to parallelize operations inside a transaction is
     * undefined behaviour.
     *
     * @param options - Options for the transaction
     */
    startTransaction(options?: TransactionOptions): void;
    /**
     * Commits the currently active transaction in this session.
     *
     * @param options - Optional options, can be used to override `defaultTimeoutMS`.
     */
    commitTransaction(options?: {
        timeoutMS?: number;
    }): Promise<void>;
    /**
     * Aborts the currently active transaction in this session.
     *
     * @param options - Optional options, can be used to override `defaultTimeoutMS`.
     */
    abortTransaction(options?: {
        timeoutMS?: number;
    }): Promise<void>;
    /** @internal */
    abortTransaction(options?: {
        timeoutMS?: number;
        throwTimeout?: true;
    }): Promise<void>;
    /**
     * This is here to ensure that ClientSession is never serialized to BSON.
     */
    toBSON(): never;
    /**
     * Starts a transaction and runs a provided function, ensuring the commitTransaction is always attempted when all operations run in the function have completed.
     *
     * **IMPORTANT:** This method requires the function passed in to return a Promise. That promise must be made by `await`-ing all operations in such a way that rejections are propagated to the returned promise.
     *
     * **IMPORTANT:** Running operations in parallel is not supported during a transaction. The use of `Promise.all`,
     * `Promise.allSettled`, `Promise.race`, etc to parallelize operations inside a transaction is
     * undefined behaviour.
     *
     * **IMPORTANT:** When running an operation inside a `withTransaction` callback, if it is not
     * provided the explicit session in its options, it will not be part of the transaction and it will not respect timeoutMS.
     *
     *
     * @remarks
     * - If all operations successfully complete and the `commitTransaction` operation is successful, then the provided function will return the result of the provided function.
     * - If the transaction is unable to complete or an error is thrown from within the provided function, then the provided function will throw an error.
     *   - If the transaction is manually aborted within the provided function it will not throw.
     * - If the driver needs to attempt to retry the operations, the provided function may be called multiple times.
     *
     * Checkout a descriptive example here:
     * @see https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions
     *
     * If a command inside withTransaction fails:
     * - It may cause the transaction on the server to be aborted.
     * - This situation is normally handled transparently by the driver.
     * - However, if the application catches such an error and does not rethrow it, the driver will not be able to determine whether the transaction was aborted or not.
     * - The driver will then retry the transaction indefinitely.
     *
     * To avoid this situation, the application must not silently handle errors within the provided function.
     * If the application needs to handle errors within, it must await all operations such that if an operation is rejected it becomes the rejection of the callback function passed into withTransaction.
     *
     * @param fn - callback to run within a transaction
     * @param options - optional settings for the transaction
     * @returns A raw command response or undefined
     */
    withTransaction<T = any>(fn: WithTransactionCallback<T>, options?: TransactionOptions & {
        /**
         * Configures a timeoutMS expiry for the entire withTransactionCallback.
         *
         * @remarks
         * - The remaining timeout will not be applied to callback operations that do not use the ClientSession.
         * - Overriding timeoutMS for operations executed using the explicit session inside the provided callback will result in a client-side error.
         */
        timeoutMS?: number;
    }): Promise<T>;
}
export declare function maybeClearPinnedConnection(session: ClientSession, options?: EndSessionOptions): void;
/** @public */
export type ServerSessionId = {
    id: Binary;
};
/**
 * Reflects the existence of a session on the server. Can be reused by the session pool.
 * WARNING: not meant to be instantiated directly. For internal use only.
 * @public
 */
export declare class ServerSession {
    id: ServerSessionId;
    lastUse: number;
    txnNumber: number;
    isDirty: boolean;
    /** @internal */
    constructor(cloned?: ServerSession | null);
    /**
     * Determines if the server session has timed out.
     *
     * @param sessionTimeoutMinutes - The server's "logicalSessionTimeoutMinutes"
     */
    hasTimedOut(sessionTimeoutMinutes: number): boolean;
}
/**
 * Maintains a pool of Server Sessions.
 * For internal use only
 * @internal
 */
export declare class ServerSessionPool {
    client: MongoClient;
    sessions: List<ServerSession>;
    constructor(client: MongoClient);
    /**
     * Acquire a Server Session from the pool.
     * Iterates through each session in the pool, removing any stale sessions
     * along the way. The first non-stale session found is removed from the
     * pool and returned. If no non-stale session is found, a new ServerSession is created.
     */
    acquire(): ServerSession;
    /**
     * Release a session to the session pool
     * Adds the session back to the session pool if the session has not timed out yet.
     * This method also removes any stale sessions from the pool.
     *
     * @param session - The session to release to the pool
     */
    release(session: ServerSession): void;
}
/**
 * Optionally decorate a command with sessions specific keys
 *
 * @param session - the session tracking transaction state
 * @param command - the command to decorate
 * @param options - Optional settings passed to calling operation
 *
 * @internal
 */
export declare function applySession(session: ClientSession, command: Document, options: CommandOptions): MongoDriverError | undefined;
export declare function updateSessionFromResponse(session: ClientSession, document: MongoDBResponse): void;
//# sourceMappingURL=sessions.d.ts.map