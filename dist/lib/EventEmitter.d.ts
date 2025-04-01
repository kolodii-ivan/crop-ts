/**
 * Simple EventEmitter implementation to replace jQuery events
 */
export declare class EventEmitter {
    private events;
    /**
     * Add an event listener
     */
    on(event: string, callback: Function): this;
    /**
     * Remove an event listener
     */
    off(event: string, callback?: Function): this;
    /**
     * Trigger an event
     */
    emit(event: string, ...args: any[]): this;
}
