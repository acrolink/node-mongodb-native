import { Binary, type BSONElement, BSONType, type DeserializeOptions, ObjectId, Timestamp } from '../../../bson';
/** @internal */
export type JSTypeOf = {
    [BSONType.null]: null;
    [BSONType.undefined]: null;
    [BSONType.double]: number;
    [BSONType.int]: number;
    [BSONType.long]: bigint;
    [BSONType.timestamp]: Timestamp;
    [BSONType.binData]: Binary;
    [BSONType.bool]: boolean;
    [BSONType.objectId]: ObjectId;
    [BSONType.string]: string;
    [BSONType.date]: Date;
    [BSONType.object]: OnDemandDocument;
    [BSONType.array]: OnDemandDocument;
};
/**
 * @internal
 *
 * Options for `OnDemandDocument.toObject()`. Validation is required to ensure
 * that callers provide utf8 validation options. */
export type OnDemandDocumentDeserializeOptions = Omit<DeserializeOptions, 'validation'> & Required<Pick<DeserializeOptions, 'validation'>>;
/** @internal */
export declare class OnDemandDocument {
    /** BSON bytes, this document begins at offset */
    protected readonly bson: Uint8Array;
    /** The start of the document */
    private readonly offset;
    /** If this is an embedded document, indicates if this was a BSON array */
    readonly isArray: boolean;
    /**
     * Maps JS strings to elements and jsValues for speeding up subsequent lookups.
     * - If `false` then name does not exist in the BSON document
     * - If `CachedBSONElement` instance name exists
     * - If `cache[name].value == null` jsValue has not yet been parsed
     *   - Null/Undefined values do not get cached because they are zero-length values.
     */
    private readonly cache;
    /** Caches the index of elements that have been named */
    private readonly indexFound;
    /** All bson elements in this document */
    private readonly elements;
    constructor(
    /** BSON bytes, this document begins at offset */
    bson: Uint8Array, 
    /** The start of the document */
    offset?: number, 
    /** If this is an embedded document, indicates if this was a BSON array */
    isArray?: boolean, 
    /** If elements was already calculated */
    elements?: BSONElement[]);
    /** Only supports basic latin strings */
    private isElementName;
    /**
     * Seeks into the elements array for an element matching the given name.
     *
     * @remarks
     * Caching:
     * - Caches the existence of a property making subsequent look ups for non-existent properties return immediately
     * - Caches names mapped to elements to avoid reiterating the array and comparing the name again
     * - Caches the index at which an element has been found to prevent rechecking against elements already determined to belong to another name
     *
     * @param name - a basic latin string name of a BSON element
     * @returns
     */
    private getElement;
    /**
     * Translates BSON bytes into a javascript value. Checking `as` against the BSON element's type
     * this methods returns the small subset of BSON types that the driver needs to function.
     *
     * @remarks
     * - BSONType.null and BSONType.undefined always return null
     * - If the type requested does not match this returns null
     *
     * @param element - The element to revive to a javascript value
     * @param as - A type byte expected to be returned
     */
    private toJSValue;
    /**
     * Returns the number of elements in this BSON document
     */
    size(): number;
    /**
     * Checks for the existence of an element by name.
     *
     * @remarks
     * Uses `getElement` with the expectation that will populate caches such that a `has` call
     * followed by a `getElement` call will not repeat the cost paid by the first look up.
     *
     * @param name - element name
     */
    has(name: string): boolean;
    /**
     * Turns BSON element with `name` into a javascript value.
     *
     * @typeParam T - must be one of the supported BSON types determined by `JSTypeOf` this will determine the return type of this function.
     * @param name - the element name
     * @param as - the bson type expected
     * @param required - whether or not the element is expected to exist, if true this function will throw if it is not present
     */
    get<const T extends keyof JSTypeOf>(name: string | number, as: T, required?: boolean): JSTypeOf[T] | null;
    /** `required` will make `get` throw if name does not exist or is null/undefined */
    get<const T extends keyof JSTypeOf>(name: string | number, as: T, required: true): JSTypeOf[T];
    /**
     * Supports returning int, double, long, and bool as javascript numbers
     *
     * @remarks
     * **NOTE:**
     * - Use this _only_ when you believe the potential precision loss of an int64 is acceptable
     * - This method does not cache the result as Longs or booleans would be stored incorrectly
     *
     * @param name - element name
     * @param required - throws if name does not exist
     */
    getNumber<const Req extends boolean = false>(name: string, required?: Req): Req extends true ? number : number | null;
    /**
     * Deserialize this object, DOES NOT cache result so avoid multiple invocations
     * @param options - BSON deserialization options
     */
    toObject(options?: OnDemandDocumentDeserializeOptions): Record<string, any>;
    /** Returns this document's bytes only */
    toBytes(): Uint8Array;
}
//# sourceMappingURL=document.d.ts.map