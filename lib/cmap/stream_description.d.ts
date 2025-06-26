import { type Document, type Double, Long } from '../bson';
import { ServerType } from '../sdam/common';
import type { CompressorName } from './wire_protocol/compression';
/** @public */
export interface StreamDescriptionOptions {
    compressors?: CompressorName[];
    logicalSessionTimeoutMinutes?: number;
    loadBalanced: boolean;
}
/** @public */
export declare class StreamDescription {
    address: string;
    type: ServerType;
    minWireVersion?: number;
    maxWireVersion?: number;
    maxBsonObjectSize: number;
    maxMessageSizeBytes: number;
    maxWriteBatchSize: number;
    compressors: CompressorName[];
    compressor?: CompressorName;
    logicalSessionTimeoutMinutes?: number;
    loadBalanced: boolean;
    __nodejs_mock_server__?: boolean;
    zlibCompressionLevel?: number;
    serverConnectionId: bigint | null;
    hello: Document | null;
    constructor(address: string, options?: StreamDescriptionOptions);
    receiveResponse(response: Document | null): void;
    parseServerConnectionID(serverConnectionId: number | Double | bigint | Long): bigint;
}
//# sourceMappingURL=stream_description.d.ts.map