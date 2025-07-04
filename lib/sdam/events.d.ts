import type { Document } from '../bson';
import type { ServerDescription } from './server_description';
import type { TopologyDescription } from './topology_description';
/**
 * Emitted when server description changes, but does NOT include changes to the RTT.
 * @public
 * @category Event
 */
export declare class ServerDescriptionChangedEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** The address (host/port pair) of the server */
    address: string;
    /** The previous server description */
    previousDescription: ServerDescription;
    /** The new server description */
    newDescription: ServerDescription;
    name: "serverDescriptionChanged";
    /** @internal */
    constructor(topologyId: number, address: string, previousDescription: ServerDescription, newDescription: ServerDescription);
}
/**
 * Emitted when server is initialized.
 * @public
 * @category Event
 */
export declare class ServerOpeningEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** The address (host/port pair) of the server */
    address: string;
    /** @internal */
    name: "serverOpening";
    /** @internal */
    constructor(topologyId: number, address: string);
}
/**
 * Emitted when server is closed.
 * @public
 * @category Event
 */
export declare class ServerClosedEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** The address (host/port pair) of the server */
    address: string;
    /** @internal */
    name: "serverClosed";
    /** @internal */
    constructor(topologyId: number, address: string);
}
/**
 * Emitted when topology description changes.
 * @public
 * @category Event
 */
export declare class TopologyDescriptionChangedEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** The old topology description */
    previousDescription: TopologyDescription;
    /** The new topology description */
    newDescription: TopologyDescription;
    /** @internal */
    name: "topologyDescriptionChanged";
    /** @internal */
    constructor(topologyId: number, previousDescription: TopologyDescription, newDescription: TopologyDescription);
}
/**
 * Emitted when topology is initialized.
 * @public
 * @category Event
 */
export declare class TopologyOpeningEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** @internal */
    name: "topologyOpening";
    /** @internal */
    constructor(topologyId: number);
}
/**
 * Emitted when topology is closed.
 * @public
 * @category Event
 */
export declare class TopologyClosedEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** @internal */
    name: "topologyClosed";
    /** @internal */
    constructor(topologyId: number);
}
/**
 * Emitted when the server monitor’s hello command is started - immediately before
 * the hello command is serialized into raw BSON and written to the socket.
 *
 * @public
 * @category Event
 */
export declare class ServerHeartbeatStartedEvent {
    /** The connection id for the command */
    connectionId: string;
    /** Is true when using the streaming protocol */
    awaited: boolean;
    /** @internal */
    name: "serverHeartbeatStarted";
    /** @internal */
    constructor(connectionId: string, awaited: boolean);
}
/**
 * Emitted when the server monitor’s hello succeeds.
 * @public
 * @category Event
 */
export declare class ServerHeartbeatSucceededEvent {
    /** The connection id for the command */
    connectionId: string;
    /** The execution time of the event in ms */
    duration: number;
    /** The command reply */
    reply: Document;
    /** Is true when using the streaming protocol */
    awaited: boolean;
    /** @internal */
    name: "serverHeartbeatSucceeded";
    /** @internal */
    constructor(connectionId: string, duration: number, reply: Document | null, awaited: boolean);
}
/**
 * Emitted when the server monitor’s hello fails, either with an “ok: 0” or a socket exception.
 * @public
 * @category Event
 */
export declare class ServerHeartbeatFailedEvent {
    /** The connection id for the command */
    connectionId: string;
    /** The execution time of the event in ms */
    duration: number;
    /** The command failure */
    failure: Error;
    /** Is true when using the streaming protocol */
    awaited: boolean;
    /** @internal */
    name: "serverHeartbeatFailed";
    /** @internal */
    constructor(connectionId: string, duration: number, failure: Error, awaited: boolean);
}
//# sourceMappingURL=events.d.ts.map