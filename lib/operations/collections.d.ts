import { Collection } from '../collection';
import type { Db } from '../db';
import type { Server } from '../sdam/server';
import type { ClientSession } from '../sessions';
import { AbstractOperation, type OperationOptions } from './operation';
export interface CollectionsOptions extends OperationOptions {
    nameOnly?: boolean;
}
/** @internal */
export declare class CollectionsOperation extends AbstractOperation<Collection[]> {
    options: CollectionsOptions;
    db: Db;
    constructor(db: Db, options: CollectionsOptions);
    get commandName(): "listCollections";
    execute(server: Server, session: ClientSession | undefined): Promise<Collection[]>;
}
//# sourceMappingURL=collections.d.ts.map