import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";
import { InsertNote, UpdateNote, Note } from "@shared/schema";

interface NoteFormProps {
  onSubmit: (note: InsertNote | UpdateNote) => void;
  editingNote?: Note | null;
  onCancelEdit?: () => void;
}

export function NoteForm({ onSubmit, editingNote, onCancelEdit }: NoteFormProps) {
  const [title, setTitle] = useState(editingNote?.title || "");
  const [content, setContent] = useState(editingNote?.content || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;

    if (editingNote) {
      onSubmit({
        id: editingNote.id,
        title: title.trim(),
        content: content.trim(),
      });
    } else {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
      });
    }

    // Reset form if creating new note
    if (!editingNote) {
      setTitle("");
      setContent("");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    onCancelEdit?.();
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} data-testid="note-form">
          <div className="mb-4">
            <Label htmlFor="noteTitle" className="block text-sm font-medium text-foreground mb-2">
              Título
            </Label>
            <Input
              type="text"
              id="noteTitle"
              placeholder="Ingresa el título de tu nota..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="input-title"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="noteContent" className="block text-sm font-medium text-foreground mb-2">
              Contenido
            </Label>
            <Textarea
              id="noteContent"
              rows={4}
              placeholder="Escribe el contenido de tu nota..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="resize-vertical"
              data-testid="input-content"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="inline-flex items-center"
              data-testid="button-save"
            >
              <Save className="mr-2 h-4 w-4" />
              {editingNote ? "Actualizar" : "Guardar"}
            </Button>
            
            {editingNote && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
