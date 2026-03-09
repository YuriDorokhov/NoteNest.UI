import axios from 'axios';
import type { Category } from '../types/Category';
import { ApiError } from '../types/ApiError';
import { API_URL } from '../services/serviceConfigs';

const CATEGORIES_API_URL = API_URL + '/Categories';

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

export const getCategories = async () => {
    try {
        const response = await axios.get<Category[]>(CATEGORIES_API_URL);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const getCategory = async (id: string) => {
    try {
        const response = await axios.get<Category>(`${CATEGORIES_API_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const createCategory = async (category: Category) => {
    try {
        const response = await axios.post<Category>(CATEGORIES_API_URL, category);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const updateCategory = async (
    category: Category
) => {
    try {
        const response = await axios.put<Category>(`${CATEGORIES_API_URL}/${category.id}`, category);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await axios.delete(`${CATEGORIES_API_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
};