import type { Document } from '../../bson';
import type { HandshakeDocument } from '../connect';
import type { Connection, ConnectionOptions } from '../connection';
import type { MongoCredentials } from './mongo_credentials';
/**
 * Context used during authentication
 * @internal
 */
export declare class AuthContext {
    /** The connection to authenticate */
    connection: Connection;
    /** The credentials to use for authentication */
    credentials?: MongoCredentials;
    /** If the context is for reauthentication. */
    reauthenticating: boolean;
    /** The options passed to the `connect` method */
    options: ConnectionOptions;
    /** A response from an initial auth attempt, only some mechanisms use this (e.g, SCRAM) */
    response?: Document;
    /** A random nonce generated for use in an authentication conversation */
    nonce?: Buffer;
    constructor(connection: Connection, credentials: MongoCredentials | undefined, options: ConnectionOptions);
}
/**
 * Provider used during authentication.
 * @internal
 */
export declare abstract class AuthProvider {
    /**
     * Prepare the handshake document before the initial handshake.
     *
     * @param handshakeDoc - The document used for the initial handshake on a connection
     * @param authContext - Context for authentication flow
     */
    prepare(handshakeDoc: HandshakeDocument, _authContext: AuthContext): Promise<HandshakeDocument>;
    /**
     * Authenticate
     *
     * @param context - A shared context for authentication flow
     */
    abstract auth(context: AuthContext): Promise<void>;
    /**
     * Reauthenticate.
     * @param context - The shared auth context.
     */
    reauth(context: AuthContext): Promise<void>;
}
//# sourceMappingURL=auth_provider.d.ts.map