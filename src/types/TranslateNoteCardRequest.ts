import type { NoteCard } from '../types/NoteCard';

export interface TranslateNoteCardRequest {
    noteCard: NoteCard;

    sourceLanguage: string;
    targetLanguage: string;
}