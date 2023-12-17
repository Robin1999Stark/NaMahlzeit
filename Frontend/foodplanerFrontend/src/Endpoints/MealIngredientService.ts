import axios from 'axios';
import { Meal } from '../Datatypes/Meal'
import { IngredientAmount, IngredientAmountWithMeal } from '../Datatypes/Ingredient';


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

    export async function getAllMealIngredients(mealID: number): Promise<IngredientAmountWithMeal[]> {
        let ingredientAmounts: IngredientAmountWithMeal[] = [];
        try {
            const data = await getAllMealIngredientsJSON(mealID);
            ingredientAmounts = data.map((ingredient: any) => IngredientAmountWithMeal.fromJSON(ingredient));
            return ingredientAmounts;
        } catch (error) {
            console.error('Error fetching Meal Ingredients: ', error);
        }
        return ingredientAmounts;
    }

    export interface CreateMealngredientInterface {
        meal: number;
        ingredient: string;
        amount: number;
        unit: string;
    }

    export async function createMealIngredient(ingredient: CreateMealngredientInterface): Promise<IngredientAmountWithMeal | null> {
        const requestBody = {
            meal: ingredient.meal,
            ingredient: ingredient.ingredient,
            amount: ingredient.amount,
            unit: ingredient.unit,
        }

        try {
            const response = await axios.post('http://localhost:8000/meal-ingredients/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return IngredientAmountWithMeal.fromJSON(response);
        } catch (error) {
            console.error(error)
        }
        return null;
    }

    export async function updateMealIngredient(miID: number, mealIngredient: IngredientAmountWithMeal): Promise<IngredientAmountWithMeal | null> {
        let json = JSON.stringify(mealIngredient)
        try {
            let response = await instance.put(`/meal-ingredients/${miID}/`, json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return IngredientAmountWithMeal.fromJSON(response.data)
        } catch (error) {
            console.error('Error updating Meal Ingredients:', error);
        }
        return null;
    }


    export async function deleteMealIngredient(miID: number) {
        try {
            const response = await instance.delete(`/meal-ingredients/${miID}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting Meal Ingredient: ' + error);
        }
    }

}