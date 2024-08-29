import axios, { AxiosResponse } from 'axios';
import { Ingredient, IngredientTags } from '../Datatypes/Ingredient';
import { createIngredientTags } from './TagService';
import { BASE_URL } from './Settings';


const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

// Fetch all ingredients in JSON format
async function getAllIngredientsJSON(): Promise<unknown> {
    try {
        const response = await instance.get('/ingredients/');
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching Ingredients: ${error}`);
    }
}

// Convert JSON data to Ingredient objects
export async function getAllIngredients(): Promise<Ingredient[]> {
    try {
        const data = await getAllIngredientsJSON();

        if (Array.isArray(data)) {
            return data.map((ingredient) => {
                if (typeof ingredient === 'object' && ingredient !== null) {
                    return Ingredient.fromJSON(ingredient);
                } else {
                    throw new Error('Invalid data format');
                }
            });
        } else {
            throw new Error('Expected an array of ingredients');
        }
    } catch (error) {
        console.error('Error fetching Ingredients:', error);
        return [];
    }
}

// Fetch a single ingredient in JSON format
async function getIngredientJSON(id: string): Promise<unknown> {
    try {
        const response = await instance.get(`/ingredients/${id}/`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching Ingredient with ID ${id}: ${error}`);
    }
}

// Convert JSON data to a single Ingredient object
export async function getIngredient(id: string): Promise<Ingredient> {
    try {
        const data = await getIngredientJSON(id);

        if (typeof data === 'object' && data !== null) {
            return Ingredient.fromJSON(data);
        } else {
            throw new Error('Invalid data format');
        }
    } catch (error) {
        throw new Error(`Error occurred while getting Ingredient with ID ${id}: ${error}`);
    }
}


interface CreateIngredientInterface {
    title: string;
    description: string;
    preferedUnit: string;
}
// Create a new ingredient
export async function createIngredient({ title, description, preferedUnit }: CreateIngredientInterface): Promise<Ingredient | null> {
    const requestBody = {
        title,
        description,
        preferedUnit,
    };

    try {
        const response = await instance.post('/ingredients/', JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' }
        });

        const tags = new IngredientTags(title, []);
        await createIngredientTags(tags);

        const data = response.data;
        if (typeof data === 'object' && data !== null) {
            return Ingredient.fromJSON(data);
        } else {
            throw new Error('Invalid data format');
        }
    } catch (error) {
        console.error('Error creating Ingredient:', error);
        return null;
    }
}


// Update an existing ingredient
export async function updateIngredient(ingredient: Ingredient): Promise<AxiosResponse> {
    const requestBody = {
        title: ingredient.title,
        description: ingredient.description,
        preferedUnit: ingredient.preferedUnit,
    };

    try {
        const response = await instance.put(`/ingredients/${ingredient.title}/`, JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' }
        });
        return response;
    } catch (error) {
        throw new Error(`Error while updating Ingredient with title ${ingredient.title}: ${error}`);
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

export async function exportIngredients(): Promise<AxiosResponse> {
    try {
        const response = await instance.get('/export/ingredients/');
        return response.data;
    } catch (error) {
        throw new Error('Error exporting Ingredients: ' + error);
    }
}



