/**
 * Calendar service facade. No external calendar provider is connected.
 */

import { calendarEvents } from "./data/initial-data";
import type { CalendarEventDto } from "./types";

export const calendarService = {
  getCalendarEvents(): Promise<CalendarEventDto[]> {
    return new Promise((resolve) => setTimeout(() => resolve(calendarEvents), 300));
  },
};

export const calendarKeys = { events: ["calendar", "events"] as const };
