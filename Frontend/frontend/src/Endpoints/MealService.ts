import axios from 'axios';
import { MealIngredientService } from './MealIngredientService';
import { IngredientAmount, IngredientAmountWithMeal } from '../Datatypes/Ingredient';
import { Meal, MealWithIngredientAmountMIID } from '../Datatypes/Meal';


const BASE_URL = 'http://localhost:8000';

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
            console.log("id", id)
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

    /*
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
        }*/
    interface CreateMealAmountInterface {
        title: string;
        description: string;
        ingredients: IngredientAmount[];
        preparation: string;
        duration: number;
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
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json'
                }
            })
            const meal = Meal.fromJSON(response.data);

            const results = Promise.all(
                ingredients.map(async (ingredient) => {
                    return await MealIngredientService.createMealIngredient({ ingredient: ingredient.ingredient, meal: meal.id, amount: ingredient.amount, unit: ingredient.unit });
                })
            )
            if (results === null) return null;

            return meal;
        } catch (error) {
            console.error('Error creating Meal:', error);
            return null;
        }
    }

    export async function updateMeal(id: number, meal: MealWithIngredientAmountMIID): Promise<Meal | null> {

        const ingredientsToChange: IngredientAmountWithMeal[] = meal.ingredients;
        const ingredientsToChangeIDs: number[] = ingredientsToChange.map((ingr) => ingr.id);

        const requestBody = {
            id: meal.id,
            title: meal.title,
            description: meal.description,
            ingredients: meal.ingredients,
            duration: meal.duration,
            preparation: meal.preparation
        }

        try {

            // update Meal
            let responseMeal = await instance.put(`/meals/${id}/`, JSON.stringify(requestBody), {
                headers: {
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json'
                }
            })

            // update Meal Ingredients

            // get existing MealIngredients to check the changes
            const existingMealIngredients: IngredientAmountWithMeal[] = await MealIngredientService.getAllMealIngredients(id)
            const existingMealIngredientsIDs: number[] = existingMealIngredients.map((ingr) => ingr.id);

            // filter the new created ingredients from the ingredientsToChange
            const createdIngredients = ingredientsToChange.filter((ingr) => !existingMealIngredientsIDs.includes(ingr.id));

            // filter the deleted MealIngredients from the existing Meal Ingredients
            const deletedMealIngredientsIDs: number[] = existingMealIngredientsIDs.filter((ingrID) => !ingredientsToChangeIDs.includes(ingrID));

            // create new MealIngredients
            Promise.all(
                createdIngredients.map(async (ingr) => {
                    return await MealIngredientService.createMealIngredient({ meal: id, ingredient: ingr.ingredient, amount: ingr.amount, unit: ingr.unit })
                })
            )

            // delete removed MealIngredients
            Promise.all(
                deletedMealIngredientsIDs.map(async (ingredientID) => {
                    return await MealIngredientService.deleteMealIngredient(ingredientID);
                })
            )

            // exclude deleted and created MealIngredients from the ingredients to change
            const updatedIngredients = ingredientsToChange.filter((ingr) => {
                if (deletedMealIngredientsIDs.includes(ingr.id)) return false;
                if (createdIngredients.map((ingr) => ingr.id).includes(ingr.id)) return false;
                return true;
            })

            // update existing MealIngredients
            Promise.all(
                updatedIngredients.map(async (ingredient) => {
                    return await MealIngredientService.updateMealIngredient(ingredient.id, ingredient);
                })
            )

            return Meal.fromJSON(responseMeal);
        } catch (error) {
            console.error('Error updating Meals:', error);
        }
        return null;
    }

    export async function deleteMeal(mealID: number) {
        try {
            const response = await instance.delete(`/meals/${mealID}/`, {
                headers: {
                    'Access-Control-Allow-Credentials': true,
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error deleting Meal: ' + error);
        }
    }


}