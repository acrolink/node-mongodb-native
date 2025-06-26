import { Binary } from '../../../bson';
import { type MongoCredentials } from '../mongo_credentials';
/** @internal */
export interface OIDCCommand {
    saslStart?: number;
    saslContinue?: number;
    conversationId?: number;
    mechanism?: string;
    autoAuthorize?: number;
    db?: string;
    payload: Binary;
}
/**
 * Generate the finishing command document for authentication. Will be a
 * saslStart or saslContinue depending on the presence of a conversation id.
 */
export declare function finishCommandDocument(token: string, conversationId?: number): OIDCCommand;
/**
 * Generate the saslStart command document.
 */
export declare function startCommandDocument(credentials: MongoCredentials): OIDCCommand;
//# sourceMappingURL=command_builders.d.ts.map