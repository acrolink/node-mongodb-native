import { type Connection } from '../../connection';
import { type MongoCredentials } from '../mongo_credentials';
import { type OIDCCallbackFunction, type OIDCResponse } from '../mongodb_oidc';
import { CallbackWorkflow } from './callback_workflow';
import { type TokenCache } from './token_cache';
/**
 * Class implementing behaviour for the non human callback workflow.
 * @internal
 */
export declare class AutomatedCallbackWorkflow extends CallbackWorkflow {
    /**
     * Instantiate the human callback workflow.
     */
    constructor(cache: TokenCache, callback: OIDCCallbackFunction);
    /**
     * Execute the OIDC callback workflow.
     */
    execute(connection: Connection, credentials: MongoCredentials): Promise<void>;
    /**
     * Fetches the access token using the callback.
     */
    protected fetchAccessToken(credentials: MongoCredentials): Promise<OIDCResponse>;
}
//# sourceMappingURL=automated_callback_workflow.d.ts.map