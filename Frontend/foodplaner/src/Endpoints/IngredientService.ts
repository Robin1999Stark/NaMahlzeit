import axios from 'axios';
import { Ingredient } from '../Datatypes/Meal';

const BASE_URL = 'http://127.0.0.1:8000';

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

    export async function getIngredient(id: string): Promise<Ingredient | null> {
        let meal: Ingredient | null = null;
        try {
            const response = await getIngredientJSON(id);
            meal = Ingredient.fromJSON(response);
        } catch (error) {
            console.error('Error fetching Ingredient:', error);
        }
        return meal;

    }


    interface CreateIngredientInterface {
        title: string;
        description: string;
    }
    export async function createIngredient({ title, description }: CreateIngredientInterface): Promise<Ingredient | null> {
        const requestBody = {
            title: title,
            description: description,
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
    export async function deleteIngredient(ingredient: string) {
        try {
            const response = await instance.delete(`/ingredients/${ingredient}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting Ingredient: ' + error);
        }
    }

}