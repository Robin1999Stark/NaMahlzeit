import axios from 'axios';
import { Meal } from '../Datatypes/Meal';


const BASE_URL = 'http://127.0.0.1:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export namespace MealService {
    export async function getAllMealsJSON(): Promise<any> {
        try {
            const response = await instance.get('/meals/');
            console.log("respoinse:", response)
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Meals: ' + error);
        }
    }

    export async function getAllMeals(): Promise<Meal[]> {
        let meals: Meal[] = [];
        try {
            const data = await getAllMealsJSON();
            meals = data.map((meal1: any) => Meal.fromJSON(meal1));
            return meals;
        } catch (error) {
            console.error('Error fetching Meals: ', error);
        }
        return meals;
    }


    export async function getMealJSON(id: string): Promise<any> {
        try {
            const response = await instance.get('/meals/' + id + '/');
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Meal: ' + error);
        }
    }

    export async function getMeal(id: string): Promise<Meal | null> {
        let meal: Meal | null = null;
        try {
            const response = await getMealJSON(id);
            meal = Meal.fromJSON(response);
        } catch (error) {
            console.error('Error fetching Meal:', error);
        }
        return meal;

    }


}