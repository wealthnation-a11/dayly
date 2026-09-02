/**
 * Notifications service facade facade. Wraps the existing Dayly data layer.
 */

import { daylyService } from "@/lib/dayly/service";
import type { DaylyNotification } from "@/lib/dayly/types";

export const notificationsService = {
  getNotifications: (): Promise<DaylyNotification[]> => daylyService.getNotifications(),
  getUnreadCount: async (): Promise<number> => {
    const list = await daylyService.getNotifications();
    return list.filter((n) => !n.read).length;
  },
};

export const notificationKeys = { list: ["notifications"] as const };
