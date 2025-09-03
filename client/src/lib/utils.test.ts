import { localStorageService } from './localStorage';
import { Note } from '@shared/schema';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('localStorage Service', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const mockNote: Note = {
    id: '1',
    title: 'Test Note',
    content: 'This is a test note content',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  test('should return empty array when no notes exist', () => {
    const notes = localStorageService.getNotes();
    expect(notes).toEqual([]);
  });

  test('should save and retrieve notes', () => {
    const notes = [mockNote];
    localStorageService.saveNotes(notes);
    
    const retrievedNotes = localStorageService.getNotes();
    expect(retrievedNotes).toEqual(notes);
  });

  test('should add note to beginning of list', () => {
    const existingNote: Note = {
      id: '2',
      title: 'Existing Note',
      content: 'Existing content',
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-02'),
    };
    
    localStorageService.saveNotes([existingNote]);
    localStorageService.addNote(mockNote);
    
    const notes = localStorageService.getNotes();
    expect(notes[0]).toEqual(mockNote);
    expect(notes[1]).toEqual(existingNote);
  });

  test('should update existing note', () => {
    localStorageService.saveNotes([mockNote]);
    
    const updatedNote: Note = {
      ...mockNote,
      title: 'Updated Title',
      content: 'Updated content',
    };
    
    localStorageService.updateNote(updatedNote);
    
    const notes = localStorageService.getNotes();
    expect(notes[0]).toEqual(updatedNote);
  });

  test('should delete note', () => {
    localStorageService.saveNotes([mockNote]);
    localStorageService.deleteNote(mockNote.id);
    
    const notes = localStorageService.getNotes();
    expect(notes).toEqual([]);
  });

  test('should search notes by title', () => {
    const notes = [
      mockNote,
      {
        id: '2',
        title: 'Another Note',
        content: 'Different content',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    localStorageService.saveNotes(notes);
    
    const results = localStorageService.searchNotes('Test');
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(mockNote);
  });

  test('should search notes by content', () => {
    const notes = [
      mockNote,
      {
        id: '2',
        title: 'Another Note',
        content: 'Different content',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    localStorageService.saveNotes(notes);
    
    const results = localStorageService.searchNotes('test note content');
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(mockNote);
  });

  test('should return all notes when search query is empty', () => {
    const notes = [mockNote];
    localStorageService.saveNotes(notes);
    
    const results = localStorageService.searchNotes('');
    expect(results).toEqual(notes);
  });
});
