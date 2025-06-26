import { type Document } from './bson';
import { type ClientSession } from './sessions';
/** @internal */
export declare class TimeoutError extends Error {
    duration: number;
    get name(): 'TimeoutError';
    constructor(message: string, options: {
        cause?: Error;
        duration: number;
    });
    static is(error: unknown): error is TimeoutError;
}
/**
 * @internal
 * This class is an abstraction over timeouts
 * The Timeout class can only be in the pending or rejected states. It is guaranteed not to resolve
 * if interacted with exclusively through its public API
 * */
export declare class Timeout extends Promise<never> {
    private id?;
    readonly start: number;
    ended: number | null;
    duration: number;
    private timedOut;
    cleared: boolean;
    get remainingTime(): number;
    get timeElapsed(): number;
    /** Create a new timeout that expires in `duration` ms */
    private constructor();
    /**
     * Clears the underlying timeout. This method is idempotent
     */
    clear(): void;
    throwIfExpired(): void;
    static expires(duration: number, unref?: true): Timeout;
    static reject(rejection?: Error): Timeout;
}
/** @internal */
export type TimeoutContextOptions = (LegacyTimeoutContextOptions | CSOTTimeoutContextOptions) & {
    session?: ClientSession;
};
/** @internal */
export type LegacyTimeoutContextOptions = {
    serverSelectionTimeoutMS: number;
    waitQueueTimeoutMS: number;
    socketTimeoutMS?: number;
};
/** @internal */
export type CSOTTimeoutContextOptions = {
    timeoutMS: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS?: number;
};
/** @internal */
export declare abstract class TimeoutContext {
    static create(options: TimeoutContextOptions): TimeoutContext;
    abstract get maxTimeMS(): number | null;
    abstract get serverSelectionTimeout(): Timeout | null;
    abstract get connectionCheckoutTimeout(): Timeout | null;
    abstract get clearServerSelectionTimeout(): boolean;
    abstract get timeoutForSocketWrite(): Timeout | null;
    abstract get timeoutForSocketRead(): Timeout | null;
    abstract csotEnabled(): this is CSOTTimeoutContext;
    abstract refresh(): void;
    abstract clear(): void;
    /** Returns a new instance of the TimeoutContext, with all timeouts refreshed and restarted. */
    abstract refreshed(): TimeoutContext;
    abstract addMaxTimeMSToCommand(command: Document, options: {
        omitMaxTimeMS?: boolean;
    }): void;
    abstract getSocketTimeoutMS(): number | undefined;
}
/** @internal */
export declare class CSOTTimeoutContext extends TimeoutContext {
    timeoutMS: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS?: number;
    clearServerSelectionTimeout: boolean;
    private _serverSelectionTimeout?;
    private _connectionCheckoutTimeout?;
    minRoundTripTime: number;
    start: number;
    constructor(options: CSOTTimeoutContextOptions);
    get maxTimeMS(): number;
    get remainingTimeMS(): number;
    csotEnabled(): this is CSOTTimeoutContext;
    get serverSelectionTimeout(): Timeout | null;
    get connectionCheckoutTimeout(): Timeout | null;
    get timeoutForSocketWrite(): Timeout | null;
    get timeoutForSocketRead(): Timeout | null;
    refresh(): void;
    clear(): void;
    /**
     * @internal
     * Throws a MongoOperationTimeoutError if the context has expired.
     * If the context has not expired, returns the `remainingTimeMS`
     **/
    getRemainingTimeMSOrThrow(message?: string): number;
    /**
     * @internal
     * This method is intended to be used in situations where concurrent operation are on the same deadline, but cannot share a single `TimeoutContext` instance.
     * Returns a new instance of `CSOTTimeoutContext` constructed with identical options, but setting the `start` property to `this.start`.
     */
    clone(): CSOTTimeoutContext;
    refreshed(): CSOTTimeoutContext;
    addMaxTimeMSToCommand(command: Document, options: {
        omitMaxTimeMS?: boolean;
    }): void;
    getSocketTimeoutMS(): number | undefined;
}
/** @internal */
export declare class LegacyTimeoutContext extends TimeoutContext {
    options: LegacyTimeoutContextOptions;
    clearServerSelectionTimeout: boolean;
    constructor(options: LegacyTimeoutContextOptions);
    csotEnabled(): this is CSOTTimeoutContext;
    get serverSelectionTimeout(): Timeout | null;
    get connectionCheckoutTimeout(): Timeout | null;
    get timeoutForSocketWrite(): Timeout | null;
    get timeoutForSocketRead(): Timeout | null;
    refresh(): void;
    clear(): void;
    get maxTimeMS(): null;
    refreshed(): LegacyTimeoutContext;
    addMaxTimeMSToCommand(_command: Document, _options: {
        omitMaxTimeMS?: boolean;
    }): void;
    getSocketTimeoutMS(): number | undefined;
}
//# sourceMappingURL=timeout.d.ts.map