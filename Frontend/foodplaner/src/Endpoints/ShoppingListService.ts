import axios from "axios";
import { InventoryItem } from "../Datatypes/Inventory";
import { ShoppingList, ShoppingListItem } from "../Datatypes/ShoppingList";

const BASE_URL = 'http://127.0.0.1:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})
export namespace ShoppingListService {

    export async function getAllShoppingListsJSON(): Promise<any> {
        try {
            const response = await instance.get(`/shopping-lists/`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Shopping Lists: ' + error);
        }
    }

    export async function getAllShoppingLists(): Promise<ShoppingList[]> {
        let shoppingLists: ShoppingList[] = [];
        try {
            const data = await getAllShoppingListsJSON();
            const shoppingLists: ShoppingList[] = []
            data.map((list: any) => shoppingLists.push(ShoppingList.fromJSON(list)));
            return shoppingLists;
        } catch (error) {
            console.error('Error fetching shoppingLists: ', error);
        }
        return shoppingLists;
    }

    interface CreateShoppingList {
        items: number[],
    }
    export async function CreateShoppingList({ items }: CreateShoppingList): Promise<ShoppingList | null> {

        const date = new Date(Date.now())
        const dateString = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + "Z";

        const requestBody = {
            created: dateString,
            items: items,
        }
        try {
            let response = await instance.post('/shopping-lists/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return ShoppingList.fromJSON(response.data);
        } catch (error) {
            console.error('Error creating Shopping List:', error);
            return null;
        }
    }

    export async function deleteShoppingList(id: number) {
        try {
            const response = await instance.delete(`/shopping-lists/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting ShoppingList: ' + error);
        }
    }


    export async function getAllShoppingListItemsJSON(): Promise<any> {
        try {
            const response = await instance.get(`/shopping-list-items/`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching Shopping List Items: ' + error);
        }
    }

    export async function getAllShoppingListItems(): Promise<ShoppingListItem[]> {
        let shoppingListItems: ShoppingListItem[] = [];
        try {
            const data = await getAllShoppingListItemsJSON();
            data.map((inv: any) => shoppingListItems.push(ShoppingListItem.fromJSON(inv)));
            return shoppingListItems;
        } catch (error) {
            console.error('Error fetching shoppingListItems: ', error);
        }
        return shoppingListItems;
    }



    interface CreateShoppingListItem {
        ingredient: string;
        amount: number;
        unit: string;
        notes: string;
    }
    export async function createShoppingListItem({ ingredient, amount, unit, notes }: CreateShoppingListItem): Promise<ShoppingListItem | null> {
        const date = new Date(Date.now())
        const dateString = date.toISOString()
        const requestBody = {
            bought: false,
            added: dateString,
            ingredient: ingredient,
            amount: amount,
            unit: unit,
            notes: notes,
        }
        try {
            let response = await instance.post('/shopping-list-items/', JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return ShoppingListItem.fromJSON(response.data);
        } catch (error) {
            console.error('Error creating Shopping list Item:', error);
            return null;
        }
    }

    export async function deleteShoppingListItem(id: number) {
        try {
            const response = await instance.delete(`/shopping-list-items/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting ShoppinglistItem: ' + error);
        }
    }

    export async function addItemToShoppingList(list: ShoppingList, itemID: number) {
        const date = new Date(list.created)
        const dateString = date.toISOString()
        const items = list.items
        items.push(itemID)
        const requestBody = {
            id: list.id,
            created: dateString,
            items: items,

        }
        console.log(JSON.stringify(requestBody))
        try {
            let response = await instance.put(`/shopping-lists/${list.id}/`, JSON.stringify(requestBody), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response;

        } catch (error) {
            console.error('Error creating Shopping list Item:', error);
            return null;
        }

    }

    export async function createItemAndAddToShoppingList(list: ShoppingList, item: CreateShoppingListItem): Promise<ShoppingListItem | null> {
        try {
            const createdItem = await createShoppingListItem(item);
            if (createdItem) {
                addItemToShoppingList(list, createdItem.id)
            }
            return createdItem ? createdItem : null
        } catch (error) {
            console.error('Error creating Shopping list Item:', error);
        }
        return null
    }
}