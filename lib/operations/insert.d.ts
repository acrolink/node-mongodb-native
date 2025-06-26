import type { Document } from '../bson';
import type { BulkWriteOptions } from '../bulk/common';
import type { Collection } from '../collection';
import type { InferIdType } from '../mongo_types';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { type MongoDBNamespace } from '../utils';
import { CommandOperation, type CommandOperationOptions } from './command';
import { AbstractOperation } from './operation';
/** @internal */
export declare class InsertOperation extends CommandOperation<Document> {
    options: BulkWriteOptions;
    documents: Document[];
    constructor(ns: MongoDBNamespace, documents: Document[], options: BulkWriteOptions);
    get commandName(): "insert";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<Document>;
}
/** @public */
export interface InsertOneOptions extends CommandOperationOptions {
    /** Allow driver to bypass schema validation. */
    bypassDocumentValidation?: boolean;
    /** Force server to assign _id values instead of driver. */
    forceServerObjectId?: boolean;
}
/** @public */
export interface InsertOneResult<TSchema = Document> {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined */
    acknowledged: boolean;
    /** The identifier that was inserted. If the server generated the identifier, this value will be null as the driver does not have access to that data */
    insertedId: InferIdType<TSchema>;
}
export declare class InsertOneOperation extends InsertOperation {
    constructor(collection: Collection, doc: Document, options: InsertOneOptions);
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<InsertOneResult>;
}
/** @public */
export interface InsertManyResult<TSchema = Document> {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined */
    acknowledged: boolean;
    /** The number of inserted documents for this operations */
    insertedCount: number;
    /** Map of the index of the inserted document to the id of the inserted document */
    insertedIds: {
        [key: number]: InferIdType<TSchema>;
    };
}
/** @internal */
export declare class InsertManyOperation extends AbstractOperation<InsertManyResult> {
    options: BulkWriteOptions;
    collection: Collection;
    docs: ReadonlyArray<Document>;
    constructor(collection: Collection, docs: ReadonlyArray<Document>, options: BulkWriteOptions);
    get commandName(): "insert";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<InsertManyResult>;
}
//# sourceMappingURL=insert.d.ts.map