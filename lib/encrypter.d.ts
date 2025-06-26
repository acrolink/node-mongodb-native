import { AutoEncrypter, type AutoEncryptionOptions } from './client-side-encryption/auto_encrypter';
import { MongoClient, type MongoClientOptions } from './mongo_client';
/** @internal */
export interface EncrypterOptions {
    autoEncryption: AutoEncryptionOptions;
    maxPoolSize?: number;
}
/** @internal */
export declare class Encrypter {
    private internalClient;
    bypassAutoEncryption: boolean;
    needsConnecting: boolean;
    autoEncrypter: AutoEncrypter;
    constructor(client: MongoClient, uri: string, options: MongoClientOptions);
    getInternalClient(client: MongoClient, uri: string, options: MongoClientOptions): MongoClient;
    connectInternalClient(): Promise<void>;
    close(client: MongoClient): Promise<void>;
    static checkForMongoCrypt(): void;
}
//# sourceMappingURL=encrypter.d.ts.map