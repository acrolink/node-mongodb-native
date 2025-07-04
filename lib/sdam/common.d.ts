import type { Binary, Long, Timestamp } from '../bson';
import type { ClientSession } from '../sessions';
import type { Topology } from './topology';
export declare const STATE_CLOSING = "closing";
export declare const STATE_CLOSED = "closed";
export declare const STATE_CONNECTING = "connecting";
export declare const STATE_CONNECTED = "connected";
/**
 * An enumeration of topology types we know about
 * @public
 */
export declare const TopologyType: Readonly<{
    readonly Single: "Single";
    readonly ReplicaSetNoPrimary: "ReplicaSetNoPrimary";
    readonly ReplicaSetWithPrimary: "ReplicaSetWithPrimary";
    readonly Sharded: "Sharded";
    readonly Unknown: "Unknown";
    readonly LoadBalanced: "LoadBalanced";
}>;
/** @public */
export type TopologyType = (typeof TopologyType)[keyof typeof TopologyType];
/**
 * An enumeration of server types we know about
 * @public
 */
export declare const ServerType: Readonly<{
    readonly Standalone: "Standalone";
    readonly Mongos: "Mongos";
    readonly PossiblePrimary: "PossiblePrimary";
    readonly RSPrimary: "RSPrimary";
    readonly RSSecondary: "RSSecondary";
    readonly RSArbiter: "RSArbiter";
    readonly RSOther: "RSOther";
    readonly RSGhost: "RSGhost";
    readonly Unknown: "Unknown";
    readonly LoadBalancer: "LoadBalancer";
}>;
/** @public */
export type ServerType = (typeof ServerType)[keyof typeof ServerType];
/**
 * @public
 * Gossiped in component for the cluster time tracking the state of user databases
 * across the cluster. It may optionally include a signature identifying the process that
 * generated such a value.
 */
export interface ClusterTime {
    clusterTime: Timestamp;
    /** Used to validate the identity of a request or response's ClusterTime. */
    signature?: {
        hash: Binary;
        keyId: Long;
    };
}
/** Shared function to determine clusterTime for a given topology or session */
export declare function _advanceClusterTime(entity: Topology | ClientSession, $clusterTime: ClusterTime): void;
//# sourceMappingURL=common.d.ts.map