/* eslint-disable @typescript-eslint/no-explicit-any */

import { EventEmitter } from "events";

export const eventHub = new EventEmitter();

export const EVENT_STATUS = {
  STARTED: "started",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
  SUCCESS: "success",
  FINISHED: "finished"
};

class EventTracker {
  private events: Record<string, any> = {};

  constructor() {}

  public emit(event: string, status: string, data: any) {
    this.events[event] = { status, data };
    eventHub.emit(`${event}:${status}`, { data, status });
    if (
      status === EVENT_STATUS.CANCELLED ||
      status === EVENT_STATUS.REJECTED ||
      status === EVENT_STATUS.SUCCESS
    ) {
      eventHub.emit(`${event}:${EVENT_STATUS.FINISHED}`, { status, data });
    }
  }

  public getEvent(event: string) {
    return this.events[event];
  }
}

let eventInstance: EventTracker | null = null;

const SharedEventTracker = {
  init: () => {
    if (!eventInstance) {
      eventInstance = new EventTracker();
    }
  },
  startAction: (event: string, data: any) => {
    eventInstance?.emit(event, EVENT_STATUS.STARTED, data);
  },
  cancelAction: (event: string, data: any) => {
    eventInstance?.emit(event, EVENT_STATUS.CANCELLED, data);
  },
  rejectAction: (event: string, data: any) => {
    eventInstance?.emit(event, EVENT_STATUS.REJECTED, data);
  },
  successAction: (event: string, data: any) => {
    eventInstance?.emit(event, EVENT_STATUS.SUCCESS, data);
  },
  getStatus: (event: string) => eventInstance?.getEvent(event),
  startActionAsync: async (event: string, data: any) =>
    new Promise((resolve, reject) => {
      eventInstance?.emit(event, EVENT_STATUS.STARTED, data);
      eventHub.once(`${event}:${EVENT_STATUS.SUCCESS}`, ({ data, status }) => {
        eventHub.off(`${event}:${EVENT_STATUS.FINISHED}`, () => {});
        switch (status) {
          case EVENT_STATUS.SUCCESS:
            return resolve(data);
          case EVENT_STATUS.CANCELLED:
            return reject(new Error("Cancelled"));
          case EVENT_STATUS.REJECTED:
            return reject(new Error("Rejected"));
          default:
            return reject(new Error("Action failed with unknown reason. Please try again."));
        }
      });
    }),
  hub: eventHub
};

export default SharedEventTracker;
