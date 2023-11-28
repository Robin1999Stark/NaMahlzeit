
export class Ingredient {
    title: string;
    description: string;
    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }
    static fromJSON(json: any): Ingredient {
        return new Ingredient(json.title, json.description);
    }
}

export class Meal {
    id: number;
    title: string;
    description: string;
    ingredients: string[];

    constructor(id: number, title: string, description: string, ingredients: string[]) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
    }

    static fromJSON(json: any): Meal {
        return new Meal(json.id, json.title, json.description, json.ingredients);
    }

}

export class MealWithIngredientAmount {
    id: number;
    title: string;
    description: string;
    ingredients: IngredientAmount[];

    constructor(id: number, title: string, description: string, ingredients: IngredientAmount[]) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
    }

    static fromJSON(json: any): MealWithIngredientAmount {
        return new MealWithIngredientAmount(json.id, json.title, json.description, json.ingredients);
    }

}

export class IngredientAmount {
    ingredient: string;
    amount: number;
    unit: string;

    constructor(ingredient: string, amount: number, unit: string) {
        this.ingredient = ingredient;
        this.amount = amount;
        this.unit = unit;
    }
    static fromJSON(json: any): IngredientAmount {
        return new IngredientAmount(json.ingredient, json.amount, json.unit);
    }
}

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

