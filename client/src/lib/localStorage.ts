import { Note } from "@shared/schema";

const NOTES_KEY = "notes";

export const localStorageService = {
  getNotes(): Note[] {
    try {
      const notes = localStorage.getItem(NOTES_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error("Failed to load notes from localStorage:", error);
      return [];
    }
  },

  saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error);
    }
  },

  addNote(note: Note): void {
    const notes = this.getNotes();
    notes.unshift(note); // Add to beginning for newest first
    this.saveNotes(notes);
  },

  updateNote(updatedNote: Note): void {
    const notes = this.getNotes();
    const index = notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      notes[index] = updatedNote;
      this.saveNotes(notes);
    }
  },

  deleteNote(noteId: string): void {
    const notes = this.getNotes();
    const filteredNotes = notes.filter(note => note.id !== noteId);
    this.saveNotes(filteredNotes);
  },

  searchNotes(query: string): Note[] {
    const notes = this.getNotes();
    if (!query.trim()) return notes;
    
    const searchTerm = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm)
    );
  }
};
