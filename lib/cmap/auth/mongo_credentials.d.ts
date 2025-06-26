import type { Document } from '../../bson';
import type { AWSCredentialProvider } from './aws_temporary_credentials';
import { GSSAPICanonicalizationValue } from './gssapi';
import type { OIDCCallbackFunction } from './mongodb_oidc';
import { AuthMechanism } from './providers';
/** @internal */
export declare const DEFAULT_ALLOWED_HOSTS: string[];
/** @public */
export interface AuthMechanismProperties extends Document {
    SERVICE_HOST?: string;
    SERVICE_NAME?: string;
    SERVICE_REALM?: string;
    CANONICALIZE_HOST_NAME?: GSSAPICanonicalizationValue;
    AWS_SESSION_TOKEN?: string;
    /** A user provided OIDC machine callback function. */
    OIDC_CALLBACK?: OIDCCallbackFunction;
    /** A user provided OIDC human interacted callback function. */
    OIDC_HUMAN_CALLBACK?: OIDCCallbackFunction;
    /** The OIDC environment. Note that 'test' is for internal use only. */
    ENVIRONMENT?: 'test' | 'azure' | 'gcp' | 'k8s';
    /** Allowed hosts that OIDC auth can connect to. */
    ALLOWED_HOSTS?: string[];
    /** The resource token for OIDC auth in Azure and GCP. */
    TOKEN_RESOURCE?: string;
    /**
     * A custom AWS credential provider to use. An example using the AWS SDK default provider chain:
     *
     * ```ts
     * const client = new MongoClient(process.env.MONGODB_URI, {
     *   authMechanismProperties: {
     *     AWS_CREDENTIAL_PROVIDER: fromNodeProviderChain()
     *   }
     * });
     * ```
     *
     * Using a custom function that returns AWS credentials:
     *
     * ```ts
     * const client = new MongoClient(process.env.MONGODB_URI, {
     *   authMechanismProperties: {
     *     AWS_CREDENTIAL_PROVIDER: async () => {
     *       return {
     *         accessKeyId: process.env.ACCESS_KEY_ID,
     *         secretAccessKey: process.env.SECRET_ACCESS_KEY
     *       }
     *     }
     *   }
     * });
     * ```
     */
    AWS_CREDENTIAL_PROVIDER?: AWSCredentialProvider;
}
/** @public */
export interface MongoCredentialsOptions {
    username?: string;
    password: string;
    source: string;
    db?: string;
    mechanism?: AuthMechanism;
    mechanismProperties: AuthMechanismProperties;
}
/**
 * A representation of the credentials used by MongoDB
 * @public
 */
export declare class MongoCredentials {
    /** The username used for authentication */
    readonly username: string;
    /** The password used for authentication */
    readonly password: string;
    /** The database that the user should authenticate against */
    readonly source: string;
    /** The method used to authenticate */
    readonly mechanism: AuthMechanism;
    /** Special properties used by some types of auth mechanisms */
    readonly mechanismProperties: AuthMechanismProperties;
    constructor(options: MongoCredentialsOptions);
    /** Determines if two MongoCredentials objects are equivalent */
    equals(other: MongoCredentials): boolean;
    /**
     * If the authentication mechanism is set to "default", resolves the authMechanism
     * based on the server version and server supported sasl mechanisms.
     *
     * @param hello - A hello response from the server
     */
    resolveAuthMechanism(hello: Document | null): MongoCredentials;
    validate(): void;
    static merge(creds: MongoCredentials | undefined, options: Partial<MongoCredentialsOptions>): MongoCredentials;
}
//# sourceMappingURL=mongo_credentials.d.ts.map