import { useState, useEffect } from "react";
import { Note, InsertNote, UpdateNote } from "@shared/schema";
import { localStorageService } from "@/lib/localStorage";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorageService.getNotes();
    setNotes(savedNotes);
    setFilteredNotes(savedNotes);
  }, []);

  // Update filtered notes when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = localStorageService.searchNotes(searchQuery);
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const createNote = (noteData: InsertNote) => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorageService.addNote(newNote);
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (noteData: UpdateNote) => {
    const updatedNote: Note = {
      ...notes.find(n => n.id === noteData.id)!,
      ...noteData,
      updatedAt: new Date(),
    };

    localStorageService.updateNote(updatedNote);
    setNotes(prev => prev.map(note => 
      note.id === noteData.id ? updatedNote : note
    ));
  };

  const deleteNote = (noteId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      localStorageService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const search = (query: string) => {
    setSearchQuery(query);
  };

  return {
    notes: filteredNotes,
    searchQuery,
    createNote,
    updateNote,
    deleteNote,
    search,
  };
}
