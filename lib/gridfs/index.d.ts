import type { ObjectId } from '../bson';
import type { Collection } from '../collection';
import type { FindCursor } from '../cursor/find_cursor';
import type { Db } from '../db';
import { type Filter, TypedEventEmitter } from '../mongo_types';
import type { ReadPreference } from '../read_preference';
import { WriteConcern, type WriteConcernOptions } from '../write_concern';
import type { FindOptions } from './../operations/find';
import { GridFSBucketReadStream, type GridFSBucketReadStreamOptions, type GridFSBucketReadStreamOptionsWithRevision, type GridFSFile } from './download';
import { GridFSBucketWriteStream, type GridFSBucketWriteStreamOptions, type GridFSChunk } from './upload';
/** @public */
export interface GridFSBucketOptions extends WriteConcernOptions {
    /** The 'files' and 'chunks' collections will be prefixed with the bucket name followed by a dot. */
    bucketName?: string;
    /** Number of bytes stored in each chunk. Defaults to 255KB */
    chunkSizeBytes?: number;
    /** Read preference to be passed to read operations */
    readPreference?: ReadPreference;
    /**
     * @experimental
     * Specifies the lifetime duration of a gridFS stream. If any async operations are in progress
     * when this timeout expires, the stream will throw a timeout error.
     */
    timeoutMS?: number;
}
/** @internal */
export interface GridFSBucketPrivate {
    db: Db;
    options: {
        bucketName: string;
        chunkSizeBytes: number;
        readPreference?: ReadPreference;
        writeConcern: WriteConcern | undefined;
        timeoutMS?: number;
    };
    _chunksCollection: Collection<GridFSChunk>;
    _filesCollection: Collection<GridFSFile>;
    checkedIndexes: boolean;
    calledOpenUploadStream: boolean;
}
/** @public */
export type GridFSBucketEvents = {
    index(): void;
};
/**
 * Constructor for a streaming GridFS interface
 * @public
 */
export declare class GridFSBucket extends TypedEventEmitter<GridFSBucketEvents> {
    /** @internal */
    s: GridFSBucketPrivate;
    /**
     * When the first call to openUploadStream is made, the upload stream will
     * check to see if it needs to create the proper indexes on the chunks and
     * files collections. This event is fired either when 1) it determines that
     * no index creation is necessary, 2) when it successfully creates the
     * necessary indexes.
     * @event
     */
    static readonly INDEX: "index";
    constructor(db: Db, options?: GridFSBucketOptions);
    /**
     * Returns a writable stream (GridFSBucketWriteStream) for writing
     * buffers to GridFS. The stream's 'id' property contains the resulting
     * file's id.
     *
     * @param filename - The value of the 'filename' key in the files doc
     * @param options - Optional settings.
     */
    openUploadStream(filename: string, options?: GridFSBucketWriteStreamOptions): GridFSBucketWriteStream;
    /**
     * Returns a writable stream (GridFSBucketWriteStream) for writing
     * buffers to GridFS for a custom file id. The stream's 'id' property contains the resulting
     * file's id.
     */
    openUploadStreamWithId(id: ObjectId, filename: string, options?: GridFSBucketWriteStreamOptions): GridFSBucketWriteStream;
    /** Returns a readable stream (GridFSBucketReadStream) for streaming file data from GridFS. */
    openDownloadStream(id: ObjectId, options?: GridFSBucketReadStreamOptions): GridFSBucketReadStream;
    /**
     * Deletes a file with the given id
     *
     * @param id - The id of the file doc
     */
    delete(id: ObjectId, options?: {
        timeoutMS: number;
    }): Promise<void>;
    /** Convenience wrapper around find on the files collection */
    find(filter?: Filter<GridFSFile>, options?: FindOptions): FindCursor<GridFSFile>;
    /**
     * Returns a readable stream (GridFSBucketReadStream) for streaming the
     * file with the given name from GridFS. If there are multiple files with
     * the same name, this will stream the most recent file with the given name
     * (as determined by the `uploadDate` field). You can set the `revision`
     * option to change this behavior.
     */
    openDownloadStreamByName(filename: string, options?: GridFSBucketReadStreamOptionsWithRevision): GridFSBucketReadStream;
    /**
     * Renames the file with the given _id to the given string
     *
     * @param id - the id of the file to rename
     * @param filename - new name for the file
     */
    rename(id: ObjectId, filename: string, options?: {
        timeoutMS: number;
    }): Promise<void>;
    /** Removes this bucket's files collection, followed by its chunks collection. */
    drop(options?: {
        timeoutMS: number;
    }): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map