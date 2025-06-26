import type { IdPInfo, OIDCResponse } from '../mongodb_oidc';
/** @internal */
export declare class TokenCache {
    private accessToken?;
    private refreshToken?;
    private idpInfo?;
    private expiresInSeconds?;
    get hasAccessToken(): boolean;
    get hasRefreshToken(): boolean;
    get hasIdpInfo(): boolean;
    getAccessToken(): string;
    getRefreshToken(): string;
    getIdpInfo(): IdPInfo;
    put(response: OIDCResponse, idpInfo?: IdPInfo): void;
    removeAccessToken(): void;
    removeRefreshToken(): void;
}
//# sourceMappingURL=token_cache.d.ts.map