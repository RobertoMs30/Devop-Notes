import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, FileText } from "lucide-react";
import { Note } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export function NoteList({ notes, onEdit, onDelete }: NoteListProps) {
  const formatDate = (date: Date) => {
    return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
  };

  if (notes.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">Lista de notas</h2>
        <div className="text-center py-12 text-muted-foreground" data-testid="empty-state">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No hay notas guardadas</p>
          <p className="text-sm">Crea tu primera nota usando el formulario de arriba</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-foreground mb-4">Lista de notas</h2>
      <div className="space-y-4" data-testid="notes-list">
        {notes.map((note) => (
          <Card key={note.id} className="hover:shadow-md transition-shadow" data-testid={`note-card-${note.id}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-foreground" data-testid={`note-title-${note.id}`}>
                  {note.title}
                </h3>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
                    onClick={() => onEdit(note)}
                    title="Editar nota"
                    data-testid={`button-edit-${note.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    onClick={() => onDelete(note.id)}
                    title="Eliminar nota"
                    data-testid={`button-delete-${note.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-2" data-testid={`note-content-${note.id}`}>
                {truncateContent(note.content)}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span data-testid={`note-date-${note.id}`}>
                  {formatDate(note.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
