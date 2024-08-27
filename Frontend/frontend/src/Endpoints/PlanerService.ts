import axios, { AxiosResponse } from 'axios';
import { IngredientAmountWithMeal } from '../Datatypes/Ingredient';
import { FoodplanerItem } from '../Datatypes/FoodPlaner';

const BASE_URL = 'http://localhost:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

async function getAllPlanerItemJSON(): Promise<unknown> {
    try {
        const response = await instance.get('/planer/');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Planer JSON: ' + error);
    }
}

export async function getAllPlanerItems(): Promise<FoodplanerItem[]> {
    try {
        const data = await getAllPlanerItemJSON();
        if (Array.isArray(data)) {
            return data.map((planerItem: unknown) => {
                if (typeof planerItem === 'object' && planerItem !== null) {
                    return FoodplanerItem.fromJSON(planerItem as { id: number; date: string; meals: number[] });
                }
                throw new Error('Invalid planer item data format');
            });
        }
        return [];
    } catch (error) {
        console.error('Error fetching Planer: ', error);
        return [];
    }
}

export async function getAllIngredientsFromPlanerInTimeRange(start: Date, end: Date): Promise<IngredientAmountWithMeal[] | null> {
    try {
        const startDate: string = start.toLocaleDateString('en-CA');
        const endDate: string = end.toLocaleDateString('en-CA');

        const response = await instance.get(`/get-all-ingredients-from-planer/${startDate}/${endDate}/`);
        const meals: unknown[] = response.data.meals;

        if (Array.isArray(meals)) {
            return meals.map((ingredient: unknown) => {
                if (typeof ingredient === 'object' && ingredient !== null) {
                    return IngredientAmountWithMeal.fromJSON(ingredient as { amount: number; ingredient: string; meal: string });
                }
                throw new Error('Invalid ingredient data format');
            });
        }
        return null;
    } catch (error) {
        console.error('Error fetching ingredients from planer in time range:', error);
        return null;
    }
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
    };

    try {
        const response = await instance.post('/planer/', JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return FoodplanerItem.fromJSON(response.data);
    } catch (error) {
        console.error('Error creating planer item:', error);
        return null;
    }
}

export async function updatePlanerItem(date: Date, planer: FoodplanerItem): Promise<AxiosResponse> {
    const dateString: string = date.toLocaleDateString('en-CA');
    const json = {
        date: dateString,
        meals: planer.meals,
    };

    try {
        const response = await instance.put(`/planer/${dateString}/`, JSON.stringify(json), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        throw new Error('Error updating planer item:' + error)
    }
}

export async function removeMealFromPlaner(planerDate: Date, mealId: number): Promise<AxiosResponse> {
    try {
        const dateString: string = new Date(planerDate).toISOString().split('T')[0];
        const response = await instance.get(`/planer/remove/${dateString}/${mealId}/`);
        return response;
    } catch (error) {
        throw new Error('Error removing meal from planer:' + error)
    }
}

export async function addMealToPlaner(date: Date, mealId: number): Promise<FoodplanerItem | null> {
    const dateString: string = date.toLocaleDateString('en-CA');

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
                    console.error('Error fetching planer item:', error);
                    return null;
                }
            } else {
                console.error('Unexpected error fetching planer item:', error);
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
        console.error('Error adding meal to planer:', error);
        return null;
    }
}

export interface IsPlannedResponse {
    isPlanned: boolean;
    plannedDate: Date | null;
}

export async function isPlanned(mealID: number): Promise<IsPlannedResponse | null> {
    try {
        const response = await axios.get(`${BASE_URL}/is-planned/${mealID}/`);
        const data = response.data;

        if (typeof data.is_planned === 'boolean' && typeof data.planned_date === 'string') {
            return {
                isPlanned: data.is_planned,
                plannedDate: new Date(data.planned_date)
            };
        }
        throw new Error('Invalid isPlanned response format');
    } catch (error) {
        console.error('Error checking if meal is planned:', error);
        return null;
    }
}
export async function moveMealBetweenPlanerItemsByDate(
    mealId: number,
    fromDate: Date,
    toDate: Date
): Promise<void> {
    try {
        const fromDateString = new Date(fromDate).toISOString().split('T')[0];
        const toDateString = new Date(toDate).toISOString().split('T')[0];

        await instance.get(`/planer/moveto/${toDateString}/${fromDateString}/${mealId}/`);
    } catch (error) {
        console.error('Error moving meal between planners:', error);
    }
}