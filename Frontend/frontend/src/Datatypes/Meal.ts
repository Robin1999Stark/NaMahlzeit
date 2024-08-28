import { IngredientAmount, IngredientAmountWithMeal } from "./Ingredient";
export class Meal {
    id: number;
    title: string;
    description: string;
    ingredients: string[];
    duration: number;
    preparation: string;
    portion_size: number;
    picture: string | null;

    constructor(id: number, title: string, description: string, ingredients: string[], duration: number, preparation: string, picture: string | null = null, portion_size: number = 4) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.duration = duration;
        this.preparation = preparation;
        this.portion_size = portion_size;
        this.picture = picture;
    }

    static fromJSON(json: unknown): Meal {
        const obj = json as {
            id: unknown;
            title: unknown;
            description: unknown;
            ingredients: unknown;
            duration: unknown;
            preparation: unknown;
            portion_size: unknown;
            picture: unknown;
        };

        if (typeof obj.id !== 'number' ||
            typeof obj.title !== 'string' ||
            typeof obj.description !== 'string' ||
            !Array.isArray(obj.ingredients) || !obj.ingredients.every(i => typeof i === 'string') ||
            typeof obj.duration !== 'number' ||
            typeof obj.preparation !== 'string' ||
            typeof obj.portion_size !== 'number' ||
            (typeof obj.picture !== 'string' && obj.picture !== null)) {
            throw new Error("Invalid JSON format");
        }

        return new Meal(obj.id, obj.title, obj.description, obj.ingredients, obj.duration, obj.preparation, obj.picture, obj.portion_size);
    }
}

export class MealWithIngredientAmount {
    id: number;
    title: string;
    description: string;
    ingredients: IngredientAmount[];
    duration: number;
    preparation: string;
    portion_size: number;
    picture: string | null;

    constructor(
        id: number,
        title: string,
        description: string,
        ingredients: IngredientAmount[],
        duration: number,
        preparation: string,
        picture: string | null = null,
        portion_size: number = 4
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.duration = duration;
        this.preparation = preparation;
        this.portion_size = portion_size;
        this.picture = picture;
    }

    static fromJSON(json: unknown): MealWithIngredientAmount {
        const obj = json as {
            id: unknown;
            title: unknown;
            description: unknown;
            ingredients: unknown;
            duration: unknown;
            preparation: unknown;
            portion_size: unknown;
            picture: unknown;
        };

        if (typeof obj.id !== 'number' ||
            typeof obj.title !== 'string' ||
            typeof obj.description !== 'string' ||
            !Array.isArray(obj.ingredients) || !obj.ingredients.every(i => typeof i === 'object') ||
            typeof obj.duration !== 'number' ||
            typeof obj.preparation !== 'string' ||
            typeof obj.portion_size !== 'number' ||
            (typeof obj.picture !== 'string' && obj.picture !== null)) {
            throw new Error("Invalid JSON format");
        }

        const ingredients = obj.ingredients.map((ingredient: unknown) => {
            if (typeof ingredient !== 'object') {
                throw new Error("Invalid ingredient format");
            }
            return IngredientAmount.fromJSON(ingredient);
        });

        return new MealWithIngredientAmount(
            obj.id,
            obj.title,
            obj.description,
            ingredients,
            obj.duration,
            obj.preparation,
            obj.picture,
            obj.portion_size
        );
    }
}


export class MealWithIngredientAmountMIID {
    id: number;
    title: string;
    description: string;
    ingredients: IngredientAmountWithMeal[];
    duration: number;
    preparation: string;
    portion_size: number;
    picture: string | null;

    constructor(
        id: number,
        title: string,
        description: string,
        ingredients: IngredientAmountWithMeal[],
        duration: number,
        preparation: string,
        picture: string | null = null,
        portion_size: number = 4
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.duration = duration;
        this.preparation = preparation;
        this.portion_size = portion_size;
        this.picture = picture;
    }

    static fromJSON(json: unknown): MealWithIngredientAmountMIID {
        const obj = json as {
            id: unknown;
            title: unknown;
            description: unknown;
            ingredients: unknown;
            duration: unknown;
            preparation: unknown;
            portion_size: unknown;
            picture: unknown;
        };

        if (typeof obj.id !== 'number' ||
            typeof obj.title !== 'string' ||
            typeof obj.description !== 'string' ||
            !Array.isArray(obj.ingredients) || !obj.ingredients.every(i => typeof i === 'object') ||
            typeof obj.duration !== 'number' ||
            typeof obj.preparation !== 'string' ||
            typeof obj.portion_size !== 'number' ||
            (typeof obj.picture !== 'string' && obj.picture !== null)) {
            throw new Error("Invalid JSON format");
        }

        const ingredients = obj.ingredients.map((ingredient: unknown) => {
            if (typeof ingredient !== 'object') {
                throw new Error("Invalid ingredient format");
            }
            return IngredientAmountWithMeal.fromJSON(ingredient);
        });

        return new MealWithIngredientAmountMIID(
            obj.id,
            obj.title,
            obj.description,
            ingredients,
            obj.duration,
            obj.preparation,
            obj.picture,
            obj.portion_size
        );
    }
}

export class MealTags {
    mealID: number;
    tags: string[];

    constructor(mealID: number, tags: string[]) {
        this.mealID = mealID;
        this.tags = tags;
    }

    static fromJSON(json: unknown): MealTags {
        const obj = json as {
            meal: unknown;
            tags: unknown;
        };

        if (typeof obj.meal !== 'number' ||
            !Array.isArray(obj.tags) || !obj.tags.every(tag => typeof tag === 'string')) {
            throw new Error("Invalid JSON format for MealTags");
        }

        return new MealTags(obj.meal, obj.tags);
    }
}

