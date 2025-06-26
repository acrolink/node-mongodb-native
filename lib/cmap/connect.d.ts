import type { Socket } from 'net';
import type { TLSSocket } from 'tls';
import type { Document } from '../bson';
import { AuthContext } from './auth/auth_provider';
import { Connection, type ConnectionOptions } from './connection';
/** @public */
export type Stream = Socket | TLSSocket;
export declare function connect(options: ConnectionOptions): Promise<Connection>;
export declare function makeConnection(options: ConnectionOptions, socket: Stream): Connection;
export declare function performInitialHandshake(conn: Connection, options: ConnectionOptions): Promise<void>;
/**
 * HandshakeDocument used during authentication.
 * @internal
 */
export interface HandshakeDocument extends Document {
    /**
     * @deprecated Use hello instead
     */
    ismaster?: boolean;
    hello?: boolean;
    helloOk?: boolean;
    client: Document;
    compression: string[];
    saslSupportedMechs?: string;
    loadBalanced?: boolean;
}
/**
 * @internal
 *
 * This function is only exposed for testing purposes.
 */
export declare function prepareHandshakeDocument(authContext: AuthContext): Promise<HandshakeDocument>;
/** @public */
export declare const LEGAL_TLS_SOCKET_OPTIONS: readonly ["allowPartialTrustChain", "ALPNProtocols", "ca", "cert", "checkServerIdentity", "ciphers", "crl", "ecdhCurve", "key", "minDHSize", "passphrase", "pfx", "rejectUnauthorized", "secureContext", "secureProtocol", "servername", "session"];
/** @public */
export declare const LEGAL_TCP_SOCKET_OPTIONS: readonly ["autoSelectFamily", "autoSelectFamilyAttemptTimeout", "keepAliveInitialDelay", "family", "hints", "localAddress", "localPort", "lookup"];
type MakeConnectionOptions = ConnectionOptions & {
    existingSocket?: Stream;
};
export declare function makeSocket(options: MakeConnectionOptions): Promise<Stream>;
export {};
//# sourceMappingURL=connect.d.ts.map