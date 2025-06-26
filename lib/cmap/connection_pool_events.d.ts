import type { ObjectId } from '../bson';
import { CONNECTION_CHECK_OUT_FAILED, CONNECTION_CHECK_OUT_STARTED, CONNECTION_CHECKED_IN, CONNECTION_CHECKED_OUT, CONNECTION_CLOSED, CONNECTION_CREATED, CONNECTION_POOL_CLEARED, CONNECTION_POOL_CLOSED, CONNECTION_POOL_CREATED, CONNECTION_POOL_READY, CONNECTION_READY } from '../constants';
import type { MongoError } from '../error';
import type { Connection } from './connection';
import type { ConnectionPool, ConnectionPoolOptions } from './connection_pool';
/**
 * The base export class for all monitoring events published from the connection pool
 * @public
 * @category Event
 */
export declare abstract class ConnectionPoolMonitoringEvent {
    /** A timestamp when the event was created  */
    time: Date;
    /** The address (host/port pair) of the pool */
    address: string;
    /** @internal */
    abstract name: typeof CONNECTION_CHECK_OUT_FAILED | typeof CONNECTION_CHECK_OUT_STARTED | typeof CONNECTION_CHECKED_IN | typeof CONNECTION_CHECKED_OUT | typeof CONNECTION_CLOSED | typeof CONNECTION_CREATED | typeof CONNECTION_POOL_CLEARED | typeof CONNECTION_POOL_CLOSED | typeof CONNECTION_POOL_CREATED | typeof CONNECTION_POOL_READY | typeof CONNECTION_READY;
    /** @internal */
    constructor(pool: ConnectionPool);
}
/**
 * An event published when a connection pool is created
 * @public
 * @category Event
 */
export declare class ConnectionPoolCreatedEvent extends ConnectionPoolMonitoringEvent {
    /** The options used to create this connection pool */
    options: Pick<ConnectionPoolOptions, 'maxPoolSize' | 'minPoolSize' | 'maxConnecting' | 'maxIdleTimeMS' | 'waitQueueTimeoutMS'>;
    /** @internal */
    name: "connectionPoolCreated";
    /** @internal */
    constructor(pool: ConnectionPool);
}
/**
 * An event published when a connection pool is ready
 * @public
 * @category Event
 */
export declare class ConnectionPoolReadyEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    name: "connectionPoolReady";
    /** @internal */
    constructor(pool: ConnectionPool);
}
/**
 * An event published when a connection pool is closed
 * @public
 * @category Event
 */
export declare class ConnectionPoolClosedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    name: "connectionPoolClosed";
    /** @internal */
    constructor(pool: ConnectionPool);
}
/**
 * An event published when a connection pool creates a new connection
 * @public
 * @category Event
 */
export declare class ConnectionCreatedEvent extends ConnectionPoolMonitoringEvent {
    /** A monotonically increasing, per-pool id for the newly created connection */
    connectionId: number | '<monitor>';
    /** @internal */
    name: "connectionCreated";
    /** @internal */
    constructor(pool: ConnectionPool, connection: {
        id: number | '<monitor>';
    });
}
/**
 * An event published when a connection is ready for use
 * @public
 * @category Event
 */
export declare class ConnectionReadyEvent extends ConnectionPoolMonitoringEvent {
    /** The id of the connection */
    connectionId: number | '<monitor>';
    /**
     * The time it took to establish the connection.
     * In accordance with the definition of establishment of a connection
     * specified by `ConnectionPoolOptions.maxConnecting`,
     * it is the time elapsed between emitting a `ConnectionCreatedEvent`
     * and emitting this event as part of the same checking out.
     *
     * Naturally, when establishing a connection is part of checking out,
     * this duration is not greater than
     * `ConnectionCheckedOutEvent.duration`.
     */
    durationMS: number;
    /** @internal */
    name: "connectionReady";
    /** @internal */
    constructor(pool: ConnectionPool, connection: Connection, connectionCreatedEventTime: number);
}
/**
 * An event published when a connection is closed
 * @public
 * @category Event
 */
export declare class ConnectionClosedEvent extends ConnectionPoolMonitoringEvent {
    /** The id of the connection */
    connectionId: number | '<monitor>';
    /** The reason the connection was closed */
    reason: string;
    serviceId?: ObjectId;
    /** @internal */
    name: "connectionClosed";
    /** @internal */
    error: MongoError | null;
    /** @internal */
    constructor(pool: ConnectionPool, connection: Pick<Connection, 'id' | 'serviceId'>, reason: 'idle' | 'stale' | 'poolClosed' | 'error', error?: MongoError);
}
/**
 * An event published when a request to check a connection out begins
 * @public
 * @category Event
 */
export declare class ConnectionCheckOutStartedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    name: "connectionCheckOutStarted";
    /** @internal */
    constructor(pool: ConnectionPool);
}
/**
 * An event published when a request to check a connection out fails
 * @public
 * @category Event
 */
export declare class ConnectionCheckOutFailedEvent extends ConnectionPoolMonitoringEvent {
    /** The reason the attempt to check out failed */
    reason: string;
    /** @internal */
    error?: MongoError;
    /** @internal */
    name: "connectionCheckOutFailed";
    /**
     * The time it took to check out the connection.
     * More specifically, the time elapsed between
     * emitting a `ConnectionCheckOutStartedEvent`
     * and emitting this event as part of the same check out.
     */
    durationMS: number;
    /** @internal */
    constructor(pool: ConnectionPool, reason: 'poolClosed' | 'timeout' | 'connectionError', checkoutTime: number, error?: MongoError);
}
/**
 * An event published when a connection is checked out of the connection pool
 * @public
 * @category Event
 */
export declare class ConnectionCheckedOutEvent extends ConnectionPoolMonitoringEvent {
    /** The id of the connection */
    connectionId: number | '<monitor>';
    /** @internal */
    name: "connectionCheckedOut";
    /**
     * The time it took to check out the connection.
     * More specifically, the time elapsed between
     * emitting a `ConnectionCheckOutStartedEvent`
     * and emitting this event as part of the same checking out.
     *
     */
    durationMS: number;
    /** @internal */
    constructor(pool: ConnectionPool, connection: Connection, checkoutTime: number);
}
/**
 * An event published when a connection is checked into the connection pool
 * @public
 * @category Event
 */
export declare class ConnectionCheckedInEvent extends ConnectionPoolMonitoringEvent {
    /** The id of the connection */
    connectionId: number | '<monitor>';
    /** @internal */
    name: "connectionCheckedIn";
    /** @internal */
    constructor(pool: ConnectionPool, connection: Connection);
}
/**
 * An event published when a connection pool is cleared
 * @public
 * @category Event
 */
export declare class ConnectionPoolClearedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    serviceId?: ObjectId;
    interruptInUseConnections?: boolean;
    /** @internal */
    name: "connectionPoolCleared";
    /** @internal */
    constructor(pool: ConnectionPool, options?: {
        serviceId?: ObjectId;
        interruptInUseConnections?: boolean;
    });
}
//# sourceMappingURL=connection_pool_events.d.ts.map