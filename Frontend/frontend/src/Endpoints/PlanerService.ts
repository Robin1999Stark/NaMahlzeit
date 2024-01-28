import axios from 'axios';
import { IngredientAmountWithMeal } from '../Datatypes/Ingredient';
import { FoodplanerItem } from '../Datatypes/FoodPlaner';

const BASE_URL = 'http://localhost:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})
export namespace PlanerService {
    async function getAllPlanerItemJSON(): Promise<any> {
        try {
            const response = await instance.get('/planer/');
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Planer: ' + error);
        }
    }

    export async function getAllPlanerItems(): Promise<FoodplanerItem[]> {
        let planer: FoodplanerItem[] = [];
        try {
            const data = await getAllPlanerItemJSON();
            planer = data.map((planerItem: any) => FoodplanerItem.fromJSON(planerItem));
            return planer;
        } catch (error) {
            console.error('Error fetching Planer: ', error);
        }
        return planer;
    }

    export async function getAllIngredientsFromPlanerInTimeRange(_start: Date, _end: Date): Promise<IngredientAmountWithMeal[] | null> {
        try {
            const data = await instance.get('/get-all-ingredients-from-planer/');
            const meals: any[] = data.data.meals;
            const ingredients: IngredientAmountWithMeal[] = []
            meals.forEach((ingredient: any) => {
                const ingr = IngredientAmountWithMeal.fromJSON(ingredient)
                ingredients.push(ingr)
            });
            return ingredients
        } catch (error) {
            console.error(error)
        }
        return null;
    }

    interface CreatePlanerInterface {
        date: Date;
        meals: number[];
    }
    export async function createPlanerItem({ date, meals }: CreatePlanerInterface): Promise<FoodplanerItem | null> {
        const dateString: string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        const requestBody = {
            date: dateString,
            meals: meals,
        }
        try {
            let response = await instance.post('/planer/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return FoodplanerItem.fromJSON(response.data);
        } catch (error) {
            console.error('Error fetching planers:', error);
            return null;
        }
    }

    export async function updatePlanerItem(id: number, planer: FoodplanerItem) {
        let json = JSON.stringify(planer)
        try {
            await instance.put(`/planer/${id}/`, json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.error('Error fetching planers:', error);
        }
    }

    export interface IsPlannedResponse {
        isPlanned: boolean;
        plannedDate: Date | null;
    }
    export async function isPlanned(mealID: number): Promise<IsPlannedResponse | null> {
        try {
            const response = await axios.get(`${BASE_URL}/is-planned/${mealID}/`)
            console.log(response)
            const isPlannedResponse: IsPlannedResponse = {
                isPlanned: response.data.is_planned,
                plannedDate: new Date(response.data.planned_date)
            }
            return isPlannedResponse;
        } catch (error) {
            console.error(error)
        }
        return null;
    }

}