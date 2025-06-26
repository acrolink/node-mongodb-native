import type { Document } from '../bson';
import type { Collection } from '../collection';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { AbstractOperation, type OperationOptions } from './operation';
/** @internal */
export declare class OptionsOperation extends AbstractOperation<Document> {
    options: OperationOptions;
    collection: Collection;
    constructor(collection: Collection, options: OperationOptions);
    get commandName(): "listCollections";
    execute(server: Server, session: ClientSession | undefined): Promise<Document>;
}
//# sourceMappingURL=options_operation.d.ts.map