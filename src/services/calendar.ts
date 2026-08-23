/**
 * Calendar service (mock). No external calendar provider is connected.
 */

import { mockCalendar } from "./mock/intelligence-data";
import type { CalendarEventDto } from "./types";

export const calendarService = {
  getCalendarEvents(): Promise<CalendarEventDto[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockCalendar), 300));
  },
};

export const calendarKeys = { events: ["calendar", "events"] as const };
