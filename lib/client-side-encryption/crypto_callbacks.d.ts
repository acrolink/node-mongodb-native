type AES256Callback = (key: Buffer, iv: Buffer, input: Buffer, output: Buffer) => number | Error;
export declare function makeAES256Hook(method: 'createCipheriv' | 'createDecipheriv', mode: 'aes-256-cbc' | 'aes-256-ctr'): AES256Callback;
export declare function randomHook(buffer: Buffer, count: number): number | Error;
export declare function sha256Hook(input: Buffer, output: Buffer): number | Error;
type HMACHook = (key: Buffer, input: Buffer, output: Buffer) => number | Error;
export declare function makeHmacHook(algorithm: 'sha512' | 'sha256'): HMACHook;
export declare function signRsaSha256Hook(key: Buffer, input: Buffer, output: Buffer): number | Error;
export declare const aes256CbcEncryptHook: AES256Callback;
export declare const aes256CbcDecryptHook: AES256Callback;
export declare const aes256CtrEncryptHook: AES256Callback;
export declare const aes256CtrDecryptHook: AES256Callback;
export declare const hmacSha512Hook: HMACHook;
export declare const hmacSha256Hook: HMACHook;
export {};
//# sourceMappingURL=crypto_callbacks.d.ts.map