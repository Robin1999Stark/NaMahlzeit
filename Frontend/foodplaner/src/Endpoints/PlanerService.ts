import axios from 'axios';
import { FoodplanerItem } from '../Datatypes/Meal';

const BASE_URL = 'http://127.0.0.1:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})
export namespace PlanerService {
    export async function getAllPlanerItemJSON(): Promise<any> {
        try {
            const response = await instance.get('/planer/');
            console.log("respoinse:", response)
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

}