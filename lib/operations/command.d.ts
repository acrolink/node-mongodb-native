import type { BSONSerializeOptions, Document } from '../bson';
import { type MongoDBResponseConstructor } from '../cmap/wire_protocol/responses';
import { Explain, type ExplainOptions } from '../explain';
import { ReadConcern } from '../read_concern';
import type { ReadPreference } from '../read_preference';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { type TimeoutContext } from '../timeout';
import { MongoDBNamespace } from '../utils';
import { WriteConcern, type WriteConcernOptions } from '../write_concern';
import type { ReadConcernLike } from './../read_concern';
import { AbstractOperation, type OperationOptions } from './operation';
/** @public */
export interface CollationOptions {
    locale: string;
    caseLevel?: boolean;
    caseFirst?: string;
    strength?: number;
    numericOrdering?: boolean;
    alternate?: string;
    maxVariable?: string;
    backwards?: boolean;
    normalization?: boolean;
}
/** @public */
export interface CommandOperationOptions extends OperationOptions, WriteConcernOptions, ExplainOptions {
    /** Specify a read concern and level for the collection. (only MongoDB 3.2 or higher supported) */
    readConcern?: ReadConcernLike;
    /** Collation */
    collation?: CollationOptions;
    /**
     * maxTimeMS is a server-side time limit in milliseconds for processing an operation.
     */
    maxTimeMS?: number;
    /**
     * Comment to apply to the operation.
     *
     * In server versions pre-4.4, 'comment' must be string.  A server
     * error will be thrown if any other type is provided.
     *
     * In server versions 4.4 and above, 'comment' can be any valid BSON type.
     */
    comment?: unknown;
    /** Should retry failed writes */
    retryWrites?: boolean;
    dbName?: string;
    authdb?: string;
    noResponse?: boolean;
}
/** @internal */
export interface OperationParent {
    s: {
        namespace: MongoDBNamespace;
    };
    readConcern?: ReadConcern;
    writeConcern?: WriteConcern;
    readPreference?: ReadPreference;
    bsonOptions?: BSONSerializeOptions;
    timeoutMS?: number;
}
/** @internal */
export declare abstract class CommandOperation<T> extends AbstractOperation<T> {
    options: CommandOperationOptions;
    readConcern?: ReadConcern;
    writeConcern?: WriteConcern;
    explain?: Explain;
    constructor(parent?: OperationParent, options?: CommandOperationOptions);
    get canRetryWrite(): boolean;
    executeCommand<T extends MongoDBResponseConstructor>(server: Server, session: ClientSession | undefined, cmd: Document, timeoutContext: TimeoutContext, responseType: T | undefined): Promise<typeof responseType extends undefined ? Document : InstanceType<T>>;
    executeCommand(server: Server, session: ClientSession | undefined, cmd: Document, timeoutContext: TimeoutContext): Promise<Document>;
}
//# sourceMappingURL=command.d.ts.map