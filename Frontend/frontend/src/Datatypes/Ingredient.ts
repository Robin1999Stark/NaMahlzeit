
export class Ingredient {
    title: string;
    description: string;
    preferedUnit: string;
    constructor(title: string, description: string, preferedUnit: string) {
        this.title = title;
        this.description = description;
        this.preferedUnit = preferedUnit;
    }
    static fromJSON(json: unknown): Ingredient {
        const obj = json as { title: string; description: string; preferedUnit: string };

        if (typeof obj.title !== 'string' || typeof obj.description !== 'string' || typeof obj.preferedUnit !== 'string') {
            throw new Error("Invalid JSON format");
        }
        return new Ingredient(obj.title, obj.description, obj.preferedUnit);
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
    static fromJSON(json: unknown): IngredientAmount {
        const obj = json as { ingredient: unknown; amount: unknown; unit: unknown };

        if (typeof obj.ingredient !== 'string' ||
            typeof obj.amount !== 'number' ||
            typeof obj.unit !== 'string') {
            throw new Error("Invalid JSON format");
        }

        return new IngredientAmount(obj.ingredient, obj.amount, obj.unit);
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
    static fromJSON(json: unknown): IngredientAmountWithMeal {
        console.log(json)
        const obj = json as { id: unknown; ingredient: unknown; amount: unknown; unit: unknown; meal: unknown };

        let amount: number;
        if (typeof obj.amount === 'number') {
            amount = obj.amount;
        } else if (typeof obj.amount === 'string') {
            const parsedAmount = parseFloat(obj.amount);
            if (isNaN(parsedAmount)) {
                throw new Error("Invalid amount format");
            }
            amount = parsedAmount;
        } else {
            throw new Error("Invalid amount format");
        }

        // Validate other fields
        if (typeof obj.id !== 'number' ||
            typeof obj.ingredient !== 'string' ||
            typeof obj.unit !== 'string' ||
            typeof obj.meal !== 'number') {
            throw new Error("Invalid JSON format");
        }

        return new IngredientAmountWithMeal(obj.id, obj.ingredient, amount, obj.unit, obj.meal);
    }
}

export class IngredientTags {
    ingredient: string;
    tags: string[];

    constructor(ingredient: string, tags: string[]) {
        this.ingredient = ingredient;
        this.tags = tags;
    }

    static fromJSON(json: unknown): IngredientTags {
        const obj = json as { ingredient: unknown; tags: unknown };

        if (typeof obj.ingredient !== 'string' ||
            !Array.isArray(obj.tags) ||
            !obj.tags.every(tag => typeof tag === 'string')) {
            throw new Error("Invalid JSON format");
        }

        return new IngredientTags(obj.ingredient, obj.tags);
    }
}