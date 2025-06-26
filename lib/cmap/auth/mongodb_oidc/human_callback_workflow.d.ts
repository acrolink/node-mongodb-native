import { type Connection } from '../../connection';
import { type MongoCredentials } from '../mongo_credentials';
import { type OIDCCallbackFunction } from '../mongodb_oidc';
import { CallbackWorkflow } from './callback_workflow';
import { type TokenCache } from './token_cache';
/**
 * Class implementing behaviour for the non human callback workflow.
 * @internal
 */
export declare class HumanCallbackWorkflow extends CallbackWorkflow {
    /**
     * Instantiate the human callback workflow.
     */
    constructor(cache: TokenCache, callback: OIDCCallbackFunction);
    /**
     * Execute the OIDC human callback workflow.
     */
    execute(connection: Connection, credentials: MongoCredentials): Promise<void>;
    /**
     * Fetches an access token using the callback.
     */
    private fetchAccessToken;
}
//# sourceMappingURL=human_callback_workflow.d.ts.map