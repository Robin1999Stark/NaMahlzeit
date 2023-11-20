import axios from 'axios';
import { Ingredient } from '../Datatypes/Meal';

const BASE_URL = 'http://127.0.0.1:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})
export namespace IngredientService {
    export async function getAllIngredientsJSON(): Promise<any> {
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

}