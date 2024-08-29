import axios from "axios";
import { InventoryItem } from "../Datatypes/Inventory";
import { BASE_URL } from "./Settings";


const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})
export async function getAllInventoryItemsJSON(): Promise<unknown> {
    try {
        const response = await instance.get('/inventory/');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching inventory: ' + (error as Error).message);
    }
}

export async function getAllInventoryItems(): Promise<InventoryItem[]> {
    let inventory: InventoryItem[] = [];
    try {
        const data = await getAllInventoryItemsJSON();
        if (Array.isArray(data)) {
            inventory = data.map((inv: unknown) => InventoryItem.fromJSON(inv));
        } else {
            console.error('Unexpected data format:', data);
        }
        return inventory;
    } catch (error) {
        console.error('Error fetching inventory: ', (error as Error).message);
    }
    return inventory;
}

export interface CreateInventoryItemInterface {
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
        const response = await instance.post('/inventory/', JSON.stringify(requestBody), {
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
