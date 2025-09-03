import { useState } from "react";
import { NoteForm } from "@/components/note-form";
import { SearchBar } from "@/components/search-bar";
import { NoteList } from "@/components/note-list";
import { useNotes } from "@/hooks/use-notes";
import { Note } from "@shared/schema";

export default function Home() {
  const { notes, searchQuery, createNote, updateNote, deleteNote, search } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleSubmit = (noteData: any) => {
    if (editingNote) {
      updateNote({ ...noteData, id: editingNote.id });
      setEditingNote(null);
    } else {
      createNote(noteData);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-foreground" data-testid="page-title">
            Gestor de notas online
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <NoteForm 
          onSubmit={handleSubmit} 
          editingNote={editingNote}
          onCancelEdit={handleCancelEdit}
        />
        
        <SearchBar 
          searchQuery={searchQuery} 
          onSearch={search} 
        />
        
        <NoteList 
          notes={notes} 
          onEdit={handleEdit} 
          onDelete={deleteNote} 
        />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 Roberto Mireles Sánchez - Gestor de Notas Online</p>
            <p className="mt-2 sm:mt-0">Proyecto DevOps - Metodología CI/CD</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
