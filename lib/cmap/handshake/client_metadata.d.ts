import { BSON, type Document, Int32 } from '../../bson';
import type { MongoOptions } from '../../mongo_client';
/**
 * @public
 * @see https://github.com/mongodb/specifications/blob/master/source/mongodb-handshake/handshake.md#hello-command
 */
export interface ClientMetadata {
    driver: {
        name: string;
        version: string;
    };
    os: {
        type: string;
        name?: NodeJS.Platform;
        architecture?: string;
        version?: string;
    };
    platform: string;
    application?: {
        name: string;
    };
    /** FaaS environment information */
    env?: {
        name: 'aws.lambda' | 'gcp.func' | 'azure.func' | 'vercel';
        timeout_sec?: Int32;
        memory_mb?: Int32;
        region?: string;
        url?: string;
    };
}
/** @public */
export interface ClientMetadataOptions {
    driverInfo?: {
        name?: string;
        version?: string;
        platform?: string;
    };
    appName?: string;
}
/** @internal */
export declare class LimitedSizeDocument {
    private maxSize;
    private document;
    /** BSON overhead: Int32 + Null byte */
    private documentSize;
    constructor(maxSize: number);
    /** Only adds key/value if the bsonByteLength is less than MAX_SIZE */
    ifItFitsItSits(key: string, value: Record<string, any> | string): boolean;
    toObject(): Document;
}
type MakeClientMetadataOptions = Pick<MongoOptions, 'appName' | 'driverInfo'>;
/**
 * From the specs:
 * Implementors SHOULD cumulatively update fields in the following order until the document is under the size limit:
 * 1. Omit fields from `env` except `env.name`.
 * 2. Omit fields from `os` except `os.type`.
 * 3. Omit the `env` document entirely.
 * 4. Truncate `platform`. -- special we do not truncate this field
 */
export declare function makeClientMetadata(options: MakeClientMetadataOptions): ClientMetadata;
/**
 * @internal
 * Re-add each metadata value.
 * Attempt to add new env container metadata, but keep old data if it does not fit.
 */
export declare function addContainerMetadata(originalMetadata: ClientMetadata): Promise<BSON.Document | ClientMetadata>;
/**
 * Collects FaaS metadata.
 * - `name` MUST be the last key in the Map returned.
 */
export declare function getFAASEnv(): Map<string, string | Int32> | null;
export {};
//# sourceMappingURL=client_metadata.d.ts.map