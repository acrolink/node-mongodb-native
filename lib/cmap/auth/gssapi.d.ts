import { type AuthContext, AuthProvider } from './auth_provider';
/** @public */
export declare const GSSAPICanonicalizationValue: Readonly<{
    readonly on: true;
    readonly off: false;
    readonly none: "none";
    readonly forward: "forward";
    readonly forwardAndReverse: "forwardAndReverse";
}>;
/** @public */
export type GSSAPICanonicalizationValue = (typeof GSSAPICanonicalizationValue)[keyof typeof GSSAPICanonicalizationValue];
type MechanismProperties = {
    CANONICALIZE_HOST_NAME?: GSSAPICanonicalizationValue;
    SERVICE_HOST?: string;
    SERVICE_NAME?: string;
    SERVICE_REALM?: string;
};
export declare class GSSAPI extends AuthProvider {
    auth(authContext: AuthContext): Promise<void>;
}
export declare function performGSSAPICanonicalizeHostName(host: string, mechanismProperties: MechanismProperties): Promise<string>;
export declare function resolveCname(host: string): Promise<string>;
export {};
//# sourceMappingURL=gssapi.d.ts.map