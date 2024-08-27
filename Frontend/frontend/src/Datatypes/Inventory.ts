export class InventoryItem {
    id: number;
    ingredient: string;
    amount: number;
    unit: string;

    constructor(id: number, ingredient: string, amount: number, unit: string) {
        this.id = id;
        this.ingredient = ingredient;
        this.amount = amount;
        this.unit = unit
    }

    static fromJSON(json: unknown): InventoryItem {
        if (typeof json !== 'object' || json === null) {
            throw new Error("Invalid JSON format");
        }

        const obj = json as {
            id?: unknown;
            ingredient?: unknown;
            amount?: unknown;
            unit?: unknown;
        };

        const id = typeof obj.id === 'number' ? obj.id : NaN;
        const ingredient = typeof obj.ingredient === 'string' ? obj.ingredient : '';
        const amount = typeof obj.amount === 'number'
            ? obj.amount
            : typeof obj.amount === 'string'
                ? parseFloat(obj.amount)
                : NaN;
        const unit = typeof obj.unit === 'string' ? obj.unit : '';

        if (isNaN(id) || isNaN(amount)) {
            throw new Error("Invalid JSON format");
        }

        return new InventoryItem(id, ingredient, amount, unit);
    }

}