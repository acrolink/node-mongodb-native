import { type MongoCrypt, type MongoCryptConstructor } from 'mongodb-client-encryption';
import { type Document } from '../bson';
import { type CommandOptions, type ProxyOptions } from '../cmap/connection';
import { kDecorateResult } from '../constants';
import { MongoClient } from '../mongo_client';
import { type Abortable } from '../mongo_types';
import { MongocryptdManager } from './mongocryptd_manager';
import { type CredentialProviders, type KMSProviders } from './providers';
import { type CSFLEKMSTlsOptions } from './state_machine';
/** @public */
export interface AutoEncryptionOptions {
    /** @internal client for metadata lookups */
    metadataClient?: MongoClient;
    /** A `MongoClient` used to fetch keys from a key vault */
    keyVaultClient?: MongoClient;
    /** The namespace where keys are stored in the key vault */
    keyVaultNamespace?: string;
    /** Configuration options that are used by specific KMS providers during key generation, encryption, and decryption. */
    kmsProviders?: KMSProviders;
    /** Configuration options for custom credential providers. */
    credentialProviders?: CredentialProviders;
    /**
     * A map of namespaces to a local JSON schema for encryption
     *
     * **NOTE**: Supplying options.schemaMap provides more security than relying on JSON Schemas obtained from the server.
     * It protects against a malicious server advertising a false JSON Schema, which could trick the client into sending decrypted data that should be encrypted.
     * Schemas supplied in the schemaMap only apply to configuring automatic encryption for Client-Side Field Level Encryption.
     * Other validation rules in the JSON schema will not be enforced by the driver and will result in an error.
     */
    schemaMap?: Document;
    /** Supply a schema for the encrypted fields in the document  */
    encryptedFieldsMap?: Document;
    /** Allows the user to bypass auto encryption, maintaining implicit decryption */
    bypassAutoEncryption?: boolean;
    /** Allows users to bypass query analysis */
    bypassQueryAnalysis?: boolean;
    /**
     * Sets the expiration time for the DEK in the cache in milliseconds. Defaults to 60000.  0 means no timeout.
     */
    keyExpirationMS?: number;
    options?: {
        /** An optional hook to catch logging messages from the underlying encryption engine */
        logger?: (level: AutoEncryptionLoggerLevel, message: string) => void;
    };
    extraOptions?: {
        /**
         * A local process the driver communicates with to determine how to encrypt values in a command.
         * Defaults to "mongodb://%2Fvar%2Fmongocryptd.sock" if domain sockets are available or "mongodb://localhost:27020" otherwise
         */
        mongocryptdURI?: string;
        /** If true, autoEncryption will not attempt to spawn a mongocryptd before connecting  */
        mongocryptdBypassSpawn?: boolean;
        /** The path to the mongocryptd executable on the system */
        mongocryptdSpawnPath?: string;
        /** Command line arguments to use when auto-spawning a mongocryptd */
        mongocryptdSpawnArgs?: string[];
        /**
         * Full path to a MongoDB Crypt shared library to be used (instead of mongocryptd).
         *
         * This needs to be the path to the file itself, not a directory.
         * It can be an absolute or relative path. If the path is relative and
         * its first component is `$ORIGIN`, it will be replaced by the directory
         * containing the mongodb-client-encryption native addon file. Otherwise,
         * the path will be interpreted relative to the current working directory.
         *
         * Currently, loading different MongoDB Crypt shared library files from different
         * MongoClients in the same process is not supported.
         *
         * If this option is provided and no MongoDB Crypt shared library could be loaded
         * from the specified location, creating the MongoClient will fail.
         *
         * If this option is not provided and `cryptSharedLibRequired` is not specified,
         * the AutoEncrypter will attempt to spawn and/or use mongocryptd according
         * to the mongocryptd-specific `extraOptions` options.
         *
         * Specifying a path prevents mongocryptd from being used as a fallback.
         *
         * Requires the MongoDB Crypt shared library, available in MongoDB 6.0 or higher.
         */
        cryptSharedLibPath?: string;
        /**
         * If specified, never use mongocryptd and instead fail when the MongoDB Crypt
         * shared library could not be loaded.
         *
         * This is always true when `cryptSharedLibPath` is specified.
         *
         * Requires the MongoDB Crypt shared library, available in MongoDB 6.0 or higher.
         */
        cryptSharedLibRequired?: boolean;
        /**
         * Search paths for a MongoDB Crypt shared library to be used (instead of mongocryptd)
         * Only for driver testing!
         * @internal
         */
        cryptSharedLibSearchPaths?: string[];
    };
    proxyOptions?: ProxyOptions;
    /** The TLS options to use connecting to the KMS provider */
    tlsOptions?: CSFLEKMSTlsOptions;
}
/**
 * @public
 *
 * Extra options related to the mongocryptd process
 * \* _Available in MongoDB 6.0 or higher._
 */
export type AutoEncryptionExtraOptions = NonNullable<AutoEncryptionOptions['extraOptions']>;
/** @public */
export declare const AutoEncryptionLoggerLevel: Readonly<{
    readonly FatalError: 0;
    readonly Error: 1;
    readonly Warning: 2;
    readonly Info: 3;
    readonly Trace: 4;
}>;
/**
 * @public
 * The level of severity of the log message
 *
 * | Value | Level |
 * |-------|-------|
 * | 0 | Fatal Error |
 * | 1 | Error |
 * | 2 | Warning |
 * | 3 | Info |
 * | 4 | Trace |
 */
export type AutoEncryptionLoggerLevel = (typeof AutoEncryptionLoggerLevel)[keyof typeof AutoEncryptionLoggerLevel];
/**
 * @internal An internal class to be used by the driver for auto encryption
 * **NOTE**: Not meant to be instantiated directly, this is for internal use only.
 */
export declare class AutoEncrypter {
    _client: MongoClient;
    _bypassEncryption: boolean;
    _keyVaultNamespace: string;
    _keyVaultClient: MongoClient;
    _metaDataClient: MongoClient;
    _proxyOptions: ProxyOptions;
    _tlsOptions: CSFLEKMSTlsOptions;
    _kmsProviders: KMSProviders;
    _bypassMongocryptdAndCryptShared: boolean;
    _contextCounter: number;
    _credentialProviders?: CredentialProviders;
    _mongocryptdManager?: MongocryptdManager;
    _mongocryptdClient?: MongoClient;
    /** @internal */
    _mongocrypt: MongoCrypt;
    /**
     * Used by devtools to enable decorating decryption results.
     *
     * When set and enabled, `decrypt` will automatically recursively
     * traverse a decrypted document and if a field has been decrypted,
     * it will mark it as decrypted.  Compass uses this to determine which
     * fields were decrypted.
     */
    [kDecorateResult]: boolean;
    /** @internal */
    static getMongoCrypt(): MongoCryptConstructor;
    /**
     * Create an AutoEncrypter
     *
     * **Note**: Do not instantiate this class directly. Rather, supply the relevant options to a MongoClient
     *
     * **Note**: Supplying `options.schemaMap` provides more security than relying on JSON Schemas obtained from the server.
     * It protects against a malicious server advertising a false JSON Schema, which could trick the client into sending unencrypted data that should be encrypted.
     * Schemas supplied in the schemaMap only apply to configuring automatic encryption for Client-Side Field Level Encryption.
     * Other validation rules in the JSON schema will not be enforced by the driver and will result in an error.
     *
     * @example <caption>Create an AutoEncrypter that makes use of mongocryptd</caption>
     * ```ts
     * // Enabling autoEncryption via a MongoClient using mongocryptd
     * const { MongoClient } = require('mongodb');
     * const client = new MongoClient(URL, {
     *   autoEncryption: {
     *     kmsProviders: {
     *       aws: {
     *         accessKeyId: AWS_ACCESS_KEY,
     *         secretAccessKey: AWS_SECRET_KEY
     *       }
     *     }
     *   }
     * });
     * ```
     *
     * await client.connect();
     * // From here on, the client will be encrypting / decrypting automatically
     * @example <caption>Create an AutoEncrypter that makes use of libmongocrypt's CSFLE shared library</caption>
     * ```ts
     * // Enabling autoEncryption via a MongoClient using CSFLE shared library
     * const { MongoClient } = require('mongodb');
     * const client = new MongoClient(URL, {
     *   autoEncryption: {
     *     kmsProviders: {
     *       aws: {}
     *     },
     *     extraOptions: {
     *       cryptSharedLibPath: '/path/to/local/crypt/shared/lib',
     *       cryptSharedLibRequired: true
     *     }
     *   }
     * });
     * ```
     *
     * await client.connect();
     * // From here on, the client will be encrypting / decrypting automatically
     */
    constructor(client: MongoClient, options: AutoEncryptionOptions);
    /**
     * Initializes the auto encrypter by spawning a mongocryptd and connecting to it.
     *
     * This function is a no-op when bypassSpawn is set or the crypt shared library is used.
     */
    init(): Promise<MongoClient | void>;
    /**
     * Cleans up the `_mongocryptdClient`, if present.
     */
    close(): Promise<void>;
    /**
     * Encrypt a command for a given namespace.
     */
    encrypt(ns: string, cmd: Document, options?: CommandOptions & Abortable): Promise<Document | Uint8Array>;
    /**
     * Decrypt a command response
     */
    decrypt(response: Uint8Array, options?: CommandOptions & Abortable): Promise<Uint8Array>;
    /**
     * Ask the user for KMS credentials.
     *
     * This returns anything that looks like the kmsProviders original input
     * option. It can be empty, and any provider specified here will override
     * the original ones.
     */
    askForKMSCredentials(): Promise<KMSProviders>;
    /**
     * Return the current libmongocrypt's CSFLE shared library version
     * as `{ version: bigint, versionStr: string }`, or `null` if no CSFLE
     * shared library was loaded.
     */
    get cryptSharedLibVersionInfo(): {
        version: bigint;
        versionStr: string;
    } | null;
    static get libmongocryptVersion(): string;
}
//# sourceMappingURL=auto_encrypter.d.ts.map