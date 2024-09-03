import axios, { AxiosResponse } from "axios";
import { ShoppingList, ShoppingListItem } from "../Datatypes/ShoppingList";
import { BASE_URL, fetchCsrfToken } from "./Settings";

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

async function getAllShoppingListsJSON(): Promise<unknown> {
    try {
        const response = await instance.get('/shopping-lists/');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Shopping Lists: ' + error);
    }
}

export async function getAllShoppingLists(): Promise<ShoppingList[]> {
    try {
        const data = await getAllShoppingListsJSON();
        if (!Array.isArray(data)) return [];
        return data.map((list: unknown) => {
            if (typeof list === 'object' && list !== null) {
                return ShoppingList.fromJSON(list as { id: number; created: string; items: number[] });
            }
            throw new Error('Invalid shopping list data format');
        });
    } catch (error) {
        console.error('Error fetching shoppingLists: ', error);
        return [];
    }
}

interface CreateShoppingList {
    items: number[],
}
export async function createShoppingList({ items }: CreateShoppingList): Promise<ShoppingList | null> {
    const date = new Date();
    const dateString = date.toISOString();

    const requestBody = {
        created: dateString,
        items: items,
    };

    try {
        const csrfToken = await fetchCsrfToken();
        const response = await instance.post('/shopping-lists/', JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        });
        return ShoppingList.fromJSON(response.data);
    } catch (error) {
        throw new Error('Error creating Shopping List:' + error)
    }
}
export async function deleteShoppingList(id: number): Promise<AxiosResponse> {
    try {
        const response = await instance.delete(`/shopping-lists/${id}/`);
        return response;
    } catch (error) {
        throw new Error('Error deleting ShoppingList: ' + error);
    }
}

async function getAllShoppingListItemsJSON(): Promise<unknown> {
    try {
        const response = await instance.get('/shopping-list-items/');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching Shopping List Items: ' + error);
    }
}

export async function getAllShoppingListItems(): Promise<ShoppingListItem[]> {
    try {
        const data = await getAllShoppingListItemsJSON();
        if (!Array.isArray(data)) return [];
        return data.map((item: unknown) => {
            if (typeof item === 'object' && item !== null) {
                return ShoppingListItem.fromJSON(item as { id: number; bought: boolean; amount: number; ingredient: string; unit: string; notes: string });
            }
            throw new Error('Invalid shopping list item data format');
        });
    } catch (error) {
        console.error('Error fetching shoppingListItems: ', error);
        return [];
    }
}

interface UpdateShoppingList {
    id: number;
    created: Date;
    items: number[];
}

export async function updateShoppingList({ id, created, items }: UpdateShoppingList): Promise<ShoppingList | null> {
    const requestBody = {
        created: new Date(created).toISOString(),
        items: items,
    };

    try {
        const response = await instance.put(`/shopping-lists/${id}/`, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return ShoppingList.fromJSON(response.data);
    } catch (error) {
        console.error('Error updating Shopping List:', error);
        return null;
    }
}

interface UpdateShoppingListItem {
    bought?: boolean;
    amount?: number;
    ingredient?: string;
    unit?: string;
    notes?: string;
}
export async function updateShoppingListItem(id: number, updateData: UpdateShoppingListItem): Promise<ShoppingListItem | null> {
    const requestBody = { ...updateData };

    try {
        const response = await instance.put(`/shopping-list-items/${id}/`, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return ShoppingListItem.fromJSON(response.data);
    } catch (error) {
        console.error('Error updating Shopping List Item:', error);
        return null;
    }
}

export async function updateItemAndList(list: ShoppingList, item: ShoppingListItem): Promise<ShoppingListItem | null> {
    try {
        const updatedItem = await updateShoppingListItem(item.id, {
            bought: item.bought,
            amount: item.amount,
            ingredient: item.ingredient,
            unit: item.unit,
            notes: item.notes,
        });
        if (updatedItem) {
            await updateShoppingList({
                id: list.id,
                created: list.created,
                items: list.items
            });
            return updatedItem;
        }
    } catch (error) {
        console.error('Error updating Shopping List and Item:', error);
    }
    return null;
}
interface CreateShoppingListItem {
    ingredient: string;
    amount: number;
    unit: string;
    notes: string;
}
export async function createShoppingListItem({ ingredient, amount, unit, notes }: CreateShoppingListItem): Promise<ShoppingListItem | null> {
    const date = new Date();
    const dateString = date.toISOString();

    const requestBody = {
        bought: false,
        added: dateString,
        ingredient: ingredient,
        amount: amount,
        unit: unit,
        notes: notes,
    };
    const csrfToken = await fetchCsrfToken();
    try {
        const response = await instance.post('/shopping-list-items/', JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        });
        return ShoppingListItem.fromJSON(response.data);
    } catch (error) {
        console.error('Error creating Shopping list Item:', error);
        return null;
    }
}

export async function deleteShoppingListItem(id: number): Promise<AxiosResponse> {
    try {
        const response = await instance.delete(`/shopping-list-items/${id}/`);
        return response;
    } catch (error) {
        throw new Error('Error deleting ShoppinglistItem: ' + error);
    }
}

export async function addItemToShoppingList(list: ShoppingList, itemID: number): Promise<void> {
    const date = new Date(list.created);
    const dateString = date.toISOString();
    const items = [...list.items, itemID];

    const requestBody = {
        id: list.id,
        created: dateString,
        items: items,
    };

    try {
        await instance.put(`/shopping-lists/${list.id}/`, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error adding item to Shopping list:', error);
    }
}

export async function createItemAndAddToShoppingList(list: ShoppingList, item: CreateShoppingListItem): Promise<ShoppingListItem | null> {
    try {
        const createdItem = await createShoppingListItem(item);
        if (createdItem) {
            await addItemToShoppingList(list, createdItem.id);
        }
        return createdItem;
    } catch (error) {
        console.error('Error creating Shopping list Item:', error);
        return null;
    }
}