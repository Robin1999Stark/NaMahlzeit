import axios, { AxiosError } from 'axios';
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
            throw new Error('Error fetching Planer JSON: ' + error);
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
        const dateString: string = date.toISOString().split('T')[0];

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

    export async function updatePlanerItem(date: Date, planer: FoodplanerItem) {
        const dateString: string = new Date(date).toISOString().split('T')[0];
        console.log("test")

        let json = JSON.stringify(planer)
        try {
            const response = await instance.put(`/planer/${dateString}/`, json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response)
        } catch (error) {
            console.error('Error updating planers:', error);
        }
    }
    export async function removeMealFromPlaner(planerDate: Date, mealId: number) {
        try {
            // Fetch the current planner item
            const dateString: string = new Date(planerDate).toISOString().split('T')[0];

            const response = await instance.get(`/planer/remove/${dateString}/${mealId}/`);
            return response;
        } catch (error) {
            console.error('Error removing meal from planer:', error);
        }
    }

    export async function addMealToPlaner(date: Date, mealId: number) {
        const dateString: string = date.toISOString().split('T')[0];

        try {
            let planerItem: FoodplanerItem | null = null;
            try {
                const response = await instance.get(`/planer/${dateString}/`);
                planerItem = FoodplanerItem.fromJSON(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response && error.response.status === 404) {
                        planerItem = null;
                    } else {
                        console.error('Error fetching planner item:', error);
                        return null;
                    }
                } else {
                    console.error('Unexpected error fetching planner item:', error);
                    return null;
                }
            }
            if (!planerItem) {
                planerItem = await createPlanerItem({ date, meals: [mealId] });
                return planerItem;
            }

            if (planerItem.meals.includes(mealId)) {
                return planerItem;
            }

            planerItem.meals.push(mealId);

            await updatePlanerItem(new Date(planerItem.date), planerItem);

            return planerItem;
        } catch (error) {
            console.error('Error adding meal to planner:', error);
            return null;
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

    export async function moveMealBetweenPlanerItemsByDate(
        mealId: number,
        fromDate: Date,
        toDate: Date
    ) {
        try {
            const fromDateString = new Date(fromDate).toISOString().split('T')[0];
            const toDateString = new Date(toDate).toISOString().split('T')[0];

            const url = `/planer/moveto/${toDateString}/${fromDateString}/${mealId}/`;
            const response = await instance.get(url);
            return response;

        } catch (error) {
            console.error('Error moving meal between planers:', error);
        }
    }
}