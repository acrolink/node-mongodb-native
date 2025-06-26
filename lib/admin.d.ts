import { type Document } from './bson';
import type { Db } from './db';
import type { CommandOperationOptions } from './operations/command';
import { type ListDatabasesOptions, type ListDatabasesResult } from './operations/list_databases';
import { type RemoveUserOptions } from './operations/remove_user';
import { type RunCommandOptions } from './operations/run_command';
import { type ValidateCollectionOptions } from './operations/validate_collection';
/** @internal */
export interface AdminPrivate {
    db: Db;
}
/**
 * The **Admin** class is an internal class that allows convenient access to
 * the admin functionality and commands for MongoDB.
 *
 * **ADMIN Cannot directly be instantiated**
 * @public
 *
 * @example
 * ```ts
 * import { MongoClient } from 'mongodb';
 *
 * const client = new MongoClient('mongodb://localhost:27017');
 * const admin = client.db().admin();
 * const dbInfo = await admin.listDatabases();
 * for (const db of dbInfo.databases) {
 *   console.log(db.name);
 * }
 * ```
 */
export declare class Admin {
    /** @internal */
    s: AdminPrivate;
    /**
     * Create a new Admin instance
     * @internal
     */
    constructor(db: Db);
    /**
     * Execute a command
     *
     * The driver will ensure the following fields are attached to the command sent to the server:
     * - `lsid` - sourced from an implicit session or options.session
     * - `$readPreference` - defaults to primary or can be configured by options.readPreference
     * - `$db` - sourced from the name of this database
     *
     * If the client has a serverApi setting:
     * - `apiVersion`
     * - `apiStrict`
     * - `apiDeprecationErrors`
     *
     * When in a transaction:
     * - `readConcern` - sourced from readConcern set on the TransactionOptions
     * - `writeConcern` - sourced from writeConcern set on the TransactionOptions
     *
     * Attaching any of the above fields to the command will have no effect as the driver will overwrite the value.
     *
     * @param command - The command to execute
     * @param options - Optional settings for the command
     */
    command(command: Document, options?: RunCommandOptions): Promise<Document>;
    /**
     * Retrieve the server build information
     *
     * @param options - Optional settings for the command
     */
    buildInfo(options?: CommandOperationOptions): Promise<Document>;
    /**
     * Retrieve the server build information
     *
     * @param options - Optional settings for the command
     */
    serverInfo(options?: CommandOperationOptions): Promise<Document>;
    /**
     * Retrieve this db's server status.
     *
     * @param options - Optional settings for the command
     */
    serverStatus(options?: CommandOperationOptions): Promise<Document>;
    /**
     * Ping the MongoDB server and retrieve results
     *
     * @param options - Optional settings for the command
     */
    ping(options?: CommandOperationOptions): Promise<Document>;
    /**
     * Remove a user from a database
     *
     * @param username - The username to remove
     * @param options - Optional settings for the command
     */
    removeUser(username: string, options?: RemoveUserOptions): Promise<boolean>;
    /**
     * Validate an existing collection
     *
     * @param collectionName - The name of the collection to validate.
     * @param options - Optional settings for the command
     */
    validateCollection(collectionName: string, options?: ValidateCollectionOptions): Promise<Document>;
    /**
     * List the available databases
     *
     * @param options - Optional settings for the command
     */
    listDatabases(options?: ListDatabasesOptions): Promise<ListDatabasesResult>;
    /**
     * Get ReplicaSet status
     *
     * @param options - Optional settings for the command
     */
    replSetGetStatus(options?: CommandOperationOptions): Promise<Document>;
}
//# sourceMappingURL=admin.d.ts.map