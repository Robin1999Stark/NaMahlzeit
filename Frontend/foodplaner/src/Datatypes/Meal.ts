
export class Ingredient {
    title: string;
    description: string;
    preferedUnit: string;
    constructor(title: string, description: string, preferedUnit: string) {
        this.title = title;
        this.description = description;
        this.preferedUnit = preferedUnit;
    }
    static fromJSON(json: any): Ingredient {
        return new Ingredient(json.title, json.description, json.preferedUnit);
    }
}

export class Meal {
    id: number;
    title: string;
    description: string;
    ingredients: string[];
    duration: number;
    preparation: string;

    constructor(id: number, title: string, description: string, ingredients: string[], duration: number, preparation: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.duration = duration;
        this.preparation = preparation;
    }

    static fromJSON(json: any): Meal {
        console.log("meal full", json)
        return new Meal(json.id, json.title, json.description, json.ingredients, json.duration, json.preparation);
    }

}

export class MealWithIngredientAmount {
    id: number;
    title: string;
    description: string;
    ingredients: IngredientAmount[];
    duration: number;
    preparation: string;

    constructor(id: number, title: string, description: string, ingredients: IngredientAmount[], duration: number, preparation: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.duration = duration;
        this.preparation = preparation;
    }

    static fromJSON(json: any): MealWithIngredientAmount {
        return new MealWithIngredientAmount(json.id, json.title, json.description, json.ingredients, json.duration, json.preparation);
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
export class IngredientAmountWithMeal extends IngredientAmount {
    meal: number;
    constructor(ingredient: string, amount: number, unit: string, meal: number) {
        super(ingredient, amount, unit);
        this.meal = meal;
    }
    static fromJSON(json: any): IngredientAmountWithMeal {
        return new IngredientAmountWithMeal(json.ingredient, json.amount, json.unit, json.meal);
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

