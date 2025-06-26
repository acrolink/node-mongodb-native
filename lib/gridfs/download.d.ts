import { Readable } from 'stream';
import type { Document, ObjectId } from '../bson';
import type { Collection } from '../collection';
import type { FindCursor } from '../cursor/find_cursor';
import type { ReadPreference } from '../read_preference';
import type { Sort } from '../sort';
import { CSOTTimeoutContext } from '../timeout';
import type { GridFSChunk } from './upload';
/** @public */
export interface GridFSBucketReadStreamOptions {
    sort?: Sort;
    skip?: number;
    /**
     * 0-indexed non-negative byte offset from the beginning of the file
     */
    start?: number;
    /**
     * 0-indexed non-negative byte offset to the end of the file contents
     * to be returned by the stream. `end` is non-inclusive
     */
    end?: number;
    /**
     * @experimental
     * Specifies the time an operation will run until it throws a timeout error
     */
    timeoutMS?: number;
}
/** @public */
export interface GridFSBucketReadStreamOptionsWithRevision extends GridFSBucketReadStreamOptions {
    /** The revision number relative to the oldest file with the given filename. 0
     * gets you the oldest file, 1 gets you the 2nd oldest, -1 gets you the
     * newest. */
    revision?: number;
}
/** @public */
export interface GridFSFile {
    _id: ObjectId;
    length: number;
    chunkSize: number;
    filename: string;
    metadata?: Document;
    uploadDate: Date;
    /** @deprecated Will be removed in the next major version. */
    contentType?: string;
    /** @deprecated Will be removed in the next major version. */
    aliases?: string[];
}
/** @internal */
export interface GridFSBucketReadStreamPrivate {
    /**
     * The running total number of bytes read from the chunks collection.
     */
    bytesRead: number;
    /**
     * The number of bytes to remove from the last chunk read in the file.  This is non-zero
     * if `end` is not equal to the length of the document and `end` is not a multiple
     * of the chunkSize.
     */
    bytesToTrim: number;
    /**
     * The number of bytes to remove from the first chunk read in the file.  This is non-zero
     * if `start` is not equal to the 0  and `start` is not a multiple
     * of the chunkSize.
     */
    bytesToSkip: number;
    files: Collection<GridFSFile>;
    chunks: Collection<GridFSChunk>;
    cursor?: FindCursor<GridFSChunk>;
    /** The running total number of chunks read from the chunks collection. */
    expected: number;
    /**
     * The filter used to search in the _files_ collection (i.e., `{ _id: <> }`)
     * This is not the same filter used when reading chunks from the chunks collection.
     */
    filter: Document;
    /** Indicates whether or not download has started. */
    init: boolean;
    /** The expected number of chunks to read, calculated from start, end, chunkSize and file length. */
    expectedEnd: number;
    file?: GridFSFile;
    options: {
        sort?: Sort;
        skip?: number;
        start: number;
        end: number;
        timeoutMS?: number;
    };
    readPreference?: ReadPreference;
    timeoutContext?: CSOTTimeoutContext;
}
/**
 * A readable stream that enables you to read buffers from GridFS.
 *
 * Do not instantiate this class directly. Use `openDownloadStream()` instead.
 * @public
 */
export declare class GridFSBucketReadStream extends Readable {
    /** @internal */
    s: GridFSBucketReadStreamPrivate;
    /**
     * Fires when the stream loaded the file document corresponding to the provided id.
     * @event
     */
    static readonly FILE: "file";
    /**
     * @param chunks - Handle for chunks collection
     * @param files - Handle for files collection
     * @param readPreference - The read preference to use
     * @param filter - The filter to use to find the file document
     * @internal
     */
    constructor(chunks: Collection<GridFSChunk>, files: Collection<GridFSFile>, readPreference: ReadPreference | undefined, filter: Document, options?: GridFSBucketReadStreamOptions);
    /**
     * Reads from the cursor and pushes to the stream.
     * Private Impl, do not call directly
     * @internal
     */
    _read(): void;
    /**
     * Sets the 0-based offset in bytes to start streaming from. Throws
     * an error if this stream has entered flowing mode
     * (e.g. if you've already called `on('data')`)
     *
     * @param start - 0-based offset in bytes to start streaming from
     */
    start(start?: number): this;
    /**
     * Sets the 0-based offset in bytes to start streaming from. Throws
     * an error if this stream has entered flowing mode
     * (e.g. if you've already called `on('data')`)
     *
     * @param end - Offset in bytes to stop reading at
     */
    end(end?: number): this;
    /**
     * Marks this stream as aborted (will never push another `data` event)
     * and kills the underlying cursor. Will emit the 'end' event, and then
     * the 'close' event once the cursor is successfully killed.
     */
    abort(): Promise<void>;
}
//# sourceMappingURL=download.d.ts.map