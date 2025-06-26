import { type Document, type EJSONOptions, type ObjectId } from './bson';
import type { CommandStartedEvent } from './cmap/command_monitoring_events';
import type { ConnectionCheckedInEvent, ConnectionCheckedOutEvent, ConnectionCheckOutFailedEvent, ConnectionCheckOutStartedEvent, ConnectionClosedEvent, ConnectionCreatedEvent, ConnectionPoolClearedEvent, ConnectionPoolClosedEvent, ConnectionPoolCreatedEvent, ConnectionPoolReadyEvent, ConnectionReadyEvent } from './cmap/connection_pool_events';
import { COMMAND_FAILED, COMMAND_SUCCEEDED, SERVER_HEARTBEAT_FAILED, SERVER_HEARTBEAT_STARTED, SERVER_HEARTBEAT_SUCCEEDED } from './constants';
import type { ServerClosedEvent, ServerOpeningEvent, TopologyClosedEvent, TopologyDescriptionChangedEvent, TopologyOpeningEvent } from './sdam/events';
import type { ServerSelectionFailedEvent, ServerSelectionStartedEvent, ServerSelectionSucceededEvent, WaitingForSuitableServerEvent } from './sdam/server_selection_events';
/**
 * @public
 * Severity levels align with unix syslog.
 * Most typical driver functions will log to debug.
 */
export declare const SeverityLevel: Readonly<{
    readonly EMERGENCY: "emergency";
    readonly ALERT: "alert";
    readonly CRITICAL: "critical";
    readonly ERROR: "error";
    readonly WARNING: "warn";
    readonly NOTICE: "notice";
    readonly INFORMATIONAL: "info";
    readonly DEBUG: "debug";
    readonly TRACE: "trace";
    readonly OFF: "off";
}>;
/** @internal */
export declare const DEFAULT_MAX_DOCUMENT_LENGTH = 1000;
/** @public */
export type SeverityLevel = (typeof SeverityLevel)[keyof typeof SeverityLevel];
/** @internal */
declare class SeverityLevelMap extends Map<SeverityLevel | number, SeverityLevel | number> {
    constructor(entries: [SeverityLevel | number, SeverityLevel | number][]);
    getNumericSeverityLevel(severity: SeverityLevel): number;
    getSeverityLevelName(level: number): SeverityLevel | undefined;
}
/** @internal */
export declare const SEVERITY_LEVEL_MAP: SeverityLevelMap;
/** @public */
export declare const MongoLoggableComponent: Readonly<{
    readonly COMMAND: "command";
    readonly TOPOLOGY: "topology";
    readonly SERVER_SELECTION: "serverSelection";
    readonly CONNECTION: "connection";
    readonly CLIENT: "client";
}>;
/** @public */
export type MongoLoggableComponent = (typeof MongoLoggableComponent)[keyof typeof MongoLoggableComponent];
/** @internal */
export interface MongoLoggerEnvOptions {
    /** Severity level for command component */
    MONGODB_LOG_COMMAND?: string;
    /** Severity level for topology component */
    MONGODB_LOG_TOPOLOGY?: string;
    /** Severity level for server selection component */
    MONGODB_LOG_SERVER_SELECTION?: string;
    /** Severity level for CMAP */
    MONGODB_LOG_CONNECTION?: string;
    /** Severity level for client */
    MONGODB_LOG_CLIENT?: string;
    /** Default severity level to be if any of the above are unset */
    MONGODB_LOG_ALL?: string;
    /** Max length of embedded EJSON docs. Setting to 0 disables truncation. Defaults to 1000. */
    MONGODB_LOG_MAX_DOCUMENT_LENGTH?: string;
    /** Destination for log messages. Must be 'stderr', 'stdout'. Defaults to 'stderr'. */
    MONGODB_LOG_PATH?: string;
}
/** @public */
export interface LogComponentSeveritiesClientOptions {
    /** Optional severity level for command component */
    command?: SeverityLevel;
    /** Optional severity level for topology component */
    topology?: SeverityLevel;
    /** Optional severity level for server selection component */
    serverSelection?: SeverityLevel;
    /** Optional severity level for connection component */
    connection?: SeverityLevel;
    /** Optional severity level for client component */
    client?: SeverityLevel;
    /** Optional default severity level to be used if any of the above are unset */
    default?: SeverityLevel;
}
/** @internal */
export interface MongoLoggerMongoClientOptions {
    /** Destination for log messages */
    mongodbLogPath?: 'stdout' | 'stderr' | MongoDBLogWritable;
    /** Severity levels for logger components */
    mongodbLogComponentSeverities?: LogComponentSeveritiesClientOptions;
    /** Max length of embedded EJSON docs. Setting to 0 disables truncation. Defaults to 1000. */
    mongodbLogMaxDocumentLength?: number;
}
/** @internal */
export interface MongoLoggerOptions {
    componentSeverities: {
        /** Severity level for command component */
        command: SeverityLevel;
        /** Severity level for topology component */
        topology: SeverityLevel;
        /** Severity level for server selection component */
        serverSelection: SeverityLevel;
        /** Severity level for connection component */
        connection: SeverityLevel;
        /** Severity level for client component */
        client: SeverityLevel;
        /** Default severity level to be used if any of the above are unset */
        default: SeverityLevel;
    };
    /** Max length of embedded EJSON docs. Setting to 0 disables truncation. Defaults to 1000. */
    maxDocumentLength: number;
    /** Destination for log messages. */
    logDestination: MongoDBLogWritable;
    /** For internal check to see if error should stop logging. */
    logDestinationIsStdErr: boolean;
}
/**
 * Parses a string as one of SeverityLevel
 * @internal
 *
 * @param s - the value to be parsed
 * @returns one of SeverityLevel if value can be parsed as such, otherwise null
 */
export declare function parseSeverityFromString(s?: string): SeverityLevel | null;
/** @internal */
export declare function createStdioLogger(stream: {
    write: NodeJS.WriteStream['write'];
}): MongoDBLogWritable;
/** @public */
export interface Log extends Record<string, any> {
    t: Date;
    c: MongoLoggableComponent;
    s: SeverityLevel;
    message?: string;
}
/**
 * @public
 *
 * A custom destination for structured logging messages.
 */
export interface MongoDBLogWritable {
    /**
     * This function will be called for every enabled log message.
     *
     * It can be sync or async:
     * - If it is synchronous it will block the driver from proceeding until this method returns.
     * - If it is asynchronous the driver will not await the returned promise. It will attach fulfillment handling (`.then`).
     *   If the promise rejects the logger will write an error message to stderr and stop functioning.
     *   If the promise resolves the driver proceeds to the next log message (or waits for new ones to occur).
     *
     * Tips:
     * - We recommend writing an async `write` function that _never_ rejects.
     *   Instead handle logging errors as necessary to your use case and make the write function a noop, until it can be recovered.
     * - The Log messages are structured but **subject to change** since the intended purpose is informational.
     *   Program against this defensively and err on the side of stringifying whatever is passed in to write in some form or another.
     *
     */
    write(log: Log): PromiseLike<unknown> | unknown;
}
/**
 * @internal
 * Must be separate from Events API due to differences in spec requirements for logging a command success
 */
export type LoggableCommandSucceededEvent = {
    address: string;
    connectionId?: string | number;
    requestId: number;
    duration: number;
    commandName: string;
    reply: Document | undefined;
    serviceId?: ObjectId;
    name: typeof COMMAND_SUCCEEDED;
    serverConnectionId: bigint | null;
    databaseName: string;
};
/**
 * @internal
 * Must be separate from Events API due to differences in spec requirements for logging a command failure
 */
export type LoggableCommandFailedEvent = {
    address: string;
    connectionId?: string | number;
    requestId: number;
    duration: number;
    commandName: string;
    failure: Error;
    serviceId?: ObjectId;
    name: typeof COMMAND_FAILED;
    serverConnectionId: bigint | null;
    databaseName: string;
};
/**
 * @internal
 * Must be separate from Events API due to differences in spec requirements for logging server heartbeat beginning
 */
export type LoggableServerHeartbeatStartedEvent = {
    topologyId: number;
    awaited: boolean;
    connectionId: string;
    name: typeof SERVER_HEARTBEAT_STARTED;
};
/**
 * @internal
 * Must be separate from Events API due to differences in spec requirements for logging server heartbeat success
 */
export type LoggableServerHeartbeatSucceededEvent = {
    topologyId: number;
    awaited: boolean;
    connectionId: string;
    reply: Document;
    serverConnectionId: number | '<monitor>';
    duration: number;
    name: typeof SERVER_HEARTBEAT_SUCCEEDED;
};
/**
 * @internal
 * Must be separate from Events API due to differences in spec requirements for logging server heartbeat failure
 */
export type LoggableServerHeartbeatFailedEvent = {
    topologyId: number;
    awaited: boolean;
    connectionId: string;
    failure: Error;
    duration: number;
    name: typeof SERVER_HEARTBEAT_FAILED;
};
/** @internal */
export type LoggableEvent = ServerSelectionStartedEvent | ServerSelectionFailedEvent | ServerSelectionSucceededEvent | WaitingForSuitableServerEvent | CommandStartedEvent | LoggableCommandSucceededEvent | LoggableCommandFailedEvent | ConnectionPoolCreatedEvent | ConnectionPoolReadyEvent | ConnectionPoolClosedEvent | ConnectionPoolClearedEvent | ConnectionCreatedEvent | ConnectionReadyEvent | ConnectionClosedEvent | ConnectionCheckedInEvent | ConnectionCheckedOutEvent | ConnectionCheckOutStartedEvent | ConnectionCheckOutFailedEvent | ServerClosedEvent | LoggableServerHeartbeatFailedEvent | LoggableServerHeartbeatStartedEvent | LoggableServerHeartbeatSucceededEvent | ServerOpeningEvent | TopologyClosedEvent | TopologyDescriptionChangedEvent | TopologyOpeningEvent;
/** @internal */
export interface LogConvertible extends Record<string, any> {
    toLog(): Record<string, any>;
}
/** @internal */
export declare function stringifyWithMaxLen(value: any, maxDocumentLength: number, options?: EJSONOptions): string;
/** @internal */
export type Loggable = LoggableEvent | LogConvertible;
/** @internal */
export declare function defaultLogTransform(logObject: LoggableEvent | Record<string, any>, maxDocumentLength?: number): Omit<Log, 's' | 't' | 'c'>;
/** @internal */
export declare class MongoLogger {
    componentSeverities: Record<MongoLoggableComponent, SeverityLevel>;
    maxDocumentLength: number;
    logDestination: MongoDBLogWritable;
    logDestinationIsStdErr: boolean;
    pendingLog: PromiseLike<unknown> | unknown;
    private severities;
    /**
     * This method should be used when logging errors that do not have a public driver API for
     * reporting errors.
     */
    error: (component: MongoLoggableComponent, message: string | Loggable) => void;
    /**
     * This method should be used to log situations where undesirable application behaviour might
     * occur. For example, failing to end sessions on `MongoClient.close`.
     */
    warn: (component: MongoLoggableComponent, message: string | Loggable) => void;
    /**
     * This method should be used to report high-level information about normal driver behaviour.
     * For example, the creation of a `MongoClient`.
     */
    info: (component: MongoLoggableComponent, message: string | Loggable) => void;
    /**
     * This method should be used to report information that would be helpful when debugging an
     * application. For example, a command starting, succeeding or failing.
     */
    debug: (component: MongoLoggableComponent, message: string | Loggable) => void;
    /**
     * This method should be used to report fine-grained details related to logic flow. For example,
     * entering and exiting a function body.
     */
    trace: (component: MongoLoggableComponent, message: string | Loggable) => void;
    constructor(options: MongoLoggerOptions);
    createLoggingSeverities(): Record<MongoLoggableComponent, Record<SeverityLevel, boolean>>;
    turnOffSeverities(): void;
    private logWriteFailureHandler;
    private clearPendingLog;
    willLog(component: MongoLoggableComponent, severity: SeverityLevel): boolean;
    private log;
    /**
     * Merges options set through environment variables and the MongoClient, preferring environment
     * variables when both are set, and substituting defaults for values not set. Options set in
     * constructor take precedence over both environment variables and MongoClient options.
     *
     * @remarks
     * When parsing component severity levels, invalid values are treated as unset and replaced with
     * the default severity.
     *
     * @param envOptions - options set for the logger from the environment
     * @param clientOptions - options set for the logger in the MongoClient options
     * @returns a MongoLoggerOptions object to be used when instantiating a new MongoLogger
     */
    static resolveOptions(envOptions: MongoLoggerEnvOptions, clientOptions: MongoLoggerMongoClientOptions): MongoLoggerOptions;
}
export {};
//# sourceMappingURL=mongo_logger.d.ts.map