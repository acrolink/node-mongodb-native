import { type Document } from '../../bson';
import { type KMSProviders } from './index';
/** Base URL for getting Azure tokens. */
export declare const AZURE_BASE_URL = "http://169.254.169.254/metadata/identity/oauth2/token?";
/**
 * The access token that libmongocrypt expects for Azure kms.
 */
interface AccessToken {
    accessToken: string;
}
/**
 * The response from the azure idms endpoint, including the `expiresOnTimestamp`.
 * `expiresOnTimestamp` is needed for caching.
 */
interface AzureTokenCacheEntry extends AccessToken {
    accessToken: string;
    expiresOnTimestamp: number;
}
/**
 * @internal
 */
export declare class AzureCredentialCache {
    cachedToken: AzureTokenCacheEntry | null;
    getToken(): Promise<AccessToken>;
    needsRefresh(token: AzureTokenCacheEntry): boolean;
    /**
     * exposed for testing
     */
    resetCache(): void;
    /**
     * exposed for testing
     */
    _getToken(): Promise<AzureTokenCacheEntry>;
}
/** @internal */
export declare const tokenCache: AzureCredentialCache;
/**
 * @internal
 *
 * exposed for CSFLE
 * [prose test 18](https://github.com/mongodb/specifications/tree/master/source/client-side-encryption/tests#azure-imds-credentials)
 */
export interface AzureKMSRequestOptions {
    headers?: Document;
    url?: URL | string;
}
/**
 * @internal
 * Get the Azure endpoint URL.
 */
export declare function addAzureParams(url: URL, resource: string, username?: string): URL;
/**
 * @internal
 *
 * parses any options provided by prose tests to `fetchAzureKMSToken` and merges them with
 * the default values for headers and the request url.
 */
export declare function prepareRequest(options: AzureKMSRequestOptions): {
    headers: Document;
    url: URL;
};
/**
 * @internal
 *
 * `AzureKMSRequestOptions` allows prose tests to modify the http request sent to the idms
 * servers.  This is required to simulate different server conditions.  No options are expected to
 * be set outside of tests.
 *
 * exposed for CSFLE
 * [prose test 18](https://github.com/mongodb/specifications/tree/master/source/client-side-encryption/tests#azure-imds-credentials)
 */
export declare function fetchAzureKMSToken(options?: AzureKMSRequestOptions): Promise<AzureTokenCacheEntry>;
/**
 * @internal
 *
 * @throws Will reject with a `MongoCryptError` if the http request fails or the http response is malformed.
 */
export declare function loadAzureCredentials(kmsProviders: KMSProviders): Promise<KMSProviders>;
export {};
//# sourceMappingURL=azure.d.ts.map