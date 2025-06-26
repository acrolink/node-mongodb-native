import type { Document } from '../bson';
import { type AutoEncrypter } from '../client-side-encryption/auto_encrypter';
import { type CommandOptions, Connection } from '../cmap/connection';
import { ConnectionPool, type ConnectionPoolEvents, type ConnectionPoolOptions } from '../cmap/connection_pool';
import { type MongoDBResponseConstructor } from '../cmap/wire_protocol/responses';
import { type AnyError } from '../error';
import type { ServerApi } from '../mongo_client';
import { type Abortable, TypedEventEmitter } from '../mongo_types';
import { type TimeoutContext } from '../timeout';
import { type EventEmitterWithState, type MongoDBNamespace } from '../utils';
import { type ClusterTime } from './common';
import type { ServerHeartbeatFailedEvent, ServerHeartbeatStartedEvent, ServerHeartbeatSucceededEvent } from './events';
import { Monitor, type MonitorOptions } from './monitor';
import { ServerDescription } from './server_description';
import type { Topology } from './topology';
/** @internal */
export type ServerOptions = Omit<ConnectionPoolOptions, 'id' | 'generation' | 'hostAddress'> & MonitorOptions;
/** @internal */
export interface ServerPrivate {
    /** The server description for this server */
    description: ServerDescription;
    /** A copy of the options used to construct this instance */
    options: ServerOptions;
    /** The current state of the Server */
    state: string;
    /** MongoDB server API version */
    serverApi?: ServerApi;
    /** A count of the operations currently running against the server. */
    operationCount: number;
}
/** @public */
export type ServerEvents = {
    serverHeartbeatStarted(event: ServerHeartbeatStartedEvent): void;
    serverHeartbeatSucceeded(event: ServerHeartbeatSucceededEvent): void;
    serverHeartbeatFailed(event: ServerHeartbeatFailedEvent): void;
    /** Top level MongoClient doesn't emit this so it is marked: @internal */
    connect(server: Server): void;
    descriptionReceived(description: ServerDescription): void;
    closed(): void;
    ended(): void;
} & ConnectionPoolEvents & EventEmitterWithState;
/** @internal */
export type ServerCommandOptions = Omit<CommandOptions, 'timeoutContext' | 'socketTimeoutMS'> & {
    timeoutContext: TimeoutContext;
} & Abortable;
/** @internal */
export declare class Server extends TypedEventEmitter<ServerEvents> {
    /** @internal */
    s: ServerPrivate;
    /** @internal */
    topology: Topology;
    /** @internal */
    pool: ConnectionPool;
    serverApi?: ServerApi;
    hello?: Document;
    monitor: Monitor | null;
    /** @event */
    static readonly SERVER_HEARTBEAT_STARTED: "serverHeartbeatStarted";
    /** @event */
    static readonly SERVER_HEARTBEAT_SUCCEEDED: "serverHeartbeatSucceeded";
    /** @event */
    static readonly SERVER_HEARTBEAT_FAILED: "serverHeartbeatFailed";
    /** @event */
    static readonly CONNECT: "connect";
    /** @event */
    static readonly DESCRIPTION_RECEIVED = "descriptionReceived";
    /** @event */
    static readonly CLOSED: "closed";
    /** @event */
    static readonly ENDED: "ended";
    /**
     * Create a server
     */
    constructor(topology: Topology, description: ServerDescription, options: ServerOptions);
    get clusterTime(): ClusterTime | undefined;
    set clusterTime(clusterTime: ClusterTime | undefined);
    get description(): ServerDescription;
    get name(): string;
    get autoEncrypter(): AutoEncrypter | undefined;
    get loadBalanced(): boolean;
    /**
     * Initiate server connect
     */
    connect(): void;
    closeCheckedOutConnections(): void;
    /** Destroy the server connection */
    close(): void;
    /**
     * Immediately schedule monitoring of this server. If there already an attempt being made
     * this will be a no-op.
     */
    requestCheck(): void;
    command<T extends MongoDBResponseConstructor>(ns: MongoDBNamespace, command: Document, options: ServerCommandOptions, responseType: T | undefined): Promise<typeof responseType extends undefined ? Document : InstanceType<T>>;
    command(ns: MongoDBNamespace, command: Document, options: ServerCommandOptions): Promise<Document>;
    /**
     * Handle SDAM error
     * @internal
     */
    handleError(error: AnyError, connection?: Connection): void;
    /**
     * Ensure that error is properly decorated and internal state is updated before throwing
     * @internal
     */
    private decorateCommandError;
    /**
     * Decrement the operation count, returning the new count.
     */
    private decrementOperationCount;
    /**
     * Increment the operation count, returning the new count.
     */
    private incrementOperationCount;
}
//# sourceMappingURL=server.d.ts.map