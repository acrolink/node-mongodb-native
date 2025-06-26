import type { ChildProcess } from 'child_process';
import { type AutoEncryptionExtraOptions } from './auto_encrypter';
/**
 * @internal
 * An internal class that handles spawning a mongocryptd.
 */
export declare class MongocryptdManager {
    static DEFAULT_MONGOCRYPTD_URI: string;
    uri: string;
    bypassSpawn: boolean;
    spawnPath: string;
    spawnArgs: Array<string>;
    _child?: ChildProcess;
    constructor(extraOptions?: AutoEncryptionExtraOptions);
    /**
     * Will check to see if a mongocryptd is up. If it is not up, it will attempt
     * to spawn a mongocryptd in a detached process, and then wait for it to be up.
     */
    spawn(): Promise<void>;
    /**
     * @returns the result of `fn` or rejects with an error.
     */
    withRespawn<T>(fn: () => Promise<T>): ReturnType<typeof fn>;
}
//# sourceMappingURL=mongocryptd_manager.d.ts.map