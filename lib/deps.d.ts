import { type Stream } from './cmap/connect';
import { MongoMissingDependencyError } from './error';
import type { Callback } from './utils';
export type Kerberos = typeof import('kerberos') | {
    kModuleError: MongoMissingDependencyError;
};
export declare function getKerberos(): Kerberos;
export interface KerberosClient {
    step(challenge: string): Promise<string>;
    step(challenge: string, callback: Callback<string>): void;
    wrap(challenge: string, options: {
        user: string;
    }): Promise<string>;
    wrap(challenge: string, options: {
        user: string;
    }, callback: Callback<string>): void;
    unwrap(challenge: string): Promise<string>;
    unwrap(challenge: string, callback: Callback<string>): void;
}
type ZStandardLib = {
    /**
     * Compress using zstd.
     * @param buf - Buffer to be compressed.
     */
    compress(buf: Buffer, level?: number): Promise<Buffer>;
    /**
     * Decompress using zstd.
     */
    decompress(buf: Buffer): Promise<Buffer>;
};
export type ZStandard = ZStandardLib | {
    kModuleError: MongoMissingDependencyError;
};
export declare function getZstdLibrary(): ZStandardLib | {
    kModuleError: MongoMissingDependencyError;
};
/**
 * @public
 * Copy of the AwsCredentialIdentityProvider interface from [`smithy/types`](https://socket.dev/npm/package/\@smithy/types/files/1.1.1/dist-types/identity/awsCredentialIdentity.d.ts),
 * the return type of the aws-sdk's `fromNodeProviderChain().provider()`.
 */
export interface AWSCredentials {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
    expiration?: Date;
}
type CredentialProvider = {
    fromNodeProviderChain(this: void, options: {
        clientConfig: {
            region: string;
        };
    }): () => Promise<AWSCredentials>;
    fromNodeProviderChain(this: void): () => Promise<AWSCredentials>;
};
export declare function getAwsCredentialProvider(): CredentialProvider | {
    kModuleError: MongoMissingDependencyError;
};
/** @internal */
export type GcpMetadata = typeof import('gcp-metadata') | {
    kModuleError: MongoMissingDependencyError;
};
export declare function getGcpMetadata(): GcpMetadata;
/** @internal */
export type SnappyLib = {
    /**
     * In order to support both we must check the return value of the function
     * @param buf - Buffer to be compressed
     */
    compress(buf: Buffer): Promise<Buffer>;
    /**
     * In order to support both we must check the return value of the function
     * @param buf - Buffer to be compressed
     */
    uncompress(buf: Buffer, opt: {
        asBuffer: true;
    }): Promise<Buffer>;
};
export declare function getSnappy(): SnappyLib | {
    kModuleError: MongoMissingDependencyError;
};
export type SocksLib = {
    SocksClient: {
        createConnection(options: {
            command: 'connect';
            destination: {
                host: string;
                port: number;
            };
            proxy: {
                /** host and port are ignored because we pass existing_socket */
                host: 'iLoveJavaScript';
                port: 0;
                type: 5;
                userId?: string;
                password?: string;
            };
            timeout?: number;
            /** We always create our own socket, and pass it to this API for proxy negotiation */
            existing_socket: Stream;
        }): Promise<{
            socket: Stream;
        }>;
    };
};
export declare function getSocks(): SocksLib | {
    kModuleError: MongoMissingDependencyError;
};
interface AWS4 {
    /**
     * Created these inline types to better assert future usage of this API
     * @param options - options for request
     * @param credentials - AWS credential details, sessionToken should be omitted entirely if its false-y
     */
    sign(this: void, options: {
        path: '/';
        body: string;
        host: string;
        method: 'POST';
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded';
            'Content-Length': number;
            'X-MongoDB-Server-Nonce': string;
            'X-MongoDB-GS2-CB-Flag': 'n';
        };
        service: string;
        region: string;
    }, credentials: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken: string;
    } | {
        accessKeyId: string;
        secretAccessKey: string;
    } | undefined): {
        headers: {
            Authorization: string;
            'X-Amz-Date': string;
        };
    };
}
export declare const aws4: AWS4 | {
    kModuleError: MongoMissingDependencyError;
};
/** A utility function to get the instance of mongodb-client-encryption, if it exists. */
export declare function getMongoDBClientEncryption(): typeof import('mongodb-client-encryption') | {
    kModuleError: MongoMissingDependencyError;
};
export {};
//# sourceMappingURL=deps.d.ts.map