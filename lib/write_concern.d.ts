import { type Document } from './bson';
/** @public */
export type W = number | 'majority';
/** @public */
export interface WriteConcernOptions {
    /** Write Concern as an object */
    writeConcern?: WriteConcern | WriteConcernSettings;
}
/** @public */
export interface WriteConcernSettings {
    /** The write concern */
    w?: W;
    /**
     * The write concern timeout.
     */
    wtimeoutMS?: number;
    /** The journal write concern */
    journal?: boolean;
    /**
     * The journal write concern.
     * @deprecated Will be removed in the next major version. Please use the journal option.
     */
    j?: boolean;
    /**
     * The write concern timeout.
     */
    wtimeout?: number;
    /**
     * The file sync write concern.
     * @deprecated Will be removed in the next major version. Please use the journal option.
     */
    fsync?: boolean | 1;
}
export declare const WRITE_CONCERN_KEYS: string[];
/**
 * A MongoDB WriteConcern, which describes the level of acknowledgement
 * requested from MongoDB for write operations.
 * @public
 *
 * @see https://www.mongodb.com/docs/manual/reference/write-concern/
 */
export declare class WriteConcern {
    /**
     * Request acknowledgment that the write operation has propagated to a specified number of mongod instances or to mongod instances with specified tags.
     * If w is 0 and is set on a write operation, the server will not send a response.
     */
    readonly w?: W;
    /** Request acknowledgment that the write operation has been written to the on-disk journal */
    readonly journal?: boolean;
    /**
     * Specify a time limit to prevent write operations from blocking indefinitely.
     */
    readonly wtimeoutMS?: number;
    /**
     * Specify a time limit to prevent write operations from blocking indefinitely.
     * @deprecated Will be removed in the next major version. Please use wtimeoutMS.
     */
    wtimeout?: number;
    /**
     * Request acknowledgment that the write operation has been written to the on-disk journal.
     * @deprecated Will be removed in the next major version. Please use journal.
     */
    j?: boolean;
    /**
     * Equivalent to the j option.
     * @deprecated Will be removed in the next major version. Please use journal.
     */
    fsync?: boolean | 1;
    /**
     * Constructs a WriteConcern from the write concern properties.
     * @param w - request acknowledgment that the write operation has propagated to a specified number of mongod instances or to mongod instances with specified tags.
     * @param wtimeoutMS - specify a time limit to prevent write operations from blocking indefinitely
     * @param journal - request acknowledgment that the write operation has been written to the on-disk journal
     * @param fsync - equivalent to the j option. Is deprecated and will be removed in the next major version.
     */
    constructor(w?: W, wtimeoutMS?: number, journal?: boolean, fsync?: boolean | 1);
    /**
     * Apply a write concern to a command document. Will modify and return the command.
     */
    static apply(command: Document, writeConcern: WriteConcern): Document;
    /** Construct a WriteConcern given an options object. */
    static fromOptions(options?: WriteConcernOptions | WriteConcern | W, inherit?: WriteConcernOptions | WriteConcern): WriteConcern | undefined;
}
/** Called with either a plain object or MongoDBResponse */
export declare function throwIfWriteConcernError(response: unknown): void;
//# sourceMappingURL=write_concern.d.ts.map