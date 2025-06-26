import { Transform, type TransformCallback } from 'stream';
import { type BSONSerializeOptions, type Document, type ObjectId } from '../bson';
import { type AutoEncrypter } from '../client-side-encryption/auto_encrypter';
import type { ServerApi, SupportedNodeConnectionOptions } from '../mongo_client';
import { type MongoClientAuthProviders } from '../mongo_client_auth_providers';
import { type MongoLogger } from '../mongo_logger';
import { type CancellationToken, TypedEventEmitter } from '../mongo_types';
import { type ReadPreferenceLike } from '../read_preference';
import { type ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { BufferPool, type Callback, HostAddress, type MongoDBNamespace } from '../utils';
import type { WriteConcern } from '../write_concern';
import type { AuthContext } from './auth/auth_provider';
import type { MongoCredentials } from './auth/mongo_credentials';
import { CommandFailedEvent, CommandStartedEvent, CommandSucceededEvent } from './command_monitoring_events';
import type { Stream } from './connect';
import type { ClientMetadata } from './handshake/client_metadata';
import { StreamDescription, type StreamDescriptionOptions } from './stream_description';
import { type MongoDBResponseConstructor } from './wire_protocol/responses';
/** @internal */
export interface CommandOptions extends BSONSerializeOptions {
    secondaryOk?: boolean;
    /** Specify read preference if command supports it */
    readPreference?: ReadPreferenceLike;
    monitoring?: boolean;
    socketTimeoutMS?: number;
    /** Session to use for the operation */
    session?: ClientSession;
    documentsReturnedIn?: string;
    noResponse?: boolean;
    omitReadPreference?: boolean;
    omitMaxTimeMS?: boolean;
    willRetryWrite?: boolean;
    writeConcern?: WriteConcern;
    directConnection?: boolean;
    /** @internal */
    timeoutContext?: TimeoutContext;
}
/** @public */
export interface ProxyOptions {
    proxyHost?: string;
    proxyPort?: number;
    proxyUsername?: string;
    proxyPassword?: string;
}
/** @public */
export interface ConnectionOptions extends SupportedNodeConnectionOptions, StreamDescriptionOptions, ProxyOptions {
    id: number | '<monitor>';
    generation: number;
    hostAddress: HostAddress;
    /** @internal */
    autoEncrypter?: AutoEncrypter;
    serverApi?: ServerApi;
    monitorCommands: boolean;
    /** @internal */
    connectionType?: any;
    credentials?: MongoCredentials;
    /** @internal */
    authProviders: MongoClientAuthProviders;
    connectTimeoutMS?: number;
    tls: boolean;
    noDelay?: boolean;
    socketTimeoutMS?: number;
    cancellationToken?: CancellationToken;
    metadata: ClientMetadata;
    /** @internal */
    extendedMetadata: Promise<Document>;
    /** @internal */
    mongoLogger?: MongoLogger | undefined;
}
/** @public */
export type ConnectionEvents = {
    commandStarted(event: CommandStartedEvent): void;
    commandSucceeded(event: CommandSucceededEvent): void;
    commandFailed(event: CommandFailedEvent): void;
    clusterTimeReceived(clusterTime: Document): void;
    close(): void;
    pinned(pinType: string): void;
    unpinned(pinType: string): void;
};
/** @internal */
export declare function hasSessionSupport(conn: Connection): boolean;
/** @internal */
export declare class Connection extends TypedEventEmitter<ConnectionEvents> {
    id: number | '<monitor>';
    address: string;
    lastHelloMS: number;
    serverApi?: ServerApi;
    helloOk: boolean;
    authContext?: AuthContext;
    delayedTimeoutId: NodeJS.Timeout | null;
    generation: number;
    accessToken?: string;
    readonly description: Readonly<StreamDescription>;
    /**
     * Represents if the connection has been established:
     *  - TCP handshake
     *  - TLS negotiated
     *  - mongodb handshake (saslStart, saslContinue), includes authentication
     *
     * Once connection is established, command logging can log events (if enabled)
     */
    established: boolean;
    /** Indicates that the connection (including underlying TCP socket) has been closed. */
    closed: boolean;
    private lastUseTime;
    private clusterTime;
    private error;
    private dataEvents;
    private readonly socketTimeoutMS;
    private readonly monitorCommands;
    private readonly socket;
    private readonly messageStream;
    /** @event */
    static readonly COMMAND_STARTED: "commandStarted";
    /** @event */
    static readonly COMMAND_SUCCEEDED: "commandSucceeded";
    /** @event */
    static readonly COMMAND_FAILED: "commandFailed";
    /** @event */
    static readonly CLUSTER_TIME_RECEIVED: "clusterTimeReceived";
    /** @event */
    static readonly CLOSE: "close";
    /** @event */
    static readonly PINNED: "pinned";
    /** @event */
    static readonly UNPINNED: "unpinned";
    constructor(stream: Stream, options: ConnectionOptions);
    get hello(): Document | null;
    set hello(response: Document | null);
    get serviceId(): ObjectId | undefined;
    get loadBalanced(): boolean;
    get idleTime(): number;
    private get hasSessionSupport();
    private get supportsOpMsg();
    private get shouldEmitAndLogCommand();
    markAvailable(): void;
    private onSocketError;
    private onTransformError;
    onError(error: Error): void;
    private onClose;
    private onTimeout;
    destroy(): void;
    /**
     * A method that cleans up the connection.  When `force` is true, this method
     * forcibly destroys the socket.
     *
     * If an error is provided, any in-flight operations will be closed with the error.
     *
     * This method does nothing if the connection is already closed.
     */
    private cleanup;
    private prepareCommand;
    private sendWire;
    private sendCommand;
    command<T extends MongoDBResponseConstructor>(ns: MongoDBNamespace, command: Document, options: CommandOptions | undefined, responseType: T): Promise<InstanceType<T>>;
    command<T extends MongoDBResponseConstructor>(ns: MongoDBNamespace, command: Document, options: CommandOptions | undefined, responseType: T | undefined): Promise<typeof responseType extends undefined ? Document : InstanceType<T>>;
    command(ns: MongoDBNamespace, command: Document, options?: CommandOptions): Promise<Document>;
    exhaustCommand(ns: MongoDBNamespace, command: Document, options: CommandOptions, replyListener: Callback): void;
    private throwIfAborted;
    /**
     * @internal
     *
     * Writes an OP_MSG or OP_QUERY request to the socket, optionally compressing the command. This method
     * waits until the socket's buffer has emptied (the Nodejs socket `drain` event has fired).
     */
    private writeCommand;
    /**
     * @internal
     *
     * Returns an async generator that yields full wire protocol messages from the underlying socket.  This function
     * yields messages until `moreToCome` is false or not present in a response, or the caller cancels the request
     * by calling `return` on the generator.
     *
     * Note that `for-await` loops call `return` automatically when the loop is exited.
     */
    private readMany;
}
/** @internal */
export declare class SizedMessageTransform extends Transform {
    bufferPool: BufferPool;
    connection: Connection;
    constructor({ connection }: {
        connection: Connection;
    });
    _transform(chunk: Buffer, encoding: unknown, callback: TransformCallback): void;
}
/** @internal */
export declare class CryptoConnection extends Connection {
    /** @internal */
    autoEncrypter?: AutoEncrypter;
    constructor(stream: Stream, options: ConnectionOptions);
    command<T extends MongoDBResponseConstructor>(ns: MongoDBNamespace, command: Document, options: CommandOptions | undefined, responseType: T): Promise<InstanceType<T>>;
    command(ns: MongoDBNamespace, command: Document, options?: CommandOptions): Promise<Document>;
}
//# sourceMappingURL=connection.d.ts.map