import type { MongoClient } from '../mongo_client';
import { TimeoutContext } from '../timeout';
import { AbstractOperation } from './operation';
type ResultTypeFromOperation<TOperation> = TOperation extends AbstractOperation<infer K> ? K : never;
/**
 * Executes the given operation with provided arguments.
 * @internal
 *
 * @remarks
 * Allows for a single point of entry to provide features such as implicit sessions, which
 * are required by the Driver Sessions specification in the event that a ClientSession is
 * not provided.
 *
 * The expectation is that this function:
 * - Connects the MongoClient if it has not already been connected, see {@link autoConnect}
 * - Creates a session if none is provided and cleans up the session it creates
 * - Tries an operation and retries under certain conditions, see {@link tryOperation}
 *
 * @typeParam T - The operation's type
 * @typeParam TResult - The type of the operation's result, calculated from T
 *
 * @param client - The MongoClient to execute this operation with
 * @param operation - The operation to execute
 */
export declare function executeOperation<T extends AbstractOperation<TResult>, TResult = ResultTypeFromOperation<T>>(client: MongoClient, operation: T, timeoutContext?: TimeoutContext | null): Promise<TResult>;
export {};
//# sourceMappingURL=execute_operation.d.ts.map