/** @public */
export declare const AuthMechanism: Readonly<{
    readonly MONGODB_AWS: "MONGODB-AWS";
    readonly MONGODB_CR: "MONGODB-CR";
    readonly MONGODB_DEFAULT: "DEFAULT";
    readonly MONGODB_GSSAPI: "GSSAPI";
    readonly MONGODB_PLAIN: "PLAIN";
    readonly MONGODB_SCRAM_SHA1: "SCRAM-SHA-1";
    readonly MONGODB_SCRAM_SHA256: "SCRAM-SHA-256";
    readonly MONGODB_X509: "MONGODB-X509";
    readonly MONGODB_OIDC: "MONGODB-OIDC";
}>;
/** @public */
export type AuthMechanism = (typeof AuthMechanism)[keyof typeof AuthMechanism];
/** @internal */
export declare const AUTH_MECHS_AUTH_SRC_EXTERNAL: Set<AuthMechanism>;
//# sourceMappingURL=providers.d.ts.map