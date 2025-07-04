import type { Document } from '../bson';
import { Collection } from '../collection';
import type { Db } from '../db';
import type { PkFactory } from '../mongo_client';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { CommandOperation, type CommandOperationOptions } from './command';
/** @public
 * Configuration options for timeseries collections
 * @see https://www.mongodb.com/docs/manual/core/timeseries-collections/
 */
export interface TimeSeriesCollectionOptions extends Document {
    timeField: string;
    metaField?: string;
    granularity?: 'seconds' | 'minutes' | 'hours' | string;
    bucketMaxSpanSeconds?: number;
    bucketRoundingSeconds?: number;
}
/** @public
 * Configuration options for clustered collections
 * @see https://www.mongodb.com/docs/manual/core/clustered-collections/
 */
export interface ClusteredCollectionOptions extends Document {
    name?: string;
    key: Document;
    unique: boolean;
}
/** @public */
export interface CreateCollectionOptions extends CommandOperationOptions {
    /** Create a capped collection */
    capped?: boolean;
    /** @deprecated Create an index on the _id field of the document. This option is deprecated in MongoDB 3.2+ and will be removed once no longer supported by the server. */
    autoIndexId?: boolean;
    /** The size of the capped collection in bytes */
    size?: number;
    /** The maximum number of documents in the capped collection */
    max?: number;
    /** Available for the MMAPv1 storage engine only to set the usePowerOf2Sizes and the noPadding flag */
    flags?: number;
    /** Allows users to specify configuration to the storage engine on a per-collection basis when creating a collection */
    storageEngine?: Document;
    /** Allows users to specify validation rules or expressions for the collection. For more information, see Document Validation */
    validator?: Document;
    /** Determines how strictly MongoDB applies the validation rules to existing documents during an update */
    validationLevel?: string;
    /** Determines whether to error on invalid documents or just warn about the violations but allow invalid documents to be inserted */
    validationAction?: string;
    /** Allows users to specify a default configuration for indexes when creating a collection */
    indexOptionDefaults?: Document;
    /** The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view (i.e., does not include the database name and implies the same database as the view to create) */
    viewOn?: string;
    /** An array that consists of the aggregation pipeline stage. Creates the view by applying the specified pipeline to the viewOn collection or view */
    pipeline?: Document[];
    /** A primary key factory function for generation of custom _id keys. */
    pkFactory?: PkFactory;
    /** A document specifying configuration options for timeseries collections. */
    timeseries?: TimeSeriesCollectionOptions;
    /** A document specifying configuration options for clustered collections. For MongoDB 5.3 and above. */
    clusteredIndex?: ClusteredCollectionOptions;
    /** The number of seconds after which a document in a timeseries or clustered collection expires. */
    expireAfterSeconds?: number;
    /** @experimental */
    encryptedFields?: Document;
    /**
     * If set, enables pre-update and post-update document events to be included for any
     * change streams that listen on this collection.
     */
    changeStreamPreAndPostImages?: {
        enabled: boolean;
    };
}
/** @internal */
export declare class CreateCollectionOperation extends CommandOperation<Collection> {
    options: CreateCollectionOptions;
    db: Db;
    name: string;
    constructor(db: Db, name: string, options?: CreateCollectionOptions);
    get commandName(): "create";
    execute(server: Server, session: ClientSession | undefined, timeoutContext: TimeoutContext): Promise<Collection>;
    private executeWithoutEncryptedFieldsCheck;
}
//# sourceMappingURL=create_collection.d.ts.map