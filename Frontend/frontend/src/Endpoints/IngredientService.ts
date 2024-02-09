import axios from 'axios';
import { Ingredient } from '../Datatypes/Ingredient';

const BASE_URL = 'http://localhost:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})
export namespace IngredientService {
    async function getAllIngredientsJSON(): Promise<any> {
        try {
            const response = await instance.get('/ingredients/');
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Ingredients: ' + error);
        }
    }

    export async function getAllIngredients(): Promise<Ingredient[]> {
        let ingredients: Ingredient[] = [];
        try {
            const data = await getAllIngredientsJSON();
            ingredients = data.map((ingredient: any) => Ingredient.fromJSON(ingredient));
            return ingredients;
        } catch (error) {
            console.error('Error fetching Ingredients: ', error);
        }
        return ingredients;
    }


    async function getIngredientJSON(id: string): Promise<any> {
        try {
            const response = await instance.get('/ingredients/' + id + '/');
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Ingredient: ' + error);
        }
    }

    export async function getIngredient(id: string): Promise<Ingredient> {
        try {
            const response = await getIngredientJSON(id);
            return Ingredient.fromJSON(response);

        } catch (error) {
            throw new Error("Error occured while getting Ingredient")
        }
    }


    interface CreateIngredientInterface {
        title: string;
        description: string;
        preferedUnit: string;
    }
    export async function createIngredient({ title, description, preferedUnit }: CreateIngredientInterface): Promise<Ingredient | null> {
        const requestBody = {
            title: title,
            description: description,
            preferedUnit: preferedUnit,
        }
        try {
            let response = await instance.post('/ingredients/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return Ingredient.fromJSON(response.data);
        } catch (error) {
            console.error('Error creating Ingredient:', error);
            return null;
        }
    }


    export async function updateIngredient(ingredient: Ingredient) {
        let requestBody = {
            title: ingredient.title,
            description: ingredient.description,
            preferedUnit: ingredient.preferedUnit,
        }

        try {
            await instance.put(`/ingredients/${ingredient.title}/`, JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            throw new Error('Error while updating Ingredient occured: ' + error);
        }
    }

    export async function deleteIngredient(ingredient: string) {
        try {
            const response = await instance.delete(`/ingredients/${ingredient}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting Ingredient: ' + error);
        }
    }

}