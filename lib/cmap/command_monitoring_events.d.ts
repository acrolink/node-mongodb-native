import { type Document, type ObjectId } from '../bson';
import { type WriteProtocolMessageType } from './commands';
import type { Connection } from './connection';
/**
 * An event indicating the start of a given command
 * @public
 * @category Event
 */
export declare class CommandStartedEvent {
    commandObj?: Document;
    requestId: number;
    databaseName: string;
    commandName: string;
    command: Document;
    address: string;
    /** Driver generated connection id */
    connectionId?: string | number;
    /**
     * Server generated connection id
     * Distinct from the connection id and is returned by the hello or legacy hello response as "connectionId"
     * from the server on 4.2+.
     */
    serverConnectionId: bigint | null;
    serviceId?: ObjectId;
    /** @internal */
    name: "commandStarted";
    /**
     * Create a started event
     *
     * @internal
     * @param pool - the pool that originated the command
     * @param command - the command
     */
    constructor(connection: Connection, command: WriteProtocolMessageType, serverConnectionId: bigint | null);
    get hasServiceId(): boolean;
}
/**
 * An event indicating the success of a given command
 * @public
 * @category Event
 */
export declare class CommandSucceededEvent {
    address: string;
    /** Driver generated connection id */
    connectionId?: string | number;
    /**
     * Server generated connection id
     * Distinct from the connection id and is returned by the hello or legacy hello response as "connectionId" from the server on 4.2+.
     */
    serverConnectionId: bigint | null;
    requestId: number;
    duration: number;
    commandName: string;
    reply: unknown;
    serviceId?: ObjectId;
    /** @internal */
    name: "commandSucceeded";
    /**
     * Create a succeeded event
     *
     * @internal
     * @param pool - the pool that originated the command
     * @param command - the command
     * @param reply - the reply for this command from the server
     * @param started - a high resolution tuple timestamp of when the command was first sent, to calculate duration
     */
    constructor(connection: Connection, command: WriteProtocolMessageType, reply: Document | undefined, started: number, serverConnectionId: bigint | null);
    get hasServiceId(): boolean;
}
/**
 * An event indicating the failure of a given command
 * @public
 * @category Event
 */
export declare class CommandFailedEvent {
    address: string;
    /** Driver generated connection id */
    connectionId?: string | number;
    /**
     * Server generated connection id
     * Distinct from the connection id and is returned by the hello or legacy hello response as "connectionId" from the server on 4.2+.
     */
    serverConnectionId: bigint | null;
    requestId: number;
    duration: number;
    commandName: string;
    failure: Error;
    serviceId?: ObjectId;
    /** @internal */
    name: "commandFailed";
    /**
     * Create a failure event
     *
     * @internal
     * @param pool - the pool that originated the command
     * @param command - the command
     * @param error - the generated error or a server error response
     * @param started - a high resolution tuple timestamp of when the command was first sent, to calculate duration
     */
    constructor(connection: Connection, command: WriteProtocolMessageType, error: Error | Document, started: number, serverConnectionId: bigint | null);
    get hasServiceId(): boolean;
}
/**
 * Commands that we want to redact because of the sensitive nature of their contents
 * @internal
 */
export declare const SENSITIVE_COMMANDS: Set<string>;
//# sourceMappingURL=command_monitoring_events.d.ts.map