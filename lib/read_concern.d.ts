import type { Document } from './bson';
/** @public */
export declare const ReadConcernLevel: Readonly<{
    readonly local: "local";
    readonly majority: "majority";
    readonly linearizable: "linearizable";
    readonly available: "available";
    readonly snapshot: "snapshot";
}>;
/** @public */
export type ReadConcernLevel = (typeof ReadConcernLevel)[keyof typeof ReadConcernLevel];
/** @public */
export type ReadConcernLike = ReadConcern | {
    level: ReadConcernLevel;
} | ReadConcernLevel;
/**
 * The MongoDB ReadConcern, which allows for control of the consistency and isolation properties
 * of the data read from replica sets and replica set shards.
 * @public
 *
 * @see https://www.mongodb.com/docs/manual/reference/read-concern/index.html
 */
export declare class ReadConcern {
    level: ReadConcernLevel | string;
    /** Constructs a ReadConcern from the read concern level.*/
    constructor(level: ReadConcernLevel);
    /**
     * Construct a ReadConcern given an options object.
     *
     * @param options - The options object from which to extract the write concern.
     */
    static fromOptions(options?: {
        readConcern?: ReadConcernLike;
        level?: ReadConcernLevel;
    }): ReadConcern | undefined;
    static get MAJORITY(): 'majority';
    static get AVAILABLE(): 'available';
    static get LINEARIZABLE(): 'linearizable';
    static get SNAPSHOT(): 'snapshot';
    toJSON(): Document;
}
//# sourceMappingURL=read_concern.d.ts.map