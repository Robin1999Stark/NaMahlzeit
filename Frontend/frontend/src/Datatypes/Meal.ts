import { IngredientAmount, IngredientAmountWithMeal } from "./Ingredient";

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


export class MealWithIngredientAmountMIID {
    id: number;
    title: string;
    description: string;
    ingredients: IngredientAmountWithMeal[];
    duration: number;
    preparation: string;

    constructor(id: number, title: string, description: string, ingredients: IngredientAmountWithMeal[], duration: number, preparation: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.duration = duration;
        this.preparation = preparation;
    }

    static fromJSON(json: any): MealWithIngredientAmountMIID {
        return new MealWithIngredientAmountMIID(json.id, json.title, json.description, json.ingredients, json.duration, json.preparation);
    }

}

export class MealTags {
    mealID: number;
    tags: string[];

    constructor(mealID: number, tags: string[]) {
        this.mealID = mealID;
        this.tags = tags;
    }

    static fromJSON(json: any): MealTags {
        return new MealTags(json.meal, json.tags);
    }
}

