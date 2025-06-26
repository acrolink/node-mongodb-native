import type { SrvRecord } from 'dns';
import { type EventEmitter } from 'events';
import * as http from 'http';
import { URL } from 'url';
import { type Document, ObjectId } from './bson';
import type { Connection } from './cmap/connection';
import type { Collection } from './collection';
import { kDecoratedKeys } from './constants';
import type { AbstractCursor } from './cursor/abstract_cursor';
import type { FindCursor } from './cursor/find_cursor';
import type { Db } from './db';
import { type AnyError } from './error';
import type { MongoClient } from './mongo_client';
import { type Abortable } from './mongo_types';
import type { CommandOperationOptions, OperationParent } from './operations/command';
import type { Hint, OperationOptions } from './operations/operation';
import { ReadConcern } from './read_concern';
import type { Server } from './sdam/server';
import type { Topology } from './sdam/topology';
import type { ClientSession } from './sessions';
import { type TimeoutContextOptions } from './timeout';
/**
 * MongoDB Driver style callback
 * @public
 */
export type Callback<T = any> = (error?: AnyError, result?: T) => void;
export type AnyOptions = Document;
export declare const ByteUtils: {
    toLocalBufferType(this: void, buffer: Buffer | Uint8Array): Buffer;
    equals(this: void, seqA: Uint8Array, seqB: Uint8Array): boolean;
    compare(this: void, seqA: Uint8Array, seqB: Uint8Array): 0 | 1 | -1;
    toBase64(this: void, uint8array: Uint8Array): string;
};
/**
 * Returns true if value is a Uint8Array or a Buffer
 * @param value - any value that may be a Uint8Array
 */
export declare function isUint8Array(value: unknown): value is Uint8Array;
/**
 * Determines if a connection's address matches a user provided list
 * of domain wildcards.
 */
export declare function hostMatchesWildcards(host: string, wildcards: string[]): boolean;
/**
 * Ensure Hint field is in a shape we expect:
 * - object of index names mapping to 1 or -1
 * - just an index name
 * @internal
 */
export declare function normalizeHintField(hint?: Hint): Hint | undefined;
/**
 * Checks if arg is an Object:
 * - **NOTE**: the check is based on the `[Symbol.toStringTag]() === 'Object'`
 * @internal
 */
export declare function isObject(arg: unknown): arg is object;
/** @internal */
export declare function mergeOptions<T, S>(target: T, source: S): T & S;
/** @internal */
export declare function filterOptions(options: AnyOptions, names: ReadonlyArray<string>): AnyOptions;
interface HasRetryableWrites {
    retryWrites?: boolean;
}
/**
 * Applies retryWrites: true to a command if retryWrites is set on the command's database.
 * @internal
 *
 * @param target - The target command to which we will apply retryWrites.
 * @param db - The database from which we can inherit a retryWrites value.
 */
export declare function applyRetryableWrites<T extends HasRetryableWrites>(target: T, db?: Db): T;
/**
 * Applies a write concern to a command based on well defined inheritance rules, optionally
 * detecting support for the write concern in the first place.
 * @internal
 *
 * @param target - the target command we will be applying the write concern to
 * @param sources - sources where we can inherit default write concerns from
 * @param options - optional settings passed into a command for write concern overrides
 */
/**
 * Checks if a given value is a Promise
 *
 * @typeParam T - The resolution type of the possible promise
 * @param value - An object that could be a promise
 * @returns true if the provided value is a Promise
 */
export declare function isPromiseLike<T = unknown>(value?: unknown): value is PromiseLike<T>;
/**
 * Applies collation to a given command.
 * @internal
 *
 * @param command - the command on which to apply collation
 * @param target - target of command
 * @param options - options containing collation settings
 */
export declare function decorateWithCollation(command: Document, target: MongoClient | Db | Collection, options: AnyOptions): void;
/**
 * Applies a read concern to a given command.
 * @internal
 *
 * @param command - the command on which to apply the read concern
 * @param coll - the parent collection of the operation calling this method
 */
export declare function decorateWithReadConcern(command: Document, coll: {
    s: {
        readConcern?: ReadConcern;
    };
}, options?: OperationOptions): void;
/**
 * @internal
 */
export type TopologyProvider = MongoClient | ClientSession | FindCursor | AbstractCursor | Collection<any> | Db;
/**
 * A helper function to get the topology from a given provider. Throws
 * if the topology cannot be found.
 * @throws MongoNotConnectedError
 * @internal
 */
export declare function getTopology(provider: TopologyProvider): Topology;
/** @internal */
export declare function ns(ns: string): MongoDBNamespace;
/** @public */
export declare class MongoDBNamespace {
    db: string;
    collection?: string | undefined;
    /**
     * Create a namespace object
     *
     * @param db - database name
     * @param collection - collection name
     */
    constructor(db: string, collection?: string | undefined);
    toString(): string;
    withCollection(collection: string): MongoDBCollectionNamespace;
    static fromString(namespace?: string): MongoDBNamespace;
}
/**
 * @public
 *
 * A class representing a collection's namespace.  This class enforces (through Typescript) that
 * the `collection` portion of the namespace is defined and should only be
 * used in scenarios where this can be guaranteed.
 */
export declare class MongoDBCollectionNamespace extends MongoDBNamespace {
    collection: string;
    constructor(db: string, collection: string);
    static fromString(namespace?: string): MongoDBCollectionNamespace;
}
/** @internal */
export declare function makeCounter(seed?: number): Generator<number>;
/**
 * Synchronously Generate a UUIDv4
 * @internal
 */
export declare function uuidV4(): Buffer;
/**
 * A helper function for determining `maxWireVersion` between legacy and new topology instances
 * @internal
 */
export declare function maxWireVersion(topologyOrServer?: Connection | Topology | Server): number;
/** @internal */
export declare function arrayStrictEqual(arr: unknown[], arr2: unknown[]): boolean;
/** @internal */
export declare function errorStrictEqual(lhs?: AnyError | null, rhs?: AnyError | null): boolean;
interface StateTable {
    [key: string]: string[];
}
interface ObjectWithState {
    s: {
        state: string;
    };
    emit(event: 'stateChanged', state: string, newState: string): void;
}
interface StateTransitionFunction {
    (target: ObjectWithState, newState: string): void;
}
/** @public */
export type EventEmitterWithState = {
    /** @internal */
    stateChanged(previous: string, current: string): void;
};
/** @internal */
export declare function makeStateMachine(stateTable: StateTable): StateTransitionFunction;
/** @internal */
export declare function now(): number;
/** @internal */
export declare function calculateDurationInMs(started: number | undefined): number;
/** @internal */
export declare function hasAtomicOperators(doc: Document | Document[], options?: CommandOperationOptions): boolean;
export declare function resolveTimeoutOptions<T extends Partial<TimeoutContextOptions>>(client: MongoClient, options: T): T & Pick<MongoClient['s']['options'], 'timeoutMS' | 'serverSelectionTimeoutMS' | 'waitQueueTimeoutMS' | 'socketTimeoutMS'>;
/**
 * Merge inherited properties from parent into options, prioritizing values from options,
 * then values from parent.
 *
 * @param parent - An optional owning class of the operation being run. ex. Db/Collection/MongoClient.
 * @param options - The options passed to the operation method.
 *
 * @internal
 */
export declare function resolveOptions<T extends CommandOperationOptions>(parent: OperationParent | undefined, options?: T): T;
export declare function isSuperset(set: Set<any> | any[], subset: Set<any> | any[]): boolean;
/**
 * Checks if the document is a Hello request
 * @internal
 */
export declare function isHello(doc: Document): boolean;
/** Returns the items that are uniquely in setA */
export declare function setDifference<T>(setA: Iterable<T>, setB: Iterable<T>): Set<T>;
export declare function isRecord<T extends readonly string[]>(value: unknown, requiredKeys: T): value is Record<T[number], any>;
export declare function isRecord(value: unknown): value is Record<string, any>;
/**
 * A sequential list of items in a circularly linked list
 * @remarks
 * The head node is special, it is always defined and has a value of null.
 * It is never "included" in the list, in that, it is not returned by pop/shift or yielded by the iterator.
 * The circular linkage and always defined head node are to reduce checks for null next/prev references to zero.
 * New nodes are declared as object literals with keys always in the same order: next, prev, value.
 * @internal
 */
export declare class List<T = unknown> {
    private readonly head;
    private count;
    get length(): number;
    get [Symbol.toStringTag](): "List";
    constructor();
    toArray(): T[];
    toString(): string;
    [Symbol.iterator](): Generator<T, void, void>;
    private nodes;
    /** Insert at end of list */
    push(value: T): void;
    /** Inserts every item inside an iterable instead of the iterable itself */
    pushMany(iterable: Iterable<T>): void;
    /** Insert at front of list */
    unshift(value: T): void;
    private remove;
    /** Removes the first node at the front of the list */
    shift(): T | null;
    /** Removes the last node at the end of the list */
    pop(): T | null;
    /** Iterates through the list and removes nodes where filter returns true */
    prune(filter: (value: T) => boolean): void;
    clear(): void;
    /** Returns the first item in the list, does not remove */
    first(): T | null;
    /** Returns the last item in the list, does not remove */
    last(): T | null;
}
/**
 * A pool of Buffers which allow you to read them as if they were one
 * @internal
 */
export declare class BufferPool {
    private buffers;
    private totalByteLength;
    constructor();
    get length(): number;
    /** Adds a buffer to the internal buffer pool list */
    append(buffer: Buffer): void;
    /**
     * If BufferPool contains 4 bytes or more construct an int32 from the leading bytes,
     * otherwise return null. Size can be negative, caller should error check.
     */
    getInt32(): number | null;
    /** Reads the requested number of bytes, optionally consuming them */
    read(size: number): Buffer;
}
/** @public */
export declare class HostAddress {
    host: string | undefined;
    port: number | undefined;
    socketPath: string | undefined;
    isIPv6: boolean;
    constructor(hostString: string);
    inspect(): string;
    toString(): string;
    static fromString(this: void, s: string): HostAddress;
    static fromHostPort(host: string, port: number): HostAddress;
    static fromSrvRecord({ name, port }: SrvRecord): HostAddress;
    toHostPort(): {
        host: string;
        port: number;
    };
}
export declare const DEFAULT_PK_FACTORY: {
    createPk(): ObjectId;
};
/**
 * When the driver used emitWarning the code will be equal to this.
 * @public
 *
 * @example
 * ```ts
 * process.on('warning', (warning) => {
 *  if (warning.code === MONGODB_WARNING_CODE) console.error('Ah an important warning! :)')
 * })
 * ```
 */
export declare const MONGODB_WARNING_CODE = "MONGODB DRIVER";
/** @internal */
export declare function emitWarning(message: string): void;
/**
 * Will emit a warning once for the duration of the application.
 * Uses the message to identify if it has already been emitted
 * so using string interpolation can cause multiple emits
 * @internal
 */
export declare function emitWarningOnce(message: string): void;
/**
 * Takes a JS object and joins the values into a string separated by ', '
 */
export declare function enumToString(en: Record<string, unknown>): string;
/**
 * Determine if a server supports retryable writes.
 *
 * @internal
 */
export declare function supportsRetryableWrites(server?: Server): boolean;
/**
 * Fisher–Yates Shuffle
 *
 * Reference: https://bost.ocks.org/mike/shuffle/
 * @param sequence - items to be shuffled
 * @param limit - Defaults to `0`. If nonzero shuffle will slice the randomized array e.g, `.slice(0, limit)` otherwise will return the entire randomized array.
 */
export declare function shuffle<T>(sequence: Iterable<T>, limit?: number): Array<T>;
/**
 * TODO(NODE-4936): read concern eligibility for commands should be codified in command construction
 * @internal
 * @see https://github.com/mongodb/specifications/blob/master/source/read-write-concern/read-write-concern.md#read-concern
 */
export declare function commandSupportsReadConcern(command: Document): boolean;
/**
 * Compare objectIds. `null` is always less
 * - `+1 = oid1 is greater than oid2`
 * - `-1 = oid1 is less than oid2`
 * - `+0 = oid1 is equal oid2`
 */
export declare function compareObjectId(oid1?: ObjectId | null, oid2?: ObjectId | null): 0 | 1 | -1;
export declare function parseInteger(value: unknown): number | null;
export declare function parseUnsignedInteger(value: unknown): number | null;
/**
 * This function throws a MongoAPIError in the event that either of the following is true:
 * * If the provided address domain does not match the provided parent domain
 * * If the parent domain contains less than three `.` separated parts and the provided address does not contain at least one more domain level than its parent
 *
 * If a DNS server were to become compromised SRV records would still need to
 * advertise addresses that are under the same domain as the srvHost.
 *
 * @param address - The address to check against a domain
 * @param srvHost - The domain to check the provided address against
 * @returns void
 */
export declare function checkParentDomainMatch(address: string, srvHost: string): void;
interface RequestOptions {
    json?: boolean;
    method?: string;
    timeout?: number;
    headers?: http.OutgoingHttpHeaders;
}
/**
 * Perform a get request that returns status and body.
 * @internal
 */
export declare function get(url: URL | string, options?: http.RequestOptions): Promise<{
    body: string;
    status: number | undefined;
}>;
export declare function request(uri: string): Promise<Record<string, any>>;
export declare function request(uri: string, options?: {
    json?: true;
} & RequestOptions): Promise<Record<string, any>>;
export declare function request(uri: string, options?: {
    json: false;
} & RequestOptions): Promise<string>;
/** @internal */
export declare const DOCUMENT_DB_CHECK: RegExp;
/** @internal */
export declare const COSMOS_DB_CHECK: RegExp;
/** @internal */
export declare const DOCUMENT_DB_MSG = "You appear to be connected to a DocumentDB cluster. For more information regarding feature compatibility and support please visit https://www.mongodb.com/supportability/documentdb";
/** @internal */
export declare const COSMOS_DB_MSG = "You appear to be connected to a CosmosDB cluster. For more information regarding feature compatibility and support please visit https://www.mongodb.com/supportability/cosmosdb";
/** @internal */
export declare function isHostMatch(match: RegExp, host?: string): boolean;
export declare function promiseWithResolvers<T>(): {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (error: Error) => void;
};
/**
 * A noop function intended for use in preventing unhandled rejections.
 *
 * @example
 * ```js
 * const promise = myAsyncTask();
 * // eslint-disable-next-line github/no-then
 * promise.then(undefined, squashError);
 * ```
 */
export declare function squashError(_error: unknown): void;
export declare const randomBytes: (arg1: number) => Promise<Buffer>;
/**
 * Replicates the events.once helper.
 *
 * Removes unused signal logic and It **only** supports 0 or 1 argument events.
 *
 * @param ee - An event emitter that may emit `ev`
 * @param name - An event name to wait for
 */
export declare function once<T>(ee: EventEmitter, name: string, options?: Abortable): Promise<T>;
export declare function maybeAddIdToDocuments(coll: Collection, docs: Document[], options: {
    forceServerObjectId?: boolean;
}): Document[];
export declare function maybeAddIdToDocuments(coll: Collection, docs: Document, options: {
    forceServerObjectId?: boolean;
}): Document;
export declare function fileIsAccessible(fileName: string, mode?: number): Promise<boolean>;
export declare function csotMin(duration1: number, duration2: number): number;
export declare function noop(): void;
/**
 * Recurse through the (identically-shaped) `decrypted` and `original`
 * objects and attach a `decryptedKeys` property on each sub-object that
 * contained encrypted fields. Because we only call this on BSON responses,
 * we do not need to worry about circular references.
 *
 * @internal
 */
export declare function decorateDecryptionResult(decrypted: Document & {
    [kDecoratedKeys]?: Array<string>;
}, original: Document, isTopLevelDecorateCall?: boolean): void;
/** @internal */
export declare const kDispose: unique symbol;
/** @internal */
export interface Disposable {
    [kDispose](): void;
}
/**
 * A utility that helps with writing listener code idiomatically
 *
 * @example
 * ```js
 * using listener = addAbortListener(signal, function () {
 *   console.log('aborted', this.reason);
 * });
 * ```
 *
 * @param signal - if exists adds an abort listener
 * @param listener - the listener to be added to signal
 * @returns A disposable that will remove the abort listener
 */
export declare function addAbortListener(signal: AbortSignal | undefined | null, listener: (this: AbortSignal, event: Event) => void): Disposable | undefined;
/**
 * Takes a promise and races it with a promise wrapping the abort event of the optionally provided signal.
 * The given promise is _always_ ordered before the signal's abort promise.
 * When given an already rejected promise and an already aborted signal, the promise's rejection takes precedence.
 *
 * Any asynchronous processing in `promise` will continue even after the abort signal has fired,
 * but control will be returned to the caller
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
 *
 * @param promise - A promise to discard if the signal aborts
 * @param options - An options object carrying an optional signal
 */
export declare function abortable<T>(promise: Promise<T>, { signal }: {
    signal?: AbortSignal;
}): Promise<T>;
export {};
//# sourceMappingURL=utils.d.ts.map