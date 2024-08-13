
export class FoodplanerItem {
    date: Date;
    meals: number[];
    constructor(date: Date, food: number[]) {
        this.date = date;
        this.meals = food;
    }

    static fromJSON(json: any): FoodplanerItem {
        return new FoodplanerItem(json.date, json.meals)
    }
}

export type FoodPlaner = {
    [key: string]: FoodplanerItem
}

