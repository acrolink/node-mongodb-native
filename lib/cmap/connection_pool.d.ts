import type { ObjectId } from '../bson';
import { type AnyError, type MongoError } from '../error';
import { type Abortable, TypedEventEmitter } from '../mongo_types';
import type { Server } from '../sdam/server';
import { type TimeoutContext } from '../timeout';
import { type Callback } from '../utils';
import { Connection, type ConnectionEvents, type ConnectionOptions } from './connection';
import { ConnectionCheckedInEvent, ConnectionCheckedOutEvent, ConnectionCheckOutFailedEvent, ConnectionCheckOutStartedEvent, ConnectionClosedEvent, ConnectionCreatedEvent, ConnectionPoolClearedEvent, ConnectionPoolClosedEvent, ConnectionPoolCreatedEvent, ConnectionPoolReadyEvent, ConnectionReadyEvent } from './connection_pool_events';
/** @public */
export interface ConnectionPoolOptions extends Omit<ConnectionOptions, 'id' | 'generation'> {
    /** The maximum number of connections that may be associated with a pool at a given time. This includes in use and available connections. */
    maxPoolSize: number;
    /** The minimum number of connections that MUST exist at any moment in a single connection pool. */
    minPoolSize: number;
    /** The maximum number of connections that may be in the process of being established concurrently by the connection pool. */
    maxConnecting: number;
    /** The maximum amount of time a connection should remain idle in the connection pool before being marked idle. */
    maxIdleTimeMS: number;
    /** The maximum amount of time operation execution should wait for a connection to become available. The default is 0 which means there is no limit. */
    waitQueueTimeoutMS: number;
    /** If we are in load balancer mode. */
    loadBalanced: boolean;
    /** @internal */
    minPoolSizeCheckFrequencyMS?: number;
}
/** @internal */
export interface WaitQueueMember {
    resolve: (conn: Connection) => void;
    reject: (err: AnyError) => void;
    cancelled: boolean;
    checkoutTime: number;
}
/** @internal */
export declare const PoolState: Readonly<{
    readonly paused: "paused";
    readonly ready: "ready";
    readonly closed: "closed";
}>;
/**
 * @public
 * @deprecated This interface is deprecated and will be removed in a future release as it is not used
 * in the driver
 */
export interface CloseOptions {
    force?: boolean;
}
/** @public */
export type ConnectionPoolEvents = {
    connectionPoolCreated(event: ConnectionPoolCreatedEvent): void;
    connectionPoolReady(event: ConnectionPoolReadyEvent): void;
    connectionPoolClosed(event: ConnectionPoolClosedEvent): void;
    connectionPoolCleared(event: ConnectionPoolClearedEvent): void;
    connectionCreated(event: ConnectionCreatedEvent): void;
    connectionReady(event: ConnectionReadyEvent): void;
    connectionClosed(event: ConnectionClosedEvent): void;
    connectionCheckOutStarted(event: ConnectionCheckOutStartedEvent): void;
    connectionCheckOutFailed(event: ConnectionCheckOutFailedEvent): void;
    connectionCheckedOut(event: ConnectionCheckedOutEvent): void;
    connectionCheckedIn(event: ConnectionCheckedInEvent): void;
} & Omit<ConnectionEvents, 'close' | 'message'>;
/**
 * A pool of connections which dynamically resizes, and emit events related to pool activity
 * @internal
 */
export declare class ConnectionPool extends TypedEventEmitter<ConnectionPoolEvents> {
    options: Readonly<ConnectionPoolOptions>;
    /**  An integer representing the SDAM generation of the pool */
    generation: number;
    /** A map of generations to service ids */
    serviceGenerations: Map<string, number>;
    private poolState;
    private server;
    private connections;
    private pending;
    private checkedOut;
    private minPoolSizeTimer?;
    private connectionCounter;
    private cancellationToken;
    private waitQueue;
    private metrics;
    private processingWaitQueue;
    /**
     * Emitted when the connection pool is created.
     * @event
     */
    static readonly CONNECTION_POOL_CREATED: "connectionPoolCreated";
    /**
     * Emitted once when the connection pool is closed
     * @event
     */
    static readonly CONNECTION_POOL_CLOSED: "connectionPoolClosed";
    /**
     * Emitted each time the connection pool is cleared and it's generation incremented
     * @event
     */
    static readonly CONNECTION_POOL_CLEARED: "connectionPoolCleared";
    /**
     * Emitted each time the connection pool is marked ready
     * @event
     */
    static readonly CONNECTION_POOL_READY: "connectionPoolReady";
    /**
     * Emitted when a connection is created.
     * @event
     */
    static readonly CONNECTION_CREATED: "connectionCreated";
    /**
     * Emitted when a connection becomes established, and is ready to use
     * @event
     */
    static readonly CONNECTION_READY: "connectionReady";
    /**
     * Emitted when a connection is closed
     * @event
     */
    static readonly CONNECTION_CLOSED: "connectionClosed";
    /**
     * Emitted when an attempt to check out a connection begins
     * @event
     */
    static readonly CONNECTION_CHECK_OUT_STARTED: "connectionCheckOutStarted";
    /**
     * Emitted when an attempt to check out a connection fails
     * @event
     */
    static readonly CONNECTION_CHECK_OUT_FAILED: "connectionCheckOutFailed";
    /**
     * Emitted each time a connection is successfully checked out of the connection pool
     * @event
     */
    static readonly CONNECTION_CHECKED_OUT: "connectionCheckedOut";
    /**
     * Emitted each time a connection is successfully checked into the connection pool
     * @event
     */
    static readonly CONNECTION_CHECKED_IN: "connectionCheckedIn";
    constructor(server: Server, options: ConnectionPoolOptions);
    /** The address of the endpoint the pool is connected to */
    get address(): string;
    /**
     * Check if the pool has been closed
     *
     * TODO(NODE-3263): We can remove this property once shell no longer needs it
     */
    get closed(): boolean;
    /** An integer expressing how many total connections (available + pending + in use) the pool currently has */
    get totalConnectionCount(): number;
    /** An integer expressing how many connections are currently available in the pool. */
    get availableConnectionCount(): number;
    get pendingConnectionCount(): number;
    get currentCheckedOutCount(): number;
    get waitQueueSize(): number;
    get loadBalanced(): boolean;
    get serverError(): MongoError | null;
    /**
     * This is exposed ONLY for use in mongosh, to enable
     * killing all connections if a user quits the shell with
     * operations in progress.
     *
     * This property may be removed as a part of NODE-3263.
     */
    get checkedOutConnections(): Set<Connection>;
    /**
     * Get the metrics information for the pool when a wait queue timeout occurs.
     */
    private waitQueueErrorMetrics;
    /**
     * Set the pool state to "ready"
     */
    ready(): void;
    /**
     * Check a connection out of this pool. The connection will continue to be tracked, but no reference to it
     * will be held by the pool. This means that if a connection is checked out it MUST be checked back in or
     * explicitly destroyed by the new owner.
     */
    checkOut(options: {
        timeoutContext: TimeoutContext;
    } & Abortable): Promise<Connection>;
    /**
     * Check a connection into the pool.
     *
     * @param connection - The connection to check in
     */
    checkIn(connection: Connection): void;
    /**
     * Clear the pool
     *
     * Pool reset is handled by incrementing the pool's generation count. Any existing connection of a
     * previous generation will eventually be pruned during subsequent checkouts.
     */
    clear(options?: {
        serviceId?: ObjectId;
        interruptInUseConnections?: boolean;
    }): void;
    /**
     * Closes all stale in-use connections in the pool with a resumable PoolClearedOnNetworkError.
     *
     * Only connections where `connection.generation <= minGeneration` are killed.
     */
    private interruptInUseConnections;
    /** For MongoClient.close() procedures */
    closeCheckedOutConnections(): void;
    /** Close the pool */
    close(): void;
    /**
     * @internal
     * Reauthenticate a connection
     */
    reauthenticate(connection: Connection): Promise<void>;
    /** Clear the min pool size timer */
    private clearMinPoolSizeTimer;
    private destroyConnection;
    private connectionIsStale;
    private connectionIsIdle;
    /**
     * Destroys a connection if the connection is perished.
     *
     * @returns `true` if the connection was destroyed, `false` otherwise.
     */
    private destroyConnectionIfPerished;
    private createConnection;
    private ensureMinPoolSize;
    private processWaitQueue;
}
/**
 * A callback provided to `withConnection`
 * @internal
 *
 * @param error - An error instance representing the error during the execution.
 * @param connection - The managed connection which was checked out of the pool.
 * @param callback - A function to call back after connection management is complete
 */
export type WithConnectionCallback = (error: MongoError | undefined, connection: Connection | undefined, callback: Callback<Connection>) => void;
//# sourceMappingURL=connection_pool.d.ts.map