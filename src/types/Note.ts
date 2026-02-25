export interface Note {
    id: string;
    createdDate: string;
    lastModifiedDate: string;
    title: string;
    text: string;
}

export interface NoteProps {
    note: Note;
    onDelete: (id:string) => void;
    onEdit: (note: Note) => void;
}