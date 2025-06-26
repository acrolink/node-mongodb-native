import { type AWSCredentials } from '../../deps';
/**
 * @internal
 * This interface matches the final result of fetching temporary credentials manually, outlined
 * in the spec [here](https://github.com/mongodb/specifications/blob/master/source/auth/auth.md#ec2-endpoint).
 *
 * When we use the AWS SDK, we map the response from the SDK to conform to this interface.
 */
export interface AWSTempCredentials {
    AccessKeyId?: string;
    SecretAccessKey?: string;
    Token?: string;
    RoleArn?: string;
    Expiration?: Date;
}
/** @public **/
export type AWSCredentialProvider = () => Promise<AWSCredentials>;
/**
 * @internal
 *
 * Fetches temporary AWS credentials.
 */
export declare abstract class AWSTemporaryCredentialProvider {
    abstract getCredentials(): Promise<AWSTempCredentials>;
    private static _awsSDK;
    protected static get awsSDK(): {
        fromNodeProviderChain(this: void, options: {
            clientConfig: {
                region: string;
            };
        }): () => Promise<AWSCredentials>;
        fromNodeProviderChain(this: void): () => Promise<AWSCredentials>;
    } | {
        kModuleError: import("../../error").MongoMissingDependencyError;
    };
    static get isAWSSDKInstalled(): boolean;
}
/** @internal */
export declare class AWSSDKCredentialProvider extends AWSTemporaryCredentialProvider {
    private _provider?;
    /**
     * Create the SDK credentials provider.
     * @param credentialsProvider - The credentials provider.
     */
    constructor(credentialsProvider?: AWSCredentialProvider);
    /**
     * The AWS SDK caches credentials automatically and handles refresh when the credentials have expired.
     * To ensure this occurs, we need to cache the `provider` returned by the AWS sdk and re-use it when fetching credentials.
     */
    private get provider();
    getCredentials(): Promise<AWSTempCredentials>;
}
/**
 * @internal
 * Fetches credentials manually (without the AWS SDK), as outlined in the [Obtaining Credentials](https://github.com/mongodb/specifications/blob/master/source/auth/auth.md#obtaining-credentials)
 * section of the Auth spec.
 */
export declare class LegacyAWSTemporaryCredentialProvider extends AWSTemporaryCredentialProvider {
    getCredentials(): Promise<AWSTempCredentials>;
}
//# sourceMappingURL=aws_temporary_credentials.d.ts.map