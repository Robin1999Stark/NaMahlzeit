
export class FoodplanerItem {
    date: Date;
    meals: number[];
    constructor(date: Date, food: number[]) {
        this.date = date;
        this.meals = food;
    }

    static fromJSON(json: unknown): FoodplanerItem {
        const obj = json as { date: string | Date; meals: number[] };

        const date = typeof obj.date === 'string' ? new Date(obj.date) : obj.date;

        return new FoodplanerItem(date, obj.meals)
    }
}

export type FoodPlaner = {
    [key: string]: FoodplanerItem
}

