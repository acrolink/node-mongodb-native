import { type ObjectId } from '../bson';
import { type MongoError } from '../error';
import { TopologyType } from './common';
import { ServerDescription } from './server_description';
import type { SrvPollingEvent } from './srv_polling';
/** @public */
export interface TopologyDescriptionOptions {
    heartbeatFrequencyMS?: number;
    localThresholdMS?: number;
}
/**
 * Representation of a deployment of servers
 * @public
 */
export declare class TopologyDescription {
    type: TopologyType;
    setName: string | null;
    maxSetVersion: number | null;
    maxElectionId: ObjectId | null;
    servers: Map<string, ServerDescription>;
    stale: boolean;
    compatible: boolean;
    compatibilityError?: string;
    logicalSessionTimeoutMinutes: number | null;
    heartbeatFrequencyMS: number;
    localThresholdMS: number;
    commonWireVersion: number;
    /**
     * Create a TopologyDescription
     */
    constructor(topologyType: TopologyType, serverDescriptions?: Map<string, ServerDescription> | null, setName?: string | null, maxSetVersion?: number | null, maxElectionId?: ObjectId | null, commonWireVersion?: number | null, options?: TopologyDescriptionOptions | null);
    /**
     * Returns a new TopologyDescription based on the SrvPollingEvent
     * @internal
     */
    updateFromSrvPollingEvent(ev: SrvPollingEvent, srvMaxHosts?: number): TopologyDescription;
    /**
     * Returns a copy of this description updated with a given ServerDescription
     * @internal
     */
    update(serverDescription: ServerDescription): TopologyDescription;
    get error(): MongoError | null;
    /**
     * Determines if the topology description has any known servers
     */
    get hasKnownServers(): boolean;
    /**
     * Determines if this topology description has a data-bearing server available.
     */
    get hasDataBearingServers(): boolean;
    /**
     * Determines if the topology has a definition for the provided address
     * @internal
     */
    hasServer(address: string): boolean;
    /**
     * Returns a JSON-serializable representation of the TopologyDescription.  This is primarily
     * intended for use with JSON.stringify().
     *
     * This method will not throw.
     */
    toJSON(): import("bson").Document;
}
//# sourceMappingURL=topology_description.d.ts.map