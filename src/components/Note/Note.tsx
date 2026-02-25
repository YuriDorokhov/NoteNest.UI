import type { NoteProps } from '../../types/Note';
import type { Note as NoteType } from '../../types/Note';
import { useState } from 'react';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ClearIcon from '@mui/icons-material/Clear';
import EditOffIcon from '@mui/icons-material/EditOff';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    IconButton,
    TextField,
    Typography,
    Tooltip,
    Box
} from '@mui/material';

export const Note = ({ note, onDelete, onEdit }: NoteProps) => {
    const isNewNote = note.title === '' && note.text === '';

    const [isEditing, setIsEditing] = useState<boolean>(isNewNote);
    const [editedNote, setEditedNote] = useState<NoteType>(note);

    const handleCancelOrDelete = async () => {

        // cancel editing this note.
        if (isEditing) {
            if(isNewNote){
                onDelete(note.id);
                return;
            }
            setEditedNote(note);
            setIsEditing(false);
            return;
        }

        // delete this note.
        onDelete(note.id);
    }

    const changeEditingState = () => {

        if (isEditing) {
            handleEdit()
        }

        setIsEditing(!isEditing);
    }

    const onNoteChanged = (field: keyof NoteType, value: string) => {
        setEditedNote(prev => ({ ...prev, [field]: value }));
    }

    const handleEdit = async () => {
        if (JSON.stringify(note) !== JSON.stringify(editedNote)) {
            note.title = editedNote.title;
            note.text = editedNote.text;
            onEdit(note);
        }
    }

    return (
        <Card
            sx={{
                width: 380,
                bgcolor: 'warning.50',
                borderRadius: 2,
                boxShadow: 3,
                alignItems: 'flex-start',
                textAlign: 'left',
                maxHeight: 300
            }}
        >
            <CardHeader
                title={
                    isEditing ? (
                        <TextField
                            variant="standard"
                            value={editedNote.title}
                            onChange={e => onNoteChanged('title', e.target.value)}
                            fullWidth
                        />
                    ) : (
                        <Typography variant="h6">{note.title}</Typography>
                    )
                }
                action={
                    <Box> 
                        <IconButton onClick={changeEditingState}>
                            {isEditing ? <CheckIcon /> : <EditIcon />}
                        </IconButton>
                        <IconButton onClick={handleCancelOrDelete}>
                            {isEditing ? <EditOffIcon /> : <ClearIcon />}
                        </IconButton>
                    </Box>
                }
            />

            <CardContent sx={{ pt: 0 }}>
                {isEditing ? (
                    <TextField
                        multiline
                        minRows={4}
                        value={editedNote.text}
                        onChange={e => onNoteChanged('text', e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                ) : (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {note.text}
                    </Typography>
                )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, mt: 'auto'}}>
                <Tooltip title={`Created on ${new Date(note.createdDate).toLocaleDateString()}` + (note.lastModifiedDate != null
                    ? `\nModified on ${new Date(note.lastModifiedDate).toLocaleDateString()}`
                    : '')} slotProps={{
                        tooltip: {
                            sx: { whiteSpace: 'pre-line' }
                        }
                    }}>
                    <span>
                        <IconButton disabled size="small">
                            <ScheduleIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default Note;