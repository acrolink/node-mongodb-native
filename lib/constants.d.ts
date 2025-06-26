export declare const SYSTEM_NAMESPACE_COLLECTION = "system.namespaces";
export declare const SYSTEM_INDEX_COLLECTION = "system.indexes";
export declare const SYSTEM_PROFILE_COLLECTION = "system.profile";
export declare const SYSTEM_USER_COLLECTION = "system.users";
export declare const SYSTEM_COMMAND_COLLECTION = "$cmd";
export declare const SYSTEM_JS_COLLECTION = "system.js";
export declare const ERROR: "error";
export declare const TIMEOUT: "timeout";
export declare const CLOSE: "close";
export declare const OPEN: "open";
export declare const CONNECT: "connect";
export declare const CLOSED: "closed";
export declare const ENDED: "ended";
export declare const MESSAGE: "message";
export declare const PINNED: "pinned";
export declare const UNPINNED: "unpinned";
export declare const DESCRIPTION_RECEIVED = "descriptionReceived";
/** @internal */
export declare const SERVER_OPENING: "serverOpening";
/** @internal */
export declare const SERVER_CLOSED: "serverClosed";
/** @internal */
export declare const SERVER_DESCRIPTION_CHANGED: "serverDescriptionChanged";
/** @internal */
export declare const TOPOLOGY_OPENING: "topologyOpening";
/** @internal */
export declare const TOPOLOGY_CLOSED: "topologyClosed";
/** @internal */
export declare const TOPOLOGY_DESCRIPTION_CHANGED: "topologyDescriptionChanged";
/** @internal */
export declare const SERVER_SELECTION_STARTED: "serverSelectionStarted";
/** @internal */
export declare const SERVER_SELECTION_FAILED: "serverSelectionFailed";
/** @internal */
export declare const SERVER_SELECTION_SUCCEEDED: "serverSelectionSucceeded";
/** @internal */
export declare const WAITING_FOR_SUITABLE_SERVER: "waitingForSuitableServer";
/** @internal */
export declare const CONNECTION_POOL_CREATED: "connectionPoolCreated";
/** @internal */
export declare const CONNECTION_POOL_CLOSED: "connectionPoolClosed";
/** @internal */
export declare const CONNECTION_POOL_CLEARED: "connectionPoolCleared";
/** @internal */
export declare const CONNECTION_POOL_READY: "connectionPoolReady";
/** @internal */
export declare const CONNECTION_CREATED: "connectionCreated";
/** @internal */
export declare const CONNECTION_READY: "connectionReady";
/** @internal */
export declare const CONNECTION_CLOSED: "connectionClosed";
/** @internal */
export declare const CONNECTION_CHECK_OUT_STARTED: "connectionCheckOutStarted";
/** @internal */
export declare const CONNECTION_CHECK_OUT_FAILED: "connectionCheckOutFailed";
/** @internal */
export declare const CONNECTION_CHECKED_OUT: "connectionCheckedOut";
/** @internal */
export declare const CONNECTION_CHECKED_IN: "connectionCheckedIn";
export declare const CLUSTER_TIME_RECEIVED: "clusterTimeReceived";
/** @internal */
export declare const COMMAND_STARTED: "commandStarted";
/** @internal */
export declare const COMMAND_SUCCEEDED: "commandSucceeded";
/** @internal */
export declare const COMMAND_FAILED: "commandFailed";
/** @internal */
export declare const SERVER_HEARTBEAT_STARTED: "serverHeartbeatStarted";
/** @internal */
export declare const SERVER_HEARTBEAT_SUCCEEDED: "serverHeartbeatSucceeded";
/** @internal */
export declare const SERVER_HEARTBEAT_FAILED: "serverHeartbeatFailed";
export declare const RESPONSE: "response";
export declare const MORE: "more";
export declare const INIT: "init";
export declare const CHANGE: "change";
export declare const END: "end";
export declare const RESUME_TOKEN_CHANGED: "resumeTokenChanged";
/** @public */
export declare const HEARTBEAT_EVENTS: readonly ["serverHeartbeatStarted", "serverHeartbeatSucceeded", "serverHeartbeatFailed"];
/** @public */
export declare const CMAP_EVENTS: readonly ["connectionPoolCreated", "connectionPoolReady", "connectionPoolCleared", "connectionPoolClosed", "connectionCreated", "connectionReady", "connectionClosed", "connectionCheckOutStarted", "connectionCheckOutFailed", "connectionCheckedOut", "connectionCheckedIn"];
/** @public */
export declare const TOPOLOGY_EVENTS: readonly ["serverOpening", "serverClosed", "serverDescriptionChanged", "topologyOpening", "topologyClosed", "topologyDescriptionChanged", "error", "timeout", "close"];
/** @public */
export declare const APM_EVENTS: readonly ["commandStarted", "commandSucceeded", "commandFailed"];
/**
 * All events that we relay to the `Topology`
 * @internal
 */
export declare const SERVER_RELAY_EVENTS: readonly ["serverHeartbeatStarted", "serverHeartbeatSucceeded", "serverHeartbeatFailed", "commandStarted", "commandSucceeded", "commandFailed", "connectionPoolCreated", "connectionPoolReady", "connectionPoolCleared", "connectionPoolClosed", "connectionCreated", "connectionReady", "connectionClosed", "connectionCheckOutStarted", "connectionCheckOutFailed", "connectionCheckedOut", "connectionCheckedIn"];
/**
 * All events we listen to from `Server` instances, but do not forward to the client
 * @internal
 */
export declare const LOCAL_SERVER_EVENTS: readonly ["connect", "descriptionReceived", "closed", "ended"];
/** @public */
export declare const MONGO_CLIENT_EVENTS: readonly ["connectionPoolCreated", "connectionPoolReady", "connectionPoolCleared", "connectionPoolClosed", "connectionCreated", "connectionReady", "connectionClosed", "connectionCheckOutStarted", "connectionCheckOutFailed", "connectionCheckedOut", "connectionCheckedIn", "commandStarted", "commandSucceeded", "commandFailed", "serverOpening", "serverClosed", "serverDescriptionChanged", "topologyOpening", "topologyClosed", "topologyDescriptionChanged", "error", "timeout", "close", "serverHeartbeatStarted", "serverHeartbeatSucceeded", "serverHeartbeatFailed"];
/**
 * @internal
 * The legacy hello command that was deprecated in MongoDB 5.0.
 */
export declare const LEGACY_HELLO_COMMAND = "ismaster";
/**
 * @internal
 * The legacy hello command that was deprecated in MongoDB 5.0.
 */
export declare const LEGACY_HELLO_COMMAND_CAMEL_CASE = "isMaster";
/** @internal */
export declare const kDecorateResult: unique symbol;
/** @internal */
export declare const kDecoratedKeys: unique symbol;
//# sourceMappingURL=constants.d.ts.map