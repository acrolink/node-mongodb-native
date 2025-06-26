import { Writable } from 'stream';
import { type Document, ObjectId } from '../bson';
import type { Collection } from '../collection';
import { CSOTTimeoutContext } from '../timeout';
import { type Callback } from '../utils';
import type { WriteConcernOptions } from '../write_concern';
import { WriteConcern } from './../write_concern';
import type { GridFSFile } from './download';
import type { GridFSBucket } from './index';
/** @public */
export interface GridFSChunk {
    _id: ObjectId;
    files_id: ObjectId;
    n: number;
    data: Buffer | Uint8Array;
}
/** @public */
export interface GridFSBucketWriteStreamOptions extends WriteConcernOptions {
    /** Overwrite this bucket's chunkSizeBytes for this file */
    chunkSizeBytes?: number;
    /** Custom file id for the GridFS file. */
    id?: ObjectId;
    /** Object to store in the file document's `metadata` field */
    metadata?: Document;
    /**
     * String to store in the file document's `contentType` field.
     * @deprecated Will be removed in the next major version. Add a contentType field to the metadata document instead.
     */
    contentType?: string;
    /**
     * Array of strings to store in the file document's `aliases` field.
     * @deprecated Will be removed in the next major version. Add an aliases field to the metadata document instead.
     */
    aliases?: string[];
    /**
     * @experimental
     * Specifies the time an operation will run until it throws a timeout error
     */
    timeoutMS?: number;
}
/**
 * A writable stream that enables you to write buffers to GridFS.
 *
 * Do not instantiate this class directly. Use `openUploadStream()` instead.
 * @public
 */
export declare class GridFSBucketWriteStream extends Writable {
    bucket: GridFSBucket;
    /** A Collection instance where the file's chunks are stored */
    chunks: Collection<GridFSChunk>;
    /** A Collection instance where the file's GridFSFile document is stored */
    files: Collection<GridFSFile>;
    /** The name of the file */
    filename: string;
    /** Options controlling the metadata inserted along with the file */
    options: GridFSBucketWriteStreamOptions;
    /** Indicates the stream is finished uploading */
    done: boolean;
    /** The ObjectId used for the `_id` field on the GridFSFile document */
    id: ObjectId;
    /** The number of bytes that each chunk will be limited to */
    chunkSizeBytes: number;
    /** Space used to store a chunk currently being inserted */
    bufToStore: Buffer;
    /** Accumulates the number of bytes inserted as the stream uploads chunks */
    length: number;
    /** Accumulates the number of chunks inserted as the stream uploads file contents */
    n: number;
    /** Tracks the current offset into the buffered bytes being uploaded */
    pos: number;
    /** Contains a number of properties indicating the current state of the stream */
    state: {
        /** If set the stream has ended */
        streamEnd: boolean;
        /** Indicates the number of chunks that still need to be inserted to exhaust the current buffered data */
        outstandingRequests: number;
        /** If set an error occurred during insertion */
        errored: boolean;
        /** If set the stream was intentionally aborted */
        aborted: boolean;
    };
    /** The write concern setting to be used with every insert operation */
    writeConcern?: WriteConcern;
    /**
     * The document containing information about the inserted file.
     * This property is defined _after_ the finish event has been emitted.
     * It will remain `null` if an error occurs.
     *
     * @example
     * ```ts
     * fs.createReadStream('file.txt')
     *   .pipe(bucket.openUploadStream('file.txt'))
     *   .on('finish', function () {
     *     console.log(this.gridFSFile)
     *   })
     * ```
     */
    gridFSFile: GridFSFile | null;
    /** @internal */
    timeoutContext?: CSOTTimeoutContext;
    /**
     * @param bucket - Handle for this stream's corresponding bucket
     * @param filename - The value of the 'filename' key in the files doc
     * @param options - Optional settings.
     * @internal
     */
    constructor(bucket: GridFSBucket, filename: string, options?: GridFSBucketWriteStreamOptions);
    /**
     * @internal
     *
     * The stream is considered constructed when the indexes are done being created
     */
    _construct(callback: (error?: Error | null) => void): void;
    /**
     * @internal
     * Write a buffer to the stream.
     *
     * @param chunk - Buffer to write
     * @param encoding - Optional encoding for the buffer
     * @param callback - Function to call when the chunk was added to the buffer, or if the entire chunk was persisted to MongoDB if this chunk caused a flush.
     */
    _write(chunk: Buffer | string, encoding: BufferEncoding, callback: Callback<void>): void;
    /** @internal */
    _final(callback: (error?: Error | null) => void): void;
    /**
     * Places this write stream into an aborted state (all future writes fail)
     * and deletes all chunks that have already been written.
     */
    abort(): Promise<void>;
}
//# sourceMappingURL=upload.d.ts.map