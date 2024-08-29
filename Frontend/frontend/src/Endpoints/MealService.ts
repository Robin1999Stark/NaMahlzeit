import axios, { AxiosResponse } from 'axios';
import { Meal } from '../Datatypes/Meal';
import { BASE_URL } from './Settings';


const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

async function getAllMealsJSON(): Promise<unknown> {
    try {
        const response = await instance.get('/meals/');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Meals: ' + error);
    }
}

export async function getAllMeals(): Promise<Meal[]> {
    let meals: Meal[] = [];
    try {
        const data = await getAllMealsJSON();
        meals = (data as unknown[]).map((meal: unknown) => Meal.fromJSON(meal as object));
        return meals;
    } catch (error) {
        console.error('Error fetching Meals: ', error);
    }
    return meals;
}

async function getMealJSON(id: string): Promise<unknown> {
    try {
        const response = await instance.get(`/meals/${id}/`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Meal: ' + error);
    }
}

export async function getMeal(id: string): Promise<Meal | null> {
    let meal: Meal | null = null;
    try {
        const response = await getMealJSON(id);
        meal = Meal.fromJSON(response as object);
    } catch (error) {
        console.error('Error fetching Meal:', error);
    }
    return meal;
}

export async function createMeal(formData: FormData): Promise<Meal | null> {
    try {
        const response = await instance.post(`/meals/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const updatedMeal: Meal = Meal.fromJSON(response.data);
        return updatedMeal;
    } catch (error) {
        console.error('Error updating Meal:', error);
        return null;
    }
}

export async function updateMeal(id: number, formData: FormData): Promise<Meal | null> {
    try {
        const response = await instance.put(`/meals/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const updatedMeal = Meal.fromJSON(response.data);
        return updatedMeal;
    } catch (error) {
        console.error('Error updating Meal:', error);
        return null;
    }
}

export async function deleteMeal(mealID: number): Promise<AxiosResponse> {
    try {
        const response = await instance.delete(`/meals/${mealID}/`);
        return response;
    } catch (error) {
        throw new Error('Error deleting Meal: ' + error);
    }
}

export async function exportMeals(): Promise<AxiosResponse> {
    try {
        const response = await instance.get('/export/meals/');
        return response.data;
    } catch (error) {
        throw new Error('Error exporting Meals: ' + error);
    }
}


