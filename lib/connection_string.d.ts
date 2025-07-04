import { MongoClient, type MongoClientOptions, type MongoOptions } from './mongo_client';
import { HostAddress } from './utils';
/**
 * Lookup a `mongodb+srv` connection string, combine the parts and reparse it as a normal
 * connection string.
 *
 * @param uri - The connection string to parse
 * @param options - Optional user provided connection string options
 */
export declare function resolveSRVRecord(options: MongoOptions): Promise<HostAddress[]>;
declare class CaseInsensitiveMap<Value = any> extends Map<string, Value> {
    constructor(entries?: Array<[string, any]>);
    has(k: string): boolean;
    get(k: string): Value | undefined;
    set(k: string, v: any): this;
    delete(k: string): boolean;
}
export declare function parseOptions(uri: string, mongoClient?: MongoClient | MongoClientOptions | undefined, options?: MongoClientOptions): MongoOptions;
interface OptionDescriptor {
    target?: string;
    type?: 'boolean' | 'int' | 'uint' | 'record' | 'string' | 'any';
    default?: any;
    deprecated?: boolean | string;
    /**
     * @param name - the original option name
     * @param options - the options so far for resolution
     * @param values - the possible values in precedence order
     */
    transform?: (args: {
        name: string;
        options: MongoOptions;
        values: unknown[];
    }) => unknown;
}
export declare const OPTIONS: Record<keyof MongoClientOptions, OptionDescriptor>;
export declare const DEFAULT_OPTIONS: CaseInsensitiveMap<any>;
export {};
//# sourceMappingURL=connection_string.d.ts.map