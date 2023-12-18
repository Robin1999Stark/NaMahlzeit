import axios from "axios";
import { Tag } from "../Datatypes/Tag";
import { MealTags } from "../Datatypes/Meal";
import { IngredientTags } from "../Datatypes/Ingredient";

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
            throw new Error('Error fetching Tags: ' + error);
        }
    }

    export async function getAllTags(): Promise<Tag[]> {
        let tags: Tag[] = [];
        try {
            const data = await getAllTagsJSON();
            const tags: Tag[] = []
            data.map((tag: any) => tags.push(Tag.fromJSON(tag)));
            return tags;
        } catch (error) {
            console.error('Error fetching tags: ', error);
        }
        return tags;
    }

    interface CreateTagInterface {
        name: string,
    }

    export async function createTag({ name }: CreateTagInterface): Promise<Tag | null> {


        const requestBody = {
            name: name,
        }
        try {
            let response = await instance.post('/tags/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return Tag.fromJSON(response.data);
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


    export async function getAllTagsFromMealJSON(meal: number): Promise<any> {
        try {
            const response = await instance.get(`/meal-tags/${meal}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Tags from Meal: ' + error);
        }
    }

    export async function getAllTagsFromMeal(meal: number): Promise<MealTags> {
        try {
            const data = await getAllTagsFromMealJSON(meal);
            return MealTags.fromJSON(data);
        } catch (error: any) {
            throw new Error('Error fetching tags: ', error);
        }
    }

    export async function getMealTagsFromTagList(tags: Tag[]): Promise<MealTags[]> {
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
        } catch (error: any) {
            throw new Error("Error while creating Meal Tags", error)
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

    export async function getAllTagsFromIngredientJSON(ingredient: string): Promise<any> {
        try {
            const response = await instance.get(`/ingredient-tags/${ingredient}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Tags from Ingredient: ' + error);
        }
    }

    export async function getAllTagsFromIngredient(ingredient: string): Promise<IngredientTags> {
        try {
            const data = await getAllTagsFromIngredientJSON(ingredient);
            return IngredientTags.fromJSON(data);
        } catch (error) {
            throw new Error('Error fetching Tags from Ingredient: ' + error);
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



    export async function updateIngredientTags(ingredient: number, tags: IngredientTags) {
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

}