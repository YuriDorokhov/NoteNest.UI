import React, { useEffect, useState } from 'react';
import type { Note as NoteType } from '../types/Note';
import { createNote } from '../services/NoteService';
import { getNotes } from '../services/NoteService';
import { updateNote } from '../services/NoteService';
import { deleteNote } from '../services/NoteService';
import Note from '../components/Note/Note';
import Button from '@mui/material/Button';
// import { useNotesHub } from '../hooks/useNotesHub';
// import { ApiError } from '../types/ApiError';

const NotesList: React.FC = () => {
    const [label, setLabel] = useState<string>('..');
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasError, setError] = useState<boolean>(false);
    const [isCreatingNewNote, setIsCreatingNewNote] = useState<boolean>(false);
    const emptyId = "emptyId";

    const initialize = () => {
        setLabel('...');
    }

    // const handleResponse(response) => {

    // }

    const createNewNote = async () => {
        setIsCreatingNewNote(true);
        const newNote: NoteType = {
            id: emptyId,
            title: "",
            text: "",
            createdDate: "",
            lastModifiedDate: ""
        };
        setNotes(prevNotes => {
            return [...prevNotes, newNote];
        });
    }

    const handleUpdate = async (note: NoteType) => {

        if (note.id !== emptyId) {
            await updateNote(note.id, note);
        }
        else {
            setIsCreatingNewNote(false);
            note = await createNote({ title: note.title, text: note.text });
        }

        setNotes(prev => prev
            .map(n => (n.id === note.id || n.id === emptyId ? note : n)));
    }

    const fetchNotes = async () => {
        try {
            initialize();
            setLoading(true);
            const data = await getNotes();
            setNotes(data);
        } catch (error) {
            setError(true);
            console.error('Failed to fetch notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {

        if (id !== emptyId) {
            await deleteNote(id);
        }

        setIsCreatingNewNote(false);
        setNotes(prev => prev.filter(note => note.id && note.id !== id));
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Receives updates from the server.
    // useNotesHub(
    //     newNote => {
    //         setNotes(prevNotes => {
    //             const exists = prevNotes.some(note => note.id === newNote.id);
    //             if (exists) return prevNotes;
    //             return [...prevNotes, newNote];
    //         });
    //     },
    //     updatedNote => { setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n)) },
    //     deletedNoteId => { setNotes(prev => prev.filter(n => n.id !== deletedNoteId)) });

    if (hasError) return <p>Failed to fetch notes</p>
    if (loading) return <p>Loading notes...</p>;

    return (
        <div>
            <h1>{label}</h1>
            {notes.length === 0 ? (
                <p>There are no notes yet..</p>
            ) : (
                <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {notes
                            .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
                            .map(note => (
                                <Note key={note.id} note={note}
                                    onDelete={handleDelete}
                                    onEdit={handleUpdate} />
                            ))}
                    </div>
                </>
            )}
            <Button sx={{ mt: 2 }} variant="contained" disabled={isCreatingNewNote} onClick={createNewNote} >Add new note</Button>
        </div>
    );
};

export default NotesList;