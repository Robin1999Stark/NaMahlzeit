
export class InventoryItem {
    ingredient: string;
    amount: number;
    unit: string;

    constructor(ingredient: string, amount: number, unit: string) {
        this.ingredient = ingredient;
        this.amount = amount;
        this.unit = unit
    }

    static fromJSON(json: any): InventoryItem {
        return new InventoryItem(json.ingredient, json.amount, json.unit);
    }

}