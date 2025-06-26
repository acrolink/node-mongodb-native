import { BSON, type DeserializeOptions, type SerializeOptions } from 'bson';
export { Binary, BSON, BSONError, BSONRegExp, BSONSymbol, BSONType, calculateObjectSize, Code, DBRef, Decimal128, deserialize, type DeserializeOptions, Document, Double, EJSON, EJSONOptions, Int32, Long, MaxKey, MinKey, ObjectId, type ObjectIdLike, serialize, Timestamp, UUID } from 'bson';
/** @internal */
export type BSONElement = BSON.OnDemand['BSONElement'];
export declare function parseToElementsToArray(bytes: Uint8Array, offset?: number): BSONElement[];
export declare const getInt32LE: (source: Uint8Array, offset: number) => number;
export declare const getFloat64LE: (source: Uint8Array, offset: number) => number;
export declare const getBigInt64LE: (source: Uint8Array, offset: number) => bigint;
export declare const toUTF8: (buffer: Uint8Array, start: number, end: number, fatal: boolean) => string;
/**
 * BSON Serialization options.
 * @public
 */
export interface BSONSerializeOptions extends Omit<SerializeOptions, 'index'>, Omit<DeserializeOptions, 'evalFunctions' | 'cacheFunctions' | 'cacheFunctionsCrc32' | 'allowObjectSmallerThanBufferSize' | 'index' | 'validation'> {
    /**
     * Enabling the raw option will return a [Node.js Buffer](https://nodejs.org/api/buffer.html)
     * which is allocated using [allocUnsafe API](https://nodejs.org/api/buffer.html#static-method-bufferallocunsafesize).
     * See this section from the [Node.js Docs here](https://nodejs.org/api/buffer.html#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-unsafe)
     * for more detail about what "unsafe" refers to in this context.
     * If you need to maintain your own editable clone of the bytes returned for an extended life time of the process, it is recommended you allocate
     * your own buffer and clone the contents:
     *
     * @example
     * ```ts
     * const raw = await collection.findOne({}, { raw: true });
     * const myBuffer = Buffer.alloc(raw.byteLength);
     * myBuffer.set(raw, 0);
     * // Only save and use `myBuffer` beyond this point
     * ```
     *
     * @remarks
     * Please note there is a known limitation where this option cannot be used at the MongoClient level (see [NODE-3946](https://jira.mongodb.org/browse/NODE-3946)).
     * It does correctly work at `Db`, `Collection`, and per operation the same as other BSON options work.
     */
    raw?: boolean;
    /** Enable utf8 validation when deserializing BSON documents.  Defaults to true. */
    enableUtf8Validation?: boolean;
}
export declare function pluckBSONSerializeOptions(options: BSONSerializeOptions): BSONSerializeOptions;
/**
 * Merge the given BSONSerializeOptions, preferring options over the parent's options, and
 * substituting defaults for values not set.
 *
 * @internal
 */
export declare function resolveBSONOptions(options?: BSONSerializeOptions, parent?: {
    bsonOptions?: BSONSerializeOptions;
}): BSONSerializeOptions;
/** @internal */
export declare function parseUtf8ValidationOption(options?: {
    enableUtf8Validation?: boolean;
}): {
    utf8: {
        writeErrors: false;
    } | false;
};
//# sourceMappingURL=bson.d.ts.map