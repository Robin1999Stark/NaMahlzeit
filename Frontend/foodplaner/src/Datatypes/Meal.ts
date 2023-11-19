
export class Meal {
    title: string;
    constructor(title: string) {
        this.title = title
    }

    static fromJSON(json: any): Meal {
        return new Meal(json.title)
    }

}

export class FoodplanerItem {
    id: number;
    date: Date;
    food: number[];
    constructor(id: number, date: Date, food: number[]) {
        this.id = id;
        this.date = date;
        this.food = food;
    }

    static fromJSON(json: any): FoodplanerItem {
        return new FoodplanerItem(json.id, json.date, json.meals)
    }
}
