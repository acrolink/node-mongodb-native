import { SERVER_SELECTION_FAILED, SERVER_SELECTION_STARTED, SERVER_SELECTION_SUCCEEDED, WAITING_FOR_SUITABLE_SERVER } from '../constants';
import { type ReadPreference } from '../read_preference';
import { type ServerSelector } from './server_selection';
import type { TopologyDescription } from './topology_description';
/**
 * The base export class for all logs published from server selection
 * @internal
 * @category Log Type
 */
export declare abstract class ServerSelectionEvent {
    /** String representation of the selector being used to select the server.
     *  Defaults to 'custom selector' for application-provided custom selector case.
     */
    selector: string | ReadPreference | ServerSelector;
    /** The name of the operation for which a server is being selected.  */
    operation: string;
    /** 	The current topology description.  */
    topologyDescription: TopologyDescription;
    /** @internal */
    abstract name: typeof SERVER_SELECTION_STARTED | typeof SERVER_SELECTION_SUCCEEDED | typeof SERVER_SELECTION_FAILED | typeof WAITING_FOR_SUITABLE_SERVER;
    abstract message: string;
    /** @internal */
    constructor(selector: string | ReadPreference | ServerSelector, topologyDescription: TopologyDescription, operation: string);
}
/**
 * An event published when server selection starts
 * @internal
 * @category Event
 */
export declare class ServerSelectionStartedEvent extends ServerSelectionEvent {
    /** @internal */
    name: "serverSelectionStarted";
    message: string;
    /** @internal */
    constructor(selector: string | ReadPreference | ServerSelector, topologyDescription: TopologyDescription, operation: string);
}
/**
 * An event published when a server selection fails
 * @internal
 * @category Event
 */
export declare class ServerSelectionFailedEvent extends ServerSelectionEvent {
    /** @internal */
    name: "serverSelectionFailed";
    message: string;
    /** Representation of the error the driver will throw regarding server selection failing. */
    failure: Error;
    /** @internal */
    constructor(selector: string | ReadPreference | ServerSelector, topologyDescription: TopologyDescription, error: Error, operation: string);
}
/**
 * An event published when server selection succeeds
 * @internal
 * @category Event
 */
export declare class ServerSelectionSucceededEvent extends ServerSelectionEvent {
    /** @internal */
    name: "serverSelectionSucceeded";
    message: string;
    /** 	The hostname, IP address, or Unix domain socket path for the selected server. */
    serverHost: string;
    /** The port for the selected server. Optional; not present for Unix domain sockets. When the user does not specify a port and the default (27017) is used, the driver SHOULD include it here. */
    serverPort: number | undefined;
    /** @internal */
    constructor(selector: string | ReadPreference | ServerSelector, topologyDescription: TopologyDescription, address: string, operation: string);
}
/**
 * An event published when server selection is waiting for a suitable server to become available
 * @internal
 * @category Event
 */
export declare class WaitingForSuitableServerEvent extends ServerSelectionEvent {
    /** @internal */
    name: "waitingForSuitableServer";
    message: string;
    /** The remaining time left until server selection will time out. */
    remainingTimeMS: number;
    /** @internal */
    constructor(selector: string | ReadPreference | ServerSelector, topologyDescription: TopologyDescription, remainingTimeMS: number, operation: string);
}
//# sourceMappingURL=server_selection_events.d.ts.map