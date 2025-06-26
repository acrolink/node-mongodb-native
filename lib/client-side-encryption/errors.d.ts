import { type Document } from '../bson';
import { MongoError } from '../error';
/**
 * @public
 * An error indicating that something went wrong specifically with MongoDB Client Encryption
 */
export declare class MongoCryptError extends MongoError {
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
 *
 * An error indicating an invalid argument was provided to an encryption API.
 */
export declare class MongoCryptInvalidArgumentError extends MongoCryptError {
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
 * @public
 * An error indicating that `ClientEncryption.createEncryptedCollection()` failed to create data keys
 */
export declare class MongoCryptCreateDataKeyError extends MongoCryptError {
    encryptedFields: Document;
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
    constructor(encryptedFields: Document, { cause }: {
        cause: Error;
    });
    get name(): string;
}
/**
 * @public
 * An error indicating that `ClientEncryption.createEncryptedCollection()` failed to create a collection
 */
export declare class MongoCryptCreateEncryptedCollectionError extends MongoCryptError {
    encryptedFields: Document;
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
    constructor(encryptedFields: Document, { cause }: {
        cause: Error;
    });
    get name(): string;
}
/**
 * @public
 * An error indicating that mongodb-client-encryption failed to auto-refresh Azure KMS credentials.
 */
export declare class MongoCryptAzureKMSRequestError extends MongoCryptError {
    /** The body of the http response that failed, if present. */
    body?: Document;
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
    constructor(message: string, body?: Document);
    get name(): string;
}
/** @public */
export declare class MongoCryptKMSRequestNetworkTimeoutError extends MongoCryptError {
    get name(): string;
}
//# sourceMappingURL=errors.d.ts.map