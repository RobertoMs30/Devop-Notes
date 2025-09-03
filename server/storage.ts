import { type User, type InsertUser, type Note, type InsertNote, type UpdateNote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Notes operations
  getAllNotes(): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(note: UpdateNote): Promise<Note>;
  deleteNote(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private notes: Map<string, Note>;

  constructor() {
    this.users = new Map();
    this.notes = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = {
      ...insertNote,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(updateNote: UpdateNote): Promise<Note> {
    const existingNote = this.notes.get(updateNote.id);
    if (!existingNote) {
      throw new Error("Note not found");
    }
    
    const updatedNote: Note = {
      ...existingNote,
      title: updateNote.title,
      content: updateNote.content,
      updatedAt: new Date(),
    };
    
    this.notes.set(updateNote.id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<void> {
    if (!this.notes.has(id)) {
      throw new Error("Note not found");
    }
    this.notes.delete(id);
  }
}

export const storage = new MemStorage();
