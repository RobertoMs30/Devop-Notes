import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, updateNoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getAllNotes();
      res.json(notes);
    } catch (error) {
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
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
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
      res.json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      if (error instanceof Error && error.message === "Note not found") {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  // Delete note
  app.delete("/api/notes/:id", async (req, res) => {
    try {
      await storage.deleteNote(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Note not found") {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
