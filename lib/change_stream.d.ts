import type { Readable } from 'stream';
import type { Binary, Document, Timestamp } from './bson';
import { Collection } from './collection';
import { type CursorStreamOptions } from './cursor/abstract_cursor';
import { Db } from './db';
import { MongoClient } from './mongo_client';
import { type InferIdType, TypedEventEmitter } from './mongo_types';
import type { AggregateOptions } from './operations/aggregate';
import type { CollationOptions, OperationParent } from './operations/command';
import type { ReadPreference } from './read_preference';
import { type AsyncDisposable } from './resource_management';
import type { ServerSessionId } from './sessions';
import { type MongoDBNamespace } from './utils';
/**
 * @public
 * @deprecated Please use the ChangeStreamCursorOptions type instead.
 */
export interface ResumeOptions {
    startAtOperationTime?: Timestamp;
    batchSize?: number;
    maxAwaitTimeMS?: number;
    collation?: CollationOptions;
    readPreference?: ReadPreference;
    resumeAfter?: ResumeToken;
    startAfter?: ResumeToken;
    fullDocument?: string;
}
/**
 * Represents the logical starting point for a new ChangeStream or resuming a ChangeStream on the server.
 * @see https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume
 * @public
 */
export type ResumeToken = unknown;
/**
 * Represents a specific point in time on a server. Can be retrieved by using `db.command()`
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/method/db.runCommand/#response
 */
export type OperationTime = Timestamp;
/**
 * Options that can be passed to a ChangeStream. Note that startAfter, resumeAfter, and startAtOperationTime are all mutually exclusive, and the server will error if more than one is specified.
 * @public
 */
export interface ChangeStreamOptions extends Omit<AggregateOptions, 'writeConcern'> {
    /**
     * Allowed values: 'updateLookup', 'whenAvailable', 'required'.
     *
     * When set to 'updateLookup', the change notification for partial updates
     * will include both a delta describing the changes to the document as well
     * as a copy of the entire document that was changed from some time after
     * the change occurred.
     *
     * When set to 'whenAvailable', configures the change stream to return the
     * post-image of the modified document for replace and update change events
     * if the post-image for this event is available.
     *
     * When set to 'required', the same behavior as 'whenAvailable' except that
     * an error is raised if the post-image is not available.
     */
    fullDocument?: string;
    /**
     * Allowed values: 'whenAvailable', 'required', 'off'.
     *
     * The default is to not send a value, which is equivalent to 'off'.
     *
     * When set to 'whenAvailable', configures the change stream to return the
     * pre-image of the modified document for replace, update, and delete change
     * events if it is available.
     *
     * When set to 'required', the same behavior as 'whenAvailable' except that
     * an error is raised if the pre-image is not available.
     */
    fullDocumentBeforeChange?: string;
    /** The maximum amount of time for the server to wait on new documents to satisfy a change stream query. */
    maxAwaitTimeMS?: number;
    /**
     * Allows you to start a changeStream after a specified event.
     * @see https://www.mongodb.com/docs/manual/changeStreams/#resumeafter-for-change-streams
     */
    resumeAfter?: ResumeToken;
    /**
     * Similar to resumeAfter, but will allow you to start after an invalidated event.
     * @see https://www.mongodb.com/docs/manual/changeStreams/#startafter-for-change-streams
     */
    startAfter?: ResumeToken;
    /** Will start the changeStream after the specified operationTime. */
    startAtOperationTime?: OperationTime;
    /**
     * The number of documents to return per batch.
     * @see https://www.mongodb.com/docs/manual/reference/command/aggregate
     */
    batchSize?: number;
    /**
     * When enabled, configures the change stream to include extra change events.
     *
     * - createIndexes
     * - dropIndexes
     * - modify
     * - create
     * - shardCollection
     * - reshardCollection
     * - refineCollectionShardKey
     */
    showExpandedEvents?: boolean;
}
/** @public */
export interface ChangeStreamNameSpace {
    db: string;
    coll: string;
}
/** @public */
export interface ChangeStreamDocumentKey<TSchema extends Document = Document> {
    /**
     * For unsharded collections this contains a single field `_id`.
     * For sharded collections, this will contain all the components of the shard key
     */
    documentKey: {
        _id: InferIdType<TSchema>;
        [shardKey: string]: any;
    };
}
/** @public */
export interface ChangeStreamSplitEvent {
    /** Which fragment of the change this is. */
    fragment: number;
    /** The total number of fragments. */
    of: number;
}
/** @public */
export interface ChangeStreamDocumentCommon {
    /**
     * The id functions as an opaque token for use when resuming an interrupted
     * change stream.
     */
    _id: ResumeToken;
    /**
     * The timestamp from the oplog entry associated with the event.
     * For events that happened as part of a multi-document transaction, the associated change stream
     * notifications will have the same clusterTime value, namely the time when the transaction was committed.
     * On a sharded cluster, events that occur on different shards can have the same clusterTime but be
     * associated with different transactions or even not be associated with any transaction.
     * To identify events for a single transaction, you can use the combination of lsid and txnNumber in the change stream event document.
     */
    clusterTime?: Timestamp;
    /**
     * The transaction number.
     * Only present if the operation is part of a multi-document transaction.
     *
     * **NOTE:** txnNumber can be a Long if promoteLongs is set to false
     */
    txnNumber?: number;
    /**
     * The identifier for the session associated with the transaction.
     * Only present if the operation is part of a multi-document transaction.
     */
    lsid?: ServerSessionId;
    /**
     * When the change stream's backing aggregation pipeline contains the $changeStreamSplitLargeEvent
     * stage, events larger than 16MB will be split into multiple events and contain the
     * following information about which fragment the current event is.
     */
    splitEvent?: ChangeStreamSplitEvent;
}
/** @public */
export interface ChangeStreamDocumentCollectionUUID {
    /**
     * The UUID (Binary subtype 4) of the collection that the operation was performed on.
     *
     * Only present when the `showExpandedEvents` flag is enabled.
     *
     * **NOTE:** collectionUUID will be converted to a NodeJS Buffer if the promoteBuffers
     *    flag is enabled.
     *
     * @sinceServerVersion 6.1.0
     */
    collectionUUID: Binary;
}
/** @public */
export interface ChangeStreamDocumentOperationDescription {
    /**
     * An description of the operation.
     *
     * Only present when the `showExpandedEvents` flag is enabled.
     *
     * @sinceServerVersion 6.1.0
     */
    operationDescription?: Document;
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/#insert-event
 */
export interface ChangeStreamInsertDocument<TSchema extends Document = Document> extends ChangeStreamDocumentCommon, ChangeStreamDocumentKey<TSchema>, ChangeStreamDocumentCollectionUUID {
    /** Describes the type of operation represented in this change notification */
    operationType: 'insert';
    /** This key will contain the document being inserted */
    fullDocument: TSchema;
    /** Namespace the insert event occurred on */
    ns: ChangeStreamNameSpace;
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/#update-event
 */
export interface ChangeStreamUpdateDocument<TSchema extends Document = Document> extends ChangeStreamDocumentCommon, ChangeStreamDocumentKey<TSchema>, ChangeStreamDocumentCollectionUUID {
    /** Describes the type of operation represented in this change notification */
    operationType: 'update';
    /**
     * This is only set if `fullDocument` is set to `'updateLookup'`
     * Contains the point-in-time post-image of the modified document if the
     * post-image is available and either 'required' or 'whenAvailable' was
     * specified for the 'fullDocument' option when creating the change stream.
     */
    fullDocument?: TSchema;
    /** Contains a description of updated and removed fields in this operation */
    updateDescription: UpdateDescription<TSchema>;
    /** Namespace the update event occurred on */
    ns: ChangeStreamNameSpace;
    /**
     * Contains the pre-image of the modified or deleted document if the
     * pre-image is available for the change event and either 'required' or
     * 'whenAvailable' was specified for the 'fullDocumentBeforeChange' option
     * when creating the change stream. If 'whenAvailable' was specified but the
     * pre-image is unavailable, this will be explicitly set to null.
     */
    fullDocumentBeforeChange?: TSchema;
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/#replace-event
 */
export interface ChangeStreamReplaceDocument<TSchema extends Document = Document> extends ChangeStreamDocumentCommon, ChangeStreamDocumentKey<TSchema> {
    /** Describes the type of operation represented in this change notification */
    operationType: 'replace';
    /** The fullDocument of a replace event represents the document after the insert of the replacement document */
    fullDocument: TSchema;
    /** Namespace the replace event occurred on */
    ns: ChangeStreamNameSpace;
    /**
     * Contains the pre-image of the modified or deleted document if the
     * pre-image is available for the change event and either 'required' or
     * 'whenAvailable' was specified for the 'fullDocumentBeforeChange' option
     * when creating the change stream. If 'whenAvailable' was specified but the
     * pre-image is unavailable, this will be explicitly set to null.
     */
    fullDocumentBeforeChange?: TSchema;
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/#delete-event
 */
export interface ChangeStreamDeleteDocument<TSchema extends Document = Document> extends ChangeStreamDocumentCommon, ChangeStreamDocumentKey<TSchema>, ChangeStreamDocumentCollectionUUID {
    /** Describes the type of operation represented in this change notification */
    operationType: 'delete';
    /** Namespace the delete event occurred on */
    ns: ChangeStreamNameSpace;
    /**
     * Contains the pre-image of the modified or deleted document if the
     * pre-image is available for the change event and either 'required' or
     * 'whenAvailable' was specified for the 'fullDocumentBeforeChange' option
     * when creating the change stream. If 'whenAvailable' was specified but the
     * pre-image is unavailable, this will be explicitly set to null.
     */
    fullDocumentBeforeChange?: TSchema;
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/#drop-event
 */
export interface ChangeStreamDropDocument extends ChangeStreamDocumentCommon, ChangeStreamDocumentCollectionUUID {
    /** Describes the type of operation represented in this change notification */
    operationType: 'drop';
    /** Namespace the drop event occurred on */
    ns: ChangeStreamNameSpace;
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/#rename-event
 */
export interface ChangeStreamRenameDocument extends ChangeStreamDocumentCommon, ChangeStreamDocumentCollectionUUID {
    /** Describes the type of operation represented in this change notification */
    operationType: 'rename';
    /** The new name for the `ns.coll` collection */
    to: {
        db: string;
        coll: string;
    };
    /** The "from" namespace that the rename occurred on */
    ns: ChangeStreamNameSpace;
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/#dropdatabase-event
 */
export interface ChangeStreamDropDatabaseDocument extends ChangeStreamDocumentCommon {
    /** Describes the type of operation represented in this change notification */
    operationType: 'dropDatabase';
    /** The database dropped */
    ns: {
        db: string;
    };
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/#invalidate-event
 */
export interface ChangeStreamInvalidateDocument extends ChangeStreamDocumentCommon {
    /** Describes the type of operation represented in this change notification */
    operationType: 'invalidate';
}
/**
 * Only present when the `showExpandedEvents` flag is enabled.
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/createIndexes/#mongodb-data-createIndexes
 */
export interface ChangeStreamCreateIndexDocument extends ChangeStreamDocumentCommon, ChangeStreamDocumentCollectionUUID, ChangeStreamDocumentOperationDescription {
    /** Describes the type of operation represented in this change notification */
    operationType: 'createIndexes';
}
/**
 * Only present when the `showExpandedEvents` flag is enabled.
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/dropIndexes/#mongodb-data-dropIndexes
 */
export interface ChangeStreamDropIndexDocument extends ChangeStreamDocumentCommon, ChangeStreamDocumentCollectionUUID, ChangeStreamDocumentOperationDescription {
    /** Describes the type of operation represented in this change notification */
    operationType: 'dropIndexes';
}
/**
 * Only present when the `showExpandedEvents` flag is enabled.
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/modify/#mongodb-data-modify
 */
export interface ChangeStreamCollModDocument extends ChangeStreamDocumentCommon, ChangeStreamDocumentCollectionUUID {
    /** Describes the type of operation represented in this change notification */
    operationType: 'modify';
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/create/#mongodb-data-create
 */
export interface ChangeStreamCreateDocument extends ChangeStreamDocumentCommon, ChangeStreamDocumentCollectionUUID {
    /** Describes the type of operation represented in this change notification */
    operationType: 'create';
    /**
     * The type of the newly created object.
     *
     * @sinceServerVersion 8.1.0
     */
    nsType?: 'collection' | 'timeseries' | 'view';
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/shardCollection/#mongodb-data-shardCollection
 */
export interface ChangeStreamShardCollectionDocument extends ChangeStreamDocumentCommon, ChangeStreamDocumentCollectionUUID, ChangeStreamDocumentOperationDescription {
    /** Describes the type of operation represented in this change notification */
    operationType: 'shardCollection';
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/reshardCollection/#mongodb-data-reshardCollection
 */
export interface ChangeStreamReshardCollectionDocument extends ChangeStreamDocumentCommon, ChangeStreamDocumentCollectionUUID, ChangeStreamDocumentOperationDescription {
    /** Describes the type of operation represented in this change notification */
    operationType: 'reshardCollection';
}
/**
 * @public
 * @see https://www.mongodb.com/docs/manual/reference/change-events/refineCollectionShardKey/#mongodb-data-refineCollectionShardKey
 */
export interface ChangeStreamRefineCollectionShardKeyDocument extends ChangeStreamDocumentCommon, ChangeStreamDocumentCollectionUUID, ChangeStreamDocumentOperationDescription {
    /** Describes the type of operation represented in this change notification */
    operationType: 'refineCollectionShardKey';
}
/** @public */
export type ChangeStreamDocument<TSchema extends Document = Document> = ChangeStreamInsertDocument<TSchema> | ChangeStreamUpdateDocument<TSchema> | ChangeStreamReplaceDocument<TSchema> | ChangeStreamDeleteDocument<TSchema> | ChangeStreamDropDocument | ChangeStreamRenameDocument | ChangeStreamDropDatabaseDocument | ChangeStreamInvalidateDocument | ChangeStreamCreateIndexDocument | ChangeStreamCreateDocument | ChangeStreamCollModDocument | ChangeStreamDropIndexDocument | ChangeStreamShardCollectionDocument | ChangeStreamReshardCollectionDocument | ChangeStreamRefineCollectionShardKeyDocument;
/** @public */
export interface UpdateDescription<TSchema extends Document = Document> {
    /**
     * A document containing key:value pairs of names of the fields that were
     * changed, and the new value for those fields.
     */
    updatedFields?: Partial<TSchema>;
    /**
     * An array of field names that were removed from the document.
     */
    removedFields?: string[];
    /**
     * An array of documents which record array truncations performed with pipeline-based updates using one or more of the following stages:
     * - $addFields
     * - $set
     * - $replaceRoot
     * - $replaceWith
     */
    truncatedArrays?: Array<{
        /** The name of the truncated field. */
        field: string;
        /** The number of elements in the truncated array. */
        newSize: number;
    }>;
    /**
     * A document containing additional information about any ambiguous update paths from the update event.  The document
     * maps the full ambiguous update path to an array containing the actual resolved components of the path.  For example,
     * given a document shaped like `{ a: { '0': 0 } }`, and an update of `{ $inc: 'a.0' }`, disambiguated paths would look like
     * the following:
     *
     * ```
     *   {
     *     'a.0': ['a', '0']
     *   }
     * ```
     *
     * This field is only present when there are ambiguous paths that are updated as a part of the update event.
     *
     * On \<8.2.0 servers, this field is only present when `showExpandedEvents` is set to true.
     * is enabled for the change stream.
     *
     * On 8.2.0+ servers, this field is present for update events regardless of whether `showExpandedEvents` is enabled.
     * @sinceServerVersion 6.1.0
     */
    disambiguatedPaths?: Document;
}
/** @public */
export type ChangeStreamEvents<TSchema extends Document = Document, TChange extends Document = ChangeStreamDocument<TSchema>> = {
    resumeTokenChanged(token: ResumeToken): void;
    init(response: any): void;
    more(response?: any): void;
    response(): void;
    end(): void;
    error(error: Error): void;
    change(change: TChange): void;
    /**
     * @remarks Note that the `close` event is currently emitted whenever the internal `ChangeStreamCursor`
     * instance is closed, which can occur multiple times for a given `ChangeStream` instance.
     *
     * TODO(NODE-6434): address this issue in NODE-6434
     */
    close(): void;
};
/**
 * Creates a new Change Stream instance. Normally created using {@link Collection#watch|Collection.watch()}.
 * @public
 */
export declare class ChangeStream<TSchema extends Document = Document, TChange extends Document = ChangeStreamDocument<TSchema>> extends TypedEventEmitter<ChangeStreamEvents<TSchema, TChange>> implements AsyncDisposable {
    /**
     * @beta
     * @experimental
     * An alias for {@link ChangeStream.close|ChangeStream.close()}.
     */
    [Symbol.asyncDispose]: () => Promise<void>;
    /** @internal */
    asyncDispose(): Promise<void>;
    pipeline: Document[];
    /**
     * @remarks WriteConcern can still be present on the options because
     * we inherit options from the client/db/collection.  The
     * key must be present on the options in order to delete it.
     * This allows typescript to delete the key but will
     * not allow a writeConcern to be assigned as a property on options.
     */
    options: ChangeStreamOptions & {
        writeConcern?: never;
    };
    parent: MongoClient | Db | Collection;
    namespace: MongoDBNamespace;
    type: symbol;
    /** @internal */
    private cursor;
    streamOptions?: CursorStreamOptions;
    /** @internal */
    private cursorStream?;
    /** @internal */
    private isClosed;
    /** @internal */
    private mode;
    /** @event */
    static readonly RESPONSE: "response";
    /** @event */
    static readonly MORE: "more";
    /** @event */
    static readonly INIT: "init";
    /** @event */
    static readonly CLOSE: "close";
    /**
     * Fired for each new matching change in the specified namespace. Attaching a `change`
     * event listener to a Change Stream will switch the stream into flowing mode. Data will
     * then be passed as soon as it is available.
     * @event
     */
    static readonly CHANGE: "change";
    /** @event */
    static readonly END: "end";
    /** @event */
    static readonly ERROR: "error";
    /**
     * Emitted each time the change stream stores a new resume token.
     * @event
     */
    static readonly RESUME_TOKEN_CHANGED: "resumeTokenChanged";
    private timeoutContext?;
    /**
     * Note that this property is here to uniquely identify a ChangeStream instance as the owner of
     * the {@link CursorTimeoutContext} instance (see {@link ChangeStream._createChangeStreamCursor}) to ensure
     * that {@link AbstractCursor.close} does not mutate the timeoutContext.
     */
    private contextOwner;
    /**
     * @internal
     *
     * @param parent - The parent object that created this change stream
     * @param pipeline - An array of {@link https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents
     */
    constructor(parent: OperationParent, pipeline?: Document[], options?: ChangeStreamOptions);
    /** The cached resume token that is used to resume after the most recently returned change. */
    get resumeToken(): ResumeToken;
    /** Check if there is any document still available in the Change Stream */
    hasNext(): Promise<boolean>;
    /** Get the next available document from the Change Stream. */
    next(): Promise<TChange>;
    /**
     * Try to get the next available document from the Change Stream's cursor or `null` if an empty batch is returned
     */
    tryNext(): Promise<TChange | null>;
    [Symbol.asyncIterator](): AsyncGenerator<TChange, void, void>;
    /** Is the cursor closed */
    get closed(): boolean;
    /**
     * Frees the internal resources used by the change stream.
     */
    close(): Promise<void>;
    /**
     * Return a modified Readable stream including a possible transform method.
     *
     * NOTE: When using a Stream to process change stream events, the stream will
     * NOT automatically resume in the case a resumable error is encountered.
     *
     * @throws MongoChangeStreamError if the underlying cursor or the change stream is closed
     */
    stream(options?: CursorStreamOptions): Readable & AsyncIterable<TChange>;
    /** @internal */
    private _setIsEmitter;
    /** @internal */
    private _setIsIterator;
    /**
     * Create a new change stream cursor based on self's configuration
     * @internal
     */
    private _createChangeStreamCursor;
    /** @internal */
    private _closeEmitterModeWithError;
    /** @internal */
    private _streamEvents;
    /** @internal */
    private _endStream;
    /** @internal */
    private _processChange;
    /** @internal */
    private _processErrorStreamMode;
    /** @internal */
    private _processErrorIteratorMode;
    private _resume;
}
//# sourceMappingURL=change_stream.d.ts.map