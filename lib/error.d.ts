import type { Document } from './bson';
import { type ClientBulkWriteError, type ClientBulkWriteResult } from './operations/client_bulk_write/common';
import type { ServerType } from './sdam/common';
import type { TopologyVersion } from './sdam/server_description';
import type { TopologyDescription } from './sdam/topology_description';
/** @public */
export type AnyError = MongoError | Error;
/**
 * @internal
 * The legacy error message from the server that indicates the node is not a writable primary
 * https://github.com/mongodb/specifications/blob/921232976f9913cf17415b5ef937ee772e45e6ae/source/server-discovery-and-monitoring/server-discovery-and-monitoring.md#not-writable-primary-and-node-is-recovering
 */
export declare const LEGACY_NOT_WRITABLE_PRIMARY_ERROR_MESSAGE: RegExp;
/**
 * @internal
 * The legacy error message from the server that indicates the node is not a primary or secondary
 * https://github.com/mongodb/specifications/blob/921232976f9913cf17415b5ef937ee772e45e6ae/source/server-discovery-and-monitoring/server-discovery-and-monitoring.md#not-writable-primary-and-node-is-recovering
 */
export declare const LEGACY_NOT_PRIMARY_OR_SECONDARY_ERROR_MESSAGE: RegExp;
/**
 * @internal
 * The error message from the server that indicates the node is recovering
 * https://github.com/mongodb/specifications/blob/921232976f9913cf17415b5ef937ee772e45e6ae/source/server-discovery-and-monitoring/server-discovery-and-monitoring.md#not-writable-primary-and-node-is-recovering
 */
export declare const NODE_IS_RECOVERING_ERROR_MESSAGE: RegExp;
/** @internal MongoDB Error Codes */
export declare const MONGODB_ERROR_CODES: Readonly<{
    readonly HostUnreachable: 6;
    readonly HostNotFound: 7;
    readonly AuthenticationFailed: 18;
    readonly NetworkTimeout: 89;
    readonly ShutdownInProgress: 91;
    readonly PrimarySteppedDown: 189;
    readonly ExceededTimeLimit: 262;
    readonly SocketException: 9001;
    readonly NotWritablePrimary: 10107;
    readonly InterruptedAtShutdown: 11600;
    readonly InterruptedDueToReplStateChange: 11602;
    readonly NotPrimaryNoSecondaryOk: 13435;
    readonly NotPrimaryOrSecondary: 13436;
    readonly StaleShardVersion: 63;
    readonly StaleEpoch: 150;
    readonly StaleConfig: 13388;
    readonly RetryChangeStream: 234;
    readonly FailedToSatisfyReadPreference: 133;
    readonly CursorNotFound: 43;
    readonly LegacyNotPrimary: 10058;
    readonly WriteConcernTimeout: 64;
    readonly NamespaceNotFound: 26;
    readonly IllegalOperation: 20;
    readonly MaxTimeMSExpired: 50;
    readonly UnknownReplWriteConcern: 79;
    readonly UnsatisfiableWriteConcern: 100;
    readonly Reauthenticate: 391;
    readonly ReadConcernMajorityNotAvailableYet: 134;
}>;
export declare const GET_MORE_RESUMABLE_CODES: Set<number>;
/** @public */
export declare const MongoErrorLabel: Readonly<{
    readonly RetryableWriteError: "RetryableWriteError";
    readonly TransientTransactionError: "TransientTransactionError";
    readonly UnknownTransactionCommitResult: "UnknownTransactionCommitResult";
    readonly ResumableChangeStreamError: "ResumableChangeStreamError";
    readonly HandshakeError: "HandshakeError";
    readonly ResetPool: "ResetPool";
    readonly PoolRequstedRetry: "PoolRequstedRetry";
    readonly InterruptInUseConnections: "InterruptInUseConnections";
    readonly NoWritesPerformed: "NoWritesPerformed";
}>;
/** @public */
export type MongoErrorLabel = (typeof MongoErrorLabel)[keyof typeof MongoErrorLabel];
/** @public */
export interface ErrorDescription extends Document {
    message?: string;
    errmsg?: string;
    $err?: string;
    errorLabels?: string[];
    errInfo?: Document;
}
/**
 * @public
 * @category Error
 *
 * @privateRemarks
 * mongodb-client-encryption has a dependency on this error, it uses the constructor with a string argument
 */
export declare class MongoError extends Error {
    /** @internal */
    private readonly errorLabelSet;
    get errorLabels(): string[];
    /**
     * This is a number in MongoServerError and a string in MongoDriverError
     * @privateRemarks
     * Define the type override on the subclasses when we can use the override keyword
     */
    code?: number | string;
    topologyVersion?: TopologyVersion;
    connectionGeneration?: number;
    cause?: Error;
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: {
        cause?: Error;
    });
    /** @internal */
    static buildErrorMessage(e: unknown): string;
    get name(): string;
    /** Legacy name for server error responses */
    get errmsg(): string;
    /**
     * Checks the error to see if it has an error label
     *
     * @param label - The error label to check for
     * @returns returns true if the error has the provided error label
     */
    hasErrorLabel(label: string): boolean;
    addErrorLabel(label: string): void;
}
/**
 * An error coming from the mongo server
 *
 * @public
 * @category Error
 */
export declare class MongoServerError extends MongoError {
    /** Raw error result document returned by server. */
    errorResponse: ErrorDescription;
    codeName?: string;
    writeConcernError?: Document;
    errInfo?: Document;
    ok?: number;
    [key: string]: any;
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: ErrorDescription);
    get name(): string;
}
/**
 * An error generated by the driver
 *
 * @public
 * @category Error
 */
export declare class MongoDriverError extends MongoError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: {
        cause?: Error;
    });
    get name(): string;
}
/**
 * An error generated when the driver API is used incorrectly
 *
 * @privateRemarks
 * Should **never** be directly instantiated
 *
 * @public
 * @category Error
 */
export declare class MongoAPIError extends MongoDriverError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: {
        cause?: Error;
    });
    get name(): string;
}
/**
 * An error generated when the driver encounters unexpected input
 * or reaches an unexpected/invalid internal state.
 *
 * @privateRemarks
 * Should **never** be directly instantiated.
 *
 * @public
 * @category Error
 */
export declare class MongoRuntimeError extends MongoDriverError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: {
        cause?: Error;
    });
    get name(): string;
}
/**
 * An error generated when a primary server is marked stale, never directly thrown
 *
 * @public
 * @category Error
 */
export declare class MongoStalePrimaryError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: {
        cause?: Error;
    });
    get name(): string;
}
/**
 * An error generated when a batch command is re-executed after one of the commands in the batch
 * has failed
 *
 * @public
 * @category Error
 */
export declare class MongoBatchReExecutionError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message?: string);
    get name(): string;
}
/**
 * An error generated when the driver fails to decompress
 * data received from the server.
 *
 * @public
 * @category Error
 */
export declare class MongoDecompressionError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error thrown when the user attempts to operate on a database or collection through a MongoClient
 * that has not yet successfully called the "connect" method
 *
 * @public
 * @category Error
 */
export declare class MongoNotConnectedError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error generated when the user makes a mistake in the usage of transactions.
 * (e.g. attempting to commit a transaction with a readPreference other than primary)
 *
 * @public
 * @category Error
 */
export declare class MongoTransactionError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error generated when the user attempts to operate
 * on a session that has expired or has been closed.
 *
 * @public
 * @category Error
 */
export declare class MongoExpiredSessionError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message?: string);
    get name(): string;
}
/**
 * A error generated when the user attempts to authenticate
 * via Kerberos, but fails to connect to the Kerberos client.
 *
 * @public
 * @category Error
 */
export declare class MongoKerberosError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * A error generated when the user attempts to authenticate
 * via AWS, but fails
 *
 * @public
 * @category Error
 */
export declare class MongoAWSError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: {
        cause?: Error;
    });
    get name(): string;
}
/**
 * A error generated when the user attempts to authenticate
 * via OIDC callbacks, but fails.
 *
 * @public
 * @category Error
 */
export declare class MongoOIDCError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * A error generated when the user attempts to authenticate
 * via Azure, but fails.
 *
 * @public
 * @category Error
 */
export declare class MongoAzureError extends MongoOIDCError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * A error generated when the user attempts to authenticate
 * via GCP, but fails.
 *
 * @public
 * @category Error
 */
export declare class MongoGCPError extends MongoOIDCError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error indicating that an error occurred when executing the bulk write.
 *
 * @public
 * @category Error
 */
export declare class MongoClientBulkWriteError extends MongoServerError {
    /**
     * Write concern errors that occurred while executing the bulk write. This list may have
     * multiple items if more than one server command was required to execute the bulk write.
     */
    writeConcernErrors: Document[];
    /**
     * Errors that occurred during the execution of individual write operations. This map will
     * contain at most one entry if the bulk write was ordered.
     */
    writeErrors: Map<number, ClientBulkWriteError>;
    /**
     * The results of any successful operations that were performed before the error was
     * encountered.
     */
    partialResult?: ClientBulkWriteResult;
    /**
     * Initialize the client bulk write error.
     * @param message - The error message.
     */
    constructor(message: ErrorDescription);
    get name(): string;
}
/**
 * An error indicating that an error occurred when processing bulk write results.
 *
 * @public
 * @category Error
 */
export declare class MongoClientBulkWriteCursorError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error indicating that an error occurred on the client when executing a client bulk write.
 *
 * @public
 * @category Error
 */
export declare class MongoClientBulkWriteExecutionError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error generated when a ChangeStream operation fails to execute.
 *
 * @public
 * @category Error
 */
export declare class MongoChangeStreamError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error thrown when the user calls a function or method not supported on a tailable cursor
 *
 * @public
 * @category Error
 */
export declare class MongoTailableCursorError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message?: string);
    get name(): string;
}
/** An error generated when a GridFSStream operation fails to execute.
 *
 * @public
 * @category Error
 */
export declare class MongoGridFSStreamError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error generated when a malformed or invalid chunk is
 * encountered when reading from a GridFSStream.
 *
 * @public
 * @category Error
 */
export declare class MongoGridFSChunkError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error generated when a **parsable** unexpected response comes from the server.
 * This is generally an error where the driver in a state expecting a certain behavior to occur in
 * the next message from MongoDB but it receives something else.
 * This error **does not** represent an issue with wire message formatting.
 *
 * #### Example
 * When an operation fails, it is the driver's job to retry it. It must perform serverSelection
 * again to make sure that it attempts the operation against a server in a good state. If server
 * selection returns a server that does not support retryable operations, this error is used.
 * This scenario is unlikely as retryable support would also have been determined on the first attempt
 * but it is possible the state change could report a selectable server that does not support retries.
 *
 * @public
 * @category Error
 */
export declare class MongoUnexpectedServerResponseError extends MongoRuntimeError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: {
        cause?: Error;
    });
    get name(): string;
}
/**
 * @public
 * @category Error
 *
 * The `MongoOperationTimeoutError` class represents an error that occurs when an operation could not be completed within the specified `timeoutMS`.
 * It is generated by the driver in support of the "client side operation timeout" feature so inherits from `MongoDriverError`.
 * When `timeoutMS` is enabled `MongoServerError`s relating to `MaxTimeExpired` errors will be converted to `MongoOperationTimeoutError`
 *
 * @example
 * ```ts
 * try {
 *   await blogs.insertOne(blogPost, { timeoutMS: 60_000 })
 * } catch (error) {
 *   if (error instanceof MongoOperationTimeoutError) {
 *     console.log(`Oh no! writer's block!`, error);
 *   }
 * }
 * ```
 */
export declare class MongoOperationTimeoutError extends MongoDriverError {
    get name(): string;
}
/**
 * An error thrown when the user attempts to add options to a cursor that has already been
 * initialized
 *
 * @public
 * @category Error
 */
export declare class MongoCursorInUseError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message?: string);
    get name(): string;
}
/**
 * An error generated when an attempt is made to operate
 * on a closed/closing server.
 *
 * @public
 * @category Error
 */
export declare class MongoServerClosedError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message?: string);
    get name(): string;
}
/**
 * An error thrown when an attempt is made to read from a cursor that has been exhausted
 *
 * @public
 * @category Error
 */
export declare class MongoCursorExhaustedError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message?: string);
    get name(): string;
}
/**
 * An error generated when an attempt is made to operate on a
 * dropped, or otherwise unavailable, database.
 *
 * @public
 * @category Error
 */
export declare class MongoTopologyClosedError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message?: string);
    get name(): string;
}
/**
 * An error generated when the MongoClient is closed and async
 * operations are interrupted.
 *
 * @public
 * @category Error
 */
export declare class MongoClientClosedError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor();
    get name(): string;
}
/** @public */
export interface MongoNetworkErrorOptions {
    /** Indicates the timeout happened before a connection handshake completed */
    beforeHandshake?: boolean;
    cause?: Error;
}
/**
 * An error indicating an issue with the network, including TCP errors and timeouts.
 * @public
 * @category Error
 */
export declare class MongoNetworkError extends MongoError {
    /** @internal */
    readonly beforeHandshake: boolean;
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: MongoNetworkErrorOptions);
    get name(): string;
}
/**
 * An error indicating a network timeout occurred
 * @public
 * @category Error
 *
 * @privateRemarks
 * mongodb-client-encryption has a dependency on this error with an instanceof check
 */
export declare class MongoNetworkTimeoutError extends MongoNetworkError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: MongoNetworkErrorOptions);
    get name(): string;
}
/**
 * An error used when attempting to parse a value (like a connection string)
 * @public
 * @category Error
 */
export declare class MongoParseError extends MongoDriverError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error generated when the user supplies malformed or unexpected arguments
 * or when a required argument or field is not provided.
 *
 *
 * @public
 * @category Error
 */
export declare class MongoInvalidArgumentError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options?: {
        cause?: Error;
    });
    get name(): string;
}
/**
 * An error generated when a feature that is not enabled or allowed for the current server
 * configuration is used
 *
 *
 * @public
 * @category Error
 */
export declare class MongoCompatibilityError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error generated when the user fails to provide authentication credentials before attempting
 * to connect to a mongo server instance.
 *
 *
 * @public
 * @category Error
 */
export declare class MongoMissingCredentialsError extends MongoAPIError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string);
    get name(): string;
}
/**
 * An error generated when a required module or dependency is not present in the local environment
 *
 * @public
 * @category Error
 */
export declare class MongoMissingDependencyError extends MongoAPIError {
    dependencyName: string;
    /** @remarks This property is assigned in the `Error` constructor. */
    cause: Error;
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, options: {
        cause: Error;
        dependencyName: string;
    });
    get name(): string;
}
/**
 * An error signifying a general system issue
 * @public
 * @category Error
 */
export declare class MongoSystemError extends MongoError {
    /** An optional reason context, such as an error saved during flow of monitoring and selecting servers */
    reason?: TopologyDescription;
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, reason: TopologyDescription);
    get name(): string;
}
/**
 * An error signifying a client-side server selection error
 * @public
 * @category Error
 */
export declare class MongoServerSelectionError extends MongoSystemError {
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(message: string, reason: TopologyDescription);
    get name(): string;
}
/**
 * The type of the result property of MongoWriteConcernError
 * @public
 */
export interface WriteConcernErrorResult {
    writeConcernError: {
        code: number;
        errmsg: string;
        codeName?: string;
        errInfo?: Document;
    };
    ok: number;
    code?: number;
    errorLabels?: string[];
    [x: string | number]: unknown;
}
/**
 * An error thrown when the server reports a writeConcernError
 * @public
 * @category Error
 */
export declare class MongoWriteConcernError extends MongoServerError {
    /** The result document */
    result: Document;
    /**
     * **Do not use this constructor!**
     *
     * Meant for internal use only.
     *
     * @remarks
     * This class is only meant to be constructed within the driver. This constructor is
     * not subject to semantic versioning compatibility guarantees and may change at any time.
     *
     * @public
     **/
    constructor(result: WriteConcernErrorResult);
    get name(): string;
}
export declare function needsRetryableWriteLabel(error: Error, maxWireVersion: number, serverType: ServerType): boolean;
export declare function isRetryableWriteError(error: MongoError): boolean;
/** Determines whether an error is something the driver should attempt to retry */
export declare function isRetryableReadError(error: MongoError): boolean;
export declare function isNodeShuttingDownError(err: MongoError): boolean;
/**
 * Determines whether SDAM can recover from a given error. If it cannot
 * then the pool will be cleared, and server state will completely reset
 * locally.
 *
 * @see https://github.com/mongodb/specifications/blob/master/source/server-discovery-and-monitoring/server-discovery-and-monitoring.md#not-writable-primary-and-node-is-recovering
 */
export declare function isSDAMUnrecoverableError(error: MongoError): boolean;
export declare function isNetworkTimeoutError(err: MongoError): err is MongoNetworkError;
export declare function isResumableError(error?: Error, wireVersion?: number): boolean;
//# sourceMappingURL=error.d.ts.map