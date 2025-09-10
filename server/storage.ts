import { type User, type InsertUser, type Note, type InsertNote, type UpdateNote, notes, users } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllNotes(): Promise<Note[]> {
    return await db.select().from(notes).orderBy(desc(notes.createdAt));
  }

  async getNote(id: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note || undefined;
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values(insertNote)
      .returning();
    return note;
  }

  async updateNote(updateNote: UpdateNote): Promise<Note> {
    const [note] = await db
      .update(notes)
      .set({
        title: updateNote.title,
        content: updateNote.content,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, updateNote.id))
      .returning();
    
    if (!note) {
      throw new Error("Note not found");
    }
    
    return note;
  }

  async deleteNote(id: string): Promise<void> {
    const result = await db.delete(notes).where(eq(notes.id, id));
    if (result.rowCount === 0) {
      throw new Error("Note not found");
    }
  }
}

export const storage = new DatabaseStorage();
