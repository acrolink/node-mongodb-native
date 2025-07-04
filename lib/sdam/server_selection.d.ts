import { ReadPreference } from '../read_preference';
import type { ServerDescription } from './server_description';
import type { TopologyDescription } from './topology_description';
export declare const MIN_SECONDARY_WRITE_WIRE_VERSION = 13;
/** @internal */
export type ServerSelector = (topologyDescription: TopologyDescription, servers: ServerDescription[], deprioritized?: ServerDescription[]) => ServerDescription[];
/**
 * Returns a server selector that selects for writable servers
 */
export declare function writableServerSelector(): ServerSelector;
/**
 * The purpose of this selector is to select the same server, only
 * if it is in a state that it can have commands sent to it.
 */
export declare function sameServerSelector(description?: ServerDescription): ServerSelector;
/**
 * Returns a server selector that uses a read preference to select a
 * server potentially for a write on a secondary.
 */
export declare function secondaryWritableServerSelector(wireVersion?: number, readPreference?: ReadPreference): ServerSelector;
/**
 * Returns a function which selects servers based on a provided read preference
 *
 * @param readPreference - The read preference to select with
 */
export declare function readPreferenceServerSelector(readPreference: ReadPreference): ServerSelector;
//# sourceMappingURL=server_selection.d.ts.map