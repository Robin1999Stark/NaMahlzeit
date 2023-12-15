import axios from 'axios';
import { IngredientAmount, Meal } from '../Datatypes/Meal';


const BASE_URL = 'http://127.0.0.1:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export namespace MealIngredientService {
    async function getAllMealIngredientsJSON(mealID: number): Promise<any> {
        try {
            const response = await instance.get(`/meals/${mealID}/ingredients/`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Meal Ingredients: ' + error);
        }
    }

    export async function getAllMealIngredients(mealID: number): Promise<IngredientAmount[]> {
        let ingredientAmounts: IngredientAmount[] = [];
        try {
            const data = await getAllMealIngredientsJSON(mealID);
            ingredientAmounts = data.map((meal1: any) => IngredientAmount.fromJSON(meal1));
            return ingredientAmounts;
        } catch (error) {
            console.error('Error fetching Meals Ingredients: ', error);
        }
        return ingredientAmounts;
    }


    export async function getMealJSON(id: string): Promise<any> {
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

}