/** @public */
export type SortDirection = 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending' | {
    readonly $meta: string;
};
/** @public */
export type Sort = string | Exclude<SortDirection, {
    readonly $meta: string;
}> | ReadonlyArray<string> | {
    readonly [key: string]: SortDirection;
} | ReadonlyMap<string, SortDirection> | ReadonlyArray<readonly [string, SortDirection]> | readonly [string, SortDirection];
/** Below stricter types were created for sort that correspond with type that the cmd takes  */
/** @public */
export type SortDirectionForCmd = 1 | -1 | {
    $meta: string;
};
/** @public */
export type SortForCmd = Map<string, SortDirectionForCmd>;
/** converts a Sort type into a type that is valid for the server (SortForCmd) */
export declare function formatSort(sort: Sort | undefined, direction?: SortDirection): SortForCmd | undefined;
//# sourceMappingURL=sort.d.ts.map