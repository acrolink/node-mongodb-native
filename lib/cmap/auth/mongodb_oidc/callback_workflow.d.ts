import { type Document } from '../../../bson';
import type { Connection } from '../../connection';
import type { MongoCredentials } from '../mongo_credentials';
import { type OIDCCallbackFunction, type OIDCCallbackParams, type OIDCResponse, type Workflow } from '../mongodb_oidc';
import { type TokenCache } from './token_cache';
/** 5 minutes in milliseconds */
export declare const HUMAN_TIMEOUT_MS = 300000;
/** 1 minute in milliseconds */
export declare const AUTOMATED_TIMEOUT_MS = 60000;
/**
 * OIDC implementation of a callback based workflow.
 * @internal
 */
export declare abstract class CallbackWorkflow implements Workflow {
    cache: TokenCache;
    callback: OIDCCallbackFunction;
    lastExecutionTime: number;
    /**
     * Instantiate the callback workflow.
     */
    constructor(cache: TokenCache, callback: OIDCCallbackFunction);
    /**
     * Get the document to add for speculative authentication. This also needs
     * to add a db field from the credentials source.
     */
    speculativeAuth(connection: Connection, credentials: MongoCredentials): Promise<Document>;
    /**
     * Reauthenticate the callback workflow. For this we invalidated the access token
     * in the cache and run the authentication steps again. No initial handshake needs
     * to be sent.
     */
    reauthenticate(connection: Connection, credentials: MongoCredentials): Promise<void>;
    /**
     * Execute the OIDC callback workflow.
     */
    abstract execute(connection: Connection, credentials: MongoCredentials, response?: Document): Promise<void>;
    /**
     * Starts the callback authentication process. If there is a speculative
     * authentication document from the initial handshake, then we will use that
     * value to get the issuer, otherwise we will send the saslStart command.
     */
    protected startAuthentication(connection: Connection, credentials: MongoCredentials, response?: Document): Promise<Document>;
    /**
     * Finishes the callback authentication process.
     */
    protected finishAuthentication(connection: Connection, credentials: MongoCredentials, token: string, conversationId?: number): Promise<void>;
    /**
     * Executes the callback and validates the output.
     */
    protected executeAndValidateCallback(params: OIDCCallbackParams): Promise<OIDCResponse>;
    /**
     * Ensure the callback is only executed one at a time and throttles the calls
     * to every 100ms.
     */
    protected withLock(callback: OIDCCallbackFunction): OIDCCallbackFunction;
}
//# sourceMappingURL=callback_workflow.d.ts.map