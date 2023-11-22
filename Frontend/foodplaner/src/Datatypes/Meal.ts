
export class Ingredient {
    id: number;
    title: string;
    description: string;
    constructor(id: number, title: string, description: string) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
    static fromJSON(json: any): Ingredient {
        return new Ingredient(json.id, json.title, json.description);
    }
}

export class Meal {
    id: number;
    title: string;
    description: string;
    ingredientIDs: number[];

    constructor(id: number, title: string, description: string, ingredientIDs: number[]) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredientIDs = ingredientIDs;
    }

    static fromJSON(json: any): Meal {
        return new Meal(json.id, json.title, json.description, json.ingredients);
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

export type FoodPlaner = {
    [key: string]: FoodplanerItem
}
