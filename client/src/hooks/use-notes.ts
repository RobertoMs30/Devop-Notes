
import { useState, useEffect } from "react";
import { Note, InsertNote, UpdateNote } from "@shared/schema";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  // Load notes from API on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Update filtered notes when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      if (response.ok) {
        const fetchedNotes = await response.json();
        setNotes(fetchedNotes);
        setFilteredNotes(fetchedNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const createNote = async (noteData: InsertNote) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes(prev => [newNote, ...prev]);
        return { success: true };
      } else {
        const errorData = await response.json();
        console.error('Error creating note:', errorData);
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error creating note:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const updateNote = async (noteData: UpdateNote) => {
    try {
      const response = await fetch(`/api/notes/${noteData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(prev => prev.map(note => 
          note.id === noteData.id ? updatedNote : note
        ));
        return { success: true };
      } else {
        const errorData = await response.json();
        console.error('Error updating note:', errorData);
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error updating note:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const deleteNote = async (noteId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setNotes(prev => prev.filter(note => note.id !== noteId));
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
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
