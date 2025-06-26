import { OpMsgResponse, OpReply, type WriteProtocolMessageType } from '../commands';
/** @public */
export declare const Compressor: Readonly<{
    readonly none: 0;
    readonly snappy: 1;
    readonly zlib: 2;
    readonly zstd: 3;
}>;
/** @public */
export type Compressor = (typeof Compressor)[CompressorName];
/** @public */
export type CompressorName = keyof typeof Compressor;
export declare const uncompressibleCommands: Set<string>;
export declare function compress(options: {
    zlibCompressionLevel: number;
    agreedCompressor: CompressorName;
}, dataToBeCompressed: Buffer): Promise<Buffer>;
export declare function decompress(compressorID: number, compressedData: Buffer): Promise<Buffer>;
/**
 * @internal
 *
 * Compresses an OP_MSG or OP_QUERY message, if compression is configured.  This method
 * also serializes the command to BSON.
 */
export declare function compressCommand(command: WriteProtocolMessageType, description: {
    agreedCompressor?: CompressorName;
    zlibCompressionLevel?: number;
}): Promise<Buffer>;
/**
 * @internal
 *
 * Decompresses an OP_MSG or OP_QUERY response from the server, if compression is configured.
 *
 * This method does not parse the response's BSON.
 */
export declare function decompressResponse(message: Buffer): Promise<OpMsgResponse | OpReply>;
//# sourceMappingURL=compression.d.ts.map