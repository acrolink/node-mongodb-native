import { type BSONElement, type BSONSerializeOptions, type DeserializeOptions, type Document, Long, type Timestamp } from '../../bson';
import { type ClusterTime } from '../../sdam/common';
import { type JSTypeOf, OnDemandDocument, type OnDemandDocumentDeserializeOptions } from './on_demand/document';
/**
 * Accepts a BSON payload and checks for na "ok: 0" element.
 * This utility is intended to prevent calling response class constructors
 * that expect the result to be a success and demand certain properties to exist.
 *
 * For example, a cursor response always expects a cursor embedded document.
 * In order to write the class such that the properties reflect that assertion (non-null)
 * we cannot invoke the subclass constructor if the BSON represents an error.
 *
 * @param bytes - BSON document returned from the server
 */
export declare function isErrorResponse(bson: Uint8Array, elements: BSONElement[]): boolean;
/** @internal */
export type MongoDBResponseConstructor = {
    new (bson: Uint8Array, offset?: number, isArray?: boolean): MongoDBResponse;
    make(bson: Uint8Array): MongoDBResponse;
};
/** @internal */
export declare class MongoDBResponse extends OnDemandDocument {
    get<const T extends keyof JSTypeOf>(name: string | number, as: T, required?: false): JSTypeOf[T] | null;
    get<const T extends keyof JSTypeOf>(name: string | number, as: T, required: true): JSTypeOf[T];
    static is(value: unknown): value is MongoDBResponse;
    static make(bson: Uint8Array): MongoDBResponse;
    static empty: MongoDBResponse;
    /**
     * Returns true iff:
     * - ok is 0 and the top-level code === 50
     * - ok is 1 and the writeErrors array contains a code === 50
     * - ok is 1 and the writeConcern object contains a code === 50
     */
    get isMaxTimeExpiredError(): boolean;
    /**
     * Drivers can safely assume that the `recoveryToken` field is always a BSON document but drivers MUST NOT modify the
     * contents of the document.
     */
    get recoveryToken(): Document | null;
    /**
     * The server creates a cursor in response to a snapshot find/aggregate command and reports atClusterTime within the cursor field in the response.
     * For the distinct command the server adds a top-level atClusterTime field to the response.
     * The atClusterTime field represents the timestamp of the read and is guaranteed to be majority committed.
     */
    get atClusterTime(): Timestamp | null;
    get operationTime(): Timestamp | null;
    /** Normalizes whatever BSON value is "ok" to a JS number 1 or 0. */
    get ok(): 0 | 1;
    get $err(): string | null;
    get errmsg(): string | null;
    get code(): number | null;
    private clusterTime?;
    get $clusterTime(): ClusterTime | null;
    toObject(options?: BSONSerializeOptions): Record<string, any>;
}
/** @internal */
export declare class CursorResponse extends MongoDBResponse {
    /**
     * Devtools need to know which keys were encrypted before the driver automatically decrypted them.
     * If decorating is enabled (`Symbol.for('@@mdb.decorateDecryptionResult')`), this field will be set,
     * storing the original encrypted response from the server, so that we can build an object that has
     * the list of BSON keys that were encrypted stored at a well known symbol: `Symbol.for('@@mdb.decryptedKeys')`.
     */
    encryptedResponse?: MongoDBResponse;
    /**
     * This supports a feature of the FindCursor.
     * It is an optimization to avoid an extra getMore when the limit has been reached
     */
    static get emptyGetMore(): CursorResponse;
    static is(value: unknown): value is CursorResponse;
    private _batch;
    private iterated;
    get cursor(): OnDemandDocument;
    get id(): Long;
    get ns(): import("../../utils").MongoDBNamespace | null;
    get length(): number;
    private _encryptedBatch;
    get encryptedBatch(): OnDemandDocument | null;
    private get batch();
    get batchSize(): number;
    get postBatchResumeToken(): Record<string, any> | null;
    shift(options: OnDemandDocumentDeserializeOptions): any;
    clear(): void;
}
/**
 * Explain responses have nothing to do with cursor responses
 * This class serves to temporarily avoid refactoring how cursors handle
 * explain responses which is to detect that the response is not cursor-like and return the explain
 * result as the "first and only" document in the "batch" and end the "cursor"
 */
export declare class ExplainedCursorResponse extends CursorResponse {
    isExplain: boolean;
    get id(): Long;
    get batchSize(): number;
    get ns(): null;
    _length: number;
    get length(): number;
    shift(options?: DeserializeOptions): Record<string, any> | null;
}
/**
 * Client bulk writes have some extra metadata at the top level that needs to be
 * included in the result returned to the user.
 */
export declare class ClientBulkWriteCursorResponse extends CursorResponse {
    get insertedCount(): number;
    get upsertedCount(): number;
    get matchedCount(): number;
    get modifiedCount(): number;
    get deletedCount(): number;
    get writeConcernError(): OnDemandDocument | null;
}
//# sourceMappingURL=responses.d.ts.map