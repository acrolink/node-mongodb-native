import { type Document, Long, type ObjectId } from '../bson';
import { type MongoError } from '../error';
import { HostAddress } from '../utils';
import { type ClusterTime, ServerType } from './common';
/** @public */
export interface TopologyVersion {
    processId: ObjectId;
    counter: Long;
}
/** @public */
export type TagSet = {
    [key: string]: string;
};
/** @internal */
export interface ServerDescriptionOptions {
    /** An Error used for better reporting debugging */
    error?: MongoError;
    /** The average round trip time to ping this server (in ms) */
    roundTripTime?: number;
    /** The minimum round trip time to ping this server over the past 10 samples(in ms) */
    minRoundTripTime?: number;
    /** If the client is in load balancing mode. */
    loadBalanced?: boolean;
}
/**
 * The client's view of a single server, based on the most recent hello outcome.
 *
 * Internal type, not meant to be directly instantiated
 * @public
 */
export declare class ServerDescription {
    address: string;
    type: ServerType;
    hosts: string[];
    passives: string[];
    arbiters: string[];
    tags: TagSet;
    error: MongoError | null;
    topologyVersion: TopologyVersion | null;
    minWireVersion: number;
    maxWireVersion: number;
    roundTripTime: number;
    /** The minimum measurement of the last 10 measurements of roundTripTime that have been collected */
    minRoundTripTime: number;
    lastUpdateTime: number;
    lastWriteDate: number;
    me: string | null;
    primary: string | null;
    setName: string | null;
    setVersion: number | null;
    electionId: ObjectId | null;
    logicalSessionTimeoutMinutes: number | null;
    /** The max message size in bytes for the server. */
    maxMessageSizeBytes: number | null;
    /** The max number of writes in a bulk write command. */
    maxWriteBatchSize: number | null;
    /** The max bson object size. */
    maxBsonObjectSize: number | null;
    /** Indicates server is a mongocryptd instance. */
    iscryptd: boolean;
    $clusterTime?: ClusterTime;
    /**
     * Create a ServerDescription
     * @internal
     *
     * @param address - The address of the server
     * @param hello - An optional hello response for this server
     */
    constructor(address: HostAddress | string, hello?: Document, options?: ServerDescriptionOptions);
    get hostAddress(): HostAddress;
    get allHosts(): string[];
    /** Is this server available for reads*/
    get isReadable(): boolean;
    /** Is this server data bearing */
    get isDataBearing(): boolean;
    /** Is this server available for writes */
    get isWritable(): boolean;
    get host(): string;
    get port(): number;
    /**
     * Determines if another `ServerDescription` is equal to this one per the rules defined in the SDAM specification.
     * @see https://github.com/mongodb/specifications/blob/master/source/server-discovery-and-monitoring/server-discovery-and-monitoring.md
     */
    equals(other?: ServerDescription | null): boolean;
}
export declare function parseServerType(hello?: Document, options?: ServerDescriptionOptions): ServerType;
/**
 * Compares two topology versions.
 *
 * 1. If the response topologyVersion is unset or the ServerDescription's
 *    topologyVersion is null, the client MUST assume the response is more recent.
 * 1. If the response's topologyVersion.processId is not equal to the
 *    ServerDescription's, the client MUST assume the response is more recent.
 * 1. If the response's topologyVersion.processId is equal to the
 *    ServerDescription's, the client MUST use the counter field to determine
 *    which topologyVersion is more recent.
 *
 * ```ts
 * currentTv <   newTv === -1
 * currentTv === newTv === 0
 * currentTv >   newTv === 1
 * ```
 */
export declare function compareTopologyVersion(currentTv?: TopologyVersion | null, newTv?: TopologyVersion | null): 0 | -1 | 1;
//# sourceMappingURL=server_description.d.ts.map