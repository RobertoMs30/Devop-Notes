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
  const [tagsInput, setTagsInput] = useState(
    editingNote?.tags?.join(", ") || ""
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Procesar etiquetas: normalizar y eliminar duplicados
    const processedTags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .filter((tag, index, arr) => arr.indexOf(tag) === index); // eliminar duplicados

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      tags: processedTags,
    };

    // Validación manual antes de enviar
    const newErrors: { [key: string]: string } = {};
    
    if (!noteData.title) {
      newErrors.title = "El título no puede estar vacío";
    }
    
    if (noteData.content.length < 10) {
      newErrors.content = "El contenido debe tener al menos 10 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingNote) {
      onSubmit({
        id: editingNote.id,
        ...noteData,
      });
    } else {
      onSubmit(noteData);
    }

    // Reset form if creating new note
    if (!editingNote) {
      setTitle("");
      setContent("");
      setTagsInput("");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setTagsInput("");
    setErrors({});
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
              className={errors.title ? "border-destructive" : ""}
              data-testid="input-title"
            />
            {errors.title && (
              <p className="text-destructive text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          <div className="mb-4">
            <Label htmlFor="noteContent" className="block text-sm font-medium text-foreground mb-2">
              Contenido
            </Label>
            <Textarea
              id="noteContent"
              rows={4}
              placeholder="Escribe el contenido de tu nota..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`resize-vertical ${errors.content ? "border-destructive" : ""}`}
              data-testid="input-content"
            />
            {errors.content && (
              <p className="text-destructive text-sm mt-1">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {content.length}/10 caracteres mínimos
            </p>
          </div>

          <div className="mb-6">
            <Label htmlFor="noteTags" className="block text-sm font-medium text-foreground mb-2">
              Etiquetas
            </Label>
            <Input
              type="text"
              id="noteTags"
              placeholder="DevOps, CI/CD, Examen (separadas por comas)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              data-testid="input-tags"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separa las etiquetas con comas. Los duplicados se eliminarán automáticamente.
            </p>
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
