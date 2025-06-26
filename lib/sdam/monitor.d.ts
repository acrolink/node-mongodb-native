import type { Connection, ConnectionOptions } from '../cmap/connection';
import { MongoError } from '../error';
import { CancellationToken, TypedEventEmitter } from '../mongo_types';
import { type Callback, type EventEmitterWithState } from '../utils';
import { ServerHeartbeatFailedEvent, ServerHeartbeatStartedEvent, ServerHeartbeatSucceededEvent } from './events';
import { Server } from './server';
/** @public */
export declare const ServerMonitoringMode: Readonly<{
    readonly auto: "auto";
    readonly poll: "poll";
    readonly stream: "stream";
}>;
/** @public */
export type ServerMonitoringMode = (typeof ServerMonitoringMode)[keyof typeof ServerMonitoringMode];
/** @internal */
export interface MonitorPrivate {
    state: string;
}
/** @public */
export interface MonitorOptions extends Omit<ConnectionOptions, 'id' | 'generation' | 'hostAddress'> {
    connectTimeoutMS: number;
    heartbeatFrequencyMS: number;
    minHeartbeatFrequencyMS: number;
    serverMonitoringMode: ServerMonitoringMode;
}
/** @public */
export type MonitorEvents = {
    serverHeartbeatStarted(event: ServerHeartbeatStartedEvent): void;
    serverHeartbeatSucceeded(event: ServerHeartbeatSucceededEvent): void;
    serverHeartbeatFailed(event: ServerHeartbeatFailedEvent): void;
    resetServer(error?: MongoError): void;
    resetConnectionPool(): void;
    close(): void;
} & EventEmitterWithState;
/** @internal */
export declare class Monitor extends TypedEventEmitter<MonitorEvents> {
    /** @internal */
    s: MonitorPrivate;
    address: string;
    options: Readonly<Pick<MonitorOptions, 'connectTimeoutMS' | 'heartbeatFrequencyMS' | 'minHeartbeatFrequencyMS' | 'serverMonitoringMode'>>;
    connectOptions: ConnectionOptions;
    isRunningInFaasEnv: boolean;
    server: Server;
    connection: Connection | null;
    cancellationToken: CancellationToken;
    /** @internal */
    monitorId?: MonitorInterval;
    rttPinger?: RTTPinger;
    /** @internal */
    component: "topology";
    /** @internal */
    private rttSampler;
    constructor(server: Server, options: MonitorOptions);
    connect(): void;
    requestCheck(): void;
    reset(): void;
    close(): void;
    get roundTripTime(): number;
    get minRoundTripTime(): number;
    get latestRtt(): number | null;
    addRttSample(rtt: number): void;
    clearRttSamples(): void;
}
/** @internal */
export interface RTTPingerOptions extends ConnectionOptions {
    heartbeatFrequencyMS: number;
}
/** @internal */
export declare class RTTPinger {
    connection?: Connection;
    /** @internal */
    cancellationToken: CancellationToken;
    /** @internal */
    monitorId: NodeJS.Timeout;
    /** @internal */
    monitor: Monitor;
    closed: boolean;
    /** @internal */
    latestRtt?: number;
    constructor(monitor: Monitor);
    get roundTripTime(): number;
    get minRoundTripTime(): number;
    close(): void;
    private measureAndReschedule;
    private measureRoundTripTime;
}
/**
 * @internal
 */
export interface MonitorIntervalOptions {
    /** The interval to execute a method on */
    heartbeatFrequencyMS: number;
    /** A minimum interval that must elapse before the method is called */
    minHeartbeatFrequencyMS: number;
    /** Whether the method should be called immediately when the interval is started  */
    immediate: boolean;
}
/**
 * @internal
 */
export declare class MonitorInterval {
    fn: (callback: Callback) => void;
    timerId: NodeJS.Timeout | undefined;
    lastExecutionEnded: number;
    isExpeditedCallToFnScheduled: boolean;
    stopped: boolean;
    isExecutionInProgress: boolean;
    hasExecutedOnce: boolean;
    heartbeatFrequencyMS: number;
    minHeartbeatFrequencyMS: number;
    constructor(fn: (callback: Callback) => void, options?: Partial<MonitorIntervalOptions>);
    wake(): void;
    stop(): void;
    toString(): string;
    toJSON(): {
        timerId: string;
        lastCallTime: number;
        isExpeditedCheckScheduled: boolean;
        stopped: boolean;
        heartbeatFrequencyMS: number;
        minHeartbeatFrequencyMS: number;
        currentTime: number;
        timeSinceLastCall: number;
    };
    private _reschedule;
    private _executeAndReschedule;
}
/** @internal
 * This class implements the RTT sampling logic specified for [CSOT](https://github.com/mongodb/specifications/blob/bbb335e60cd7ea1e0f7cd9a9443cb95fc9d3b64d/source/client-side-operations-timeout/client-side-operations-timeout.md#drivers-use-minimum-rtt-to-short-circuit-operations)
 *
 * This is implemented as a [circular buffer](https://en.wikipedia.org/wiki/Circular_buffer) keeping
 * the most recent `windowSize` samples
 * */
export declare class RTTSampler {
    /** Index of the next slot to be overwritten */
    private writeIndex;
    private length;
    private rttSamples;
    constructor(windowSize?: number);
    /**
     * Adds an rtt sample to the end of the circular buffer
     * When `windowSize` samples have been collected, `addSample` overwrites the least recently added
     * sample
     */
    addSample(sample: number): void;
    /**
     * When \< 2 samples have been collected, returns 0
     * Otherwise computes the minimum value samples contained in the buffer
     */
    min(): number;
    /**
     * Returns mean of samples contained in the buffer
     */
    average(): number;
    /**
     * Returns most recently inserted element in the buffer
     * Returns null if the buffer is empty
     * */
    get last(): number | null;
    /**
     * Clear the buffer
     * NOTE: this does not overwrite the data held in the internal array, just the pointers into
     * this array
     */
    clear(): void;
}
//# sourceMappingURL=monitor.d.ts.map