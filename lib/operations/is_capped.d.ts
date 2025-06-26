import type { Collection } from '../collection';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { AbstractOperation, type OperationOptions } from './operation';
/** @internal */
export declare class IsCappedOperation extends AbstractOperation<boolean> {
    options: OperationOptions;
    collection: Collection;
    constructor(collection: Collection, options: OperationOptions);
    get commandName(): "listCollections";
    execute(server: Server, session: ClientSession | undefined): Promise<boolean>;
}
//# sourceMappingURL=is_capped.d.ts.map