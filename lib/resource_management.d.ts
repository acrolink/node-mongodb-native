/**
 * @public
 */
export interface AsyncDisposable {
    /**
     * @beta
     * @experimental
     */
    [Symbol.asyncDispose](): Promise<void>;
    /**
     * @internal
     *
     * A method that wraps disposal semantics for a given resource in the class.
     */
    asyncDispose(): Promise<void>;
}
/** @internal */
export declare function configureResourceManagement(target: AsyncDisposable): void;
/**
 * @beta
 * @experimental
 *
 * Attaches `Symbol.asyncDispose` methods to the MongoClient, Cursors, sessions and change streams
 * if Symbol.asyncDispose is defined.
 *
 * It's usually not necessary to call this method - the driver attempts to attach these methods
 * itself when its loaded.  However, sometimes the driver may be loaded before `Symbol.asyncDispose`
 * is defined, in which case it is necessary to call this method directly.  This can happen if the
 * application is polyfilling `Symbol.asyncDispose`.
 *
 * Example:
 *
 * ```typescript
 * import { configureExplicitResourceManagement, MongoClient } from 'mongodb/lib/beta';
 *
 * Symbol.asyncDispose ??= Symbol('dispose');
 * load();
 *
 * await using client = new MongoClient(...);
 * ```
 */
export declare function configureExplicitResourceManagement(): void;
//# sourceMappingURL=resource_management.d.ts.map