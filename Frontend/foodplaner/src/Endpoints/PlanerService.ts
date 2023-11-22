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

    export async function createPlanerItem(planer: FoodplanerItem) {
        console.log(planer)
        let json = JSON.stringify(planer)
        console.log(json)
        try {
            console.log("test")
            let response = await instance.post('/planer/', json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log("Response:", response)
        } catch (error) {
            console.error('Error fetching planers:', error);
        }
    }

    export async function updatePlanerItem(id: number, planer: FoodplanerItem) {
        let json = JSON.stringify(planer)
        console.log(json)
        try {
            console.log("test")
            let response = await instance.put(`/planer/${id}/`, json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log("Response:", response)
        } catch (error) {
            console.error('Error fetching planers:', error);
        }
    }

}