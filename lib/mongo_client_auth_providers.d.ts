import { type AuthProvider } from './cmap/auth/auth_provider';
import { type AuthMechanismProperties } from './cmap/auth/mongo_credentials';
import { AuthMechanism } from './cmap/auth/providers';
/**
 * Create a set of providers per client
 * to avoid sharing the provider's cache between different clients.
 * @internal
 */
export declare class MongoClientAuthProviders {
    private existingProviders;
    /**
     * Get or create an authentication provider based on the provided mechanism.
     * We don't want to create all providers at once, as some providers may not be used.
     * @param name - The name of the provider to get or create.
     * @param credentials - The credentials.
     * @returns The provider.
     * @throws MongoInvalidArgumentError if the mechanism is not supported.
     * @internal
     */
    getOrCreateProvider(name: AuthMechanism | string, authMechanismProperties: AuthMechanismProperties): AuthProvider;
}
//# sourceMappingURL=mongo_client_auth_providers.d.ts.map