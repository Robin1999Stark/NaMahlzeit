import axios from 'axios';
import { IngredientAmount, IngredientAmountWithMeal, Meal, MealWithIngredientAmount } from '../Datatypes/Meal';


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
        preparation: string;
        duration: number;
    }

    interface CreateMealngredientInterface {
        ingredient: string;
        meal: number;
        amount: number;
        unit: string;
    }
    async function createMealIngredient(ingredient: CreateMealngredientInterface): Promise<IngredientAmountWithMeal | null> {
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

    export async function createMealWithAmounts({ title, description, ingredients, preparation, duration }: CreateMealAmountInterface): Promise<Meal | null> {

        const requestBody = {
            title: title,
            description: description,
            ingredients: ingredients.map((ingredientAmount) => ({
                title: ingredientAmount.ingredient,
                amount: ingredientAmount.amount,
                unit: ingredientAmount.unit,
            })),
            duration: duration,
            preparation: preparation,
        }
        const requestJSON = JSON.stringify(requestBody)
        console.debug(requestJSON)

        try {
            let response = await instance.post('/meals/', requestJSON, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const meal = Meal.fromJSON(response.data);

            const results = Promise.all(
                ingredients.map(async (ingredient) => {
                    return await createMealIngredient({ ingredient: ingredient.ingredient, meal: meal.id, amount: ingredient.amount, unit: ingredient.unit });
                })
            )
            console.log("results", results);
            if (results === null) return null;

            return meal;
        } catch (error) {
            console.error('Error creating Meal:', error);
            return null;
        }
    }

    export async function updateMeal(id: number, meal: MealWithIngredientAmount) {
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