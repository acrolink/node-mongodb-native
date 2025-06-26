import { type MongoCryptContext, type MongoCryptKMSRequest } from 'mongodb-client-encryption';
import * as tls from 'tls';
import { type BSONSerializeOptions, type Document } from '../bson';
import { type ProxyOptions } from '../cmap/connection';
import { type MongoClient, type MongoClientOptions } from '../mongo_client';
import { type Abortable } from '../mongo_types';
import { type CollectionInfo } from '../operations/list_collections';
import { type TimeoutContext } from '../timeout';
import { type DataKey } from './client_encryption';
import { MongoCryptError } from './errors';
import { type MongocryptdManager } from './mongocryptd_manager';
import { type KMSProviders } from './providers';
declare module 'mongodb-client-encryption' {
    interface MongoCryptContext {
        id: number;
        document: Document;
        ns: string;
    }
}
/**
 * @public
 *
 * TLS options to use when connecting. The spec specifically calls out which insecure
 * tls options are not allowed:
 *
 *  - tlsAllowInvalidCertificates
 *  - tlsAllowInvalidHostnames
 *  - tlsInsecure
 *
 * These options are not included in the type, and are ignored if provided.
 */
export type ClientEncryptionTlsOptions = Pick<MongoClientOptions, 'tlsCAFile' | 'tlsCertificateKeyFile' | 'tlsCertificateKeyFilePassword'>;
/** @public */
export type CSFLEKMSTlsOptions = {
    aws?: ClientEncryptionTlsOptions;
    gcp?: ClientEncryptionTlsOptions;
    kmip?: ClientEncryptionTlsOptions;
    local?: ClientEncryptionTlsOptions;
    azure?: ClientEncryptionTlsOptions;
    [key: string]: ClientEncryptionTlsOptions | undefined;
};
/**
 * @public
 *
 * Socket options to use for KMS requests.
 */
export type ClientEncryptionSocketOptions = Pick<MongoClientOptions, 'autoSelectFamily' | 'autoSelectFamilyAttemptTimeout'>;
/**
 * @internal
 *
 * An interface representing an object that can be passed to the `StateMachine.execute` method.
 *
 * Not all properties are required for all operations.
 */
export interface StateMachineExecutable {
    _keyVaultNamespace: string;
    _keyVaultClient: MongoClient;
    askForKMSCredentials: () => Promise<KMSProviders>;
    /** only used for auto encryption */
    _metaDataClient?: MongoClient;
    /** only used for auto encryption */
    _mongocryptdClient?: MongoClient;
    /** only used for auto encryption */
    _mongocryptdManager?: MongocryptdManager;
}
export type StateMachineOptions = {
    /** socks5 proxy options, if set. */
    proxyOptions: ProxyOptions;
    /** TLS options for KMS requests, if set. */
    tlsOptions: CSFLEKMSTlsOptions;
    /** Socket specific options we support. */
    socketOptions: ClientEncryptionSocketOptions;
} & Pick<BSONSerializeOptions, 'promoteLongs' | 'promoteValues'>;
/**
 * @internal
 * An internal class that executes across a MongoCryptContext until either
 * a finishing state or an error is reached. Do not instantiate directly.
 */
export declare class StateMachine {
    private options;
    private bsonOptions;
    constructor(options: StateMachineOptions, bsonOptions?: BSONSerializeOptions);
    /**
     * Executes the state machine according to the specification
     */
    execute(executor: StateMachineExecutable, context: MongoCryptContext, options: {
        timeoutContext?: TimeoutContext;
    } & Abortable): Promise<Uint8Array>;
    /**
     * Handles the request to the KMS service. Exposed for testing purposes. Do not directly invoke.
     * @param kmsContext - A C++ KMS context returned from the bindings
     * @returns A promise that resolves when the KMS reply has be fully parsed
     */
    kmsRequest(request: MongoCryptKMSRequest, options?: {
        timeoutContext?: TimeoutContext;
    } & Abortable): Promise<void>;
    requests(context: MongoCryptContext, options?: {
        timeoutContext?: TimeoutContext;
    } & Abortable): Generator<Promise<void>, void, unknown>;
    /**
     * Validates the provided TLS options are secure.
     *
     * @param kmsProvider - The KMS provider name.
     * @param tlsOptions - The client TLS options for the provider.
     *
     * @returns An error if any option is invalid.
     */
    validateTlsOptions(kmsProvider: string, tlsOptions: ClientEncryptionTlsOptions): MongoCryptError | void;
    /**
     * Sets only the valid secure TLS options.
     *
     * @param tlsOptions - The client TLS options for the provider.
     * @param options - The existing connection options.
     */
    setTlsOptions(tlsOptions: ClientEncryptionTlsOptions, options: tls.ConnectionOptions): Promise<void>;
    /**
     * Fetches collection info for a provided namespace, when libmongocrypt
     * enters the `MONGOCRYPT_CTX_NEED_MONGO_COLLINFO` state. The result is
     * used to inform libmongocrypt of the schema associated with this
     * namespace. Exposed for testing purposes. Do not directly invoke.
     *
     * @param client - A MongoClient connected to the topology
     * @param ns - The namespace to list collections from
     * @param filter - A filter for the listCollections command
     * @param callback - Invoked with the info of the requested collection, or with an error
     */
    fetchCollectionInfo(client: MongoClient, ns: string, filter: Document, options?: {
        timeoutContext?: TimeoutContext;
    } & Abortable): AsyncIterable<CollectionInfo>;
    /**
     * Calls to the mongocryptd to provide markings for a command.
     * Exposed for testing purposes. Do not directly invoke.
     * @param client - A MongoClient connected to a mongocryptd
     * @param ns - The namespace (database.collection) the command is being executed on
     * @param command - The command to execute.
     * @param callback - Invoked with the serialized and marked bson command, or with an error
     */
    markCommand(client: MongoClient, ns: string, command: Uint8Array, options?: {
        timeoutContext?: TimeoutContext;
    } & Abortable): Promise<Uint8Array>;
    /**
     * Requests keys from the keyVault collection on the topology.
     * Exposed for testing purposes. Do not directly invoke.
     * @param client - A MongoClient connected to the topology
     * @param keyVaultNamespace - The namespace (database.collection) of the keyVault Collection
     * @param filter - The filter for the find query against the keyVault Collection
     * @param callback - Invoked with the found keys, or with an error
     */
    fetchKeys(client: MongoClient, keyVaultNamespace: string, filter: Uint8Array, options?: {
        timeoutContext?: TimeoutContext;
    } & Abortable): Promise<Array<DataKey>>;
}
//# sourceMappingURL=state_machine.d.ts.map