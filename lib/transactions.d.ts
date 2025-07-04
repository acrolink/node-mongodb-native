import type { Document } from './bson';
import type { CommandOperationOptions } from './operations/command';
import { type ReadConcernLike } from './read_concern';
import { type ReadPreferenceLike } from './read_preference';
import type { Server } from './sdam/server';
import { WriteConcern } from './write_concern';
/** @internal */
export declare const TxnState: Readonly<{
    readonly NO_TRANSACTION: "NO_TRANSACTION";
    readonly STARTING_TRANSACTION: "STARTING_TRANSACTION";
    readonly TRANSACTION_IN_PROGRESS: "TRANSACTION_IN_PROGRESS";
    readonly TRANSACTION_COMMITTED: "TRANSACTION_COMMITTED";
    readonly TRANSACTION_COMMITTED_EMPTY: "TRANSACTION_COMMITTED_EMPTY";
    readonly TRANSACTION_ABORTED: "TRANSACTION_ABORTED";
}>;
/** @internal */
export type TxnState = (typeof TxnState)[keyof typeof TxnState];
/**
 * Configuration options for a transaction.
 * @public
 */
export interface TransactionOptions extends Omit<CommandOperationOptions, 'timeoutMS'> {
    /** A default read concern for commands in this transaction */
    readConcern?: ReadConcernLike;
    /** A default writeConcern for commands in this transaction */
    writeConcern?: WriteConcern;
    /** A default read preference for commands in this transaction */
    readPreference?: ReadPreferenceLike;
    /** Specifies the maximum amount of time to allow a commit action on a transaction to run in milliseconds */
    maxCommitTimeMS?: number;
}
/**
 * @public
 * A class maintaining state related to a server transaction. Internal Only
 */
export declare class Transaction {
    /** @internal */
    state: TxnState;
    options: TransactionOptions;
    /** @internal */
    _pinnedServer?: Server;
    /** @internal */
    _recoveryToken?: Document;
    /** Create a transaction @internal */
    constructor(options?: TransactionOptions);
    /** @internal */
    get server(): Server | undefined;
    get recoveryToken(): Document | undefined;
    get isPinned(): boolean;
    /** @returns Whether the transaction has started */
    get isStarting(): boolean;
    /**
     * @returns Whether this session is presently in a transaction
     */
    get isActive(): boolean;
    get isCommitted(): boolean;
    /**
     * Transition the transaction in the state machine
     * @internal
     * @param nextState - The new state to transition to
     */
    transition(nextState: TxnState): void;
    /** @internal */
    pinServer(server: Server): void;
    /** @internal */
    unpinServer(): void;
}
export declare function isTransactionCommand(command: Document): boolean;
//# sourceMappingURL=transactions.d.ts.map