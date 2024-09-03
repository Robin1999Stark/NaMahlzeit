import axios from 'axios';
import { IngredientAmountWithMeal } from '../Datatypes/Ingredient';
import { BASE_URL, fetchCsrfToken } from './Settings';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})
async function getAllMealIngredientsJSON(mealID: number): Promise<unknown> {
    try {
        const response = await instance.get(`/meals/${mealID}/ingredients/`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Meal Ingredients: ' + (error as Error).message);
    }
}

export async function getAllMealIngredients(mealID: number): Promise<IngredientAmountWithMeal[]> {
    let ingredientAmounts: IngredientAmountWithMeal[] = [];
    try {
        const data = await getAllMealIngredientsJSON(mealID);
        if (Array.isArray(data)) {
            ingredientAmounts = data.map((ingredient: unknown) => IngredientAmountWithMeal.fromJSON(ingredient));
        } else {
            console.error('Unexpected data format:', data);
        }
        return ingredientAmounts;
    } catch (error) {
        console.error('Error fetching Meal Ingredients: ', (error as Error).message);
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
    const csrfToken = await fetchCsrfToken();
    try {

        const response = await instance.post('/meal-ingredients/', JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        })
        return IngredientAmountWithMeal.fromJSON(response.data);
    } catch (error) {
        console.error(error)
    }
    return null;
}

export async function updateMealIngredient(miID: number, mealIngredient: IngredientAmountWithMeal): Promise<IngredientAmountWithMeal | null> {
    const json = JSON.stringify(mealIngredient)
    const csrfToken = await fetchCsrfToken();
    try {
        const response = await instance.post(`/meal-ingredients/${miID}/`, json, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
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
        const response = await instance.delete(`/meal-ingredients/${miID}/`,
            {
                headers: {
                    'X-CSRFToken': await fetchCsrfToken() || '',
                }
            });
        return response.data;
    } catch (error) {
        throw new Error('Error deleting Meal Ingredient: ' + error);
    }
}
