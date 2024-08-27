import axios from 'axios';
import { IngredientAmount, IngredientAmountWithMeal } from '../Datatypes/Ingredient';
import { Meal, MealTags, MealWithIngredientAmountMIID } from '../Datatypes/Meal';
import { createMealIngredient, deleteMealIngredient, getAllMealIngredients, updateMealIngredient } from './MealIngredientService';
import { createMealTags } from './TagService';


const BASE_URL = 'http://localhost:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

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
        if (results === null) return null;
        const tags = new MealTags(response.data.id, []);
        await createMealTags(tags);
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
                'Content-Type': 'application/json'
            }
        })

        // update Meal Ingredients

        // get existing MealIngredients to check the changes
        const existingMealIngredients: IngredientAmountWithMeal[] = await getAllMealIngredients(id)
        const existingMealIngredientsIDs: number[] = existingMealIngredients.map((ingr) => ingr.id);

        // filter the new created ingredients from the ingredientsToChange
        const createdIngredients = ingredientsToChange.filter((ingr) => !existingMealIngredientsIDs.includes(ingr.id));

        // filter the deleted MealIngredients from the existing Meal Ingredients
        const deletedMealIngredientsIDs: number[] = existingMealIngredientsIDs.filter((ingrID) => !ingredientsToChangeIDs.includes(ingrID));

        // create new MealIngredients
        Promise.all(
            createdIngredients.map(async (ingr) => {
                return await createMealIngredient({ meal: id, ingredient: ingr.ingredient, amount: ingr.amount, unit: ingr.unit })
            })
        )

        // delete removed MealIngredients
        Promise.all(
            deletedMealIngredientsIDs.map(async (ingredientID) => {
                return await deleteMealIngredient(ingredientID);
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
                return await updateMealIngredient(ingredient.id, ingredient);
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
        const response = await instance.delete(`/meals/${mealID}/`);
        return response.data;
    } catch (error) {
        throw new Error('Error deleting Meal: ' + error);
    }
}


