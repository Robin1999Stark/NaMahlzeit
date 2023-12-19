import axios from "axios";
import { TagDT } from "../Datatypes/Tag";
import { MealTags } from "../Datatypes/Meal";
import { IngredientTags } from "../Datatypes/Ingredient";
import { ResponseCodes } from "./Errors";

const BASE_URL = 'http://127.0.0.1:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})
export namespace TagService {

    async function getAllTagsJSON(): Promise<any> {
        try {
            const response = await instance.get(`/tags/`);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    export async function getAllTags(): Promise<TagDT[] | null> {
        try {
            const data = await getAllTagsJSON();

            // If data is null, it means there was an error, and the calling function can handle it
            if (data === null) {
                return null;
            }
            const tags: TagDT[] = [];
            data.map((tag: any) => tags.push(TagDT.fromJSON(tag)));
            return tags;
        } catch (error) {
            console.error('Error fetching Tags: ', error);
            return null;
        }
    }

    interface CreateTagInterface {
        name: string,
    }

    export async function createTag({ name }: CreateTagInterface): Promise<TagDT | null> {


        const requestBody = {
            name: name,
        }
        try {
            let response = await instance.post('/tags/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return TagDT.fromJSON(response.data);
        } catch (error) {
            console.error('Error creating Tag:', error);
            return null;
        }
    }

    export async function deleteTag(tag: string) {
        try {
            const response = await instance.delete(`/tags/${tag}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting Tag: ' + error);
        }
    }


    async function getAllTagsFromMealJSON(meal: number): Promise<any> {
        try {
            const response = await instance.get(`/meal-tags/${meal}/`);
            return response.data;
        } catch (error: any) {
            return null;
        }
    }

    export async function getAllTagsFromMeal(meal: number): Promise<MealTags | null> {
        try {
            const data = await getAllTagsFromMealJSON(meal);
            if (data === null)
                return null;
            return MealTags.fromJSON(data);
        } catch (error: any) {
            return null
        }
    }

    export async function getMealTagsFromTagList(tags: TagDT[]): Promise<MealTags[]> {
        try {
            const tagString = tags.map(tag => tag.name).join(',')
            console.log(tagString)
            const response = await instance.get(`/meals_by_tags/${tagString}/`)
            console.log(response)
            const meals = response.data.meals.map((tag: any) => MealTags.fromJSON(tag))
            return meals;
        } catch (error) {
            throw new Error('Error finding Meals: ' + error);
        }

    }

    export async function createMealTags(mealTags: MealTags): Promise<MealTags> {
        const requestBody = {
            meal: mealTags.mealID,
            tags: mealTags.tags,
        }
        try {
            let response = await instance.post('/meal-tags/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return MealTags.fromJSON(response.data);
        } catch (error) {
            throw new Error("Error while creating Meal Tag");
        }
    }

    export async function createOrUpdateMealTags(mealTags: MealTags) {
        try {
            console.log(mealTags)
            const existingMealTags = await getAllTagsFromMeal(mealTags.mealID);

            if (existingMealTags) {
                const updatedMealTags = await updateMealTags(mealTags.mealID, mealTags);
                console.log("update", updateIngredientTags)
                return updatedMealTags;
            } else if (existingMealTags === null) {
                try {
                    const newMealTags = await createMealTags(mealTags);
                    console.log("create", newMealTags)
                    return newMealTags;
                } catch (errorWhileCreating: any) {
                    throw new Error(errorWhileCreating);
                }
            } else {
                throw new Error("Meal Tags does not Exist")

            }
        } catch (error: any) {
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



    export async function updateMealTags(meal: number, tags: MealTags) {
        let requestBody = {
            meal: meal,
            tags: tags.tags,
        }

        try {
            let response = await instance.put(`/meal-tags/${meal}/`, JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            throw new Error('Error while deleting Meal Tags occured: ' + error);
        }
    }

    async function getAllTagsFromIngredientJSON(ingredient: string): Promise<any> {
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
            if (data !== null) console.log(data)
            if (data === null)
                return null;
            const tags = IngredientTags.fromJSON(data);
            return tags;
        } catch (error) {
            return null;
        }
    }

    export async function createIngredientTags(ingredientTags: IngredientTags): Promise<IngredientTags> {
        const requestBody = {
            ingredient: ingredientTags.ingredient,
            tags: ingredientTags.tags,
        }
        try {
            let response = await instance.post('/ingredient-tags/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return IngredientTags.fromJSON(response.data);
        } catch (error) {
            throw new Error('Error while creating Tags from Ingredient: ' + error);
        }
    }


    export async function deleteIngredientTags(ingredient: string) {
        try {
            const response = await instance.delete(`/ingredient-tags/${ingredient}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error while deleting Ingredient Tags: ' + error);
        }
    }





    export async function updateIngredientTags(ingredient: string, tags: IngredientTags) {
        let requestBody = {
            ingredient: ingredient,
            tags: tags.tags,
        }

        try {
            let response = await instance.put(`/ingredient-tags/${ingredient}/`, JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            throw new Error('Error while updating Ingredient Tags occured: ' + error);
        }
    }


    export async function createOrUpdateIngredientTags(ingredientTags: IngredientTags) {
        try {
            const existingIngredientTags = await getAllTagsFromIngredient(ingredientTags.ingredient);

            if (existingIngredientTags) {
                const updatedIngredientTags = await updateIngredientTags(ingredientTags.ingredient, ingredientTags);
                console.log("update", updateIngredientTags)
                return updatedIngredientTags;
            } else if (existingIngredientTags === null) {
                try {
                    const newIngredientTags = await createIngredientTags(ingredientTags);
                    console.log("create", newIngredientTags)
                    return newIngredientTags;
                } catch (errorWhileCreating: any) {
                    throw new Error(errorWhileCreating);
                }
            } else {
                throw new Error("Ingredient Tags does not Exist")

            }
        } catch (error: any) {
            return null;
        }
    }
}