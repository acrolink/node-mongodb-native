import type { HandshakeDocument } from '../connect';
import { type AuthContext, AuthProvider } from './auth_provider';
export declare class X509 extends AuthProvider {
    prepare(handshakeDoc: HandshakeDocument, authContext: AuthContext): Promise<HandshakeDocument>;
    auth(authContext: AuthContext): Promise<void>;
}
//# sourceMappingURL=x509.d.ts.map