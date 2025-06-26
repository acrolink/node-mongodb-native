import { ReadPreference, type ReadPreferenceLike } from '../../read_preference';
import type { Server } from '../../sdam/server';
import type { Topology } from '../../sdam/topology';
import type { Connection } from '../connection';
export interface ReadPreferenceOption {
    readPreference?: ReadPreferenceLike;
}
export declare function getReadPreference(options?: ReadPreferenceOption): ReadPreference;
export declare function isSharded(topologyOrServer?: Topology | Server | Connection): boolean;
//# sourceMappingURL=shared.d.ts.map