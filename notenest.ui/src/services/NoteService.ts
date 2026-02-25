import axios from 'axios';
import type { Note } from '../types/Note';
import { ApiError } from '../types/ApiError';

const API_URL = 'https://localhost:7078/notes';

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

export const getNotes = async () => {
    try {
        const response = await axios.get<Note[]>(API_URL);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const getNote = async (id: string) => {
    try {
        const response = await axios.get<Note>(`${API_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const createNote = async (note: Omit<Note, 'id' | 'createdDate' | 'lastModifiedDate'>) => {
    try {
        const response = await axios.post<Note>(API_URL, note);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const updateNote = async (
    id: string,
    note: Partial<Omit<Note, 'id' | 'createdDate' | 'lastModifiedDate'>>
) => {
    try {
        const response = await axios.put<Note>(`${API_URL}/${id}`, note);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const deleteNote = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};