import type { Document } from './bson';
import type { TagSet } from './sdam/server_description';
import type { ClientSession } from './sessions';
/** @public */
export type ReadPreferenceLike = ReadPreference | ReadPreferenceMode;
/** @public */
export declare const ReadPreferenceMode: Readonly<{
    readonly primary: "primary";
    readonly primaryPreferred: "primaryPreferred";
    readonly secondary: "secondary";
    readonly secondaryPreferred: "secondaryPreferred";
    readonly nearest: "nearest";
}>;
/** @public */
export type ReadPreferenceMode = (typeof ReadPreferenceMode)[keyof typeof ReadPreferenceMode];
/** @public */
export interface HedgeOptions {
    /** Explicitly enable or disable hedged reads. */
    enabled?: boolean;
}
/** @public */
export interface ReadPreferenceOptions {
    /** Max secondary read staleness in seconds, Minimum value is 90 seconds.*/
    maxStalenessSeconds?: number;
    /** Server mode in which the same query is dispatched in parallel to multiple replica set members. */
    hedge?: HedgeOptions;
}
/** @public */
export interface ReadPreferenceLikeOptions extends ReadPreferenceOptions {
    readPreference?: ReadPreferenceLike | {
        mode?: ReadPreferenceMode;
        preference?: ReadPreferenceMode;
        tags?: TagSet[];
        maxStalenessSeconds?: number;
    };
}
/** @public */
export interface ReadPreferenceFromOptions extends ReadPreferenceLikeOptions {
    session?: ClientSession;
    readPreferenceTags?: TagSet[];
    hedge?: HedgeOptions;
}
/**
 * The **ReadPreference** class is a class that represents a MongoDB ReadPreference and is
 * used to construct connections.
 * @public
 *
 * @see https://www.mongodb.com/docs/manual/core/read-preference/
 */
export declare class ReadPreference {
    mode: ReadPreferenceMode;
    tags?: TagSet[];
    hedge?: HedgeOptions;
    maxStalenessSeconds?: number;
    minWireVersion?: number;
    static PRIMARY: "primary";
    static PRIMARY_PREFERRED: "primaryPreferred";
    static SECONDARY: "secondary";
    static SECONDARY_PREFERRED: "secondaryPreferred";
    static NEAREST: "nearest";
    static primary: ReadPreference;
    static primaryPreferred: ReadPreference;
    static secondary: ReadPreference;
    static secondaryPreferred: ReadPreference;
    static nearest: ReadPreference;
    /**
     * @param mode - A string describing the read preference mode (primary|primaryPreferred|secondary|secondaryPreferred|nearest)
     * @param tags - A tag set used to target reads to members with the specified tag(s). tagSet is not available if using read preference mode primary.
     * @param options - Additional read preference options
     */
    constructor(mode: ReadPreferenceMode, tags?: TagSet[], options?: ReadPreferenceOptions);
    get preference(): ReadPreferenceMode;
    static fromString(mode: string): ReadPreference;
    /**
     * Construct a ReadPreference given an options object.
     *
     * @param options - The options object from which to extract the read preference.
     */
    static fromOptions(options?: ReadPreferenceFromOptions): ReadPreference | undefined;
    /**
     * Replaces options.readPreference with a ReadPreference instance
     */
    static translate(options: ReadPreferenceLikeOptions): ReadPreferenceLikeOptions;
    /**
     * Validate if a mode is legal
     *
     * @param mode - The string representing the read preference mode.
     */
    static isValid(mode: string): boolean;
    /**
     * Validate if a mode is legal
     *
     * @param mode - The string representing the read preference mode.
     */
    isValid(mode?: string): boolean;
    /**
     * Indicates that this readPreference needs the "SecondaryOk" bit when sent over the wire
     * @see https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/#op-query
     */
    secondaryOk(): boolean;
    /**
     * Check if the two ReadPreferences are equivalent
     *
     * @param readPreference - The read preference with which to check equality
     */
    equals(readPreference: ReadPreference): boolean;
    /** Return JSON representation */
    toJSON(): Document;
}
//# sourceMappingURL=read_preference.d.ts.map