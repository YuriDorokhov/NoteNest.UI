import axios from 'axios';
import type { NoteCard } from '../types/NoteCard';
import type { TranslateNoteCardRequest } from '../types/TranslateNoteCardRequest';
import { ApiError } from '../types/ApiError';

// const API_URL = 'https://localhost:7078';
const API_URL = 'https://note-nest-api-773165564331.europe-southwest1.run.app';
const NOTECARDS_API_URL = API_URL + '/NoteCards';

function handleError(error: any):never {
    if (error.response) {
        switch (error.response.status) {
            case 404:
                throw new ApiError("NOT_FOUND");
            case 401:
                throw new ApiError("UNAUTHORIZED");
            case 500:
                throw new ApiError("SERVER_ERROR");
            default:
                throw new Error("UNKNOWN_ERROR");
        }
    }
    
    throw new ApiError("NETWORK_ERROR");
}

export const getNoteCards = async () => {
    try {
        const response = await axios.get<NoteCard[]>(NOTECARDS_API_URL);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const getCategoryNoteCards = async (categoryId: string) => {
    try {
        const response = await axios.get<NoteCard[]>(
            NOTECARDS_API_URL,
            {
                params: { categoryId }
            }
        );
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const getNoteCard = async (id: string) => {
    try {
        const response = await axios.get<NoteCard>(`${NOTECARDS_API_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const createNoteCard = async (noteCard: NoteCard) => {
    try {
        const response = await axios.post<NoteCard>(NOTECARDS_API_URL, noteCard);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const updateNoteCard = async (
    id: string,
    noteCard: Partial<Omit<NoteCard, 'id' | 'createdDate' | 'lastModifiedDate'>>
) => {
    try {
        const response = await axios.put<NoteCard>(`${NOTECARDS_API_URL}/${id}`, noteCard);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const deleteNoteCard = async (id: string) => {
    try {
        const response = await axios.delete(`${NOTECARDS_API_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const translateNoteCard = async (translateNoteCardRequest: TranslateNoteCardRequest) => {
    try {
        const response = await axios.post<NoteCard>(`${NOTECARDS_API_URL}/Translate`, translateNoteCardRequest);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};