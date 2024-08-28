import axios, { AxiosResponse } from 'axios';
import { IngredientAmount, IngredientAmountWithMeal } from '../Datatypes/Ingredient';
import { Meal, MealTags, MealWithIngredientAmountMIID } from '../Datatypes/Meal';
import { createMealIngredient, deleteMealIngredient, getAllMealIngredients, updateMealIngredient } from './MealIngredientService';
import { createMealTags } from './TagService';


const BASE_URL = 'http://localhost:8000';

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


interface CreateMealAmountInterface {
    title: string;
    description: string;
    ingredients: IngredientAmount[];
    preparation: string;
    duration: number;
    portion_size: number;
    picture: string | null;
}


export async function createMealWithAmounts2({
    title,
    description,
    ingredients,
    preparation,
    duration,
    portion_size,
    picture,
}: CreateMealAmountInterface): Promise<Meal | null> {
    const requestBody = {
        title,
        description,
        ingredients: ingredients.map((ingredientAmount) => ({
            title: ingredientAmount.ingredient,
            amount: ingredientAmount.amount,
            unit: ingredientAmount.unit,
        })),
        duration,
        preparation,
        portion_size,
        picture,
    };
    const requestJSON = JSON.stringify(requestBody);
    try {
        const response = await instance.post('/meals/', requestJSON, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const meal = Meal.fromJSON(response.data);

        await Promise.all(
            ingredients.map(async (ingredient) => {
                return createMealIngredient({
                    ingredient: ingredient.ingredient,
                    meal: meal.id,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                });
            })
        );

        const tags = new MealTags(response.data.id, []);
        await createMealTags(tags);
        return meal;
    } catch (error) {
        console.error('Error creating Meal:', error);
        return null;
    }
}


export async function createMealWithAmounts(formData: FormData): Promise<Meal | null> {
    console.log("fd", formData)
    try {
        // Make the API request using FormData
        const response = await instance.post('/meals/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Assuming Meal.fromJSON exists and parses the response into a Meal object
        const meal = Meal.fromJSON(response.data);

        // Process ingredients and tags as needed
        await Promise.all(
            formData.getAll('ingredients').map(async (ingredient: any) => {
                return createMealIngredient({
                    ingredient: ingredient.ingredient,
                    meal: meal.id,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                });
            })
        );

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
        preparation: meal.preparation,
    };

    try {
        // Update Meal
        const responseMeal = await instance.put(`/meals/${id}/`, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Update Meal Ingredients
        const existingMealIngredients: IngredientAmountWithMeal[] = await getAllMealIngredients(id);
        const existingMealIngredientsIDs: number[] = existingMealIngredients.map((ingr) => ingr.id);

        const createdIngredients = ingredientsToChange.filter((ingr) => !existingMealIngredientsIDs.includes(ingr.id));
        const deletedMealIngredientsIDs: number[] = existingMealIngredientsIDs.filter((ingrID) => !ingredientsToChangeIDs.includes(ingrID));

        await Promise.all(
            createdIngredients.map(async (ingr) => {
                return createMealIngredient({
                    meal: id,
                    ingredient: ingr.ingredient,
                    amount: ingr.amount,
                    unit: ingr.unit,
                });
            })
        );

        await Promise.all(
            deletedMealIngredientsIDs.map(async (ingredientID) => {
                return deleteMealIngredient(ingredientID);
            })
        );

        const updatedIngredients = ingredientsToChange.filter((ingr) => {
            if (deletedMealIngredientsIDs.includes(ingr.id)) return false;
            if (createdIngredients.map((ingr) => ingr.id).includes(ingr.id)) return false;
            return true;
        });

        await Promise.all(
            updatedIngredients.map(async (ingredient) => {
                return updateMealIngredient(ingredient.id, ingredient);
            })
        );

        return Meal.fromJSON(responseMeal.data);
    } catch (error) {
        console.error('Error updating Meals:', error);
    }
    return null;
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


