import type { HandshakeDocument } from '../connect';
import { type AuthContext, AuthProvider } from './auth_provider';
type CryptoMethod = 'sha1' | 'sha256';
declare class ScramSHA extends AuthProvider {
    cryptoMethod: CryptoMethod;
    constructor(cryptoMethod: CryptoMethod);
    prepare(handshakeDoc: HandshakeDocument, authContext: AuthContext): Promise<HandshakeDocument>;
    auth(authContext: AuthContext): Promise<void>;
}
export declare class ScramSHA1 extends ScramSHA {
    constructor();
}
export declare class ScramSHA256 extends ScramSHA {
    constructor();
}
export {};
//# sourceMappingURL=scram.d.ts.map