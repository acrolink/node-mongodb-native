import * as dns from 'dns';
import { TypedEventEmitter } from '../mongo_types';
/**
 * @internal
 * @category Event
 */
export declare class SrvPollingEvent {
    srvRecords: dns.SrvRecord[];
    constructor(srvRecords: dns.SrvRecord[]);
    hostnames(): Set<string>;
}
/** @internal */
export interface SrvPollerOptions {
    srvServiceName: string;
    srvMaxHosts: number;
    srvHost: string;
    heartbeatFrequencyMS: number;
}
/** @internal */
export type SrvPollerEvents = {
    srvRecordDiscovery(event: SrvPollingEvent): void;
};
/** @internal */
export declare class SrvPoller extends TypedEventEmitter<SrvPollerEvents> {
    srvHost: string;
    rescanSrvIntervalMS: number;
    heartbeatFrequencyMS: number;
    haMode: boolean;
    generation: number;
    srvMaxHosts: number;
    srvServiceName: string;
    _timeout?: NodeJS.Timeout;
    /** @event */
    static readonly SRV_RECORD_DISCOVERY: "srvRecordDiscovery";
    constructor(options: SrvPollerOptions);
    get srvAddress(): string;
    get intervalMS(): number;
    start(): void;
    stop(): void;
    schedule(): void;
    success(srvRecords: dns.SrvRecord[]): void;
    failure(): void;
    _poll(): Promise<void>;
}
//# sourceMappingURL=srv_polling.d.ts.map