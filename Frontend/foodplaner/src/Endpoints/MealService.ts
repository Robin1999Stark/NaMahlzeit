import axios from 'axios';
import { IngredientAmount, Meal } from '../Datatypes/Meal';


const BASE_URL = 'http://127.0.0.1:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export namespace MealService {
    async function getAllMealsJSON(): Promise<any> {
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
            meals = data.map((meal1: any) => Meal.fromJSON(meal1));
            return meals;
        } catch (error) {
            console.error('Error fetching Meals: ', error);
        }
        return meals;
    }


    async function getMealJSON(id: string): Promise<any> {
        try {
            const response = await instance.get('/meals/' + id + '/');
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Meal: ' + error);
        }
    }

    export async function getMeal(id: string): Promise<Meal | null> {
        let meal: Meal | null = null;
        try {
            const response = await getMealJSON(id);
            meal = Meal.fromJSON(response);
        } catch (error) {
            console.error('Error fetching Meal:', error);
        }
        return meal;

    }


    interface CreateMealInterface {
        title: string;
        description: string;
        ingredients: string[];
    }
    async function createMeal({ title, description, ingredients }: CreateMealInterface): Promise<Meal | null> {
        const requestBody = {
            title: title,
            description: description,
            ingredients: ingredients,
        }
        try {
            let response = await instance.post('/meals/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return Meal.fromJSON(response.data);
        } catch (error) {
            console.error('Error creating Meal:', error);
            return null;
        }
    }
    interface CreateMealAmountInterface {
        title: string;
        description: string;
        ingredients: IngredientAmount[];
    }
    export async function createMealWithAmounts({ title, description, ingredients }: CreateMealAmountInterface): Promise<Meal | null> {

        const requestBody = {
            title: title,
            description: description,
            ingredients: ingredients,
            duration: 45,
            preparation: "Test",
        }
        try {
            let response = await instance.post('/create-meal/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return Meal.fromJSON(response.data);
        } catch (error) {
            console.error('Error creating Meal:', error);
            return null;
        }
    }

    export async function updateMeal(id: number, meal: Meal) {
        let json = JSON.stringify(meal)
        try {
            let response = await instance.put(`/meals/${id}/`, json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.error('Error updating Meals:', error);
        }
    }

    export async function deleteMeal(mealID: number) {
        try {
            const response = await instance.delete(`/meals/${mealID}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting Meal: ' + error);
        }
    }


}