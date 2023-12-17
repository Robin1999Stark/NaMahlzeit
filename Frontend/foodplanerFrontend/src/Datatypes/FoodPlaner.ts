
export class FoodplanerItem {
    id: number;
    date: Date;
    meals: number[];
    constructor(id: number, date: Date, food: number[]) {
        this.id = id;
        this.date = date;
        this.meals = food;
    }

    static fromJSON(json: any): FoodplanerItem {
        return new FoodplanerItem(json.id, json.date, json.meals)
    }
}

export type FoodPlaner = {
    [key: string]: FoodplanerItem
}

