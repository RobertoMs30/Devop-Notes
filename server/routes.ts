import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, updateNoteSchema } from "@shared/schema";
import { MonitoringService } from "./monitoring";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getAllNotes();
      await MonitoringService.logEvent("INFO", "Notes retrieved successfully", req);
      res.json(notes);
    } catch (error) {
      await MonitoringService.logEvent("ERROR", "Failed to fetch notes", req);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  // Get single note
  app.get("/api/notes/:id", async (req, res) => {
    try {
      const note = await storage.getNote(req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  // Create note
  app.post("/api/notes", async (req, res) => {
    try {
      const validatedNote = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validatedNote);
      await MonitoringService.logEvent("INFO", `Note created: ${note.title}`, req);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        await MonitoringService.logEvent("WARN", "Invalid note data provided", req);
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      await MonitoringService.logEvent("ERROR", "Failed to create note", req);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  // Update note
  app.put("/api/notes/:id", async (req, res) => {
    try {
      const validatedNote = updateNoteSchema.parse({
        ...req.body,
        id: req.params.id,
      });
      const note = await storage.updateNote(validatedNote);
      await MonitoringService.logEvent("INFO", `Note updated: ${note.title}`, req);
      res.json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        await MonitoringService.logEvent("WARN", "Invalid note data for update", req);
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      if (error instanceof Error && error.message === "Note not found") {
        await MonitoringService.logEvent("WARN", `Note not found for update: ${req.params.id}`, req);
        return res.status(404).json({ message: "Note not found" });
      }
      await MonitoringService.logEvent("ERROR", `Failed to update note: ${req.params.id}`, req);
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  // Delete note
  app.delete("/api/notes/:id", async (req, res) => {
    try {
      await storage.deleteNote(req.params.id);
      await MonitoringService.logEvent("INFO", `Note deleted: ${req.params.id}`, req);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Note not found") {
        await MonitoringService.logEvent("WARN", `Note not found for deletion: ${req.params.id}`, req);
        return res.status(404).json({ message: "Note not found" });
      }
      await MonitoringService.logEvent("ERROR", `Failed to delete note: ${req.params.id}`, req);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Monitoring endpoints
  app.get("/api/monitoring/events", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const events = await MonitoringService.getRecentEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/monitoring/events/:type", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const events = await MonitoringService.getEventsByType(req.params.type, limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by type" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
