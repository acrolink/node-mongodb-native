import type { Document } from '../bson';
import { ExplainableCursor, type ExplainCommandOptions, type ExplainVerbosityLike } from '../explain';
import type { MongoClient } from '../mongo_client';
import { type Abortable } from '../mongo_types';
import { type AggregateOptions } from '../operations/aggregate';
import type { ClientSession } from '../sessions';
import type { Sort } from '../sort';
import { type MongoDBNamespace } from '../utils';
import { type AbstractCursorOptions, type InitialCursorResponse } from './abstract_cursor';
/** @public */
export interface AggregationCursorOptions extends AbstractCursorOptions, AggregateOptions {
}
/**
 * The **AggregationCursor** class is an internal class that embodies an aggregation cursor on MongoDB
 * allowing for iteration over the results returned from the underlying query. It supports
 * one by one document iteration, conversion to an array or can be iterated as a Node 4.X
 * or higher stream
 * @public
 */
export declare class AggregationCursor<TSchema = any> extends ExplainableCursor<TSchema> {
    readonly pipeline: Document[];
    /** @internal */
    private aggregateOptions;
    /** @internal */
    constructor(client: MongoClient, namespace: MongoDBNamespace, pipeline?: Document[], options?: AggregateOptions & Abortable);
    clone(): AggregationCursor<TSchema>;
    map<T>(transform: (doc: TSchema) => T): AggregationCursor<T>;
    /** @internal */
    _initialize(session: ClientSession): Promise<InitialCursorResponse>;
    /** Execute the explain for the cursor */
    explain(): Promise<Document>;
    explain(verbosity: ExplainVerbosityLike | ExplainCommandOptions): Promise<Document>;
    explain(options: {
        timeoutMS?: number;
    }): Promise<Document>;
    explain(verbosity: ExplainVerbosityLike | ExplainCommandOptions, options: {
        timeoutMS?: number;
    }): Promise<Document>;
    /** Add a stage to the aggregation pipeline
     * @example
     * ```
     * const documents = await users.aggregate().addStage({ $match: { name: /Mike/ } }).toArray();
     * ```
     * @example
     * ```
     * const documents = await users.aggregate()
     *   .addStage<{ name: string }>({ $project: { name: true } })
     *   .toArray(); // type of documents is { name: string }[]
     * ```
     */
    addStage(stage: Document): this;
    addStage<T = Document>(stage: Document): AggregationCursor<T>;
    /** Add a group stage to the aggregation pipeline */
    group<T = TSchema>($group: Document): AggregationCursor<T>;
    /** Add a limit stage to the aggregation pipeline */
    limit($limit: number): this;
    /** Add a match stage to the aggregation pipeline */
    match($match: Document): this;
    /** Add an out stage to the aggregation pipeline */
    out($out: {
        db: string;
        coll: string;
    } | string): this;
    /**
     * Add a project stage to the aggregation pipeline
     *
     * @remarks
     * In order to strictly type this function you must provide an interface
     * that represents the effect of your projection on the result documents.
     *
     * By default chaining a projection to your cursor changes the returned type to the generic {@link Document} type.
     * You should specify a parameterized type to have assertions on your final results.
     *
     * @example
     * ```typescript
     * // Best way
     * const docs: AggregationCursor<{ a: number }> = cursor.project<{ a: number }>({ _id: 0, a: true });
     * // Flexible way
     * const docs: AggregationCursor<Document> = cursor.project({ _id: 0, a: true });
     * ```
     *
     * @remarks
     * In order to strictly type this function you must provide an interface
     * that represents the effect of your projection on the result documents.
     *
     * **Note for Typescript Users:** adding a transform changes the return type of the iteration of this cursor,
     * it **does not** return a new instance of a cursor. This means when calling project,
     * you should always assign the result to a new variable in order to get a correctly typed cursor variable.
     * Take note of the following example:
     *
     * @example
     * ```typescript
     * const cursor: AggregationCursor<{ a: number; b: string }> = coll.aggregate([]);
     * const projectCursor = cursor.project<{ a: number }>({ _id: 0, a: true });
     * const aPropOnlyArray: {a: number}[] = await projectCursor.toArray();
     *
     * // or always use chaining and save the final cursor
     *
     * const cursor = coll.aggregate().project<{ a: string }>({
     *   _id: 0,
     *   a: { $convert: { input: '$a', to: 'string' }
     * }});
     * ```
     */
    project<T extends Document = Document>($project: Document): AggregationCursor<T>;
    /** Add a lookup stage to the aggregation pipeline */
    lookup($lookup: Document): this;
    /** Add a redact stage to the aggregation pipeline */
    redact($redact: Document): this;
    /** Add a skip stage to the aggregation pipeline */
    skip($skip: number): this;
    /** Add a sort stage to the aggregation pipeline */
    sort($sort: Sort): this;
    /** Add a unwind stage to the aggregation pipeline */
    unwind($unwind: Document | string): this;
    /** Add a geoNear stage to the aggregation pipeline */
    geoNear($geoNear: Document): this;
}
//# sourceMappingURL=aggregation_cursor.d.ts.map