
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
    id: number;
    meal: number;
    constructor(id: number, ingredient: string, amount: number, unit: string, meal: number) {
        super(ingredient, amount, unit);
        this.id = id;
        this.meal = meal;
    }
    static fromJSON(json: any): IngredientAmountWithMeal {
        return new IngredientAmountWithMeal(json.id, json.ingredient, json.amount, json.unit, json.meal);
    }
}

export class IngredientTags {
    ingredient: string;
    tags: string[];

    constructor(ingredient: string, tags: string[]) {
        this.ingredient = ingredient;
        this.tags = tags;
    }

    static fromJSON(json: any): IngredientTags {
        return new IngredientTags(json.ingredient, json.tags);
    }
}