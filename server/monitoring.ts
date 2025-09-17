
import { db } from "./db";
import { eventLogs, InsertEventLog } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { Request } from "express";

export class MonitoringService {
  static async logEvent(
    eventType: string,
    eventMessage: string,
    req?: Request
  ) {
    try {
      const eventData: InsertEventLog = {
        eventType,
        eventMessage,
        userAgent: req?.get('User-Agent') || null,
        ipAddress: req?.ip || req?.connection?.remoteAddress || null,
      };

      await db.insert(eventLogs).values(eventData);
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  static async getRecentEvents(limit: number = 100) {
    try {
      return await db
        .select()
        .from(eventLogs)
        .orderBy(eventLogs.eventTime)
        .limit(limit);
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  static async getEventsByType(eventType: string, limit: number = 50) {
    try {
      return await db
        .select()
        .from(eventLogs)
        .where(eq(eventLogs.eventType, eventType))
        .orderBy(eventLogs.eventTime)
        .limit(limit);
    } catch (error) {
      console.error('Error fetching events by type:', error);
      return [];
    }
  }
}
