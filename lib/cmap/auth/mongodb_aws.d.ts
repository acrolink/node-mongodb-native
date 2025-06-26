import { type AuthContext, AuthProvider } from './auth_provider';
import { type AWSCredentialProvider } from './aws_temporary_credentials';
export declare class MongoDBAWS extends AuthProvider {
    private credentialFetcher;
    private credentialProvider?;
    constructor(credentialProvider?: AWSCredentialProvider);
    auth(authContext: AuthContext): Promise<void>;
}
//# sourceMappingURL=mongodb_aws.d.ts.map