import { type Document } from './bson';
import { AbstractCursor } from './cursor/abstract_cursor';
/** @public */
export declare const ExplainVerbosity: Readonly<{
    readonly queryPlanner: "queryPlanner";
    readonly queryPlannerExtended: "queryPlannerExtended";
    readonly executionStats: "executionStats";
    readonly allPlansExecution: "allPlansExecution";
}>;
/** @public */
export type ExplainVerbosity = string;
/**
 * For backwards compatibility, true is interpreted as "allPlansExecution"
 * and false as "queryPlanner".
 * @public
 */
export type ExplainVerbosityLike = ExplainVerbosity | boolean;
/** @public */
export interface ExplainCommandOptions {
    /** The explain verbosity for the command. */
    verbosity: ExplainVerbosity;
    /** The maxTimeMS setting for the command. */
    maxTimeMS?: number;
}
/**
 * @public
 *
 * When set, this configures an explain command.  Valid values are boolean (for legacy compatibility,
 * see {@link ExplainVerbosityLike}), a string containing the explain verbosity, or an object containing the verbosity and
 * an optional maxTimeMS.
 *
 * Examples of valid usage:
 *
 * ```typescript
 * collection.find({ name: 'john doe' }, { explain: true });
 * collection.find({ name: 'john doe' }, { explain: false });
 * collection.find({ name: 'john doe' }, { explain: 'queryPlanner' });
 * collection.find({ name: 'john doe' }, { explain: { verbosity: 'queryPlanner' } });
 * ```
 *
 * maxTimeMS can be configured to limit the amount of time the server
 * spends executing an explain by providing an object:
 *
 * ```typescript
 * // limits the `explain` command to no more than 2 seconds
 * collection.find({ name: 'john doe' }, {
 *   explain:  {
 *    verbosity: 'queryPlanner',
 *    maxTimeMS: 2000
 *  }
 * });
 * ```
 */
export interface ExplainOptions {
    /** Specifies the verbosity mode for the explain output. */
    explain?: ExplainVerbosityLike | ExplainCommandOptions;
}
/** @internal */
export declare class Explain {
    readonly verbosity: ExplainVerbosity;
    readonly maxTimeMS?: number;
    private constructor();
    static fromOptions({ explain }?: ExplainOptions): Explain | undefined;
}
export declare function validateExplainTimeoutOptions(options: Document, explain?: Explain): void;
/**
 * Applies an explain to a given command.
 * @internal
 *
 * @param command - the command on which to apply the explain
 * @param options - the options containing the explain verbosity
 */
export declare function decorateWithExplain(command: Document, explain: Explain): {
    explain: Document;
    verbosity: ExplainVerbosity;
    maxTimeMS?: number;
};
/**
 * @public
 *
 * A base class for any cursors that have `explain()` methods.
 */
export declare abstract class ExplainableCursor<TSchema> extends AbstractCursor<TSchema> {
    /** Execute the explain for the cursor */
    abstract explain(): Promise<Document>;
    abstract explain(verbosity: ExplainVerbosityLike | ExplainCommandOptions): Promise<Document>;
    abstract explain(options: {
        timeoutMS?: number;
    }): Promise<Document>;
    abstract explain(verbosity: ExplainVerbosityLike | ExplainCommandOptions, options: {
        timeoutMS?: number;
    }): Promise<Document>;
    abstract explain(verbosity?: ExplainVerbosityLike | ExplainCommandOptions | {
        timeoutMS?: number;
    }, options?: {
        timeoutMS?: number;
    }): Promise<Document>;
    protected resolveExplainTimeoutOptions(verbosity?: ExplainVerbosityLike | ExplainCommandOptions | {
        timeoutMS?: number;
    }, options?: {
        timeoutMS?: number;
    }): {
        timeout?: {
            timeoutMS?: number;
        };
        explain?: ExplainVerbosityLike | ExplainCommandOptions;
    };
}
//# sourceMappingURL=explain.d.ts.map