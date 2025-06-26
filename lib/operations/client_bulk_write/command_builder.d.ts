import { type BSONSerializeOptions, type Document } from '../../bson';
import { DocumentSequence } from '../../cmap/commands';
import { type PkFactory } from '../../mongo_client';
import type { Filter, OptionalId, UpdateFilter, WithoutId } from '../../mongo_types';
import { type SortForCmd } from '../../sort';
import { type CollationOptions } from '../command';
import { type Hint } from '../operation';
import type { AnyClientBulkWriteModel, ClientBulkWriteOptions, ClientDeleteManyModel, ClientDeleteOneModel, ClientInsertOneModel, ClientReplaceOneModel, ClientUpdateManyModel, ClientUpdateOneModel } from './common';
/** @internal */
export interface ClientBulkWriteCommand {
    bulkWrite: 1;
    errorsOnly: boolean;
    ordered: boolean;
    ops: DocumentSequence;
    nsInfo: DocumentSequence;
    bypassDocumentValidation?: boolean;
    let?: Document;
    comment?: any;
}
/** @internal */
export declare class ClientBulkWriteCommandBuilder {
    models: ReadonlyArray<AnyClientBulkWriteModel<Document>>;
    options: ClientBulkWriteOptions;
    pkFactory: PkFactory;
    /** The current index in the models array that is being processed. */
    currentModelIndex: number;
    /** The model index that the builder was on when it finished the previous batch. Used for resets when retrying. */
    previousModelIndex: number;
    /** The last array of operations that were created. Used by the results merger for indexing results. */
    lastOperations: Document[];
    /** Returns true if the current batch being created has no multi-updates. */
    isBatchRetryable: boolean;
    /**
     * Create the command builder.
     * @param models - The client write models.
     */
    constructor(models: ReadonlyArray<AnyClientBulkWriteModel<Document>>, options: ClientBulkWriteOptions, pkFactory?: PkFactory);
    /**
     * Gets the errorsOnly value for the command, which is the inverse of the
     * user provided verboseResults option. Defaults to true.
     */
    get errorsOnly(): boolean;
    /**
     * Determines if there is another batch to process.
     * @returns True if not all batches have been built.
     */
    hasNextBatch(): boolean;
    /**
     * When we need to retry a command we need to set the current
     * model index back to its previous value.
     */
    resetBatch(): boolean;
    /**
     * Build a single batch of a client bulk write command.
     * @param maxMessageSizeBytes - The max message size in bytes.
     * @param maxWriteBatchSize - The max write batch size.
     * @returns The client bulk write command.
     */
    buildBatch(maxMessageSizeBytes: number, maxWriteBatchSize: number, maxBsonObjectSize: number): ClientBulkWriteCommand;
    private baseCommand;
}
/** @internal */
interface ClientInsertOperation {
    insert: number;
    document: OptionalId<Document>;
}
/**
 * Build the insert one operation.
 * @param model - The insert one model.
 * @param index - The namespace index.
 * @returns the operation.
 */
export declare const buildInsertOneOperation: (model: ClientInsertOneModel<Document>, index: number, pkFactory: PkFactory) => ClientInsertOperation;
/** @internal */
export interface ClientDeleteOperation {
    delete: number;
    multi: boolean;
    filter: Filter<Document>;
    hint?: Hint;
    collation?: CollationOptions;
}
/**
 * Build the delete one operation.
 * @param model - The insert many model.
 * @param index - The namespace index.
 * @returns the operation.
 */
export declare const buildDeleteOneOperation: (model: ClientDeleteOneModel<Document>, index: number) => Document;
/**
 * Build the delete many operation.
 * @param model - The delete many model.
 * @param index - The namespace index.
 * @returns the operation.
 */
export declare const buildDeleteManyOperation: (model: ClientDeleteManyModel<Document>, index: number) => Document;
/** @internal */
export interface ClientUpdateOperation {
    update: number;
    multi: boolean;
    filter: Filter<Document>;
    updateMods: UpdateFilter<Document> | Document[];
    hint?: Hint;
    upsert?: boolean;
    arrayFilters?: Document[];
    collation?: CollationOptions;
    sort?: SortForCmd;
}
/**
 * Build the update one operation.
 * @param model - The update one model.
 * @param index - The namespace index.
 * @returns the operation.
 */
export declare const buildUpdateOneOperation: (model: ClientUpdateOneModel<Document>, index: number, options: BSONSerializeOptions) => ClientUpdateOperation;
/**
 * Build the update many operation.
 * @param model - The update many model.
 * @param index - The namespace index.
 * @returns the operation.
 */
export declare const buildUpdateManyOperation: (model: ClientUpdateManyModel<Document>, index: number, options: BSONSerializeOptions) => ClientUpdateOperation;
/** @internal */
export interface ClientReplaceOneOperation {
    update: number;
    multi: boolean;
    filter: Filter<Document>;
    updateMods: WithoutId<Document>;
    hint?: Hint;
    upsert?: boolean;
    collation?: CollationOptions;
    sort?: SortForCmd;
}
/**
 * Build the replace one operation.
 * @param model - The replace one model.
 * @param index - The namespace index.
 * @returns the operation.
 */
export declare const buildReplaceOneOperation: (model: ClientReplaceOneModel<Document>, index: number) => ClientReplaceOneOperation;
/** @internal */
export declare function buildOperation(model: AnyClientBulkWriteModel<Document>, index: number, pkFactory: PkFactory, options: BSONSerializeOptions): Document;
export {};
//# sourceMappingURL=command_builder.d.ts.map