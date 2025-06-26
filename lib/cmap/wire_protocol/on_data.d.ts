import { type EventEmitter } from 'events';
import { type Abortable } from '../../mongo_types';
import { type TimeoutContext } from '../../timeout';
/**
 * onData is adapted from Node.js' events.on helper
 * https://nodejs.org/api/events.html#eventsonemitter-eventname-options
 *
 * Returns an AsyncIterator that iterates each 'data' event emitted from emitter.
 * It will reject upon an error event.
 */
export declare function onData(emitter: EventEmitter, { timeoutContext, signal }: {
    timeoutContext?: TimeoutContext;
} & Abortable): AsyncGenerator<Buffer, any, unknown>;
//# sourceMappingURL=on_data.d.ts.map