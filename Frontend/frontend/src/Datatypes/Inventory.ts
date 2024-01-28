
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

    static fromJSON(json: any): InventoryItem {
        return new InventoryItem(json.id, json.ingredient, json.amount, json.unit);
    }

}