import { MongoDriverError, MongoNetworkError } from '../error';
import type { ConnectionPool } from './connection_pool';
/**
 * An error indicating a connection pool is closed
 * @category Error
 */
export declare class PoolClosedError extends MongoDriverError {
    /** The address of the connection pool */
    address: string;
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
    constructor(pool: ConnectionPool);
    get name(): string;
}
/**
 * An error indicating a connection pool is currently paused
 * @category Error
 */
export declare class PoolClearedError extends MongoNetworkError {
    /** The address of the connection pool */
    address: string;
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
    constructor(pool: ConnectionPool, message?: string);
    get name(): string;
}
/**
 * An error indicating that a connection pool has been cleared after the monitor for that server timed out.
 * @category Error
 */
export declare class PoolClearedOnNetworkError extends PoolClearedError {
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
    constructor(pool: ConnectionPool);
    get name(): string;
}
/**
 * An error thrown when a request to check out a connection times out
 * @category Error
 */
export declare class WaitQueueTimeoutError extends MongoDriverError {
    /** The address of the connection pool */
    address: string;
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
    constructor(message: string, address: string);
    get name(): string;
}
//# sourceMappingURL=errors.d.ts.map