import { EventEmitter } from 'node:events';

export interface SystemEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

class EventBus {
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  emit(type: string, data: Record<string, unknown>): void {
    const event: SystemEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    this.emitter.emit('event', event);
  }

  subscribe(listener: (event: SystemEvent) => void): () => void {
    this.emitter.on('event', listener);
    return () => {
      this.emitter.off('event', listener);
    };
  }
}

export const eventBus = new EventBus();
