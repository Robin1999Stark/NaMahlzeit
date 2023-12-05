import axios from "axios";
import { InventoryItem } from "../Datatypes/Inventory";

const BASE_URL = 'http://127.0.0.1:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})
export namespace InventoryService {
    export async function getAllInventoryItemsJSON(): Promise<any> {
        try {
            const response = await instance.get(`/inventory/`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching inventory: ' + error);
        }
    }

    export async function getAllInventoryItems(): Promise<InventoryItem[]> {
        let inventory: InventoryItem[] = [];
        try {
            const data = await getAllInventoryItemsJSON();
            inventory = data.map((inv: any) => InventoryItem.fromJSON(inv));
            return inventory;
        } catch (error) {
            console.error('Error fetching inventory: ', error);
        }
        return inventory;
    }



    interface CreateInventoryItemInterface {
        ingredient: string;
        amount: number;
        unit: string;
    }
    export async function createInventoryItem({ ingredient, amount, unit }: CreateInventoryItemInterface): Promise<InventoryItem | null> {
        const requestBody = {
            ingredient: ingredient,
            amount: amount,
            unit: unit
        }
        try {
            let response = await instance.post('/inventory/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return InventoryItem.fromJSON(response.data);
        } catch (error) {
            console.error('Error creating Inventory Item:', error);
            return null;
        }
    }

    export async function deleteInventoryItem(id: number) {
        try {
            const response = await instance.delete(`/inventory/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting InventoryItem: ' + error);
        }
    }
}