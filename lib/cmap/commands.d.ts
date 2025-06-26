import type { BSONSerializeOptions, Document, Long } from '../bson';
import { type ReadPreference } from '../read_preference';
import type { ClientSession } from '../sessions';
import type { CommandOptions } from './connection';
import { type CompressorName } from './wire_protocol/compression';
/** @internal */
export type WriteProtocolMessageType = OpQueryRequest | OpMsgRequest;
/** @internal */
export interface OpQueryOptions extends CommandOptions {
    socketTimeoutMS?: number;
    session?: ClientSession;
    numberToSkip?: number;
    numberToReturn?: number;
    returnFieldSelector?: Document;
    pre32Limit?: number;
    serializeFunctions?: boolean;
    ignoreUndefined?: boolean;
    maxBsonSize?: number;
    checkKeys?: boolean;
    secondaryOk?: boolean;
    requestId?: number;
    moreToCome?: boolean;
    exhaustAllowed?: boolean;
}
/** @internal */
export declare class OpQueryRequest {
    databaseName: string;
    query: Document;
    ns: string;
    numberToSkip: number;
    numberToReturn: number;
    returnFieldSelector?: Document;
    requestId: number;
    pre32Limit?: number;
    serializeFunctions: boolean;
    ignoreUndefined: boolean;
    maxBsonSize: number;
    checkKeys: boolean;
    batchSize: number;
    tailable: boolean;
    secondaryOk: boolean;
    oplogReplay: boolean;
    noCursorTimeout: boolean;
    awaitData: boolean;
    exhaust: boolean;
    partial: boolean;
    /** moreToCome is an OP_MSG only concept */
    moreToCome: boolean;
    constructor(databaseName: string, query: Document, options: OpQueryOptions);
    /** Assign next request Id. */
    incRequestId(): void;
    /** Peek next request Id. */
    nextRequestId(): number;
    /** Increment then return next request Id. */
    static getRequestId(): number;
    toBin(): Uint8Array[];
}
/** @internal */
export interface MessageHeader {
    length: number;
    requestId: number;
    responseTo: number;
    opCode: number;
    fromCompressed?: boolean;
}
/** @internal */
export declare class OpReply {
    parsed: boolean;
    raw: Buffer;
    data: Buffer;
    opts: BSONSerializeOptions;
    length: number;
    requestId: number;
    responseTo: number;
    opCode: number;
    fromCompressed?: boolean;
    responseFlags?: number;
    cursorId?: Long;
    startingFrom?: number;
    numberReturned?: number;
    cursorNotFound?: boolean;
    queryFailure?: boolean;
    shardConfigStale?: boolean;
    awaitCapable?: boolean;
    useBigInt64: boolean;
    promoteLongs: boolean;
    promoteValues: boolean;
    promoteBuffers: boolean;
    bsonRegExp?: boolean;
    index: number;
    sections: Uint8Array[];
    /** moreToCome is an OP_MSG only concept */
    moreToCome: boolean;
    constructor(message: Buffer, msgHeader: MessageHeader, msgBody: Buffer, opts?: BSONSerializeOptions);
    isParsed(): boolean;
    parse(): Uint8Array;
}
/** @internal */
export interface OpMsgOptions {
    socketTimeoutMS?: number;
    session?: ClientSession;
    numberToSkip?: number;
    numberToReturn?: number;
    returnFieldSelector?: Document;
    pre32Limit?: number;
    serializeFunctions?: boolean;
    ignoreUndefined?: boolean;
    maxBsonSize?: number;
    checkKeys?: boolean;
    secondaryOk?: boolean;
    requestId?: number;
    moreToCome?: boolean;
    exhaustAllowed?: boolean;
    readPreference: ReadPreference;
}
/** @internal */
export declare class DocumentSequence {
    field: string;
    documents: Document[];
    serializedDocumentsLength: number;
    private chunks;
    private header;
    /**
     * Create a new document sequence for the provided field.
     * @param field - The field it will replace.
     */
    constructor(field: string, documents?: Document[]);
    /**
     * Push a document to the document sequence. Will serialize the document
     * as well and return the current serialized length of all documents.
     * @param document - The document to add.
     * @param buffer - The serialized document in raw BSON.
     * @returns The new total document sequence length.
     */
    push(document: Document, buffer: Uint8Array): number;
    /**
     * Get the fully serialized bytes for the document sequence section.
     * @returns The section bytes.
     */
    toBin(): Uint8Array;
}
/** @internal */
export declare class OpMsgRequest {
    databaseName: string;
    command: Document;
    options: OpQueryOptions;
    requestId: number;
    serializeFunctions: boolean;
    ignoreUndefined: boolean;
    checkKeys: boolean;
    maxBsonSize: number;
    checksumPresent: boolean;
    moreToCome: boolean;
    exhaustAllowed: boolean;
    constructor(databaseName: string, command: Document, options: OpQueryOptions);
    toBin(): Buffer[];
    /**
     * Add the sections to the OP_MSG request's buffers and returns the length.
     */
    makeSections(buffers: Uint8Array[], document: Document): number;
    /**
     * Extracts the document sequences from the command document and returns
     * a buffer to be added as multiple sections after the initial type 0
     * section in the message.
     */
    extractDocumentSequences(document: Document): Uint8Array;
    serializeBson(document: Document): Uint8Array;
    static getRequestId(): number;
}
/** @internal */
export declare class OpMsgResponse {
    parsed: boolean;
    raw: Buffer;
    data: Buffer;
    opts: BSONSerializeOptions;
    length: number;
    requestId: number;
    responseTo: number;
    opCode: number;
    fromCompressed?: boolean;
    responseFlags: number;
    checksumPresent: boolean;
    /** Indicates the server will be sending more responses on this connection */
    moreToCome: boolean;
    exhaustAllowed: boolean;
    useBigInt64: boolean;
    promoteLongs: boolean;
    promoteValues: boolean;
    promoteBuffers: boolean;
    bsonRegExp: boolean;
    index: number;
    sections: Uint8Array[];
    constructor(message: Buffer, msgHeader: MessageHeader, msgBody: Buffer, opts?: BSONSerializeOptions);
    isParsed(): boolean;
    parse(): Uint8Array;
}
/**
 * @internal
 *
 * An OP_COMPRESSED request wraps either an OP_QUERY or OP_MSG message.
 */
export declare class OpCompressedRequest {
    private command;
    private options;
    constructor(command: WriteProtocolMessageType, options: {
        zlibCompressionLevel: number;
        agreedCompressor: CompressorName;
    });
    static canCompress(command: WriteProtocolMessageType): boolean;
    toBin(): Promise<Buffer[]>;
}
//# sourceMappingURL=commands.d.ts.map