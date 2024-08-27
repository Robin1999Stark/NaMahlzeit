
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

    static fromJSON(json: unknown): ShoppingListItem {

        if (typeof json !== 'object' || json === null) {
            throw new Error("Invalid JSON format for ShoppingListItem");
        }

        const obj = json as {
            id?: unknown;
            bought?: unknown;
            ingredient?: unknown;
            added?: unknown;
            amount?: unknown;
            unit?: unknown;
            notes?: unknown;
        };

        const id = typeof obj.id === 'number' ? obj.id : NaN;
        const bought = typeof obj.bought === 'boolean' ? obj.bought : false;
        const ingredient = typeof obj.ingredient === 'string' ? obj.ingredient : '';
        const added = isValidDate(obj.added) ? new Date(obj.added as string) : new Date();
        const amount = typeof obj.amount === 'number' ? obj.amount : parseFloat(obj.amount as string);
        const unit = typeof obj.unit === 'string' ? obj.unit : '';
        const notes = typeof obj.notes === 'string' ? obj.notes : '';

        if (isNaN(id) || isNaN(amount)) {
            throw new Error("Invalid JSON format for ShoppingListItem");
        }

        return new ShoppingListItem(
            id,
            bought,
            added,
            notes,
            ingredient,
            amount,
            unit
        );
    }

}
function isValidDate(date: unknown): date is string {
    const t = typeof date === 'string' && !isNaN(Date.parse(date));
    return t
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

    static fromJSON(json: unknown): ShoppingList {
        if (typeof json !== 'object' || json === null) {
            throw new Error("Invalid JSON format for ShoppingListItem");
        }

        const obj = json as {
            id?: unknown;
            created?: unknown;
            items?: unknown;
        };
        const id = typeof obj.id === 'number' ? obj.id : NaN;
        const created = isValidDate(obj.created) ? new Date(obj.created as string) : new Date();
        const items = Array.isArray(obj.items) && obj.items.every(item => typeof item === 'number')
            ? obj.items
            : [];

        return new ShoppingList(id, created, items);
    }

}