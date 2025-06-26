import type { BSONSerializeOptions, Document } from '../bson';
import type { MongoCredentials } from '../cmap/auth/mongo_credentials';
import type { ConnectionEvents } from '../cmap/connection';
import type { ConnectionPoolEvents } from '../cmap/connection_pool';
import type { ClientMetadata } from '../cmap/handshake/client_metadata';
import { MongoError } from '../error';
import type { MongoClient, ServerApi } from '../mongo_client';
import { type MongoLogger } from '../mongo_logger';
import { type Abortable, TypedEventEmitter } from '../mongo_types';
import { ReadPreference, type ReadPreferenceLike } from '../read_preference';
import type { ClientSession } from '../sessions';
import { TimeoutContext } from '../timeout';
import type { Transaction } from '../transactions';
import { type Callback, type EventEmitterWithState, HostAddress, List } from '../utils';
import { type ClusterTime } from './common';
import { ServerClosedEvent, ServerDescriptionChangedEvent, ServerOpeningEvent, TopologyClosedEvent, TopologyDescriptionChangedEvent, TopologyOpeningEvent } from './events';
import type { ServerMonitoringMode } from './monitor';
import { Server, type ServerEvents, type ServerOptions } from './server';
import { ServerDescription } from './server_description';
import { type ServerSelector } from './server_selection';
import { SrvPoller, type SrvPollingEvent } from './srv_polling';
import { TopologyDescription } from './topology_description';
/** @internal */
export type ServerSelectionCallback = Callback<Server>;
/** @internal */
export interface ServerSelectionRequest {
    serverSelector: ServerSelector;
    topologyDescription: TopologyDescription;
    mongoLogger: MongoLogger | undefined;
    transaction?: Transaction;
    startTime: number;
    resolve: (server: Server) => void;
    reject: (error: MongoError) => void;
    cancelled: boolean;
    operationName: string;
    waitingLogged: boolean;
    previousServer?: ServerDescription;
}
/** @internal */
export interface TopologyPrivate {
    /** the id of this topology */
    id: number;
    /** passed in options */
    options: TopologyOptions;
    /** initial seedlist of servers to connect to */
    seedlist: HostAddress[];
    /** initial state */
    state: string;
    /** the topology description */
    description: TopologyDescription;
    serverSelectionTimeoutMS: number;
    heartbeatFrequencyMS: number;
    minHeartbeatFrequencyMS: number;
    /** A map of server instances to normalized addresses */
    servers: Map<string, Server>;
    credentials?: MongoCredentials;
    clusterTime?: ClusterTime;
    /** related to srv polling */
    srvPoller?: SrvPoller;
    detectShardedTopology: (event: TopologyDescriptionChangedEvent) => void;
    detectSrvRecords: (event: SrvPollingEvent) => void;
}
/** @internal */
export interface TopologyOptions extends BSONSerializeOptions, ServerOptions {
    srvMaxHosts: number;
    srvServiceName: string;
    hosts: HostAddress[];
    retryWrites: boolean;
    retryReads: boolean;
    /** How long to block for server selection before throwing an error */
    serverSelectionTimeoutMS: number;
    /** The name of the replica set to connect to */
    replicaSet?: string;
    srvHost?: string;
    srvPoller?: SrvPoller;
    /** Indicates that a client should directly connect to a node without attempting to discover its topology type */
    directConnection: boolean;
    loadBalanced: boolean;
    metadata: ClientMetadata;
    extendedMetadata: Promise<Document>;
    serverMonitoringMode: ServerMonitoringMode;
    /** MongoDB server API version */
    serverApi?: ServerApi;
    __skipPingOnConnect?: boolean;
}
/** @public */
export interface ConnectOptions {
    readPreference?: ReadPreference;
}
/** @public */
export interface SelectServerOptions {
    readPreference?: ReadPreferenceLike;
    /** How long to block for server selection before throwing an error */
    serverSelectionTimeoutMS?: number;
    session?: ClientSession;
    operationName: string;
    previousServer?: ServerDescription;
    /**
     * @internal
     * TODO(NODE-6496): Make this required by making ChangeStream use LegacyTimeoutContext
     * */
    timeoutContext?: TimeoutContext;
}
/** @public */
export type TopologyEvents = {
    /** Top level MongoClient doesn't emit this so it is marked: @internal */
    connect(topology: Topology): void;
    serverOpening(event: ServerOpeningEvent): void;
    serverClosed(event: ServerClosedEvent): void;
    serverDescriptionChanged(event: ServerDescriptionChangedEvent): void;
    topologyClosed(event: TopologyClosedEvent): void;
    topologyOpening(event: TopologyOpeningEvent): void;
    topologyDescriptionChanged(event: TopologyDescriptionChangedEvent): void;
    error(error: Error): void;
    /** @internal */
    open(topology: Topology): void;
    close(): void;
    timeout(): void;
} & Omit<ServerEvents, 'connect'> & ConnectionPoolEvents & ConnectionEvents & EventEmitterWithState;
/**
 * A container of server instances representing a connection to a MongoDB topology.
 * @internal
 */
export declare class Topology extends TypedEventEmitter<TopologyEvents> {
    /** @internal */
    s: TopologyPrivate;
    /** @internal */
    waitQueue: List<ServerSelectionRequest>;
    /** @internal */
    hello?: Document;
    /** @internal */
    _type?: string;
    client: MongoClient;
    /** @internal */
    private connectionLock?;
    /** @event */
    static readonly SERVER_OPENING: "serverOpening";
    /** @event */
    static readonly SERVER_CLOSED: "serverClosed";
    /** @event */
    static readonly SERVER_DESCRIPTION_CHANGED: "serverDescriptionChanged";
    /** @event */
    static readonly TOPOLOGY_OPENING: "topologyOpening";
    /** @event */
    static readonly TOPOLOGY_CLOSED: "topologyClosed";
    /** @event */
    static readonly TOPOLOGY_DESCRIPTION_CHANGED: "topologyDescriptionChanged";
    /** @event */
    static readonly ERROR: "error";
    /** @event */
    static readonly OPEN: "open";
    /** @event */
    static readonly CONNECT: "connect";
    /** @event */
    static readonly CLOSE: "close";
    /** @event */
    static readonly TIMEOUT: "timeout";
    /**
     * @param seedlist - a list of HostAddress instances to connect to
     */
    constructor(client: MongoClient, seeds: string | string[] | HostAddress | HostAddress[], options: TopologyOptions);
    private detectShardedTopology;
    private detectSrvRecords;
    /**
     * @returns A `TopologyDescription` for this topology
     */
    get description(): TopologyDescription;
    get loadBalanced(): boolean;
    get serverApi(): ServerApi | undefined;
    get capabilities(): ServerCapabilities;
    /** Initiate server connect */
    connect(options?: ConnectOptions): Promise<Topology>;
    private _connect;
    closeCheckedOutConnections(): void;
    /** Close this topology */
    close(): void;
    /**
     * Selects a server according to the selection predicate provided
     *
     * @param selector - An optional selector to select servers by, defaults to a random selection within a latency window
     * @param options - Optional settings related to server selection
     * @param callback - The callback used to indicate success or failure
     * @returns An instance of a `Server` meeting the criteria of the predicate provided
     */
    selectServer(selector: string | ReadPreference | ServerSelector, options: SelectServerOptions & Abortable): Promise<Server>;
    /**
     * Update the internal TopologyDescription with a ServerDescription
     *
     * @param serverDescription - The server to update in the internal list of server descriptions
     */
    serverUpdateHandler(serverDescription: ServerDescription): void;
    auth(credentials?: MongoCredentials, callback?: Callback): void;
    get clientMetadata(): ClientMetadata;
    isConnected(): boolean;
    isDestroyed(): boolean;
    lastHello(): Document;
    get commonWireVersion(): number | undefined;
    get logicalSessionTimeoutMinutes(): number | null;
    get clusterTime(): ClusterTime | undefined;
    set clusterTime(clusterTime: ClusterTime | undefined);
}
/** @public */
export declare class ServerCapabilities {
    maxWireVersion: number;
    minWireVersion: number;
    constructor(hello: Document);
    get hasAggregationCursor(): boolean;
    get hasWriteCommands(): boolean;
    get hasTextSearch(): boolean;
    get hasAuthCommands(): boolean;
    get hasListCollectionsCommand(): boolean;
    get hasListIndexesCommand(): boolean;
    get supportsSnapshotReads(): boolean;
    get commandsTakeWriteConcern(): boolean;
    get commandsTakeCollation(): boolean;
}
//# sourceMappingURL=topology.d.ts.map