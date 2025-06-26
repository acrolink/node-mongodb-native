import type { Document } from '../bson';
import type { Collection } from '../collection';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type Sort, type SortForCmd } from '../sort';
import { type TimeoutContext } from '../timeout';
import { type WriteConcern, type WriteConcernSettings } from '../write_concern';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public */
export declare const ReturnDocument: Readonly<{
    readonly BEFORE: "before";
    readonly AFTER: "after";
}>;
/** @public */
export type ReturnDocument = (typeof ReturnDocument)[keyof typeof ReturnDocument];
/** @public */
export interface FindOneAndDeleteOptions extends CommandOperationOptions {
    /** An optional hint for query optimization. See the {@link https://www.mongodb.com/docs/manual/reference/command/update/#update-command-hint|update command} reference for more information.*/
    hint?: Document;
    /** Limits the fields to return for all matching documents. */
    projection?: Document;
    /** Determines which document the operation modifies if the query selects multiple documents. */
    sort?: Sort;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
    /**
     * Return the ModifyResult instead of the modified document. Defaults to false
     */
    includeResultMetadata?: boolean;
}
/** @public */
export interface FindOneAndReplaceOptions extends CommandOperationOptions {
    /** Allow driver to bypass schema validation. */
    bypassDocumentValidation?: boolean;
    /** An optional hint for query optimization. See the {@link https://www.mongodb.com/docs/manual/reference/command/update/#update-command-hint|update command} reference for more information.*/
    hint?: Document;
    /** Limits the fields to return for all matching documents. */
    projection?: Document;
    /** When set to 'after', returns the updated document rather than the original. The default is 'before'.  */
    returnDocument?: ReturnDocument;
    /** Determines which document the operation modifies if the query selects multiple documents. */
    sort?: Sort;
    /** Upsert the document if it does not exist. */
    upsert?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
    /**
     * Return the ModifyResult instead of the modified document. Defaults to false
     */
    includeResultMetadata?: boolean;
}
/** @public */
export interface FindOneAndUpdateOptions extends CommandOperationOptions {
    /** Optional list of array filters referenced in filtered positional operators */
    arrayFilters?: Document[];
    /** Allow driver to bypass schema validation. */
    bypassDocumentValidation?: boolean;
    /** An optional hint for query optimization. See the {@link https://www.mongodb.com/docs/manual/reference/command/update/#update-command-hint|update command} reference for more information.*/
    hint?: Document;
    /** Limits the fields to return for all matching documents. */
    projection?: Document;
    /** When set to 'after', returns the updated document rather than the original. The default is 'before'.  */
    returnDocument?: ReturnDocument;
    /** Determines which document the operation modifies if the query selects multiple documents. */
    sort?: Sort;
    /** Upsert the document if it does not exist. */
    upsert?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
    /**
     * Return the ModifyResult instead of the modified document. Defaults to false
     */
    includeResultMetadata?: boolean;
}
/** @internal */
interface FindAndModifyCmdBase {
    remove: boolean;
    new: boolean;
    upsert: boolean;
    update?: Document;
    sort?: SortForCmd;
    fields?: Document;
    bypassDocumentValidation?: boolean;
    arrayFilters?: Document[];
    maxTimeMS?: number;
    let?: Document;
    writeConcern?: WriteConcern | WriteConcernSettings;
    /**
     * Comment to apply to the operation.
     *
     * In server versions pre-4.4, 'comment' must be string.  A server
     * error will be thrown if any other type is provided.
     *
     * In server versions 4.4 and above, 'comment' can be any valid BSON type.
     */
    comment?: unknown;
}
/** @internal */
export declare class FindAndModifyOperation extends CommandOperation<Document> {
    options: FindOneAndReplaceOptions | FindOneAndUpdateOptions | FindOneAndDeleteOptions;
    cmdBase: FindAndModifyCmdBase;
    collection: Collection;
    query: Document;
    doc?: Document;
    constructor(collection: Collection, query: Document, options: FindOneAndReplaceOptions | FindOneAndUpdateOptions | FindOneAndDeleteOptions);
    get commandName(): "findAndModify";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<Document>;
}
/** @internal */
export declare class FindOneAndDeleteOperation extends FindAndModifyOperation {
    constructor(collection: Collection, filter: Document, options: FindOneAndDeleteOptions);
}
/** @internal */
export declare class FindOneAndReplaceOperation extends FindAndModifyOperation {
    constructor(collection: Collection, filter: Document, replacement: Document, options: FindOneAndReplaceOptions);
}
/** @internal */
export declare class FindOneAndUpdateOperation extends FindAndModifyOperation {
    constructor(collection: Collection, filter: Document, update: Document, options: FindOneAndUpdateOptions);
}
export {};
//# sourceMappingURL=find_and_modify.d.ts.map