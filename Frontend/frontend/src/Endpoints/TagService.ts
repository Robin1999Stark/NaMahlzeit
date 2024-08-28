import axios, { AxiosResponse } from "axios";
import { TagDT } from "../Datatypes/Tag";
import { MealTags } from "../Datatypes/Meal";
import { IngredientTags } from "../Datatypes/Ingredient";

const BASE_URL = 'http://localhost:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

async function getAllTagsJSON(): Promise<unknown> {
    try {
        const response = await instance.get(`/tags/`);
        return response.data;
    } catch (_error) {
        return null;
    }
}

export async function getAllTags(): Promise<TagDT[] | null> {
    try {
        const data = await getAllTagsJSON();
        if (data === null || !Array.isArray(data)) return null;
        return data.map((tag: unknown) => {
            if (typeof tag === 'object' && tag !== null && 'name' in tag) {
                return TagDT.fromJSON(tag as { name: string });
            }
            throw new Error('Invalid tag data format');
        });
    } catch (_error) {
        console.error('Error fetching Tags: ', _error);
        return null;
    }
}

interface CreateTagInterface {
    name: string,
}

export async function createTag({ name }: CreateTagInterface): Promise<TagDT | null> {
    const requestBody = { name };
    try {
        const response = await instance.post('/tags/', JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' }
        });
        return TagDT.fromJSON(response.data);
    } catch (_error) {
        console.error('Error creating Tag:', _error);
        return null;
    }
}

export async function deleteTag(tag: string): Promise<AxiosResponse> {
    try {
        const response = await instance.delete(`/tags/${tag}/`);
        return response;
    } catch (_error) {
        throw new Error('Error deleting Tag: ' + _error);
    }
}


async function getAllTagsFromMealJSON(meal: number): Promise<unknown> {
    try {
        const response = await instance.get(`/meal-tags/${meal}/`);
        return response.data;
    } catch (_error) {
        return null;
    }
}


export async function getAllTagsFromMeal(meal: number): Promise<MealTags | null> {
    try {
        const data = await getAllTagsFromMealJSON(meal);
        if (data === null || typeof data !== 'object' || data === null) return null;
        return MealTags.fromJSON(data as { mealID: number; tags: string[] });
    } catch (_error) {
        return null;
    }
}

export async function getMealTagsFromTagList(tags: TagDT[]): Promise<MealTags[]> {
    try {
        const tagString = tags.map(tag => tag.name).join(',');
        const response = await instance.get(`/meals_by_tags/${tagString}/`);
        if (response.data.meals && Array.isArray(response.data.meals)) {
            return response.data.meals.map((tag: unknown) => {
                if (typeof tag === 'object' && tag !== null && 'mealID' in tag) {
                    return MealTags.fromJSON(tag as { mealID: number; tags: string[] });
                }
                throw new Error('Invalid meal tags data format');
            });
        }
        return [];
    } catch (error) {
        throw new Error('Error finding Meals: ' + error);
    }
}


export async function createMealTags(mealTags: MealTags): Promise<MealTags> {
    const requestBody = {
        meal: mealTags.mealID,
        tags: mealTags.tags
    };
    try {
        const response = await instance.post('/meal-tags/', JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' }
        });
        return MealTags.fromJSON(response.data);
    } catch (error) {
        throw new Error("Error while creating Meal Tag: " + error);
    }
}


export async function updateMealTags(meal: number, tags: MealTags): Promise<void> {
    const requestBody = {
        meal,
        tags: tags.tags
    };
    try {
        await instance.put(`/meal-tags/${meal}/`, JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        throw new Error('Error while updating Meal Tags: ' + error);
    }
}


export async function createOrUpdateMealTags(mealTags: MealTags): Promise<MealTags | null> {
    try {
        const existingMealTags = await getAllTagsFromMeal(mealTags.mealID);
        if (existingMealTags) {
            await updateMealTags(mealTags.mealID, mealTags);
            return mealTags;
        } else {
            return await createMealTags(mealTags);
        }
    } catch (_error) {
        return null;
    }
}

export async function deleteMealTags(meal: number) {
    try {
        const response = await instance.delete(`/meal-tags/${meal}/`);
        return response.data;
    } catch (error) {
        throw new Error('Error while deleting Meal Tags: ' + error);
    }
}


async function getAllTagsFromIngredientJSON(ingredient: string): Promise<unknown> {
    try {
        const response = await instance.get(`/ingredient-tags/${ingredient}/`);
        return response.data;
    } catch (error) {
        return null;
    }
}

export async function getAllTagsFromIngredient(ingredient: string): Promise<IngredientTags | null> {
    try {
        const data = await getAllTagsFromIngredientJSON(ingredient);
        if (data === null || typeof data !== 'object' || data === null) return null;
        return IngredientTags.fromJSON(data as { ingredient: string; tags: string[] });
    } catch (_error) {
        return null;
    }
}

export async function getIngredientTagsFromTagList(tags: TagDT[]): Promise<IngredientTags[]> {
    try {
        const tagString = tags.map(tag => tag.name).join(',');
        const response = await instance.get(`/ingredients_by_tags/${tagString}/`);
        if (response.data.ingredients && Array.isArray(response.data.ingredients)) {
            return response.data.ingredients.map((tag: unknown) => {
                if (typeof tag === 'object' && tag !== null && 'ingredient' in tag) {
                    return IngredientTags.fromJSON(tag as { ingredient: string; tags: string[] });
                }
                throw new Error('Invalid ingredient tags data format');
            });
        }
        return [];
    } catch (error) {
        throw new Error('Error finding Ingredients: ' + error);
    }
}


export async function createIngredientTags(ingredientTags: IngredientTags): Promise<IngredientTags> {
    const requestBody = {
        ingredient: ingredientTags.ingredient,
        tags: ingredientTags.tags
    };
    try {
        const response = await instance.post('/ingredient-tags/', JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' }
        });
        return IngredientTags.fromJSON(response.data);
    } catch (error) {
        throw new Error('Error while creating Tags from Ingredient: ' + error);
    }
}


export async function deleteIngredientTags(ingredient: string): Promise<void> {
    try {
        await instance.delete(`/ingredient-tags/${ingredient}/`);
    } catch (error) {
        throw new Error('Error while deleting Ingredient Tags: ' + error);
    }
}

export async function updateIngredientTags(ingredient: string, tags: IngredientTags): Promise<void> {
    const requestBody = {
        ingredient,
        tags: tags.tags
    };
    try {
        await instance.put(`/ingredient-tags/${ingredient}/`, JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        throw new Error('Error while updating Ingredient Tags: ' + error);
    }
}

export async function createOrUpdateIngredientTags(ingredientTags: IngredientTags): Promise<IngredientTags | null> {
    try {
        const existingIngredientTags = await getAllTagsFromIngredient(ingredientTags.ingredient);
        if (existingIngredientTags) {
            await updateIngredientTags(ingredientTags.ingredient, ingredientTags);
            return ingredientTags;
        } else {
            return await createIngredientTags(ingredientTags);
        }
    } catch (_error) {
        return null;
    }
}

export async function exportTags(): Promise<AxiosResponse> {
    try {
        const response = await instance.get('/export/tags/');
        return response.data;
    } catch (error) {
        throw new Error('Error exporting Tags: ' + error);
    }
}


