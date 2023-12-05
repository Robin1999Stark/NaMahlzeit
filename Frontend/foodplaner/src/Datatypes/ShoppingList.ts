
export class ShoppingListItem {
    id: number;
    bought: boolean;
    ingredient: string;
    added: Date;
    amount: number;
    unit: string;
    notes: string;

    constructor(id: number, bought: boolean, added: Date, notes: string, ingredient: string, amount: number, unit: string) {
        this.id = id;
        this.bought = bought;
        this.ingredient = ingredient;
        this.amount = amount;
        this.unit = unit;
        this.added = added;
        this.notes = notes;
    }

    static fromJSON(json: any): ShoppingListItem {
        return new ShoppingListItem(json.id, json.bought, json.added, json.notes, json.ingredient, json.amount, json.unit);
    }

}


export class ShoppingList {
    id: number;
    created: Date;
    items: number[];

    constructor(id: number, created: Date, items: number[]) {
        this.id = id;
        this.created = created;
        this.items = items;
    }

    static fromJSON(json: any): ShoppingList {
        return new ShoppingList(json.id, new Date(json.created), json.items);
    }

}