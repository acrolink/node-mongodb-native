import type { Document } from '../../bson';
import type { HandshakeDocument } from '../connect';
import type { Connection } from '../connection';
import { type AuthContext, AuthProvider } from './auth_provider';
import type { MongoCredentials } from './mongo_credentials';
import { TokenCache } from './mongodb_oidc/token_cache';
/**
 * The information returned by the server on the IDP server.
 * @public
 */
export interface IdPInfo {
    /**
     * A URL which describes the Authentication Server. This identifier should
     * be the iss of provided access tokens, and be viable for RFC8414 metadata
     * discovery and RFC9207 identification.
     */
    issuer: string;
    /** A unique client ID for this OIDC client. */
    clientId: string;
    /** A list of additional scopes to request from IdP. */
    requestScopes?: string[];
}
/**
 * The response from the IdP server with the access token and
 * optional expiration time and refresh token.
 * @public
 */
export interface IdPServerResponse {
    /** The OIDC access token. */
    accessToken: string;
    /** The time when the access token expires. For future use. */
    expiresInSeconds?: number;
    /** The refresh token, if applicable, to be used by the callback to request a new token from the issuer. */
    refreshToken?: string;
}
/**
 * The response required to be returned from the machine or
 * human callback workflows' callback.
 * @public
 */
export interface OIDCResponse {
    /** The OIDC access token. */
    accessToken: string;
    /** The time when the access token expires. For future use. */
    expiresInSeconds?: number;
    /** The refresh token, if applicable, to be used by the callback to request a new token from the issuer. */
    refreshToken?: string;
}
/**
 * The parameters that the driver provides to the user supplied
 * human or machine callback.
 *
 * The version number is used to communicate callback API changes that are not breaking but that
 * users may want to know about and review their implementation. Users may wish to check the version
 * number and throw an error if their expected version number and the one provided do not match.
 * @public
 */
export interface OIDCCallbackParams {
    /** Optional username. */
    username?: string;
    /** The context in which to timeout the OIDC callback. */
    timeoutContext: AbortSignal;
    /** The current OIDC API version. */
    version: 1;
    /** The IdP information returned from the server. */
    idpInfo?: IdPInfo;
    /** The refresh token, if applicable, to be used by the callback to request a new token from the issuer. */
    refreshToken?: string;
    /** The token audience for GCP and Azure. */
    tokenAudience?: string;
}
/**
 * The signature of the human or machine callback functions.
 * @public
 */
export type OIDCCallbackFunction = (params: OIDCCallbackParams) => Promise<OIDCResponse>;
/** The current version of OIDC implementation. */
export declare const OIDC_VERSION = 1;
type EnvironmentName = 'test' | 'azure' | 'gcp' | 'k8s' | undefined;
/** @internal */
export interface Workflow {
    cache: TokenCache;
    /**
     * All device workflows must implement this method in order to get the access
     * token and then call authenticate with it.
     */
    execute(connection: Connection, credentials: MongoCredentials, response?: Document): Promise<void>;
    /**
     * Each workflow should specify the correct custom behaviour for reauthentication.
     */
    reauthenticate(connection: Connection, credentials: MongoCredentials): Promise<void>;
    /**
     * Get the document to add for speculative authentication.
     */
    speculativeAuth(connection: Connection, credentials: MongoCredentials): Promise<Document>;
}
/** @internal */
export declare const OIDC_WORKFLOWS: Map<EnvironmentName, () => Workflow>;
/**
 * OIDC auth provider.
 */
export declare class MongoDBOIDC extends AuthProvider {
    workflow: Workflow;
    /**
     * Instantiate the auth provider.
     */
    constructor(workflow?: Workflow);
    /**
     * Authenticate using OIDC
     */
    auth(authContext: AuthContext): Promise<void>;
    /**
     * Add the speculative auth for the initial handshake.
     */
    prepare(handshakeDoc: HandshakeDocument, authContext: AuthContext): Promise<HandshakeDocument>;
}
export {};
//# sourceMappingURL=mongodb_oidc.d.ts.map